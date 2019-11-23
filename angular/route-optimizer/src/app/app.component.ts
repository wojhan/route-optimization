import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit
} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  public currentUser: any;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
