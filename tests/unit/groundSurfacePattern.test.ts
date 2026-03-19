import {
  createGroundSurfaceNoiseField,
  sampleFractalNoise,
} from '@/rendering/groundSurfacePattern';

describe('ground surface pattern generation', () => {
  it('creates a square noise field of the requested resolution', () => {
    const noiseField = createGroundSurfaceNoiseField(8);

    expect(noiseField).toHaveLength(8);
    expect(noiseField[0]).toHaveLength(8);
  });

  it('returns deterministic noise samples for the same coordinates', () => {
    expect(sampleFractalNoise(2.5, 3.5)).toBe(sampleFractalNoise(2.5, 3.5));
  });

  it('returns different values for different coordinates', () => {
    expect(sampleFractalNoise(1, 1)).not.toBe(sampleFractalNoise(2, 2));
  });

  it('returns zero when no octaves are requested', () => {
    expect(sampleFractalNoise(1, 1, 0)).toBe(0);
  });
});
