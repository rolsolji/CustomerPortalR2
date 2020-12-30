import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'vex-location-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor() { }

  ngOnInit(): void {
  }

}
