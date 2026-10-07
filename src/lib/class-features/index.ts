import { barbarianFeatureConfig } from "./barbare";

import type {
  ClassFeatureConfig,
} from "./types";

const configs: Record<
  string,
  ClassFeatureConfig
> = {
  barbare: barbarianFeatureConfig,
};

export function getClassFeatureConfig(
  classId: string | null
): ClassFeatureConfig | undefined {
  if (!classId) {
    return undefined;
  }

  return configs[classId];
}

export type {
  AbilityId,
  CharacterSubclass,
  ClassFeature,
  ClassFeatureConfig,
  ClassFeatureType,
  LevelImprovementChoice,
  SubclassFeature,
} from "./types";