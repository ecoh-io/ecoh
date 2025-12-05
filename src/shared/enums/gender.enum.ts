export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non-binary',
  NOT_SAY = 'not-say',
}

export const genderDisplayMap: Record<Gender, string> = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.NON_BINARY]: 'Non-Binary',
  [Gender.NOT_SAY]: 'Prefer not to say',
};

export const getGenderDisplay = (gender: Gender): string => {
  return genderDisplayMap[gender] || 'Unknown';
};

export const genderOptions = Object.entries(genderDisplayMap).map(
  ([value, label]) => ({
    label,
    value: value as Gender,
  }),
);
