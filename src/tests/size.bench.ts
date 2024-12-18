import { bench, describe } from 'vitest';
import { FeatureGenerator } from '../core/generator';
import { basicBlueprints } from '../features/blueprints';

describe('Feature Generation Performance', () => {
  const generator = new FeatureGenerator();

  // Benchmark feature generation time
  Object.keys(basicBlueprints).forEach(feature => {
    bench(`Generate ${feature} feature`, async () => {
      await generator.generateFeature(feature);
    }, {
      time: 100, // Run for 100ms
      iterations: 1000 // Run 1000 iterations
    });
  });

  // Benchmark cached vs uncached
  bench('Generate cached feature', async () => {
    await generator.generateFeature('bold');
  });

  bench('Generate uncached feature', async () => {
    generator.clearCache();
    await generator.generateFeature('bold');
  });
});
