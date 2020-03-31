import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

import * as L from 'leaflet';
import { Company } from '../../../../../core/models/Company';
import { CompanyService } from '../../../../../core/services/company.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.page.html'
})
export class CompanyEditPage implements OnInit, AfterViewInit {
  map;
  marker;
  lat = 53.13336;
  lng = 23.1467987;
  zoom = 7;
  company: Company;

  companyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompanyService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.companiesService.getCompany(id).subscribe(company => {
      this.company = company;
      this.companyForm = new FormGroup({
        name: new FormControl(this.company.name, [Validators.required]),
        nameShort: new FormControl(this.company.nameShort, [Validators.required]),
        nip: new FormControl(this.company.nip, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
        street: new FormControl(this.company.street),
        houseNo: new FormControl(this.company.houseNo, [Validators.required]),
        postcode: new FormControl(this.company.postcode, [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]),
        city: new FormControl(this.company.city, [Validators.required])
      });
      this.getCoordsFromAddress(`${this.company.street} ${this.company.houseNo}, ${this.company.city}`).subscribe(
        address => {
          const results = address.results[0];
          const location = results ? results.geometry.location : null;
          this.map.setZoom(7);
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
          this.cdRef.detectChanges();
        },
        err => console.error(err)
      );
      this.cdRef.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.initMap();
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

  updateForm(formData): void {
    if (formData.city && formData.street && formData.houseNo) {
      this.getCoordsFromAddress(`${formData.street} ${formData.houseNo}, ${formData.city}`).subscribe(
        address => {
          const results = address.results[0];
          const location = results ? results.geometry.location : null;
          this.map.setZoom(7);
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
          this.cdRef.detectChanges();
        },
        err => console.error(err)
      );
    }
  }

  editCompany(): void {
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
        id: this.company.id,
        name: this.companyForm.get('name').value,
        nameShort: this.companyForm.get('nameShort').value,
        nip: this.companyForm.get('nip').value,
        street: this.companyForm.get('street').value,
        houseNo: this.companyForm.get('houseNo').value,
        postcode: this.companyForm.get('postcode').value,
        city: this.companyForm.get('city').value,
        latitude,
        longitude,
        addedBy: this.company.addedBy
      };
      const company: Company = Object.assign(new Company(), values);

      this.companiesService.editCompany(company).subscribe({
        next: () => {
          this.router.navigate(['dashboard/companies', company.id]);
        }
      });
    });
  }

  getCoordsFromAddress(address: string): Observable<any> {
    return this.companiesService.getCoordsFromAddress(address);
  }
}
