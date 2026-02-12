import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateNotBeforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const controlDate = new Date(control.value);
    return controlDate < today ? { dateNotBeforeToday: { value: control.value } } : null;
  };
}

export function endDateAfterStartDateValidator(startDateControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }
    const startDateControl = formGroup.get(startDateControlName);
    if (!startDateControl) {
      return null;
    }
    const startDate = new Date(startDateControl.value);
    const endDate = new Date(control.value);
    return endDate < startDate ? { endDateNotAfterStartDate: { value: control.value } } : null;
  };
}
