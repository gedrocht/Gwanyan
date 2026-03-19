/**
 * This configuration object gathers the values that define the size, feel,
 * and performance profile of the interactive scene. Keeping them in one place
 * makes experimentation easier for learners because they can safely tweak a
 * number here and immediately understand which part of the scene changed.
 */
export const applicationConfiguration = {
  camera: {
    fieldOfViewInDegrees: 42,
    nearClippingPlaneDistance: 0.1,
    farClippingPlaneDistance: 300,
    initialPosition: {
      horizontalPositionInWorldUnits: 0,
      verticalPositionInWorldUnits: 10,
      depthPositionInWorldUnits: 16,
    },
  },
  ground: {
    widthInWorldUnits: 64,
    depthInWorldUnits: 64,
    textureResolutionInPixels: 1024,
  },
  grass: {
    bladeCount: 3600,
    segmentsPerBlade: 5,
    patchRows: 32,
    patchColumns: 32,
    minimumBladeHeightInWorldUnits: 0.7,
    maximumBladeHeightInWorldUnits: 1.6,
    minimumBladeWidthInWorldUnits: 0.018,
    maximumBladeWidthInWorldUnits: 0.045,
    maximumTipDisplacementInWorldUnits: 0.7,
  },
  wind: {
    influenceRadiusInWorldUnits: 8.5,
    maximumMouseDrivenWindForce: 8.2,
    ambientBreezeStrength: 0.25,
    stalePointerTimeoutInMilliseconds: 220,
  },
  simulation: {
    springStrength: 19,
    dampingStrength: 7.5,
    patchMass: 1.1,
    maximumSimulationTimeStepInSeconds: 1 / 30,
  },
  telemetry: {
    maximumBufferedLogEntryCount: 500,
    overlaySampleWindowFrameCount: 120,
  },
} as const;
