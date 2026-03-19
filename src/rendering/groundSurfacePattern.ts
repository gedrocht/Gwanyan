/**
 * This scalar field represents a grayscale pattern across the terrain. The
 * renderer later reinterprets these values as dirt color, roughness, and bump
 * information. Keeping the generator pure lets us unit test the terrain look
 * without touching any browser-only canvas APIs.
 */
export type GroundSurfaceNoiseField = number[][];

/**
 * A lightweight pseudo-random function based on sine hashing. It is not
 * cryptographically secure, but it is perfectly adequate for procedural visual
 * texture generation.
 */
function sampleHashNoise(horizontalIndex: number, depthIndex: number): number {
  const hashedValue = Math.sin(horizontalIndex * 127.1 + depthIndex * 311.7) * 43_758.545_312_3;
  return hashedValue - Math.floor(hashedValue);
}

/**
 * Samples a small fractal noise stack. Multiple octaves make the terrain look
 * less flat and repetitive than a single-frequency pattern would.
 */
export function sampleFractalNoise(
  horizontalCoordinate: number,
  depthCoordinate: number,
  octaveCount = 4,
): number {
  let totalNoise = 0;
  let totalAmplitude = 0;
  let frequency = 1;
  let amplitude = 1;

  for (let octaveIndex = 0; octaveIndex < octaveCount; octaveIndex += 1) {
    const sampleValue = sampleHashNoise(
      Math.floor(horizontalCoordinate * frequency),
      Math.floor(depthCoordinate * frequency),
    );

    totalNoise += sampleValue * amplitude;
    totalAmplitude += amplitude;
    frequency *= 2;
    amplitude *= 0.5;
  }

  return totalAmplitude === 0 ? 0 : totalNoise / totalAmplitude;
}

/**
 * Builds a deterministic two-dimensional terrain noise field.
 */
export function createGroundSurfaceNoiseField(resolutionInPixels: number): GroundSurfaceNoiseField {
  const field: GroundSurfaceNoiseField = [];

  for (let depthIndex = 0; depthIndex < resolutionInPixels; depthIndex += 1) {
    const row: number[] = [];

    for (let horizontalIndex = 0; horizontalIndex < resolutionInPixels; horizontalIndex += 1) {
      const coarseNoise = sampleFractalNoise(horizontalIndex / 48, depthIndex / 48, 5);
      const fineNoise = sampleFractalNoise(horizontalIndex / 12, depthIndex / 12, 3);
      const combinedNoise = coarseNoise * 0.7 + fineNoise * 0.3;

      row.push(combinedNoise);
    }

    field.push(row);
  }

  return field;
}
