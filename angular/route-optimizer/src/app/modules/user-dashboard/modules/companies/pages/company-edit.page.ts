import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { MapOptions, LatLng } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { environment } from '@route-optimizer/environment/environment';
import { Company } from '@route-optimizer/core/models/Company';
import { SpinnerOverlayService } from '@route-optimizer/core/services/spinner-overlay.service';
import { CompanyModelErrorResponse } from '@route-optimizer/core/models/errors/CompanyModelErrorResponse';
import { CompanyService } from '@route-optimizer/core/services/company.service';
import { MapService } from '@route-optimizer/core/services/map.service';
import { CompanyFormData } from '@route-optimizer/core/models/forms/CompanyFormData';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.page.html'
})
export class CompanyEditPage implements OnInit, OnDestroy {
  company: Company;
  mapOptions: MapOptions;
  markerCoordinate: Array<LatLng>;
  lat = environment.map.defaultLat;
  lng = environment.map.defaultLng;

  editPage: boolean;

  companyForm: FormGroup;

  constructor(
    private companyService: CompanyService,
    private mapService: MapService,
    private toastr: ToastrService,
    private spinner: SpinnerOverlayService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.company = this.route.snapshot.data.company;
    this.editPage = this.route.snapshot.data.edit;
    this.buildForm();
    this.initMap();
  }

  ngOnDestroy(): void {}

  protected buildForm(): void {
    this.companyForm = new FormGroup({
      name: new FormControl(this.company.name, [Validators.required]),
      nameShort: new FormControl(this.company.nameShort, [Validators.required]),
      nip: new FormControl(this.company.nip, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      street: new FormControl(this.company.street),
      houseNo: new FormControl(this.company.houseNo, [Validators.required]),
      postcode: new FormControl(this.company.postcode, [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]),
      city: new FormControl(this.company.city, [Validators.required])
    });

    this.updateForm(this.companyForm.value);
  }

  updateForm(formData: CompanyFormData): void {
    const { street, houseNo, postcode, city } = formData;
    if (street && houseNo && postcode && city) {
      this.mapService
        .getCoordsFromAddress(`${street} ${houseNo}, ${postcode} ${city}`)
        .pipe(untilComponentDestroyed(this))
        .subscribe({
          next: (address: LatLng) => {
            this.markerCoordinate = [address];
            console.log(address);
          },
          error: (err: HttpErrorResponse | Error) => {
            this.markerCoordinate = [];
            if (!(err instanceof HttpErrorResponse)) {
              this.toastr.info('Nie udało się uzyskać położenia firmy. Upewnij się, że wpisany adres jest poprawny');
            }
          }
        });
    }
  }

  editCompany(): void {
    const latitude = this.markerCoordinate.length ? this.markerCoordinate[0].lat : null;
    const longitude = this.markerCoordinate.length ? this.markerCoordinate[0].lng : null;

    const company = Object.assign(this.company, { ...this.companyForm.value, latitude, longitude });
    this.spinner.show();
    this.companyService
      .editCompany(company)
      .pipe(
        finalize(() => this.spinner.hide()),
        untilComponentDestroyed(this)
      )
      .subscribe({
        next: (c: Company) => {
          this.toastr.success(`Zapisano zmiany.`);
          this.router.navigate(['/dashboard/companies', c.id]);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status) {
            const error: CompanyModelErrorResponse = err.error;
            this.companyForm.get('nip').setErrors(error.nip ? { unique: true } : null);
          }
        }
      });
  }

  initMap() {
    this.mapOptions = environment.map.defaultMapOptions as MapOptions;

    this.markerCoordinate = [];
  }
}
