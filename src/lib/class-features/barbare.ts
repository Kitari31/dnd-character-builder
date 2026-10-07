import barbare from "@/data/class-features/barbare.json";

import type {
  CharacterSubclass,
  ClassFeature,
  ClassFeatureConfig,
} from "./types";

const features =
  barbare.features as ClassFeature[];

const subclasses =
  barbare.subclasses as CharacterSubclass[];

export const barbarianFeatureConfig: ClassFeatureConfig = {
  classId: "barbare",

  className: "Barbare",

  features,

  subclasses,

  improvementLevels: [4, 8, 12, 16],

  epicBoonLevel: 19,
};