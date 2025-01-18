import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  standalone: true,
  name: 'formErrorMessage',
  pure: false,
})
export class FormErrorMessagePipe implements PipeTransform {
  transform(control: AbstractControl | null): string {
    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return '';
    }

    const errors: any = control.errors;

    if (errors.required) {
      return 'This field is required.';
    }
    if (errors.minlength) {
      return `Minimum length is ${errors.minlength.requiredLength} characters. You have entered ${errors.minlength.actualLength}.`;
    }
    if (errors.maxlength) {
      return `Maximum length is ${errors.maxlength.requiredLength} characters. You have entered ${errors.maxlength.actualLength}.`;
    }
    if (errors.email) {
      return 'Invalid email address format.';
    }
    if (errors.pattern) {
      return 'Invalid format.';
    }
    if (errors.min) {
      return `Minimum value allowed is ${errors.min.min}. You entered ${errors.min.actual}.`;
    }
    if (errors.max) {
      return `Maximum value allowed is ${errors.max.max}. You entered ${errors.max.actual}.`;
    }
    if (errors.requiredTrue) {
      return 'This field must be checked.';
    }
    if (errors.date) {
      return 'Invalid date.';
    }
    if (errors.matchPassword) {
      return 'Passwords do not match.';
    }
    if (errors.unique) {
      return 'This value must be unique.';
    }
    if (errors.ageRange) {
      return `Age must be between ${errors.ageRange.min} and ${errors.ageRange.max}. You entered ${errors.ageRange.actual}.`;
    }

    // Handle custom validators
    if (errors.specialChars) {
      return 'Special characters are not allowed.';
    }
    if (errors.url) {
      return 'Invalid URL.';
    }
    if (errors.phone) {
      return 'Invalid phone number.';
    }
    if (errors.alphaNumeric) {
      return 'Only alphanumeric characters are allowed.';
    }

    return 'Invalid value.';
  }
}
