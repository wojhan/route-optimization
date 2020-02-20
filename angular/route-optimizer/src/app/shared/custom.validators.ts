import { FormControl, AbstractControl } from '@angular/forms';

export class CustomValidators {
  public static passwordMismatch(c: AbstractControl) {
    if (c.get('password').value !== c.get('password2').value) {
      return { passwordMismatch: true };
    }
  }
}
