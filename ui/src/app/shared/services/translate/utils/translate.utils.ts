import { IGetTranslation } from '../models/translate.models';

export function getTranslation(
  object: any,
  keys: string[],
  i: number = 0
): IGetTranslation {
  if (!object[keys[i]]) {
    return { translation: '', found: false };
  }

  const res = object[keys[i]];
  const isLastKey = i + 1 === keys.length && keys[i] === keys.at(-1);

  if (isLastKey && typeof res === 'string') {
    return { translation: res, found: true };
  } else {
    return getTranslation(res, keys, i + 1);
  }
}

export function replacePlaceholders(
  input: string,
  replacements: Record<string, any>
): string {
  return Object.entries(replacements).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, input);
}

export function keyNotFoundError(key: string, url: string) {
  return 'TranslatePipe: key: ' + key + ', does not exists in ' + url;
}
