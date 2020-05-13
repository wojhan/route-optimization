import { Component, Input, OnInit } from '@angular/core';
import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';
import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';
import { BusinessTripMessageType } from '@route-optimizer/core/enums/BusinessTripMessageType';
import { BusinessTripWSInfo } from '@route-optimizer/core/models/BusinessTripWSInfo';
import { Route } from '@route-optimizer/core/models/Route';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-business-trips-business-trip-card',
  templateUrl: './business-trip-card.component.html'
})
export class BusinessTripCardComponent implements OnInit {
  @Input() businessTrip: BusinessTrip;

  businessTripInfo: BusinessTripWSInfo = { state: undefined };

  routesByDay;

  constructor(private businessTripService: BusinessTripService, private toastr: ToastrService) {}

  ngOnInit() {
    this.businessTripService
      .getBusinessTripWS(this.businessTrip.id)
      .asObservable()
      .subscribe({
        next: msg => {
          // console.log(msg);
          this.businessTripInfo = { state: msg.messageType };
          switch (msg.messageType) {
            case BusinessTripMessageType.SUCCEEDED:
              this.businessTrip = msg.message;
              this.routesByDay = this.getRoutesByDay();
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

  getRoutesByDay(): Array<Route[]> {
    return this.businessTripService.getRoutesByDay(this.businessTrip);
  }
}
