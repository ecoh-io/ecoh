import { Location } from '@/src/types/location';

const isLocation = (value: any): value is Location =>
  value?.type === 'Point' &&
  Array.isArray(value.coordinates) &&
  value.coordinates.length === 2 &&
  value.coordinates.every((coord: any) => typeof coord === 'number');

const isRecord = (value: any): value is Record<string, string> =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  !isLocation(value);

export const formatValue = (
  value: string | Record<string, string> | Location,
): string => {
  if (typeof value === 'string') return value;
  if (isLocation(value)) {
    const [lon, lat] = value.coordinates;
    return `Lat: ${lat}, Lon: ${lon}`;
  }
  if (isRecord(value)) {
    return Object.entries(value)
      .map(
        ([platform]) =>
          platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase(),
      )
      .join(', ');
  }
  return '';
};
