import * as THREE from 'three';
import { applicationConfiguration } from '@/configuration/applicationConfiguration';
import { PointerWindTracker } from '@/input/PointerWindTracker';
import { createEnvironment } from '@/rendering/environmentFactory';
import { GrassFieldSurface } from '@/rendering/GrassFieldSurface';
import { createGroundSurface } from '@/rendering/groundSurfaceFactory';
import { createRenderingContext, type RenderingContext } from '@/rendering/rendererFactory';
import { GrassPatchPhysicsSimulation } from '@/simulation/GrassPatchPhysicsSimulation';
import { WindFieldModel } from '@/simulation/WindFieldModel';
import { DiagnosticLogger } from '@/telemetry/DiagnosticLogger';
import { DiagnosticOverlay } from '@/telemetry/DiagnosticOverlay';

/**
 * InteractiveGrasslandExperience wires every subsystem together:
 * - rendering,
 * - input,
 * - physics,
 * - logging,
 * - and the user-facing diagnostic overlay.
 */
export class InteractiveGrasslandExperience {
  private readonly hostElement: HTMLElement;

  private readonly diagnosticLogger: DiagnosticLogger;

  private readonly diagnosticOverlay: DiagnosticOverlay;

  private readonly pointerWindTracker: PointerWindTracker;

  private readonly timer = new THREE.Timer();

  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  private readonly raycaster = new THREE.Raycaster();

  private readonly reusablePointerIntersection = new THREE.Vector3();

  private readonly reusableNormalizedDeviceCoordinates = new THREE.Vector2();

  private readonly windFieldModel: WindFieldModel;

  private readonly patchSimulation: GrassPatchPhysicsSimulation;

  private readonly grassFieldSurface: GrassFieldSurface;

  private renderingContext: RenderingContext | null = null;

  /**
   * Creates the full interactive experience around a host HTML element.
   */
  public constructor(hostElement: HTMLElement) {
    this.hostElement = hostElement;
    this.diagnosticLogger = new DiagnosticLogger(
      applicationConfiguration.telemetry.maximumBufferedLogEntryCount,
    );
    this.diagnosticOverlay = new DiagnosticOverlay(
      this.diagnosticLogger,
      applicationConfiguration.telemetry.overlaySampleWindowFrameCount,
    );
    this.pointerWindTracker = new PointerWindTracker(
      applicationConfiguration.wind.stalePointerTimeoutInMilliseconds,
    );
    this.windFieldModel = new WindFieldModel(
      applicationConfiguration.wind.influenceRadiusInWorldUnits,
      applicationConfiguration.wind.maximumMouseDrivenWindForce,
      applicationConfiguration.wind.ambientBreezeStrength,
    );

    const initialPatchDescriptors = GrassPatchPhysicsSimulation.createGridDescriptors(
      applicationConfiguration.grass.patchRows,
      applicationConfiguration.grass.patchColumns,
      applicationConfiguration.ground.widthInWorldUnits,
      applicationConfiguration.ground.depthInWorldUnits,
    );

    this.patchSimulation = new GrassPatchPhysicsSimulation({
      descriptors: initialPatchDescriptors,
      springStrength: applicationConfiguration.simulation.springStrength,
      dampingStrength: applicationConfiguration.simulation.dampingStrength,
      patchMass: applicationConfiguration.simulation.patchMass,
      maximumTipDisplacementInWorldUnits:
        applicationConfiguration.grass.maximumTipDisplacementInWorldUnits,
      windFieldModel: this.windFieldModel,
    });
    this.grassFieldSurface = new GrassFieldSurface({
      bladeCount: applicationConfiguration.grass.bladeCount,
      segmentsPerBlade: applicationConfiguration.grass.segmentsPerBlade,
      patchStates: this.patchSimulation.getStates(),
      minimumBladeHeightInWorldUnits: applicationConfiguration.grass.minimumBladeHeightInWorldUnits,
      maximumBladeHeightInWorldUnits: applicationConfiguration.grass.maximumBladeHeightInWorldUnits,
      minimumBladeWidthInWorldUnits: applicationConfiguration.grass.minimumBladeWidthInWorldUnits,
      maximumBladeWidthInWorldUnits: applicationConfiguration.grass.maximumBladeWidthInWorldUnits,
      groundWidthInWorldUnits: applicationConfiguration.ground.widthInWorldUnits,
      groundDepthInWorldUnits: applicationConfiguration.ground.depthInWorldUnits,
    });
  }

