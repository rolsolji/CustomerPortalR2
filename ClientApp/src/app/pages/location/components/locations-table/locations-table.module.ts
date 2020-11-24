import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CustomLayoutModule} from "../../../../custom-layout/custom-layout.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {IconModule} from "@visurel/iconify-angular";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {LocationsTableComponent} from "./locations-table.component";
import {PageLayoutModule} from "../../../../../@vex/components/page-layout/page-layout.module";
import {BreadcrumbsModule} from "../../../../../@vex/components/breadcrumbs/breadcrumbs.module";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [LocationsTableComponent],
    imports: [
        CommonModule,
        CustomLayoutModule,
        MatCheckboxModule,
        MatIconModule,
        IconModule,
        MatMenuModule,
        MatButtonModule,
        PageLayoutModule,
        BreadcrumbsModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatTableModule,
        MatSelectModule,
        MatPaginatorModule,
        FormsModule,
        MatSortModule
    ],
  exports: [
    LocationsTableComponent
  ],
})
export class LocationsTableModule { }
