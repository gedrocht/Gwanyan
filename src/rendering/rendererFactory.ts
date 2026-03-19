import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { DiagnosticLogger } from '@/telemetry/DiagnosticLogger';

/**
 * Bundles the major rendering primitives together so the application layer can
 * stay focused on orchestration instead of low-level setup details.
 */
export interface RenderingContext {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly orbitControls: OrbitControls;
}

/**
 * Creates the renderer, scene, camera, and camera controls.
 */
export async function createRenderingContext(
  hostElement: HTMLElement,
  logger: DiagnosticLogger,
  cameraConfiguration: {
    readonly fieldOfViewInDegrees: number;
    readonly nearClippingPlaneDistance: number;
    readonly farClippingPlaneDistance: number;
    readonly initialPosition: {
      readonly horizontalPositionInWorldUnits: number;
      readonly verticalPositionInWorldUnits: number;
      readonly depthPositionInWorldUnits: number;
    };
  },
): Promise<RenderingContext> {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    cameraConfiguration.fieldOfViewInDegrees,
    hostElement.clientWidth / Math.max(hostElement.clientHeight, 1),
    cameraConfiguration.nearClippingPlaneDistance,
    cameraConfiguration.farClippingPlaneDistance,
  );

  camera.position.set(
    cameraConfiguration.initialPosition.horizontalPositionInWorldUnits,
    cameraConfiguration.initialPosition.verticalPositionInWorldUnits,
    cameraConfiguration.initialPosition.depthPositionInWorldUnits,
  );

  const renderer = new WebGPURenderer({
    antialias: true,
  });

  renderer.setSize(hostElement.clientWidth, hostElement.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  await renderer.init();

  hostElement.append(renderer.domElement);

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  orbitControls.enableDamping = true;
  orbitControls.minDistance = 5;
  orbitControls.maxDistance = 40;
  orbitControls.maxPolarAngle = Math.PI * 0.48;
  orbitControls.target.set(0, 1.8, 0);
  orbitControls.update();

  logger.info('renderer', 'Rendering context initialized.', {
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    hostWidth: hostElement.clientWidth,
    hostHeight: hostElement.clientHeight,
  });

  return {
    scene,
    camera,
    renderer,
    orbitControls,
  };
}
