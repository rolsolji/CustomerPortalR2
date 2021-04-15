import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../../@vex/interfaces/table-column.interface';
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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { Delete, Sort } from "../../../../shared/components/datasource/Page";
import { MatSidenav } from "@angular/material/sidenav";
import { ProductCreateUpdateComponent } from "../product-create-update/product-create-update.component";
import {AuthenticationService} from "../../../../common/authentication.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  formGroup: FormGroup;
  user: User;
  clientID: number;
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
    {label: 'Active', property: 'Status', type: 'text', visible: false},
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
  productDisplay: ProductDisplay;
  dataSource: PaginatedDataSource<Product, ProductQuery> | null;
  selection = new SelectionModel<Product>(true, []);
  searchCtrl = new FormControl();

  labels = [];

  // productClasses = ['Any',50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500]
  productClasses = [{ classes: "Any", Effectiveclass: "Any" },
                    { classes: "50", Effectiveclass: "50" },
                    { classes: "55", Effectiveclass: "55" },
                    { classes: "60", Effectiveclass: "60" },
                    { classes: "65", Effectiveclass: "65" },
                    { classes: "70", Effectiveclass: "70" },
                    { classes: "77.5", Effectiveclass: "77" },
                    { classes: "85", Effectiveclass: "85" },
                    { classes: "92.5", Effectiveclass: "92" },
                    { classes: "100", Effectiveclass: "100" },
                    { classes: "110", Effectiveclass: "110" },
                    { classes: "125", Effectiveclass: "125" },
                    { classes: "150", Effectiveclass: "150" },
                    { classes: "175", Effectiveclass: "175" },
                    { classes: "200", Effectiveclass: "200" },
                    { classes: "250", Effectiveclass: "250" },
                    { classes: "300", Effectiveclass: "300" },
                    { classes: "400", Effectiveclass: "400" },
                    { classes: "500", Effectiveclass: "500" }]

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
  @ViewChild('searchModal') sidenav: MatSidenav;

  constructor(
      private dialog: MatDialog,
      private httpService: HttpService,
      private productsService: ProductService,
      private fb: FormBuilder,
      private au: AuthenticationService,
      private snackBar: MatSnackBar
  ) {
    this.user = this.httpService.getUserFromStorage();
    this.clientID = this.au.getDefaultClient().ClientID;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  async getData(
      Description = null,
      Hazmat = null,
      NMFC = null,
      Class = null,
      Commodity = null,
      Status = null
  ) {
    this.productDisplay = this.initProductDisplay(Description, Hazmat, NMFC, Class, Commodity, Status);
    this.initGetProductDetailsCountParameter();
    const productDetailsCountResponse = await this.httpService.GetAndSearchPagedProductDetailsCount(this.getProductDetailsCountParameter);
    this.productDetailsCount = productDetailsCountResponse.GetAndSearchPagedProductDetailsCountResult;

    this.initGetProductsParameter();
    return await this.httpService.GetAndSearchPagedProductDetails(this.getProductParameter);
  }

  async ngOnInit() {
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

    this.formGroup = this.fb.group({
      commodity: '',
      description: '',
      hazMatSearchSelected: ['null'],
      statusSearchSelected: ['null'],
      productClass: 'Any'
    });
    this.searchCtrl.valueChanges.pipe(
        untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  async search() {
    const commodityValue = this.formGroup.get('commodity').value;
    const descriptionValue = this.formGroup.get('description').value;
    const hazMatSearchSelected = this.formGroup.get('hazMatSearchSelected').value;
    const statusSearchSelected = this.formGroup.get('statusSearchSelected').value;
    const productClassSelected = this.formGroup.get('productClass').value;
    const { GetAndSearchPagedProductDetailsResult } = await this.getData(
        descriptionValue === '' ? null : descriptionValue,
        hazMatSearchSelected === 'null' ? null : hazMatSearchSelected === 'true',
        null,
        productClassSelected === 'Any' ? null : productClassSelected,
        commodityValue === '' ? null : commodityValue,
        statusSearchSelected === 'null' ? null : statusSearchSelected === 'true'
    );
    this.dataSource.queryBy({
      search: GetAndSearchPagedProductDetailsResult,
      registration: undefined
    });
    this.close('close');
  }

  ngAfterViewInit() {}

  sortData(event) {
    const { active, direction } = event;
    this.dataSource.sortBy({property: active, order: direction})
  }

  createProduct() {
    this.dialog.open(ProductCreateUpdateComponent).afterClosed().subscribe((product: Product) => {
      /**
       * Product is the updated product (if the user pressed Save - otherwise it's null)
       */
      if (product) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.dataSource.data.unshift(new Product(product));
        this.dataSource.fetch(0);
      }
    });
  }

  updateProduct(product: Product) {
    this.dialog.open(ProductCreateUpdateComponent, {
      data: product
    }).afterClosed().subscribe(updatedProduct => {
      /**
       * Product is the updated product (if the user pressed Save - otherwise it's null)
       */
      if (updatedProduct) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.dataSource.data.findIndex((existingProduct) => existingProduct.ProductID === updatedProduct.ProductID);
        this.dataSource.data[index] = new Product(updatedProduct);
        this.dataSource.fetch(0);
      }
    });
  }

  deleteProduct(product: Product) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.selection.deselect(product);
    this.dataSource.delete({item: product});
    this.snackBar.open('Product deleted', null, {
      duration: 5000
    });
  }

  deleteProducts(products: Product[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    products.forEach(p => this.deleteProduct(p));
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

  close(reason: string) {
    if (reason === 'open' || reason === 'search')
    {
      this.sidenav.open();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    else
    {
      this.sidenav.close();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  ngOnDestroy() {}

  initGetProductDetailsCountParameter() {
    this.getProductDetailsCountParameter = {
      ClientID: this.clientID,
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
      ClientID: this.clientID,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize * this.productDetailsCount,
      OrderBy: this.orderBy,
      IsAccending: this.isAscending,
      productDisplay: this.productDisplay,
    }
  }

  initProductDisplay(
      Description = null,
      Hazmat = null,
      NMFC = null,
      Class = null,
      Commodity = null,
      Status = null
  ): ProductDisplay {
    return {
      Description: Description,
      Hazmat: Hazmat,
      NMFC: NMFC,
      Class: Class,
      Commodity: Commodity,
      Status: Status
    };
  }

  async clear(){
    this.formGroup.get('commodity').setValue('');
    this.formGroup.get('description').setValue('');   
    this.formGroup.get('productClass').setValue('Any');       

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

    this.searchCtrl.setValue('');
    this.close('close');
  }
}

interface ProductDisplay {
  Description: string | null,
  Hazmat: boolean | null,
  NMFC: string | null,
  Class: number | null,
  Commodity: number | null,
  Status: boolean | null
}
