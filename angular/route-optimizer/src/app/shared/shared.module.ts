import { NgModule } from "@angular/core";
import { MatFormFieldModule, MatInputModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { JwPaginationComponent } from "jw-angular-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
import { environment } from "src/environments/environment";

import { AgmDirectionModule } from "agm-direction";

@NgModule({
  declarations: [JwPaginationComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: localStorage.getItem("apiKey")
    }),
    AgmDirectionModule
  ],
  exports: [
    AgmCoreModule,
    AgmDirectionModule,
    ReactiveFormsModule,
    JwPaginationComponent,
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [GoogleMapsAPIWrapper]
})
export class SharedModule {}
