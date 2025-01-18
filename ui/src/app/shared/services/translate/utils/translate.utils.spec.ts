import { getTranslation, replacePlaceholders } from './translate.utils';

describe('TranslationUtils', () => {
  describe('getTranslation', () => {
    let translations: Record<string, any>;

    beforeEach(() => {
      translations = {
        homepage: {
          greeting: {
            morning: 'Good morning',
            evening: 'Good evening',
          },
          farewell: 'Goodbye',
        },
        aboutpage: {
          greeting: {
            morning: 'Buenos días',
            evening: 'Buenas noches',
          },
          farewell: 'Adiós',
        },
      };
    });

    it('should return the correct translation for a valid path', () => {
      expect(getTranslation(translations, 'homepage.greeting.morning'.split('.'))).toEqual({ translation: 'Good morning', found: true });
      expect(getTranslation(translations, 'aboutpage.farewell'.split('.'))).toEqual({
        translation: 'Adiós',
        found: true,
      });
    });

    it('should return an empty translation and found as false for an invalid path', () => {
      expect(getTranslation(translations, 'contactpage.greeting.morning'.split('.'))).toEqual({ translation: '', found: false });

      expect(getTranslation(translations, 'homepage.greeting.night'.split('.'))).toEqual({ translation: '', found: false });
    });

    it('should return an empty translation and found as false for an incomplete path', () => {
      expect(getTranslation(translations, ['homepage', 'greeting'])).toEqual({
        translation: '',
        found: false,
      });
    });
  });

  describe('replacePlaceholders', () => {
    it('should replace single placeholder correctly', () => {
      const input = 'Hello, {{name}}!';
      const replacements = { name: 'John' };
      expect(replacePlaceholders(input, replacements)).toBe('Hello, John!');
    });

    it('should replace multiple placeholders correctly', () => {
      const input = 'Hello, {{name}}! You have {{count}} new messages.';
      const replacements = { name: 'John', count: 5 };
      expect(replacePlaceholders(input, replacements)).toBe('Hello, John! You have 5 new messages.');
    });

    it('should not replace anything if no matching placeholders are found', () => {
      const input = 'Hello, {{name}}!';
      const replacements = { username: 'John' };
      expect(replacePlaceholders(input, replacements)).toBe('Hello, {{name}}!');
    });

    it('should handle empty input string', () => {
      const input = '';
      const replacements = { name: 'John' };
      expect(replacePlaceholders(input, replacements)).toBe('');
    });

    it('should handle empty replacements object', () => {
      const input = 'Hello, {{name}}!';
      const replacements = {};
      expect(replacePlaceholders(input, replacements)).toBe('Hello, {{name}}!');
    });
  });
});
