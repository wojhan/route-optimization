import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Company, CompaniesService } from '../companies.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {
  lat;
  lng;
  zoom = 12;
  company: Company;

  companyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.companiesService.getCompany(id).subscribe(company => {
      const addedBy = company.addedBy ? company.addedBy.split('?')[0] : '0';
      if (addedBy !== this.userService.profileHyperLink.getValue() && !this.userService.isStaff.getValue()) {
        this.router.navigate(['dashboard', 'company', id]);
      }

      this.company = company;
      this.companyForm = new FormGroup({
        name: new FormControl(this.company.name, [Validators.required]),
        nameShort: new FormControl(this.company.nameShort, [Validators.required]),
        nip: new FormControl(this.company.nip, [Validators.required]),
        street: new FormControl(this.company.street),
        houseNo: new FormControl(this.company.houseNo, [Validators.required]),
        postcode: new FormControl(this.company.postcode, [Validators.required]),
        city: new FormControl(this.company.city, [Validators.required])
      });
      this.getCoordsFromAddress(`${this.company.street} ${this.company.houseNo}, ${this.company.city}`).subscribe(
        address => {
          const results = address.results[0];
          const location = results.geometry.location;
          this.lng = location.lng;
          this.lat = location.lat;
          this.cdRef.detectChanges();
        },
        err => console.error(err)
      );
      this.cdRef.detectChanges();
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
        longitude
      };
      const company: Company = Object.assign(new Company(), values);

      this.companiesService.editCompany(company).subscribe(newCompany => {
        // TODO: Verify response
      });
    });
  }

  getCoordsFromAddress(address: string): Observable<any> {
    return this.companiesService.getCoordsFromAddress(address);
  }
}
