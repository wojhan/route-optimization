import { NgModule } from "@angular/core";
import { MatFormFieldModule, MatInputModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { JwPaginationComponent } from "jw-angular-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgmCoreModule } from "@agm/core";
import { environment } from "src/environments/environment";
import { DeleteModalComponent } from "./components/delete-modal/delete-modal.component";
import { MaterialModule } from "../material/material.module";
import { PaginatorComponent } from "../paginator/paginator.component";

@NgModule({
  declarations: [
    JwPaginationComponent,
    DeleteModalComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: localStorage.getItem("apiKey")
    })
  ],
  entryComponents: [DeleteModalComponent],
  exports: [
    AgmCoreModule,
    ReactiveFormsModule,
    JwPaginationComponent,
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    DeleteModalComponent,
    PaginatorComponent
  ]
})
export class SharedModule {}
