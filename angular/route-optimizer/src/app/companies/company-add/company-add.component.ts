import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CompaniesService, Company } from '../companies.service';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss']
})
export class CompanyAddComponent implements OnInit {
  lat = 53.13336;
  lng = 23.1467987;
  zoom = 12;

  companyForm: FormGroup;

  constructor(private http: HttpClient, private companiesService: CompaniesService) {}

  ngOnInit() {
    this.companyForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      nameShort: new FormControl('', [Validators.required]),
      nip: new FormControl('', [Validators.required]),
      street: new FormControl(''),
      houseNo: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required])
    });
  }

  updateForm(formData): void {
    if (formData.city && formData.street && formData.houseNo) {
      this.getCoordsFromAddress(`${formData.street} ${formData.houseNo}, ${formData.city}`).subscribe(
        address => {
          const results = address.results[0];
          const location = results.geometry.location;
          this.lng = location.lng;
          this.lat = location.lat;
        },
        err => console.error(err)
      );
    }
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
        longitude
      };
      const company: Company = Object.assign(new Company(), values);

      this.companiesService.addCompany(company).subscribe(newCompany => {
        // TODO: Verify response
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
