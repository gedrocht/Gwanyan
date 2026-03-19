import type { GroundCoordinate, WindSourceState } from '@/input/PointerWindTracker';

/**
 * A small planar vector type keeps the simulation layer independent from
 * Three.js. The rendering system is free to convert these values into
 * `THREE.Vector2` or `THREE.Vector3` objects later.
 */
export interface PlanarVector {
  readonly horizontalComponent: number;
  readonly depthComponent: number;
}

/**
 * WindFieldModel translates the pointer state into a physically plausible wind
 * force at any patch on the terrain. The mouse acts like a moving gust source:
 * the closer a patch is to the cursor and the faster the cursor moves, the
 * larger the force becomes.
 */
export class WindFieldModel {
  private readonly influenceRadiusInWorldUnits: number;

  private readonly maximumMouseDrivenWindForce: number;

  private readonly ambientBreezeStrength: number;

  /**
   * Creates a wind model with explicit values for influence radius, maximum
   * cursor gust strength, and always-on ambient breeze.
   */
  public constructor(
    influenceRadiusInWorldUnits: number,
    maximumMouseDrivenWindForce: number,
    ambientBreezeStrength: number,
  ) {
    this.influenceRadiusInWorldUnits = influenceRadiusInWorldUnits;
    this.maximumMouseDrivenWindForce = maximumMouseDrivenWindForce;
    this.ambientBreezeStrength = ambientBreezeStrength;
  }

  /**
   * Calculates the horizontal wind force that should act on a specific patch.
   *
   * @param groundCoordinate - The patch position on the terrain.
   * @param windSourceState - The current mouse-driven wind source state.
   * @param elapsedSceneTimeInSeconds - Absolute scene time used for ambient motion.
   * @returns The total planar wind force for this patch.
   */
  public calculateWindForceAtGroundCoordinate(
    groundCoordinate: GroundCoordinate,
    windSourceState: WindSourceState,
    elapsedSceneTimeInSeconds: number,
  ): PlanarVector {
    const ambientBreezeForce = this.createAmbientBreezeForce(
      groundCoordinate,
      elapsedSceneTimeInSeconds,
    );

    if (!windSourceState.isActive || windSourceState.currentGroundCoordinate === null) {
      return ambientBreezeForce;
    }

    const horizontalOffsetFromPointer =
      groundCoordinate.horizontalPositionInWorldUnits -
      windSourceState.currentGroundCoordinate.horizontalPositionInWorldUnits;
    const depthOffsetFromPointer =
      groundCoordinate.depthPositionInWorldUnits -
      windSourceState.currentGroundCoordinate.depthPositionInWorldUnits;
    const distanceFromPointer = Math.hypot(horizontalOffsetFromPointer, depthOffsetFromPointer);

    if (distanceFromPointer >= this.influenceRadiusInWorldUnits) {
      return ambientBreezeForce;
    }

    const falloffStrength =
      1 - distanceFromPointer / Math.max(this.influenceRadiusInWorldUnits, Number.EPSILON);
    const easedFalloffStrength = falloffStrength * falloffStrength * (3 - 2 * falloffStrength);
    const normalizedVelocity = this.normalizePlanarVector(
      windSourceState.groundVelocityInWorldUnitsPerSecond,
    );
    const movementDrivenForceMagnitude = Math.min(
      windSourceState.movementMagnitudeInWorldUnitsPerSecond * 0.22,
      this.maximumMouseDrivenWindForce,
    );

    return {
      horizontalComponent:
        ambientBreezeForce.horizontalComponent +
        normalizedVelocity.horizontalComponent *
          movementDrivenForceMagnitude *
          easedFalloffStrength,
      depthComponent:
        ambientBreezeForce.depthComponent +
        normalizedVelocity.depthComponent * movementDrivenForceMagnitude * easedFalloffStrength,
    };
  }

  /**
   * Builds a gentle baseline breeze so the meadow still feels alive even while
   * the mouse is completely still.
   */
  private createAmbientBreezeForce(
    groundCoordinate: GroundCoordinate,
    elapsedSceneTimeInSeconds: number,
  ): PlanarVector {
    const layeredOscillation =
      Math.sin(
        groundCoordinate.horizontalPositionInWorldUnits * 0.15 + elapsedSceneTimeInSeconds * 0.6,
      ) *
        0.5 +
      Math.cos(
        groundCoordinate.depthPositionInWorldUnits * 0.11 + elapsedSceneTimeInSeconds * 0.38,
      ) *
        0.5;

    return {
      horizontalComponent: this.ambientBreezeStrength * (0.7 + layeredOscillation * 0.4),
      depthComponent: this.ambientBreezeStrength * 0.35,
    };
  }

  /**
   * Normalizes an arbitrary planar vector. Returning a zero vector when the
   * magnitude is zero prevents division-by-zero mistakes elsewhere.
   */
  private normalizePlanarVector(planarVector: GroundCoordinate): PlanarVector {
    const magnitude = Math.hypot(
      planarVector.horizontalPositionInWorldUnits,
      planarVector.depthPositionInWorldUnits,
    );

    if (magnitude === 0) {
      return {
        horizontalComponent: 0,
        depthComponent: 0,
      };
    }

    return {
      horizontalComponent: planarVector.horizontalPositionInWorldUnits / magnitude,
      depthComponent: planarVector.depthPositionInWorldUnits / magnitude,
    };
  }
}
