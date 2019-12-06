import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CompaniesService, Company } from "../companies.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.scss"]
})
export class CompanyDetailsComponent implements OnInit {
  company: Company;
  lat;
  lng;
  zoom = 12;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get("id");

    this.companiesService.getCompany(id).subscribe(company => {
      this.company = company;
      const address = `${this.company.street} ${this.company.houseNo}, ${this.company.postcode} ${this.company.city}`;
      this.companiesService.getCoordsFromAddress(address).subscribe(coords => {
        const results = coords.results[0];
        const location = results.geometry.location;
        this.lng = location.lng;
        this.lat = location.lat;
        this.cdRef.detectChanges();
      });
    });
  }
}
