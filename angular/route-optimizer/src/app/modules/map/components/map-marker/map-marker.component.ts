import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MapMarker } from '@route-optimizer/modules/map/components/map-marker/map-marker';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss']
})
export class MapMarkerComponent implements OnInit, OnChanges {
  @Input() marker: MapMarker;
  @Input() content: string | number;

  useFa = false;

  markerClasses;

  constructor() {}

  ngOnInit() {
    this.markerClasses = {
      'map-marker-outside': true,
      'company-marker': this.marker === MapMarker.COMPANY,
      'depot-marker': this.marker === MapMarker.DEPOT,
      'hotel-marker': this.marker === MapMarker.HOTEL,
      'start-marker': this.marker === MapMarker.START,
      'finish-marker': this.marker === MapMarker.FINISH
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.markerClasses = {
      'map-marker-outside': true,
      'company-marker': this.marker === MapMarker.COMPANY,
      'depot-marker': this.marker === MapMarker.DEPOT,
      'hotel-marker': this.marker === MapMarker.HOTEL,
      'start-marker': this.marker === MapMarker.START,
      'finish-marker': this.marker === MapMarker.FINISH
    };

    this.useFa = isNaN(this.content as number);
  }
}
