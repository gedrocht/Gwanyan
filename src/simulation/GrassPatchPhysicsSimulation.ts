import type { GroundCoordinate, WindSourceState } from '@/input/PointerWindTracker';
import type { PlanarVector } from '@/simulation/WindFieldModel';
import type { WindFieldModel } from '@/simulation/WindFieldModel';

/**
 * Each patch is a small neighborhood of grass blades that shares the same
 * physical state. Using patches instead of simulating every single blade with
 * its own full spring system gives us a strong visual result without wasting
 * unnecessary CPU time.
 */
export interface GrassPatchDescriptor {
  readonly identifier: number;
  readonly groundCoordinate: GroundCoordinate;
  readonly stiffnessMultiplier: number;
}

/**
 * This is the state that changes every frame. The displacement represents how
 * far the tip of the patch is bent away from its rest pose, while the velocity
 * tells us how fast that bend is currently changing.
 */
export interface GrassPatchSimulationState {
  readonly descriptor: GrassPatchDescriptor;
  readonly tipDisplacementInWorldUnits: PlanarVector;
  readonly tipVelocityInWorldUnitsPerSecond: PlanarVector;
}

/**
 * GrassPatchPhysicsSimulation implements a classic damped spring model. The
 * spring continuously tries to pull the grass upright, damping removes energy
 * over time, and the wind model adds external force.
 */
export class GrassPatchPhysicsSimulation {
  private readonly springStrength: number;

  private readonly dampingStrength: number;

  private readonly patchMass: number;

  private readonly maximumTipDisplacementInWorldUnits: number;

  private readonly windFieldModel: WindFieldModel;

  private readonly mutableStates: {
    descriptor: GrassPatchDescriptor;
    tipDisplacementInWorldUnits: PlanarVector;
    tipVelocityInWorldUnitsPerSecond: PlanarVector;
  }[];

  /**
   * Creates the patch simulation and seeds every patch at its upright rest pose.
   */
  public constructor(parameters: {
    readonly descriptors: GrassPatchDescriptor[];
    readonly springStrength: number;
    readonly dampingStrength: number;
    readonly patchMass: number;
    readonly maximumTipDisplacementInWorldUnits: number;
    readonly windFieldModel: WindFieldModel;
  }) {
    this.springStrength = parameters.springStrength;
    this.dampingStrength = parameters.dampingStrength;
    this.patchMass = parameters.patchMass;
    this.maximumTipDisplacementInWorldUnits = parameters.maximumTipDisplacementInWorldUnits;
    this.windFieldModel = parameters.windFieldModel;
    this.mutableStates = parameters.descriptors.map((descriptor) => ({
      descriptor,
      tipDisplacementInWorldUnits: {
        horizontalComponent: 0,
        depthComponent: 0,
      },
      tipVelocityInWorldUnitsPerSecond: {
        horizontalComponent: 0,
        depthComponent: 0,
      },
    }));
  }

  /**
   * Creates a simple evenly spaced patch grid that covers the entire terrain.
   *
   * @param patchRows - Number of rows in the patch grid.
   * @param patchColumns - Number of columns in the patch grid.
   * @param groundWidthInWorldUnits - Terrain width.
   * @param groundDepthInWorldUnits - Terrain depth.
   * @returns A list of patch descriptors.
   */
  public static createGridDescriptors(
    patchRows: number,
    patchColumns: number,
    groundWidthInWorldUnits: number,
    groundDepthInWorldUnits: number,
  ): GrassPatchDescriptor[] {
    const patchDescriptors: GrassPatchDescriptor[] = [];
    const horizontalSpacing = groundWidthInWorldUnits / patchColumns;
    const depthSpacing = groundDepthInWorldUnits / patchRows;

    for (let patchRowIndex = 0; patchRowIndex < patchRows; patchRowIndex += 1) {
      for (let patchColumnIndex = 0; patchColumnIndex < patchColumns; patchColumnIndex += 1) {
        const normalizedPatchIndex =
          (patchRowIndex * patchColumns + patchColumnIndex) / Math.max(patchRows * patchColumns, 1);

        patchDescriptors.push({
          identifier: patchDescriptors.length,
          groundCoordinate: {
            horizontalPositionInWorldUnits:
              -groundWidthInWorldUnits / 2 + horizontalSpacing * (patchColumnIndex + 0.5),
            depthPositionInWorldUnits:
              -groundDepthInWorldUnits / 2 + depthSpacing * (patchRowIndex + 0.5),
          },
          stiffnessMultiplier: 0.85 + normalizedPatchIndex * 0.3,
        });
      }
    }

    return patchDescriptors;
  }

