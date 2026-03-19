export { applicationConfiguration } from '@/configuration/applicationConfiguration';
export type { GroundCoordinate, WindSourceState } from '@/input/PointerWindTracker';
export { PointerWindTracker } from '@/input/PointerWindTracker';
export { InteractiveGrasslandExperience } from '@/application/InteractiveGrasslandExperience';
export type { DiagnosticLogEntry, DiagnosticLogSeverity } from '@/telemetry/DiagnosticLogger';
export { DiagnosticLogger } from '@/telemetry/DiagnosticLogger';
export { GrassPatchPhysicsSimulation } from '@/simulation/GrassPatchPhysicsSimulation';
export type {
  GrassPatchDescriptor,
  GrassPatchSimulationState,
} from '@/simulation/GrassPatchPhysicsSimulation';
export { WindFieldModel } from '@/simulation/WindFieldModel';
export type { PlanarVector } from '@/simulation/WindFieldModel';
export {
  createGroundSurfaceNoiseField,
  sampleFractalNoise,
} from '@/rendering/groundSurfacePattern';
