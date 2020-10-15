import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input,
  Output, EventEmitter, HostListener, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icSmartphone from '@iconify/icons-ic/twotone-smartphone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icCamera from '@iconify/icons-ic/twotone-camera';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icTwotoneCalendarToday from '@iconify/icons-ic/twotone-calendar-today';
import icBaselineImageNotSupported from '@iconify/icons-ic/baseline-image-not-supported';
import baselineEdit from '@iconify/icons-ic/baseline-edit';
import baselineDoubleArrow from '@iconify/icons-ic/baseline-double-arrow';

import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import { MatAccordion } from '@angular/material/expansion';
import { HttpErrorResponse } from '@angular/common/http';
import { RatesService } from '../../../../rates.service';
import { HttpService } from '../../../../common/http.service';
import { String, StringBuilder } from 'typescript-string-operations';
import { strict } from 'assert';
import { StringifyOptions } from 'querystring';
import { PostalData } from '../../../../Entities/PostalData';
import { Rate } from '../../../../Entities/rate';
import { ProductPackageType } from '../../../../Entities/ProductPackageType'
import { ProductFeatures } from '../../../../Entities/ProductFeatures'
import { ClientDefaultData } from '../../../../Entities/ClientDefaultData';
import { CatalogItem } from '../../../../Entities/CatalogItem'
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge'
import { GetQuotesParameters } from '../../../../Entities/GetQuotesParameters';
import { Quote } from '../../../../Entities/Quote';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, ReplaySubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectChange } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { EquipmentType } from '../../../../Entities/EquipmentType';
import { ShipmentMode } from '../../../../Entities/ShipmentMode';
import { Status } from '../../../../Entities/Status';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { MessageService } from '../../../../common/message.service';
// import {ThemePalette} from '@angular/material/core';
import {MatSidenav} from '@angular/material/sidenav';
import {AuthenticationService} from '../../../../common/authentication.service';

