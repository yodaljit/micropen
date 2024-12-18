import type { FeatureBlueprint } from '../types';
import { basicBlueprints } from './blueprints';

export class BlueprintManager {
  #blueprints: Map<string, FeatureBlueprint>;

  constructor() {
    this.#blueprints = new Map();
    this.#registerBasicBlueprints();
  }

  getBlueprint(name: string): FeatureBlueprint | undefined {
    return this.#blueprints.get(name);
  }

  registerBlueprint(name: string, blueprint: FeatureBlueprint): void {
    // Validate blueprint
    this.#validateBlueprint(blueprint);
    this.#blueprints.set(name, blueprint);
  }

  #registerBasicBlueprints(): void {
    Object.entries(basicBlueprints).forEach(([name, blueprint]) => {
      this.registerBlueprint(name, blueprint);
    });
  }

  #validateBlueprint(blueprint: FeatureBlueprint): void {
    const { type, requirements, domImpact, cleanupSteps } = blueprint;
    
    if (!['inline', 'block', 'void'].includes(type)) {
      throw new Error(`Invalid blueprint type: ${type}`);
    }

    if (!Array.isArray(requirements) || !Array.isArray(domImpact) || !Array.isArray(cleanupSteps)) {
      throw new Error('Blueprint arrays must be valid');
    }

    // Validate requirements
    const validRequirements = ['selection', 'range', 'input', 'block'];
    requirements.forEach(req => {
      if (!validRequirements.includes(req)) {
        throw new Error(`Invalid requirement: ${req}`);
      }
    });

    // Validate DOM impact
    const validImpacts = ['wrap', 'insert', 'transform'];
    domImpact.forEach(impact => {
      if (!validImpacts.includes(impact)) {
        throw new Error(`Invalid DOM impact: ${impact}`);
      }
    });
  }

  hasBlueprint(name: string): boolean {
    return this.#blueprints.has(name);
  }

  removeBlueprint(name: string): void {
    this.#blueprints.delete(name);
  }

  getAllBlueprints(): string[] {
    return Array.from(this.#blueprints.keys());
  }
}
