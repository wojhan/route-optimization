import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map } from 'rxjs/operators';
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
      nip: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required])
    });
    this.companyForm.valueChanges.pipe(debounceTime(300)).subscribe((data: any) => {
      if (data.city && data.address) {
        this.getCoordsFromAddress(`${data.address}, ${data.city}`).subscribe(
          address => {
            const results = address.results[0];
            const location = results.geometry.location;
            this.lng = location.lng;
            this.lat = location.lat;
            console.log(this.lng, this.lat);
          },
          err => console.error(err)
        );
      }
    });
  }

  addCompany(): void {
    const addressValue = this.companyForm.get('address').value;
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
        nameShort: this.companyForm.get('name').value,
        nip: this.companyForm.get('nip').value,
        street: this.companyForm.get('address').value.split(' ')[0],
        houseNo: this.companyForm.get('address').value.split(' ')[1],
        postcode: this.companyForm.get('postcode').value,
        city: this.companyForm.get('city').value,
        latitude,
        longitude
      };
      const company: Company = Object.assign(new Company(), values);

      this.companiesService.addCompany(company).subscribe(newCompany => {
        console.log(newCompany);
      });
    });
  }

  getCoordsFromAddress(address: string): Observable<any> {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${localStorage.getItem('apiKey')}`
    );
  }
}

export interface Company {
  name?: string;
  street?: string;
  streetNo?: string;
  city?: string;
}