@Component({
  selector: 'vex-form-shipment-board',
  templateUrl: './form-shipment-board.component.html',
  styleUrls: ['./form-shipment-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})


// export interface ChipColor {
//   name: string;
//   color: ThemePalette;
// }



export class FormShipmentBoardComponent implements OnInit {


  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  securityToken: string;

  constructor(
    private httpService : HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService
  ) {
    this.securityToken = this.authenticationService.ticket$.value;
    this.filteredStatus = this.statusCtrl.valueChanges.pipe(
      startWith(null),
      map((status: string | null) => status ? this._filter(status) : this.StatusOptionsString.slice()));

  }

  // displayedColumns = ['position', 'name', 'weight', 'symbol', 'colA', 'colB', 'colC'];
  // dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  icFilterList = icFilterList;
  baselineEdit = baselineEdit;
  baselineDoubleArrow = baselineDoubleArrow;

  showSpinner = false;

  //#region Quotes
  getQuotesParameters: GetQuotesParameters = {
    ClientID: 8473,
    PageNumber: 1,
    PageSize: 20,
    FromShipDate: null,
    ToShipDate: null,
    SCAC: null,
    Status: null,
    ClientName: null,
    OrderBy: 'LadingID',
    IsAccending: false,
    UserRowID: 39249,
    LadingIDList: [],
    LoadNo: null,
    IsExpired: false,
    IsQuote: true,
    BOlStatusIDList: [],
    OrgName: null,
    DestName: null,
    OrgZipCode: null,
    DestZipCode: null,
    PickupNumber: null,
    ProNumber: null,
    Ref1Value: null,
    Ref2Value: null,
    Ref3Value: null,
    QuoteNo: null,
    PONumber: null,
    FromDeliveryDate: null,
    ToDeliveryDate: null,
    IsIncludeSubClient: true,
    EquipmentID: 0,
    Mode: 'LTL',
    FreeSearch: null,
    Ref4Value: null,
    ShipmentType: null
  }

  // shipperName: string;
  // consigneeName: string;
  fromShipDate: Date;
  toShipDate: Date;
  fromDeliveryDate: Date;
  toDeliveryDate: Date;
  // shipdateto: string;
  // deliverydatefrom: string;
  // deliverydateto: string;
  // ponumber: string;
  // bolnumber: string;
  // pronumber: string;
  // smallparcel: string;
  // selectmode: string;
  // shipmenttype: string;
  // searchfilter: string;
  // status: string;

  subject$: ReplaySubject<Quote[]> = new ReplaySubject<Quote[]>(1);
  data$: Observable<Quote[]> = this.subject$.asObservable();
  quotes: Quote[];

  @Input()
  columns: TableColumn<Quote>[] = [
    // { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    // { label: 'Image', property: 'image', type: 'image', visible: true },
    { label: 'View / Edit', property: 'View', type: 'edit', visible: true, cssClasses: ['grid-mat-cell-small']},
    { label: 'Load No', property: 'ClientLadingNo', type: 'text', visible: true, cssClasses: ['grid-mat-cell-small'] },
    { label: 'Client', property: 'ClientName', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Carrier Name', property: 'CarrierName', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Actual Ship Date', property: 'ActualShipDateWithFormat', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Origin Name', property: 'OrgName', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Origin Location', property: 'OriginLocation', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Destination Name', property: 'DestName', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Destination Location', property: 'DestinationLocation', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Equipment', property: 'EquipmentDescription', type: 'text', visible: true, cssClasses: ['grid-mat-cell-medd'] },
    { label: 'Status', property: 'BOLStatus', type: 'text', visible: true, cssClasses: ['grid-mat-cell-small'] },
    { label: 'Expected Delivery Date', property: 'ExpectedDeliveryDateWithFormat', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] },
    { label: 'Action', property: 'Action', type: 'more', visible: true, cssClasses: ['grid-mat-cell-small'] },
  ];

  keyId = '1593399730488';
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Quote> | null;
  selection = new SelectionModel<Quote>(true, []);
  ShipmentModeOptions: object;
  StatusOptions: Status[];
  StatusOptionsString: string[] = [];
  // StatusOptionsChip: ChipColor[] = [];
  StatusSelectec: string[];
  EquipmentOptions: object;
  quoteIdParameter: string;
  totalQuotedStatus: string;
  totalBookedStatus: string;
  totalInTransitStatus: string;
  totalDeliveredStatus: string;
  //#endregion

  // @ViewChild('statusInput') statusInput: ElementRef<HTMLInputElement>;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild('statusInput') statusInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('searchModal') sidenav: MatSidenav;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  statusCtrl = new FormControl();
  filteredStatus: Observable<string[]>;
  statusSelected: string[] = [];

  async ngOnInit() {
    this.showSpinner = true;
    this.InitialLoadPage();
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  async InitialLoadPage(){

    this.ShipmentModeOptions = await this.httpService.getShipmentMode(this.keyId);
    this.StatusOptions = await this.httpService.getBOLStatus(this.keyId);

    // Get total per status
    this.totalQuotedStatus = '11';
    this.totalBookedStatus = '22';
    this.totalInTransitStatus = '33';
    this.totalDeliveredStatus = '44';

    this.EquipmentOptions = await this.httpService.getMasEquipment(this.keyId);
    this.StatusOptions.forEach(s => this.StatusOptionsString.push(s.Status));
    this.search('');
  }

  // SearchModal Open/Close
  close(reason: string) {
    if (reason == 'open' || reason == 'search')
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

  async view(event, row: Quote){
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.messageService.SendQuoteParameter(row.ClientLadingNo);
    this.messageService.SendLadingIDParameter(row.LadingID.toString());
    this.router.navigate(['/ui/forms/form-add-ship/'], { relativeTo: this.route });
  }

  async more(event, row: Quote){
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  async search(statusCode:string){

    // SearchModal
    this.close('close');

    this.showSpinner = true;

    this.cleanField()

    if (this.fromShipDate != null)
      this.getQuotesParameters.FromShipDate = String.Format('/Date({0})/',this.fromShipDate.getTime());

    if (this.toShipDate != null)
      this.getQuotesParameters.ToShipDate = String.Format('/Date({0})/',this.toShipDate.getTime());

    if (this.fromDeliveryDate != null)
      this.getQuotesParameters.FromDeliveryDate = String.Format('/Date({0})/',this.fromDeliveryDate.getTime());

    if (this.toDeliveryDate != null)
      this.getQuotesParameters.ToDeliveryDate = String.Format('/Date({0})/',this.toDeliveryDate.getTime());

    this.getQuotesParameters.BOlStatusIDList = [];
    this.statusSelected.forEach(s =>
      this.getQuotesParameters.BOlStatusIDList.push(
        this.StatusOptions.find(so => so.Status == s).BOLStatusID
      )
    );

    if (!String.IsNullOrWhiteSpace(statusCode))
      this.getQuotesParameters.BOlStatusIDList.push(statusCode);

    // Get parameter quote and clean variable
    this.messageService.SharedQuoteParameter.subscribe(message => this.quoteIdParameter = message)


        console.log('quoteParameter', this.quoteIdParameter);

    if (!String.IsNullOrWhiteSpace(this.quoteIdParameter))
    {
      this.getQuotesParameters.FreeSearch = this.quoteIdParameter;
      this.getQuotesParameters.Mode = String.Empty;
    }

    console.log('Parameters', this.getQuotesParameters);

    this.quotes = await this.httpService.searchBOLHDRForJason(this.getQuotesParameters);

    this.quotes.forEach(element => {
      element.ActualShipDateWithFormat = this.datepipe.transform(element.ActualShipDate.replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');

      if (!String.IsNullOrWhiteSpace(element.ExpectedDeliveryDate))
      {
        element.ExpectedDeliveryDateWithFormat = this.datepipe.transform(element.ExpectedDeliveryDate.replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }
    });

    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.quotes;

    this.showSpinner = false;

    this.messageService.SendQuoteParameter(String.Empty);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.statusSelected.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.statusCtrl.setValue(null);
  }

  remove(status: string): void {
    const index = this.statusSelected.indexOf(status);

    if (index >= 0) {
      this.statusSelected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.statusSelected.find(s => s == event.option.viewValue))
      return;

    this.statusSelected.push(event.option.viewValue);
    this.statusInput.nativeElement.value = '';
    this.statusCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.StatusOptionsString.filter(status => status.toLowerCase().indexOf(filterValue) === 0);
  }

  // (blur)="cleanField()"
  cleanField(){
    this.statusInput.nativeElement.value = '';
    this.statusCtrl.setValue(null);
  }

}
