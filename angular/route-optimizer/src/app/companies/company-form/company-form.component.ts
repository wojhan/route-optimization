import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit, OnChanges {
  @Output()
  public formChanged: EventEmitter<FormGroup> = new EventEmitter();

  @Output()
  public formSent: EventEmitter<FormGroup> = new EventEmitter();

  @Input()
  public companyForm: FormGroup;

  @Input()
  public submitButton;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.companyForm) {
      const change = changes.companyForm;

      if (change.currentValue) {
        this.companyForm.valueChanges.pipe(debounceTime(300)).subscribe((data: any) => {
          this.formChanged.emit(data);
        });
      }
    }
  }

  sendForm() {
    this.formSent.emit(this.companyForm);
  }
}
