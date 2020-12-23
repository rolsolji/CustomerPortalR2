import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../../@vex/interfaces/table-column.interface';
import { CustomerCreateUpdateComponent } from '../../../apps/aio-table/customer-create-update/customer-create-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from '../../../../../@vex/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import { HttpService } from "../../../../common/http.service";
import { User } from "../../../../Entities/user.model";
import { Product } from "../../../../Entities/Product";
import { PaginatedDataSource } from "../../../../shared/components/datasource/PaginatedDataSource";
import { ProductService, ProductQuery } from "../../../../common/product.service";
import {Delete, Sort} from "../../../../shared/components/datasource/Page";

@Component({
  selector: 'vex-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ProductTableComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('fullwidth');
  user: User;
  getProductParameter;
  getProductDetailsCountParameter;
  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Product[]> = new ReplaySubject<Product[]>(1);
  products: Product[];

  @Input()
  columns: TableColumn<Product>[] = [
    {label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true},
    {label: 'Description', property: 'Description', type: 'text', visible: true, cssClasses: ['font-medium']},
    {label: 'Active', property: 'Status', type: 'text', visible: true},
    {label: 'Class', property: 'Class', type: 'text', visible: true},
    {label: 'Hazmat', property: 'Hazmat', type: 'text', visible: true},
    {label: 'NMFC', property: 'NMFC', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium']},
    {label: 'Weight', property: 'Weight', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium']},
    {label: 'Group', property: 'ProductGroup', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium']},
    {label: 'Actions', property: 'actions', type: 'button', visible: true}
  ];
  productDetailsCount: number = 0;
  pageSize = 10;
  pageNumber = 1;
  orderBy = "Description";
  isAscending = true;
  dataSource: PaginatedDataSource<Product, ProductQuery> | null;
  selection = new SelectionModel<Product>(true, []);
  searchCtrl = new FormControl();

  labels = [];

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;

  initialSort: Sort<Product> = {property: 'Description', order: 'asc'};
  initialDelete: Delete<Product> = {item: null};

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private dialog: MatDialog, private httpService: HttpService, private productsService: ProductService) {
    this.user = this.httpService.getUserFromStorage();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  async getData() {
    return await this.httpService.GetAndSearchPagedProductDetails(this.getProductParameter);
  }

  async ngOnInit() {
    this.initGetProductDetailsCountParameter();
    const productDetailsCountResponse = await this.httpService.GetAndSearchPagedProductDetailsCount(this.getProductDetailsCountParameter);
    this.productDetailsCount = productDetailsCountResponse.GetAndSearchPagedProductDetailsCountResult;

    this.initGetProductsParameter();

    const { GetAndSearchPagedProductDetailsResult } = await this.getData();
    this.dataSource = new PaginatedDataSource<Product, ProductQuery>(
        (request, query, hasDelete) =>
            this.productsService.page(request, query, hasDelete, GetAndSearchPagedProductDetailsResult, this.httpService),
        this.initialSort,
        {search: '', registration: undefined},
        this.pageSize,
        GetAndSearchPagedProductDetailsResult,
        this.initialDelete
    )

    this.searchCtrl.valueChanges.pipe(
        untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));

    const productGroupType = await this.httpService.GetProductGroupType(this.user.ClientID);
  }

  ngAfterViewInit() {}

  sortData(event) {
    console.log(event);
    const { active, direction } = event;
    console.log(active);
    console.log(direction);
    this.dataSource.sortBy({property: active, order: direction})
  }

  createCustomer() {
    this.dialog.open(CustomerCreateUpdateComponent).afterClosed().subscribe((product: Product) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (product) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.products.unshift(new Product(product));
        this.subject$.next(this.products);
      }
    });
  }

  updateCustomer(product: Product) {
    this.dialog.open(CustomerCreateUpdateComponent, {
      data: product
    }).afterClosed().subscribe(updatedProduct => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedProduct) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.products.findIndex((existingCustomer) => existingCustomer.ProductID === updatedProduct.ProductID);
        this.products[index] = new Product(updatedProduct);
        this.subject$.next(this.products);
      }
    });
  }

  deleteCustomer(product: Product) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.selection.deselect(product);
    this.dataSource.delete({item: product});
  }

  deleteCustomers(products: Product[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    products.forEach(p => this.deleteCustomer(p));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.queryBy({search: value});
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Product) {
    const index = this.products.findIndex(c => c === row);
    // this.products[index].labels = change.value;
    this.subject$.next(this.products);
  }

  ngOnDestroy() {}

  initGetProductDetailsCountParameter() {
    this.getProductDetailsCountParameter = {
      ClientID: this.user.ClientID,
      pageSize: this.pageSize,
      productDisplay: {
        Description: null,
        Hazmat: null,
        NMFC: null,
        Class: null,
        Commodity: null,
        Status: null
      }
    };
  };

  initGetProductsParameter() {
    this.getProductParameter = {
      ClientID: this.user.ClientID,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize * this.productDetailsCount,
      OrderBy: this.orderBy,
      IsAccending: this.isAscending,
      productDisplay: {
        Description: null,
        Hazmat: null,
        NMFC: null,
        Class: null,
        Commodity: null,
        Status: null
      }
    }
  }
}