  /**
   * Performs all asynchronous setup work and starts the render loop.
   */
  public async initialize(): Promise<void> {
    this.hostElement.className = 'application-shell';
    this.hostElement.innerHTML = '';
    this.renderIntroductoryPanel();
    this.diagnosticOverlay.mount(this.hostElement);

    this.renderingContext = await createRenderingContext(
      this.hostElement,
      this.diagnosticLogger,
      applicationConfiguration.camera,
    );

    createEnvironment(this.renderingContext.scene);

    const groundSurface = createGroundSurface({
      widthInWorldUnits: applicationConfiguration.ground.widthInWorldUnits,
      depthInWorldUnits: applicationConfiguration.ground.depthInWorldUnits,
      textureResolutionInPixels: applicationConfiguration.ground.textureResolutionInPixels,
    });

    this.renderingContext.scene.add(groundSurface, this.grassFieldSurface.mesh);
    this.registerEventListeners();
    this.exposeDiagnosticsOnWindow();
    this.renderingContext.renderer.setAnimationLoop(this.handleAnimationFrame);

    this.diagnosticLogger.info('application', 'Interactive grassland experience initialized.');
  }

  private renderIntroductoryPanel(): void {
    const introductionElement = document.createElement('section');

    introductionElement.className = 'application-shell__introduction';
    introductionElement.innerHTML = `
      <h1>Gwanyan Interactive Grassland</h1>
      <p>
        Move your mouse across the meadow to push wind into the grass. Faster motion creates
        stronger gusts, while position determines which part of the field reacts.
      </p>
      <p>
        Drag to orbit, scroll to zoom, and use the diagnostics panel to inspect runtime behavior.
      </p>
    `;

    this.hostElement.append(introductionElement);
  }

  private registerEventListeners(): void {
    if (this.renderingContext === null) {
      return;
    }

    this.renderingContext.renderer.domElement.addEventListener(
      'pointermove',
      this.handlePointerMove,
    );
    this.renderingContext.renderer.domElement.addEventListener(
      'pointerleave',
      this.handlePointerLeave,
    );
    window.addEventListener('resize', this.handleWindowResize);
  }

  private exposeDiagnosticsOnWindow(): void {
    window.__GWANYAN_DIAGNOSTICS__ = {
      getBufferedEntries: () => this.diagnosticLogger.getBufferedEntries(),
      downloadBufferedEntries: () => {
        this.diagnosticLogger.downloadBufferedEntries();
      },
    };
  }

  private readonly handleAnimationFrame = (): void => {
    if (this.renderingContext === null) {
      return;
    }

    this.timer.update();

    const rawTimeStepInSeconds = this.timer.getDelta();
    const timeStepInSeconds = Math.min(
      rawTimeStepInSeconds,
      applicationConfiguration.simulation.maximumSimulationTimeStepInSeconds,
    );
    const elapsedSceneTimeInSeconds = this.timer.getElapsed();
    const windSourceState = this.pointerWindTracker.createWindSourceState(performance.now());

    this.patchSimulation.advanceSimulation(
      timeStepInSeconds,
      windSourceState,
      elapsedSceneTimeInSeconds,
    );
    this.grassFieldSurface.updateSurfaceGeometry(
      this.patchSimulation.getStates(),
      elapsedSceneTimeInSeconds,
    );
    this.renderingContext.orbitControls.update();
    this.renderingContext.renderer.render(
      this.renderingContext.scene,
      this.renderingContext.camera,
    );
    this.diagnosticOverlay.recordFrameDuration(timeStepInSeconds * 1000);
  };

  private readonly handlePointerMove = (pointerEvent: PointerEvent): void => {
    if (this.renderingContext === null) {
      return;
    }

    const canvasBounds = this.renderingContext.renderer.domElement.getBoundingClientRect();

    this.reusableNormalizedDeviceCoordinates.set(
      ((pointerEvent.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1,
      -(((pointerEvent.clientY - canvasBounds.top) / canvasBounds.height) * 2 - 1),
    );
    this.raycaster.setFromCamera(
      this.reusableNormalizedDeviceCoordinates,
      this.renderingContext.camera,
    );

    const didIntersectGround = this.raycaster.ray.intersectPlane(
      this.groundPlane,
      this.reusablePointerIntersection,
    );

    if (didIntersectGround === null) {
      return;
    }

    this.pointerWindTracker.recordPointerGroundCoordinate(performance.now(), {
      horizontalPositionInWorldUnits: this.reusablePointerIntersection.x,
      depthPositionInWorldUnits: this.reusablePointerIntersection.z,
    });
  };

  private readonly handlePointerLeave = (): void => {
    this.pointerWindTracker.clearPointerSamples();
  };

  private readonly handleWindowResize = (): void => {
    if (this.renderingContext === null) {
      return;
    }

    this.renderingContext.camera.aspect =
      this.hostElement.clientWidth / Math.max(this.hostElement.clientHeight, 1);
    this.renderingContext.camera.updateProjectionMatrix();
    this.renderingContext.renderer.setSize(
      this.hostElement.clientWidth,
      this.hostElement.clientHeight,
    );
    this.renderingContext.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
}
