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
export class FormShipmentBoardComponent implements OnInit {

  //#region Quotes
  getQuotesParameters: GetQuotesParameters = {
    ClientID: 1,
    PageNumber: 1,
    PageSize: 20,
    FromShipDate: null,
    ToShipDate: null,
    SCAC: null,
    Status: null,
    ClientName: null,
    OrderBy: "LadingID",
    IsAccending: false,
    UserRowID: 1,
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
    ShipmentType: ""
  }

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

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Quote> | null;
  selection = new SelectionModel<Quote>(true, []);

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  //#endregion

  constructor(
    private httpService : HttpService
  ) { }

  async ngOnInit() {
    this.quotes = await this.httpService.getBOLHDRForJason(this.getQuotesParameters);    
    console.log(this.quotes);

    this.quotes.forEach(element => {

      //let d = element.ActualShipDate.replace(element.ActualShipDate,"\/Date\((\d+-\d+)\)\/",); // .test(element.ActualShipDate);  //.replace(/"\/Date\((\d+)\)\/"/g, 'new Date($1)');
      let d = element.ActualShipDate.replace("/Date(","").replace("-0400)/","");
      element.ActualShipDateWithFormat = new Date(parseInt(d)).toDateString();//  .toString("mm/dd/yyyy");
    });

    console.log(this.quotes[0].ActualShipDate );
    console.log(this.quotes[0].ActualShipDateWithFormat);

    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.quotes;
    console.log(this.dataSource.data); 

  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

}
