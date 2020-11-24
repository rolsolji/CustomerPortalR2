import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fadeInUp400ms} from "../../../../../@vex/animations/fade-in-up.animation";
import {stagger40ms} from "../../../../../@vex/animations/stagger.animation";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from "@angular/material/form-field";
import {FormControl} from "@angular/forms";
import {Observable, ReplaySubject} from "rxjs";
import {TableColumn} from "../../../../../@vex/interfaces/table-column.interface";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {aioTableLabels} from "../../../../../static-data/aio-table-data";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {filter} from "rxjs/operators";
import {untilDestroyed} from "ngx-take-until-destroy";
import {MatSelectChange} from "@angular/material/select";
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import {HttpService} from "../../../../common/http.service";
import {GetLocationsParameters} from '../../../../Entities/GetLocationsParameters';
import {Location} from '../../../../Entities/Location';
import {LocationCreateUpdateComponent} from "./location-create-update/location-create-update.component";

@Component({
  selector: 'vex-locations-table',
  templateUrl: './locations-table.component.html',
  styleUrls: ['./locations-table.component.scss'],
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
export class LocationsTableComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = 'fullwidth';

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Location[]> = new ReplaySubject<Location[]>(1);
  data$: Observable<Location[]> = this.subject$.asObservable();
  locations: Location[];

  @Input()
  columns: TableColumn<Location>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Short Name', property: 'ShortName', type: 'text', visible: true },
    { label: 'Name', property: 'Name', type: 'text', visible: true },
    { label: 'Active', property: 'Status', type: 'text', visible: true },
    { label: 'Country', property: 'CountryName', type: 'text', visible: true },
    { label: 'State', property: 'StateCode', type: 'text', visible: true },
    { label: 'City', property: 'CityName', type: 'text', visible: true },
    { label: 'Postal', property: 'PostalCode', type: 'text', visible: true },
    { label: 'Group', property: 'LocationGroup', type: 'text', visible: true },
    { label: 'Location Type', property: 'LocationType', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  pageSize = 20;
  pageIndex = 1;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Location> | null;
  selection = new SelectionModel<Location>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog, private httpService : HttpService) {
    this.initGetLocationsParameter();
  }

  getLocationsParameters: GetLocationsParameters;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  async getData() {
    return await this.httpService.getMasLocations(this.getLocationsParameters);
  }

  ngOnInit() {
    this.getData().then(responseData => this.subject$.next(responseData));
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
        filter<Location[]>(Boolean)
    ).subscribe(locations => {
      this.locations = locations;
      this.dataSource.data = locations;
    });

    this.searchCtrl.valueChanges.pipe(
        untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createCustomer() {
    this.dialog.open(LocationCreateUpdateComponent).afterClosed().subscribe((location: Location) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (location) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.locations.unshift(new Location(location));
        this.subject$.next(this.locations);
      }
    });
  }

  updateCustomer(location: Location) {
    this.dialog.open(LocationCreateUpdateComponent, {
      data: location
    }).afterClosed().subscribe(updatedLocation => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedLocation) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.locations.findIndex((existingLocation) => existingLocation === updatedLocation);
        this.locations[index] = new Location(updatedLocation);
        this.subject$.next(this.locations);
      }
    });
  }

  deleteCustomer(location: Location) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.locations.splice(this.locations.findIndex((existingLocation) => existingLocation === location), 1);
    this.selection.deselect(location);
    this.subject$.next(this.locations);
  }

  deleteCustomers(locations: Location[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    locations.forEach(c => this.deleteCustomer(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
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

  onLabelChange(change: MatSelectChange, row: Location) {
    const index = this.locations.findIndex(c => c === row);
    this.locations[index].Name = change.value;
    this.subject$.next(this.locations);
  }

  ngOnDestroy() {
  }

  initGetLocationsParameter() {
    this.getLocationsParameters = {
      ClientId: 1,
      IsAccending: false,
      LocationID: null,
      OrderBy: "",
      PageNumber: 1,
      PageSize: 20,
      Status: null,
    }
  }
}
