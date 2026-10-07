export type AbilityId =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type ClassFeatureType =
  | "automatic"
  | "subclass-choice"
  | "subclass-feature"
  | "feat-choice"
  | "epic-boon-choice";

export type ClassFeature = {
  id: string;
  name?: string;
  level: number;
  summary?: string;
  type: ClassFeatureType;
};

export type SubclassFeature = {
  id: string;
  name: string;
  summary: string;
};

export type CharacterSubclass = {
  id: string;
  name: string;
  summary: string;
  features: Record<string, SubclassFeature[]>;
};

export type LevelImprovementChoice = {
  type: "ability" | "feat" | "";
  ability1: AbilityId | "";
  ability2: AbilityId | "";
  feat: string;
};

export type ClassFeatureConfig = {
  classId: string;
  className: string;

  features: readonly ClassFeature[];
  subclasses: readonly CharacterSubclass[];

  improvementLevels: readonly number[];

  epicBoonLevel?: number;
};