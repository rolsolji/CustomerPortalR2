import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AioTableModule } from "../apps/aio-table/aio-table.module";
import {LocationListComponent} from "./location-list.component";
import {MatTableModule} from "@angular/material/table";
import {PageLayoutModule} from "../../../@vex/components/page-layout/page-layout.module";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {IconModule} from "@visurel/iconify-angular";
import {_MatMenuDirectivesModule, MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {AppModule} from "../../app.module";
import {LocationsTableModule} from "./components/locations-table/locations-table.module";


@NgModule({
  declarations: [LocationListComponent],
  imports: [
    CommonModule,
    AioTableModule,
    MatTableModule,
    PageLayoutModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatIconModule,
    IconModule,
    _MatMenuDirectivesModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatMenuModule,
    FormsModule,
    AppModule,
    LocationsTableModule,
  ]
})
export class LocationListModule { }
