import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteMapComponent } from './components/route-map/route-map.component';
import { MapComponent } from './components/map/map.component';
import { MapMarkerComponent } from './components/map-marker/map-marker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [RouteMapComponent, MapComponent, MapMarkerComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [MapComponent, RouteMapComponent, MapMarkerComponent]
})
export class MapModule {}
