import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { MapOptions, LatLng } from 'leaflet';
import { filter, switchMap } from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import { Company } from '@route-optimizer/core/models/Company';
import { MapService } from '@route-optimizer/core/services/map.service';
import { environment } from '@route-optimizer/environment/environment';
import { ConfirmRemoveModal } from '@route-optimizer/shared/components/confirm-remove-modal/confirm-remove.modal';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '@route-optimizer/core/services/company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.page.html'
})
export class CompanyDetailsPage implements OnInit, OnDestroy {
  company: Company;
  mapOptions: MapOptions;
  markerCoordinates = [LatLng];

  constructor(
    private companyService: CompanyService,
    private mapService: MapService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.company = this.route.snapshot.data.company;
    this.initMap();
  }

  ngOnDestroy() {}

  private initMap(): void {
    this.mapOptions = {
      center: [this.company.latitude, this.company.longitude],
      zoom: environment.map.singleElementZoom
    };

    this.markerCoordinates = [new LatLng(this.company.latitude, this.company.longitude)];
  }

  canEdit(): boolean {
    return this.companyService.canEdit(this.company);
  }

  deleteCompany() {
    const dialogRef = this.dialog.open(ConfirmRemoveModal, {
      width: '250px',
      data: {
        content: `Czy na pewno chcesz usunąć firmę ${this.company.nameShort}?`,
        ok: true
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(() => this.companyService.deleteCompany(this.company.id)),
        untilComponentDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.toastr.success(`Firma ${this.company.nameShort} została usunięta.`);
          this.router.navigate(['dashboard/companies']);
        }
      });
  }
}
