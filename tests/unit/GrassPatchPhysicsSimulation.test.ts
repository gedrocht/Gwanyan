import { GrassPatchPhysicsSimulation } from '@/simulation/GrassPatchPhysicsSimulation';
import { WindFieldModel } from '@/simulation/WindFieldModel';

describe('GrassPatchPhysicsSimulation', () => {
  it('creates a full grid of patch descriptors', () => {
    const descriptors = GrassPatchPhysicsSimulation.createGridDescriptors(4, 3, 20, 12);

    expect(descriptors).toHaveLength(12);
    expect(descriptors[0]?.groundCoordinate.horizontalPositionInWorldUnits).toBeLessThan(0);
    expect(descriptors.at(-1)?.groundCoordinate.depthPositionInWorldUnits).toBeGreaterThan(0);
  });

  it('moves patch displacement toward the wind direction over time', () => {
    const descriptors = GrassPatchPhysicsSimulation.createGridDescriptors(1, 1, 10, 10);
    const simulation = new GrassPatchPhysicsSimulation({
      descriptors,
      springStrength: 8,
      dampingStrength: 2,
      patchMass: 1,
      maximumTipDisplacementInWorldUnits: 2,
      windFieldModel: new WindFieldModel(8, 10, 0),
    });

    simulation.advanceSimulation(
      0.1,
      {
        isActive: true,
        currentGroundCoordinate: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 15,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 15,
      },
      0,
    );

    expect(
      simulation.getStates()[0]?.tipDisplacementInWorldUnits.horizontalComponent,
    ).toBeGreaterThan(0);
  });

  it('clamps displacement to the configured maximum magnitude', () => {
    const descriptors = GrassPatchPhysicsSimulation.createGridDescriptors(1, 1, 10, 10);
    const simulation = new GrassPatchPhysicsSimulation({
      descriptors,
      springStrength: 0,
      dampingStrength: 0,
      patchMass: 1,
      maximumTipDisplacementInWorldUnits: 0.25,
      windFieldModel: new WindFieldModel(20, 100, 0),
    });

    simulation.advanceSimulation(
      1,
      {
        isActive: true,
        currentGroundCoordinate: {
          horizontalPositionInWorldUnits: 0,
          depthPositionInWorldUnits: 0,
        },
        groundVelocityInWorldUnitsPerSecond: {
          horizontalPositionInWorldUnits: 100,
          depthPositionInWorldUnits: 0,
        },
        movementMagnitudeInWorldUnitsPerSecond: 100,
      },
      0,
    );

    const clampedMagnitude = Math.hypot(
      simulation.getStates()[0]?.tipDisplacementInWorldUnits.horizontalComponent ?? 0,
      simulation.getStates()[0]?.tipDisplacementInWorldUnits.depthComponent ?? 0,
    );

    expect(clampedMagnitude).toBeLessThanOrEqual(0.25);
  });
});
