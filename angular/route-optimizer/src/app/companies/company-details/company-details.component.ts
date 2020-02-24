import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompaniesService, Company } from '../companies.service';
import { ActivatedRoute } from '@angular/router';

import * as L from 'leaflet';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  company: Company;
  map;
  lat;
  lng;
  zoom = 12;

  constructor(public companiesService: CompaniesService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.companiesService.getCompany(id).subscribe(company => {
      this.company = company;
      const address = `${this.company.street} ${this.company.houseNo}, ${this.company.postcode} ${this.company.city}`;
      this.companiesService.getCoordsFromAddress(address).subscribe(coords => {
        const results = coords.results[0];
        const location = results.geometry.location;
        this.lng = location.lng;
        this.lat = location.lat;
        this.cdRef.detectChanges();
        this.initMap();
      });
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: this.zoom
    });

    const marker = L.marker([this.lat, this.lng]).addTo(this.map);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
}
