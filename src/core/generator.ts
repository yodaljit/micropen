import type { FeatureBlueprint, GeneratedFeature } from '../types';
import { BlueprintManager } from '../features/manager';
import { measureFeatureSize } from '../utils/size';
import { browserAPIs } from '../utils/ssr';

export class FeatureGenerator {
  #blueprintManager: BlueprintManager;
  #cache: Map<string, string>;

  constructor() {
    this.#blueprintManager = new BlueprintManager();
    this.#cache = new Map();
  }

  async generateFeature(name: string): Promise<GeneratedFeature> {
    const blueprint = this.#blueprintManager.getBlueprint(name);
    if (!blueprint) throw new Error(`Blueprint not found for feature: ${name}`);

    // Check cache first
    const cached = this.#cache.get(name);
    if (cached) {
      return new Function('browserAPIs', `return ${cached}`)(browserAPIs) as GeneratedFeature;
    }

    const code = this.#generateCode(blueprint);
    const optimizedCode = this.#optimize(code);
    
    // Check feature size
    const featureSize = measureFeatureSize(optimizedCode);
    if (featureSize > 256) { // max_feature_size from guidelines
      throw new Error(`Feature ${name} exceeds size limit (${featureSize}B > 256B)`);
    }
    
    // Cache the generated code
    this.#cache.set(name, optimizedCode);
    
    try {
      // Create a proper closure for the feature
      const feature = new Function('browserAPIs', `return ${optimizedCode}`)(browserAPIs) as GeneratedFeature;
      
      console.log(`Generated feature ${name} (size: ${featureSize}B)`);
      return feature;
    } catch (error) {
      console.error('Failed to generate feature code:', optimizedCode);
      throw error;
    }
  }

  #generateCode(blueprint: FeatureBlueprint): string {
    const { generate } = blueprint;
    // Ensure proper spacing around return statements and preserve variable declarations
    const code = generate.trim()
      .replace(/return\s*([^\s])/g, 'return $1')
      .replace(/let\s+([^\s])/g, 'let $1')
      .replace(/var\s+([^\s])/g, 'var $1')
      .replace(/const\s+([^\s])/g, 'const $1');
    return `{exec:function(){${code}},cleanup:function(){},handlers:{}}`;
  }

  #optimize(code: string): string {
    return code
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
      .replace(/\s+/g, '') // Remove whitespace
      .replace(/return([^\s])/g, 'return $1') // Preserve space after return
      .replace(/let([^\s])/g, 'let $1') // Preserve space after let
      .replace(/var([^\s])/g, 'var $1') // Preserve space after var
      .replace(/const([^\s])/g, 'const $1') // Preserve space after const
      .trim();
  }

  clearCache(): void {
    this.#cache.clear();
  }
}
