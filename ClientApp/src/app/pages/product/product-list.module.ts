import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AioTableModule } from "../apps/aio-table/aio-table.module";
import { ProductListComponent } from "./product-list.component";
import { MatTableModule } from "@angular/material/table";
import { PageLayoutModule } from "../../../@vex/components/page-layout/page-layout.module";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { IconModule } from "@visurel/iconify-angular";
import { _MatMenuDirectivesModule, MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AppModule } from "../../app.module";
import { ProductTableModule } from "./components/product-table/product-table.module";

@NgModule({
  declarations: [ProductListComponent],
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
    ProductTableModule,
  ]
})
export class ProductListModule { }
