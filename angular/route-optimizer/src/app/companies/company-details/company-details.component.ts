import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompaniesService, Company } from '../companies.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as L from 'leaflet';
import { MatDialog } from '@angular/material';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

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

  constructor(
    public companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

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

  deleteCompany() {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        content: `Czy na pewno chcesz usunąć firmę ${this.company.nameShort}?`,
        ok: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companiesService.deleteCompany(this.company.id).subscribe({
          next: () => {
            this.router.navigate(['dashboard/companies']);
          }
        });
      }
    });
  }
}
