import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AioTableModule } from "../apps/aio-table/aio-table.module";
import {LocationListComponent} from "./location-list.component";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [LocationListComponent],
  imports: [
    CommonModule,
    AioTableModule,
    MatTableModule,
  ]
})
export class LocationListModule { }
