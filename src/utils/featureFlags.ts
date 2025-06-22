// src/utils/featureFlags.ts
import type { FeatureFlags } from '../types/index';

export class FeatureFlagService {
  private static flags: FeatureFlags = {
    encryption: true,
    analytics: true,
    offlineMode: true,
    virtualizedList: true,
  };

  static getFlag(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  static setFlag(flag: keyof FeatureFlags, value: boolean): void {
    this.flags[flag] = value;
  }

  static getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }
}