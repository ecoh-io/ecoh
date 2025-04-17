import { Visibility } from '@/src/enums/visibility.enum';

export const getHaloColor = (visibility: Visibility): string | undefined => {
  switch (visibility) {
    case Visibility.NETWORK_ONLY:
      return '#599AFF';
    case Visibility.EVERYONE:
      return '#D4DEE4';
    default:
      return undefined;
  }
};

export const getGradientColors = (): [string, string] => {
  return ['#00c6ff', '#0072ff'];
};

export const hasHalo = (visibility: Visibility): boolean => {
  return visibility !== Visibility.PRIVATE;
};
