import { Component, HostBinding, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { MapOptions } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';
import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';
import { environment } from '@route-optimizer/environment/environment';
import { ModalService } from '@route-optimizer/core/services/modal.service';
import { BusinessTripWSInfo } from '@route-optimizer/core/models/BusinessTripWSInfo';
import { BusinessTripMessageType } from '@route-optimizer/core/enums/BusinessTripMessageType';

@Component({
  selector: 'app-business-trip-detail',
  templateUrl: './business-trip-detail.page.html'
})
export class BusinessTripDetailPage implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'fluid-content-wrapper';

  businessTripWsSubject: WebSocketSubject<any>;
  businessTrip: BusinessTrip;
  businessTripInfo: BusinessTripWSInfo;

  mapOptions: MapOptions = environment.map.defaultMapOptions;
  markerCoordinates = [];

  routesByDay = [];

  constructor(
    private businessTripService: BusinessTripService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.businessTrip = this.route.snapshot.data.businessTrip;
    this.updateRoutes();

    this.businessTripWsSubject = this.businessTripService.getBusinessTripWS(id);
    this.businessTripInfo = { state: undefined };
    this.businessTripWsSubject.asObservable().subscribe({
      next: msg => {
        this.businessTripInfo = { state: msg.messageType };
        switch (msg.messageType) {
          case BusinessTripMessageType.SUCCEEDED:
            this.businessTrip = msg.message;
            this.updateRoutes();
            break;
          case BusinessTripMessageType.PROCESSING:
            if (msg.message && msg.message.value) {
              this.businessTripInfo.progress = msg.message.value;
            }
            if (msg.message && msg.message.timeLeft) {
              this.businessTripInfo.timeLeft = msg.message.timeLeft;
            }
            break;
          case BusinessTripMessageType.FAILED:
            if (msg.message === 'No possible route found for parameters') {
              this.businessTripInfo.noRoute = true;
              this.businessTripInfo.errors = ['Dla podanych parametrów delegacji nie udało się dopasować trasy'];
            }
            if (msg.message === `Algorithm's error occurred`) {
              this.businessTripInfo.error = true;
              this.businessTripInfo.errors = ['Podczas przetwarzania trasy wystąpił błąd uniemożliwiający jej wygenerowanie'];
            }
            break;
        }
      },
      error: () => {
        this.toastr.error('Wystąpił błąd podczas przetwarzania informacji o delegacji z serwera.');
      }
    });
  }

  ngOnDestroy() {}

  updateRoutes() {
    this.routesByDay = [];
    for (let i = 0; i < this.businessTrip.duration; i++) {
      const routes = this.businessTrip.routes.filter(route => route.day === i);
      this.routesByDay.push(routes);
    }
  }

  edit(): void {
    this.router.navigate(['dashboard/business-trips', this.businessTrip.id, 'edit']);
  }

  delete(): void {
    // TODO: Update method to handle delete method of business trip service
    this.modalService
      .showDeleteModal('Czy chcesz usunąć delegację?')
      .pipe(
        filter(result => !!result),
        untilComponentDestroyed(this)
      )
      .subscribe({
        next: () => {
          // TODO: After change of url structure update the path
          this.router.navigate(['dashboard/business-trips']).then(() => {
            this.toastr.success('Usunięto delegację');
          });
        }
      });
  }
}
