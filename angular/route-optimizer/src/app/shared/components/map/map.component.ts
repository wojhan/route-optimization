import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Map, Marker, MapOptions, LatLng, featureGroup } from 'leaflet';
import { MapService } from '../../../core/services/map.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map: Map;
  private markers: Marker[];

  @Input() width: number;
  @Input() height: number;
  @Input() mapId: string;
  @Input() mapOptions: MapOptions;
  @Input() lat: number = environment.map.defaultLat;
  @Input() lng: number = environment.map.defaultLng;
  @Input() markerCoordinates: [LatLng];

  constructor(private mapService: MapService, private toastr: ToastrService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.markerCoordinates && changes.markerCoordinates.currentValue) {
      if (changes.markerCoordinates.isFirstChange()) {
        this.markers = [];
      } else {
        this.updateMarkers();
      }
    }
  }

  private initMap(): void {
    if (this.mapOptions) {
      this.map = this.mapService.initMap(this.mapOptions);
      this.updateMarkers();
    } else {
      this.toastr.error('Wystąpił błąd podczas ładowania mapy.');
    }
  }

  private updateMarkers(): void {
    if (this.markers && this.markers.length) {
      this.markers.forEach(marker => {
        marker.removeFrom(this.map);
      });
      this.markers = [];
    }

    this.markerCoordinates.forEach(latLng => {
      const marker = this.mapService.initMarker(latLng);
      marker.addTo(this.map);
      this.markers.push(marker);
    });

    if (this.markers && this.markers.length) {
      const group = featureGroup(this.markers);
      console.log(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.5));
      this.map.setZoom(this.markers.length === 1 ? environment.map.singleElementZoom : this.mapOptions.zoom);
    }
  }
}
