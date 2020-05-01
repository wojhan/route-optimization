import { Component, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CompanyFormData } from '@route-optimizer/core/models/forms/CompanyFormData';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnChanges {
  @Output()
  public formChanged: EventEmitter<CompanyFormData> = new EventEmitter();

  @Output()
  public formSent: EventEmitter<CompanyFormData> = new EventEmitter();

  @Input()
  public companyForm: FormGroup;

  @Input()
  public submitButton;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.companyForm) {
      const change = changes.companyForm;

      if (change.currentValue) {
        this.companyForm.valueChanges.pipe(debounceTime(500)).subscribe((data: any) => {
          this.formChanged.emit(data);
        });
      }
    }
  }

  sendForm() {
    this.formSent.emit(this.companyForm.value);
  }
}
