/**
 * Utility to measure feature and bundle sizes
 */

export function measureFeatureSize(code: string): number {
  // Convert to UTF-8 encoded bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(code);
  return bytes.length;
}

export function measureBundleSize(features: Map<string, any>): number {
  let totalSize = 0;
  
  // Base editor size (core functionality)
  const baseSize = 512; // Base size in bytes
  totalSize += baseSize;
  
  // Add size of each enabled feature
  for (const [_, feature] of features) {
    const featureCode = feature.toString();
    totalSize += measureFeatureSize(featureCode);
  }
  
  return totalSize;
}