  /**
   * Advances every patch by one frame.
   *
   * @param timeStepInSeconds - The elapsed frame time.
   * @param windSourceState - The latest wind source state.
   * @param elapsedSceneTimeInSeconds - Total elapsed scene time.
   */
  public advanceSimulation(
    timeStepInSeconds: number,
    windSourceState: WindSourceState,
    elapsedSceneTimeInSeconds: number,
  ): void {
    for (const mutableState of this.mutableStates) {
      const windForce = this.windFieldModel.calculateWindForceAtGroundCoordinate(
        mutableState.descriptor.groundCoordinate,
        windSourceState,
        elapsedSceneTimeInSeconds,
      );

      const displacementAcceleration = this.calculateAcceleration(
        windForce,
        mutableState.tipDisplacementInWorldUnits,
        mutableState.tipVelocityInWorldUnitsPerSecond,
        mutableState.descriptor.stiffnessMultiplier,
      );

      const updatedVelocity: PlanarVector = {
        horizontalComponent:
          mutableState.tipVelocityInWorldUnitsPerSecond.horizontalComponent +
          displacementAcceleration.horizontalComponent * timeStepInSeconds,
        depthComponent:
          mutableState.tipVelocityInWorldUnitsPerSecond.depthComponent +
          displacementAcceleration.depthComponent * timeStepInSeconds,
      };

      const unclampedDisplacement: PlanarVector = {
        horizontalComponent:
          mutableState.tipDisplacementInWorldUnits.horizontalComponent +
          updatedVelocity.horizontalComponent * timeStepInSeconds,
        depthComponent:
          mutableState.tipDisplacementInWorldUnits.depthComponent +
          updatedVelocity.depthComponent * timeStepInSeconds,
      };

      const clampedDisplacement = this.clampPlanarVectorMagnitude(
        unclampedDisplacement,
        this.maximumTipDisplacementInWorldUnits,
      );

      mutableState.tipVelocityInWorldUnitsPerSecond = updatedVelocity;
      mutableState.tipDisplacementInWorldUnits = clampedDisplacement;
    }
  }

  /**
   * Returns an immutable snapshot of the current states.
   */
  public getStates(): GrassPatchSimulationState[] {
    return this.mutableStates.map((mutableState) => ({
      descriptor: mutableState.descriptor,
      tipDisplacementInWorldUnits: mutableState.tipDisplacementInWorldUnits,
      tipVelocityInWorldUnitsPerSecond: mutableState.tipVelocityInWorldUnitsPerSecond,
    }));
  }

  private calculateAcceleration(
    windForce: PlanarVector,
    tipDisplacementInWorldUnits: PlanarVector,
    tipVelocityInWorldUnitsPerSecond: PlanarVector,
    stiffnessMultiplier: number,
  ): PlanarVector {
    return {
      horizontalComponent:
        (windForce.horizontalComponent -
          this.springStrength *
            stiffnessMultiplier *
            tipDisplacementInWorldUnits.horizontalComponent -
          this.dampingStrength * tipVelocityInWorldUnitsPerSecond.horizontalComponent) /
        this.patchMass,
      depthComponent:
        (windForce.depthComponent -
          this.springStrength * stiffnessMultiplier * tipDisplacementInWorldUnits.depthComponent -
          this.dampingStrength * tipVelocityInWorldUnitsPerSecond.depthComponent) /
        this.patchMass,
    };
  }

  private clampPlanarVectorMagnitude(
    planarVector: PlanarVector,
    maximumMagnitude: number,
  ): PlanarVector {
    const magnitude = Math.hypot(planarVector.horizontalComponent, planarVector.depthComponent);

    if (magnitude <= maximumMagnitude) {
      return planarVector;
    }

    const scale = maximumMagnitude / magnitude;

    return {
      horizontalComponent: planarVector.horizontalComponent * scale,
      depthComponent: planarVector.depthComponent * scale,
    };
  }
}
