import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CompaniesService, Company } from '../companies.service';

import * as L from 'leaflet';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss']
})
export class CompanyAddComponent implements OnInit, AfterViewInit {
  map;
  marker;
  lat = 53.13336;
  lng = 23.1467987;
  zoom = 7;

  companyForm: FormGroup;

  constructor(
    private http: HttpClient,
    private companiesService: CompaniesService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
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

  ngAfterViewInit() {
    this.initMap();
  }

  updateForm(formData): void {
    if (formData.city && formData.street && formData.houseNo) {
      this.map.setZoom(7);
      this.getCoordsFromAddress(`${formData.street} ${formData.houseNo}, ${formData.city}`).subscribe(
        address => {
          const results = address.results[0];
          const location = results ? results.geometry.location : null;
          if (location) {
            this.lng = location.lng;
            this.lat = location.lat;
            if (!this.marker) {
              this.marker = L.marker([this.lat, this.lng]).addTo(this.map);
            } else {
              const latLng = L.latLng(this.lat, this.lng);
              this.map.panTo(latLng);
              this.marker.setLatLng(latLng);
            }
            this.map.setZoom(11);
          }
        },
        err => console.error(err)
      );
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: this.zoom
    });

    // this.marker = L.marker([this.lat, this.lng]).addTo(this.map);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  addCompany(): void {
    const addressValue = this.companyForm.get('street').value + ' ' + this.companyForm.get('houseNo').value;
    const postcodeValue = this.companyForm.get('postcode').value;
    const cityValue = this.companyForm.get('city').value;

    const address = `${addressValue}, ${postcodeValue} ${cityValue}`;
    this.getCoordsFromAddress(address).subscribe(coords => {
      let latitude = null;
      let longitude = null;

      if (coords.status === 'OK') {
        latitude = coords.results[0].geometry.location.lat;
        longitude = coords.results[0].geometry.location.lng;
      }

      const values = {
        name: this.companyForm.get('name').value,
        nameShort: this.companyForm.get('nameShort').value,
        nip: this.companyForm.get('nip').value,
        street: this.companyForm.get('street').value,
        houseNo: this.companyForm.get('houseNo').value,
        postcode: this.companyForm.get('postcode').value,
        city: this.companyForm.get('city').value,
        latitude,
        longitude,
        addedBy: this.userService.user.getValue().url
      };
      const company: Company = Object.assign(new Company(), values);

      this.companiesService.addCompany(company).subscribe({
        error: (err: HttpErrorResponse) => {
          const error: CompanyErrorResponse = err.error;
          this.companyForm.get('nip').setErrors(error.nip ? { unique: true } : null);
          this.cdRef.detectChanges();
        }
      });
    });
  }

  getCoordsFromAddress(address: string): Observable<any> {
    return this.companiesService.getCoordsFromAddress(address);
  }
}

export interface Company {
  name?: string;
  street?: string;
  streetNo?: string;
  city?: string;
}

export interface CompanyErrorResponse {
  nonFieldErrors?: string[];
  nip?: string[];
}
