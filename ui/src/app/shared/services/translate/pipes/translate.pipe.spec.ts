import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from '../services/translate.service';
import { of } from 'rxjs';

class MockTranslateService {
  translate(key: string, values?: Record<string, any>): string {
    return key;
  }

  translate$(key: string, values?: Record<string, any>) {
    return of(key);
  }
}

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    });

    pipe = TestBed.inject(TranslatePipe);
    translateService = TestBed.inject(TranslateService);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return translated string for valid key', () => {
    spyOn(translateService, 'translate').and.returnValue('Hello World');

    const result = pipe.transform('greeting.hello');
    expect(result).toBe('Hello World');
    expect(translateService.translate).toHaveBeenCalledWith(
      'greeting.hello',
      undefined
    );
  });

  it('should return translated string with placeholders replaced', () => {
    spyOn(translateService, 'translate').and.returnValue('Hello John');

    const result = pipe.transform('greeting.hello', { name: 'John' });
    expect(result).toBe('Hello John');
    expect(translateService.translate).toHaveBeenCalledWith('greeting.hello', {
      name: 'John',
    });
  });

  it('should return an empty string if input is null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return key if translation is not found', () => {
    spyOn(translateService, 'translate').and.returnValue('key.not.found');

    const result = pipe.transform('invalid.key');
    expect(result).toBe('key.not.found');
    expect(translateService.translate).toHaveBeenCalledWith(
      'invalid.key',
      undefined
    );
  });
});
