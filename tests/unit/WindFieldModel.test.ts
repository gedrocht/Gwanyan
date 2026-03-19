import { WindFieldModel } from '@/simulation/WindFieldModel';

describe('WindFieldModel', () => {
  it('produces ambient breeze even when the pointer is inactive', () => {
    const windFieldModel = new WindFieldModel(8, 10, 0.4);

    const windForce = windFieldModel.calculateWindForceAtGroundCoordinate(
      {
        horizontalPositionInWorldUnits: 1,
        depthPositionInWorldUnits: 2,
      },
      {
        isActive: false,
        currentGroundCoordinate: null,
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 0,
      },
      1.5,
    );

    expect(windForce.horizontalComponent).toBeGreaterThan(0);
    expect(windForce.depthComponent).toBeGreaterThan(0);
  });

  it('adds strong directional wind near the pointer', () => {
    const windFieldModel = new WindFieldModel(8, 10, 0.2);

    const windForce = windFieldModel.calculateWindForceAtGroundCoordinate(
      {
        horizontalPositionInWorldUnits: 0.5,
        depthPositionInWorldUnits: 0.5,
      },
      {
        isActive: true,
        currentGroundCoordinate: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 10,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 10,
      },
      0,
    );

    expect(windForce.horizontalComponent).toBeGreaterThan(1);
    expect(Math.abs(windForce.depthComponent)).toBeLessThan(1);
  });

  it('falls back to ambient breeze outside the influence radius', () => {
    const windFieldModel = new WindFieldModel(2, 10, 0.2);

    const windForce = windFieldModel.calculateWindForceAtGroundCoordinate(
      {
        horizontalPositionInWorldUnits: 10,
        depthPositionInWorldUnits: 10,
      },
      {
        isActive: true,
        currentGroundCoordinate: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 10,
          depthPositionInWorldUnits: 5,
        },
        movementMagnitudeInWorldUnitsPerSecond: 12,
      },
      0,
    );

    expect(windForce.horizontalComponent).toBeLessThan(1);
  });

  it('handles an active pointer with zero movement without producing invalid numbers', () => {
    const windFieldModel = new WindFieldModel(8, 10, 0.2);

    const windForce = windFieldModel.calculateWindForceAtGroundCoordinate(
      {
        horizontalPositionInWorldUnits: 0,
        depthPositionInWorldUnits: 0,
      },
      {
        isActive: true,
        currentGroundCoordinate: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 0,
      },
      0,
    );

    expect(Number.isFinite(windForce.horizontalComponent)).toBe(true);
    expect(Number.isFinite(windForce.depthComponent)).toBe(true);
  });
});
