import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { DashboardHomeComponent } from "./dashboard-home.component";
import { CompanyAddComponent } from "../companies/company-add/company-add.component";
import { CompanyListComponent } from "../companies/company-list/company-list.component";
import { CompaniesComponent } from "../companies/companies.component";
import { AuthGuard } from "../shared/guards/auth.guard";

const dashboardRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: DashboardHomeComponent
      },
      {
        path: "company",
        component: CompaniesComponent,
        children: [
          {
            path: "",
            component: CompanyListComponent
          },
          {
            path: "add",
            component: CompanyAddComponent
          }
        ],
        canActivate: [AuthGuard]
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRouting {}
