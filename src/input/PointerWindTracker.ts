/**
 * A ground coordinate stores the pointer location after the screen-space mouse
 * position has been projected onto the flat terrain. Keeping a simple
 * two-dimensional structure here makes it easier to test the wind logic without
 * having to create Three.js objects in every unit test.
 */
export interface GroundCoordinate {
  readonly horizontalPositionInWorldUnits: number;
  readonly depthPositionInWorldUnits: number;
}

/**
 * The simulation does not need the entire pointer history. It only needs a
 * recent position, a recent velocity, and a simple "is the pointer still
 * active?" flag. This object packages exactly that information.
 */
export interface WindSourceState {
  readonly isActive: boolean;
  readonly currentGroundCoordinate: GroundCoordinate | null;
  readonly groundVelocityInWorldUnitsPerSecond: GroundCoordinate;
  readonly movementMagnitudeInWorldUnitsPerSecond: number;
}

interface PointerSample {
  readonly recordedAtTimeInMilliseconds: number;
  readonly groundCoordinate: GroundCoordinate;
}

/**
 * PointerWindTracker converts a stream of mouse positions into a stable wind
 * source description. The class deliberately averages multiple samples instead
 * of trusting just the latest one because raw mouse data can be noisy and
 * visually unpleasant when converted directly into physics forces.
 */
export class PointerWindTracker {
  private readonly stalePointerTimeoutInMilliseconds: number;

  private readonly recentSamples: PointerSample[] = [];

  /**
   * Creates a pointer tracker with a timeout that determines when the mouse
   * should stop contributing wind because it has gone still or left the canvas.
   */
  public constructor(stalePointerTimeoutInMilliseconds: number) {
    this.stalePointerTimeoutInMilliseconds = stalePointerTimeoutInMilliseconds;
  }

  /**
   * Records a freshly projected pointer location in world space.
   *
   * @param recordedAtTimeInMilliseconds - The timestamp provided by the browser.
   * @param groundCoordinate - The pointer position projected onto the ground.
   */
  public recordPointerGroundCoordinate(
    recordedAtTimeInMilliseconds: number,
    groundCoordinate: GroundCoordinate,
  ): void {
    this.recentSamples.push({
      recordedAtTimeInMilliseconds,
      groundCoordinate,
    });

    while (this.recentSamples.length > 6) {
      this.recentSamples.shift();
    }
  }

  /**
   * Clears all recent samples. This is used when the pointer leaves the canvas
   * or when the application loses focus and should stop generating wind.
   */
  public clearPointerSamples(): void {
    this.recentSamples.length = 0;
  }

  /**
   * Produces the smoothed state that the simulation consumes each frame.
   *
   * @param currentTimeInMilliseconds - The current frame timestamp.
   * @returns A stable wind source description.
   */
  public createWindSourceState(currentTimeInMilliseconds: number): WindSourceState {
    const latestSample = this.recentSamples.at(-1) ?? null;

    if (
      latestSample === null ||
      currentTimeInMilliseconds - latestSample.recordedAtTimeInMilliseconds >
        this.stalePointerTimeoutInMilliseconds
    ) {
      return {
        isActive: false,
        currentGroundCoordinate: latestSample?.groundCoordinate ?? null,
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 0,
      };
    }

    const earliestRelevantSample = this.recentSamples[0];

    if (earliestRelevantSample === undefined || earliestRelevantSample === latestSample) {
      return {
        isActive: true,
        currentGroundCoordinate: latestSample.groundCoordinate,
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 0,
      };
    }

    const elapsedTimeInSeconds =
      (latestSample.recordedAtTimeInMilliseconds -
        earliestRelevantSample.recordedAtTimeInMilliseconds) /
      1000;

    if (elapsedTimeInSeconds <= 0) {
      return {
        isActive: true,
        currentGroundCoordinate: latestSample.groundCoordinate,
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 0,
      };
    }

    const horizontalVelocityInWorldUnitsPerSecond =
      (latestSample.groundCoordinate.horizontalPositionInWorldUnits -
        earliestRelevantSample.groundCoordinate.horizontalPositionInWorldUnits) /
      elapsedTimeInSeconds;
    const depthVelocityInWorldUnitsPerSecond =
      (latestSample.groundCoordinate.depthPositionInWorldUnits -
        earliestRelevantSample.groundCoordinate.depthPositionInWorldUnits) /
      elapsedTimeInSeconds;

    return {
      isActive: true,
      currentGroundCoordinate: latestSample.groundCoordinate,
      groundVelocityInWorldUnitsPerSecond: {
        horizontalPositionInWorldUnits: horizontalVelocityInWorldUnitsPerSecond,
        depthPositionInWorldUnits: depthVelocityInWorldUnitsPerSecond,
      },
      movementMagnitudeInWorldUnitsPerSecond: Math.hypot(
        horizontalVelocityInWorldUnitsPerSecond,
        depthVelocityInWorldUnitsPerSecond,
      ),
    };
  }
}
