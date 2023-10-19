import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string) {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getFieldErrorMessage(field);
  }

  getFormArrayFieldErrorMessage(
    formGroup: UntypedFormGroup,
    formArrayName: string,
    fieldName: string,
    fieldIndex: number
    ) {
      const formArray = formGroup.get(formArrayName) as UntypedFormArray;
      const field = formArray.controls[fieldIndex].get(fieldName) as UntypedFormControl;
      return this.getFieldErrorMessage(field);
  }

  getFieldErrorMessage(field: UntypedFormControl) {
    if (field?.hasError('required')) {
      return 'Campo obrigatório.';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 0;
      return `O tamanho mínimo do campo é ${requiredLength} caracteres.`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 0;
      return `O tamanho máximo do campo é ${requiredLength} caracteres.`;
    }

    return 'Valor inválido';
  }

  isFormArrayRequired(formGroup: UntypedFormGroup, formArrayName: string) {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    return !formArray.valid && formArray.hasError('required') && formArray.touched;
  }

  checkAllFormValidations(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach(formControlName => {
      const control = formGroup.get(formControlName);

      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormArray || control instanceof UntypedFormGroup) {
        control.markAsTouched({ onlySelf: true });
        this.checkAllFormValidations(control);
      }
    })
  }

}
