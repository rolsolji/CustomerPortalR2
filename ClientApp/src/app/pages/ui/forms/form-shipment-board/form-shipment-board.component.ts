import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input, 
  Output, EventEmitter, HostListener, Pipe, PipeTransform } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icSmartphone from '@iconify/icons-ic/twotone-smartphone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icCamera from '@iconify/icons-ic/twotone-camera';
import icPhone from '@iconify/icons-ic/twotone-phone';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { MatAccordion } from '@angular/material/expansion';
import { HttpErrorResponse } from '@angular/common/http';
import { RatesService } from '../../../../rates.service';
import { HttpService } from '../../../../common/http.service';
import { String, StringBuilder } from 'typescript-string-operations';
import { strict } from 'assert';
import icTwotoneCalendarToday from '@iconify/icons-ic/twotone-calendar-today';
import icBaselineImageNotSupported from '@iconify/icons-ic/baseline-image-not-supported';
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
import {MatTableModule} from '@angular/material/table';
import { EquipmentType } from '../../../../Entities/EquipmentType';
import { ShipmentMode } from '../../../../Entities/ShipmentMode'; 
import { Status } from '../../../../Entities/Status';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { MessageService } from "../../../../common/message.service";
//import {ThemePalette} from '@angular/material/core';

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
    OrderBy: "LadingID",
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
    Mode: "LTL",
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
    //{ label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    //{ label: 'Image', property: 'image', type: 'image', visible: true },
    { label: 'Load No', property: 'ClientLadingNo', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Client', property: 'ClientName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Carrier Name', property: 'CarrierName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Actual Ship Date', property: 'ActualShipDateWithFormat', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Origin Name', property: 'OrgName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Origin Location', property: 'OriginLocation', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Destination Name', property: 'DestName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Destination Location', property: 'DestinationLocation', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Equipment', property: 'EquipmentDescription', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'Status', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Expected Delivery Date', property: 'ExpectedDeliveryDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    //{ label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  //displayedColumns: string[] = ['ClientLadingNo', 'ClientName', 'ActualShipDate', 'city'];
  //columnsToDisplay: string[] = this.displayedColumns.slice();

  keyId: string = "1593399730488";
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Quote> | null;
  selection = new SelectionModel<Quote>(true, []);
  ShipmentModeOptions: object;
  StatusOptions: Status[];
  StatusOptionsString: string[] = [];
  //StatusOptionsChip: ChipColor[] = [];
  StatusSelectec: string[];
  EquipmentOptions: object;
  securityToken: string;
  quoteIdParameter: string;
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  //#endregion

  // @ViewChild('statusInput') statusInput: ElementRef<HTMLInputElement>;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild('statusInput') statusInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private httpService : HttpService,
    private route: ActivatedRoute, 
    private router: Router,
    private messageService: MessageService 
  ) { 

    this.filteredStatus = this.statusCtrl.valueChanges.pipe(
      startWith(null),
      map((status: string | null) => status ? this._filter(status) : this.StatusOptionsString.slice()));

  }

  async ngOnInit() {
    this.showSpinner = true;
    this.InitialLoadPage();
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  async InitialLoadPage(){
    //-- Get security token
    try{
      this.securityToken = await this.httpService.getMainToken(); 
    }
    catch(ex){
      console.log(ex);
    }
    //--

    this.httpService.token = this.securityToken;
    this.ShipmentModeOptions = await this.httpService.getShipmentMode(this.keyId);
    this.StatusOptions = await this.httpService.getBOLStatus(this.keyId);
    this.EquipmentOptions = await this.httpService.getMasEquipment(this.keyId);
    console.log(this.StatusOptionsString);
    this.StatusOptions.forEach(s => this.StatusOptionsString.push(s.Status));
    this.search();
  }

  async search(){
    
    this.showSpinner = true;

    this.cleanField()

    if (this.fromShipDate != null)
      this.getQuotesParameters.FromShipDate = String.Format("/Date({0})/",this.fromShipDate.getTime());

    if (this.toShipDate != null)
      this.getQuotesParameters.ToShipDate = String.Format("/Date({0})/",this.toShipDate.getTime());

    if (this.fromDeliveryDate != null)
      this.getQuotesParameters.FromDeliveryDate = String.Format("/Date({0})/",this.fromDeliveryDate.getTime());

    if (this.toDeliveryDate != null)
      this.getQuotesParameters.ToDeliveryDate = String.Format("/Date({0})/",this.toDeliveryDate.getTime());

    this.getQuotesParameters.BOlStatusIDList = [];
    this.statusSelected.forEach(s => 
      this.getQuotesParameters.BOlStatusIDList.push(
        this.StatusOptions.find(so => so.Status == s).BOLStatusID
      )
    );

    this.messageService.SharedQuoteParameter.subscribe(message => this.quoteIdParameter = message)

    if (!String.IsNullOrWhiteSpace(this.quoteIdParameter))
    {
      this.getQuotesParameters.FreeSearch = this.quoteIdParameter;
      this.getQuotesParameters.Mode = String.Empty;
    }

    console.log(this.getQuotesParameters);
    this.quotes = await this.httpService.searchBOLHDRForJason(this.getQuotesParameters);    
    // console.log(this.quotes);
    this.quotes.forEach(element => {
      let d = element.ActualShipDate.replace("/Date(","").replace("-0400)/","");
      element.ActualShipDateWithFormat = new Date(parseInt(d)).toDateString();//  .toString("mm/dd/yyyy");
    });
    // console.log(this.quotes[0].ActualShipDate );
    // console.log(this.quotes[0].ActualShipDateWithFormat);
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.quotes;
    console.log(this.dataSource.data);

    this.showSpinner = false;
  }

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
  statusCtrl = new FormControl();
  filteredStatus: Observable<string[]>;
  statusSelected: string[] = [];

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

  //(blur)="cleanField()"
  cleanField(){
    this.statusInput.nativeElement.value = '';
    this.statusCtrl.setValue(null);
  }

  changeSelected(parameter: string, query: string) {

    console.log(String.Format("Parameter: {0}",parameter));
    console.log(String.Format("query: {0}", query));

    // const index = this.selectedChips.indexOf(query);
    // if (index >= 0) {
    //   this.selectedChips.splice(index, 1);
    // } else {
    //   this.selectedChips.push(query);
    // }
    // console.log('this.selectedChips: ' + this.selectedChips);
  }

  
}
