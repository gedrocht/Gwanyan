import { PointerWindTracker } from '@/input/PointerWindTracker';

describe('PointerWindTracker', () => {
  it('marks the wind source as inactive when no samples were recorded', () => {
    const pointerWindTracker = new PointerWindTracker(200);

    expect(pointerWindTracker.createWindSourceState(1_000)).toEqual({
      isActive: false,
      currentGroundCoordinate: null,
      groundVelocityInWorldUnitsPerSecond: {
        horizontalPositionInWorldUnits: 0,
        depthPositionInWorldUnits: 0,
      },
      movementMagnitudeInWorldUnitsPerSecond: 0,
    });
  });

  it('computes velocity from the oldest and newest retained samples', () => {
    const pointerWindTracker = new PointerWindTracker(200);

    pointerWindTracker.recordPointerGroundCoordinate(0, {
      horizontalPositionInWorldUnits: 0,
      depthPositionInWorldUnits: 0,
    });
    pointerWindTracker.recordPointerGroundCoordinate(100, {
      horizontalPositionInWorldUnits: 2,
      depthPositionInWorldUnits: 1,
    });

    expect(pointerWindTracker.createWindSourceState(100)).toEqual({
      isActive: true,
      currentGroundCoordinate: {
        horizontalPositionInWorldUnits: 2,
        depthPositionInWorldUnits: 1,
      },
      groundVelocityInWorldUnitsPerSecond: {
        horizontalPositionInWorldUnits: 20,
        depthPositionInWorldUnits: 10,
      },
      movementMagnitudeInWorldUnitsPerSecond: Math.hypot(20, 10),
    });
  });

  it('becomes inactive after the stale timeout passes', () => {
    const pointerWindTracker = new PointerWindTracker(50);

    pointerWindTracker.recordPointerGroundCoordinate(0, {
      horizontalPositionInWorldUnits: 4,
      depthPositionInWorldUnits: -2,
    });

    expect(pointerWindTracker.createWindSourceState(100).isActive).toBe(false);
  });

  it('returns zero velocity when multiple samples have the same timestamp', () => {
    const pointerWindTracker = new PointerWindTracker(200);

    pointerWindTracker.recordPointerGroundCoordinate(100, {
      horizontalPositionInWorldUnits: 1,
      depthPositionInWorldUnits: 1,
    });
    pointerWindTracker.recordPointerGroundCoordinate(100, {
      horizontalPositionInWorldUnits: 3,
      depthPositionInWorldUnits: 4,
    });

    expect(
      pointerWindTracker.createWindSourceState(100).movementMagnitudeInWorldUnitsPerSecond,
    ).toBe(0);
  });

  it('drops samples beyond the rolling history limit and supports manual clearing', () => {
    const pointerWindTracker = new PointerWindTracker(500);

    for (let sampleIndex = 0; sampleIndex < 7; sampleIndex += 1) {
      pointerWindTracker.recordPointerGroundCoordinate(sampleIndex * 100, {
        horizontalPositionInWorldUnits: sampleIndex,
        depthPositionInWorldUnits: 0,
      });
    }

    expect(
      pointerWindTracker.createWindSourceState(600).groundVelocityInWorldUnitsPerSecond,
    ).toEqual({
      horizontalPositionInWorldUnits: 10,
      depthPositionInWorldUnits: 0,
    });

    pointerWindTracker.clearPointerSamples();

    expect(pointerWindTracker.createWindSourceState(600).isActive).toBe(false);
  });
});
