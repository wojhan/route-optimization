import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { MapOptions, LatLng } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { environment } from '@route-optimizer/environment/environment';
import { SpinnerOverlayService } from '@route-optimizer/core/services/spinner-overlay.service';
import { Company } from '@route-optimizer/core/models/Company';
import { CompanyModelErrorResponse } from '@route-optimizer/core/models/errors/CompanyModelErrorResponse';
import { CompanyService } from '@route-optimizer/core/services/company.service';
import { MapService } from '@route-optimizer/core/services/map.service';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';
import { CompanyFormData } from '@route-optimizer/core/models/forms/CompanyFormData';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.page.html'
})
export class CompanyAddPage implements OnInit, OnDestroy {
  mapOptions: MapOptions;
  markerCoordinate: Array<LatLng>;
  lat = environment.map.defaultLat;
  lng = environment.map.defaultLng;

  editPage: boolean;

  companyForm: FormGroup;

  constructor(
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private mapService: MapService,
    private toastr: ToastrService,
    private spinner: SpinnerOverlayService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editPage = this.route.snapshot.data.edit;
    this.buildForm();
    this.initMap();
  }

  ngOnDestroy(): void {}

  private buildForm(): void {
    this.companyForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      nameShort: new FormControl('', [Validators.required]),
      nip: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      street: new FormControl(''),
      houseNo: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]),
      city: new FormControl('', [Validators.required])
    });
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

  addCompany(): void {
    const latitude = this.markerCoordinate.length ? this.markerCoordinate[0].lat : null;
    const longitude = this.markerCoordinate.length ? this.markerCoordinate[0].lng : null;
    const addedBy = this.authenticationService.currentUser.getValue().id;

    const company = Object.assign(new Company(), { ...this.companyForm.value, latitude, longitude, addedBy });
    this.spinner.show();
    this.companyService
      .addCompany(company)
      .pipe(
        finalize(() => this.spinner.hide()),
        untilComponentDestroyed(this)
      )
      .subscribe({
        next: (c: Company) => {
          this.toastr.success(`Firma ${c.nameShort} została dodana.`);
          this.router.navigate(['/dashboard/companies']);
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
