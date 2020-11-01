import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input,
  Output, EventEmitter, HostListener, Pipe, PipeTransform, AfterViewInit, OnDestroy, OnChanges
} from '@angular/core';
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
import outlinePhone from '@iconify/icons-ic/outline-phone';
import outlineMap from '@iconify/icons-ic/outline-map';
import outlineTextSnippet from '@iconify/icons-ic/outline-text-snippet';
import outlinePrint from '@iconify/icons-ic/outline-print';
import outlineEmail from '@iconify/icons-ic/outline-email';

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
import { User } from '../../../../Entities/user.model';
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
import {MatSidenav} from '@angular/material/sidenav';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ShipmentByLading } from '../../../../Entities/ShipmentByLading';
import {AuthenticationService} from '../../../../common/authentication.service';
import { ReferenceByClient } from '../../../../Entities/ReferenceByClient';
import {environment} from '../../../../../environments/environment';
import { SendEmailParameters, InvoiceParameter } from '../../../../Entities/SendEmailParameters';
import { SendEmailResponse } from '../../../../Entities/SendEmailResponse';

@Component({
  selector: 'vex-form-shipment-board',
  templateUrl: './form-shipment-board.component.html',
  styleUrls: ['./form-shipment-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    stagger60ms,
    fadeInUp400ms,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class FormShipmentBoardComponent implements OnInit {

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  securityToken: string;
  user: User

  constructor(
    private fb: FormBuilder,
    private httpService : HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar,
  ) {
    this.securityToken = this.authenticationService.ticket$.value;
    this.user = this.authenticationService.getUserFromStorage();
    this.filteredStatus = this.statusCtrl.valueChanges.pipe(
      startWith(null),
      map((status: string | null) => status ? this._filter(status) : this.StatusOptionsString.slice()));

      this.initGetQuoteParameter();
  }

  icFilterList = icFilterList;
  baselineEdit = baselineEdit;
  baselineDoubleArrow = baselineDoubleArrow;
  outlinePhone = outlinePhone;
  outlineMap = outlineMap;
  outlineTextSnippet = outlineTextSnippet;
  outlinePrint = outlinePrint;
  outlineEmail = outlineEmail;

  showSpinner = false;
  showSpinnerGrid = false;

  getQuotesParameters: GetQuotesParameters;

  fromShipDate: Date;
  toShipDate: Date;
  fromDeliveryDate: Date;
  toDeliveryDate: Date;

  subject$: ReplaySubject<Quote[]> = new ReplaySubject<Quote[]>(1);
  data$: Observable<Quote[]> = this.subject$.asObservable();
  quotes: Quote[] = [];
  quotesResponse: Quote[];

  @Input()
  columns: TableColumn<Quote>[] = [
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
    { label: 'Expected Delivery Date', property: 'ExpectedDeliveryDateWithFormat', type: 'text', visible: true, cssClasses: ['grid-mat-cell'] }
  ];

  keyId = '1603591137983';
  ClientID = 11992;
  pageSize = 20;
  currentPage = 1;
  totalRows: number;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Quote> | null;
  selection = new SelectionModel<Quote>(true, []);
  ShipmentModeOptions: object;
  StatusOptions: Status[];
  StatusOptionsString: string[] = [];
  StatusSelectec: string[];
  EquipmentOptions: object;
  quoteIdParameter: string;
  totalQuotedStatus: string;
  totalBookedStatus: string;
  totalInTransitStatus: string;
  totalDeliveredStatus: string;

  shipmentInformation: ShipmentByLading;
  ReferenceByClientOptions: ReferenceByClient[];

  ReferenceByClientField1 = '';
  ReferenceByClientField2 = '';
  ReferenceByClientField3 = '';
  ReferenceByClientField4 = '';

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  statusCtrl = new FormControl();
  filteredStatus: Observable<string[]>;
  statusSelected: Status[] = [];
  expandedQuote: string = String.Empty;

  emailFormGroup = new FormGroup({
    emailSendDocs: new FormControl('',[
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
  });

  sendEmailClicked = false;
  emailBOL = false;
  emailShipmentLabels = false;
  emailRateQuote = false;
  emailSendDocs: string = String.Empty;

  bolPrintURL: string;
  shipmentlabelsPrintURL: string;
  ratequotePrintURL: string;
  noCopies: string;
  labelPrintURL: string;
  labelPrintURLEnable: boolean = false;

  bolDocumentURL: string;
  bolDocumentURLIsEnabled: boolean = false;

  podDocumentURL: string;
  podDocumentURLIsEnabled: boolean = false;

  othDocumentURL: string;
  othDocumentURLIsEnabled: boolean = false;

  notesList:[];
  notesIsEnabled: boolean = false;

  auditLog:[];
  auditLogIsEnabled: boolean = false;

  
  //#endregion

  @ViewChild('statusInput') statusInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('searchModal') sidenav: MatSidenav;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  get visibleColumnsNew() {
    return ['View', 'ClientLadingNo', 'ClientName'];
  }

  expandedElement: Quote | null;

  async ngOnInit() {

    this.showSpinner = true;

    this.InitialLoadPage();

    // -- emailFormGroup fields
    this.emailFormGroup = this.fb.group({
      emailToSendQuote: [null, Validators.required]
    });
    // --
  }

  ngOnChanges(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log('pag', this.paginator);
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

    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.initGetQuoteParameter();
    this.search('');
  }

  initGetQuoteParameter(){
    this.getQuotesParameters = {
      ClientID: this.authenticationService.getDefaultClient().ClientID,
      PageNumber: 1,
      PageSize: 20,
      FromShipDate: null,
      ToShipDate: null,
      SCAC: null,
      Status: null,
      ClientName: null,
      OrderBy: 'LadingID',
      IsAccending: false,
      UserRowID: 0,
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

    this.fromShipDate = null;
    this.toShipDate = null;
    this.fromDeliveryDate = null;
    this.toDeliveryDate = null;
    this.statusSelected = [];
  }

  // SearchModal Open/Close
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

  async search(parameter:string){

    // SearchModal
    this.close('close');

    //Clean filters
    if (parameter === 'clearfilters'){
      this.initGetQuoteParameter();
      this.getQuotesParameters.PageNumber = 1;
      this.quotes = [];
    }
    this.showSpinner = true;

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
        s.BOLStatusID
      )
    );

    if (!String.IsNullOrWhiteSpace(parameter) && parameter !== 'loadmore' && parameter !== 'clearfilters' )
      this.getQuotesParameters.BOlStatusIDList.push(parameter);

    // Get parameter quote and clean variable
    this.messageService.SharedQuoteParameter.subscribe(message => this.quoteIdParameter = message)

    if (!String.IsNullOrWhiteSpace(this.quoteIdParameter))
    {
      this.getQuotesParameters.FreeSearch = this.quoteIdParameter;
      this.getQuotesParameters.Mode = String.Empty;
    }

    if (!String.IsNullOrWhiteSpace(parameter) && parameter === 'loadmore' )
    {
      this.getQuotesParameters.PageNumber = this.getQuotesParameters.PageNumber + 1;
    }
    else{
      this.getQuotesParameters.PageNumber = 1;
      this.quotes = [];
    }

    this.quotesResponse = await this.httpService.searchBOLHDRForJason(this.getQuotesParameters);

    this.quotesResponse.forEach(element => {
      if (!String.IsNullOrWhiteSpace(element.ActualShipDate)){
        element.ActualShipDateWithFormat = this.datepipe.transform(element.ActualShipDate.replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }

      if (!String.IsNullOrWhiteSpace(element.ExpectedDeliveryDate)){
        element.ExpectedDeliveryDateWithFormat = this.datepipe.transform(element.ExpectedDeliveryDate.replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }
      this.quotes.push(element);
    });

    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.quotes;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if (this.quotes != null && this.quotes.length > 0){
      this.totalRows = this.quotes[0].TotalRowCount;
    }

    this.showSpinner = false;

    this.messageService.SendQuoteParameter(String.Empty);
  }

  private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.StatusOptionsString.filter(status => status.toLowerCase().indexOf(filterValue) === 0);
  }

  quoteSelected: Quote;

  async GetQuoteInfo(rowSelected:Quote){
    if (rowSelected == null){
      this.expandedQuote = String.Empty;
      return;
    }
    this.showSpinnerGrid = true;
    this.quoteSelected = rowSelected;
    this.expandedQuote = this.expandedQuote === rowSelected.ClientLadingNo ? String.Empty : rowSelected.ClientLadingNo;
    this.shipmentInformation = await this.httpService.GetShipmentByLadingID(rowSelected.LadingID.toString(), this.keyId);
    if (this.shipmentInformation != null){
      if (this.shipmentInformation.RequestedPickupDateFrom != null && !String.IsNullOrWhiteSpace(this.shipmentInformation.RequestedPickupDateFrom.toString())){
        this.shipmentInformation.RequestedPickupDateFromWithFormat = this.datepipe.transform(this.shipmentInformation.RequestedPickupDateFrom.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }

      if (this.shipmentInformation.PickupDate != null && !String.IsNullOrWhiteSpace(this.shipmentInformation.PickupDate.toString())){
        this.shipmentInformation.PickupDateWithFormat = this.datepipe.transform(this.shipmentInformation.PickupDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }

      if (this.shipmentInformation.DeliveryDate != null && !String.IsNullOrWhiteSpace(this.shipmentInformation.DeliveryDate.toString())){
        this.shipmentInformation.DeliveryDateWithFormat = this.datepipe.transform(this.shipmentInformation.DeliveryDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }

      if (this.shipmentInformation.RequestedDeliveryDate != null && !String.IsNullOrWhiteSpace(this.shipmentInformation.RequestedDeliveryDate.toString())){
        this.shipmentInformation.RequestedDeliveryDateWithFormat = this.datepipe.transform(this.shipmentInformation.RequestedDeliveryDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy');
      }
    }

    this.ReferenceByClientOptions = await this.httpService.GetReferenceByClient(this.shipmentInformation.ClientId, this.keyId);
    if (this.ReferenceByClientOptions != null && this.ReferenceByClientOptions.length > 0){
      this.ReferenceByClientField1 = String.Format('{0}: ',this.ReferenceByClientOptions[0].Description.trim()) ;

      if (this.ReferenceByClientOptions.length > 1){
        this.ReferenceByClientField2 =  String.Format('{0}: ',this.ReferenceByClientOptions[1].Description.trim());
      }

      if (this.ReferenceByClientOptions.length > 2){
        this.ReferenceByClientField3 = String.Format('{0}: ',this.ReferenceByClientOptions[2].Description.trim());
      }

      if (this.ReferenceByClientOptions.length > 3){
        this.ReferenceByClientField4 = String.Format('{0}: ',this.ReferenceByClientOptions[3].Description.trim());
      }
    }
    else{ // If we can't get fields from API then set R2 fields as default
      this.ReferenceByClientField1 = 'Customer Ref #: ';
      this.ReferenceByClientField2 = 'R2 Order #: ';
      this.ReferenceByClientField3 = 'R2 Pro number: ';
    }

    if (this.shipmentInformation.BolDocumentsList !== null && this.shipmentInformation.BolDocumentsList.length > 0)
    {
      const BOLDocument = this.shipmentInformation.BolDocumentsList.find(d => d.DocType === 'BOL');
      if (BOLDocument !== null && BOLDocument.length > 0){
        this.bolDocumentURL = String.Format(environment.baseEndpoint + 'Handlers/DownLoadPODHandler.ashx?userToken={0}&clientID={1}&imageName={2}&docType={3}&TMWUrl={4}&Ticket={5}',
                                              this.user.TokenString,this.shipmentInformation.ShortName,BOLDocument[0].FilePath,BOLDocument[0].DocType,BOLDocument[0].TMWUrl,this.securityToken) ;
        this.bolDocumentURLIsEnabled = true;
      }
      
      const PODDocument = this.shipmentInformation.BolDocumentsList.find(d => d.DocType === 'POD');
      if (PODDocument !== null && PODDocument.length > 0){
        this.podDocumentURL = String.Format(environment.baseEndpoint + 'Handlers/DownLoadPODHandler.ashx?userToken={0}&clientID={1}&imageName={2}&docType={3}&TMWUrl={4}&Ticket={5}',
                                              this.user.TokenString,this.shipmentInformation.ShortName,PODDocument[0].FilePath,PODDocument[0].DocType,PODDocument[0].TMWUrl,this.securityToken) ;
        this.podDocumentURLIsEnabled = true;
      }

      const OTHDocument = this.shipmentInformation.BolDocumentsList.find(d => d.DocType === 'OTH');
      if (OTHDocument !== null && OTHDocument.length > 0){
        this.othDocumentURL = String.Format(environment.baseEndpoint + 'Handlers/DownLoadPODHandler.ashx?userToken={0}&clientID={1}&imageName={2}&docType={3}&TMWUrl={4}&Ticket={5}',
                                              this.user.TokenString,this.shipmentInformation.ShortName,OTHDocument[0].FilePath,OTHDocument[0].DocType,OTHDocument[0].TMWUrl,this.securityToken) ;
        this.othDocumentURLIsEnabled = true;
      }
    }

    if (this.shipmentInformation.BOLDispatchNotesList !== null && this.shipmentInformation.BOLDispatchNotesList.length > 0){
      const notes = this.shipmentInformation.BOLDispatchNotesList.find(n => n.NoteTypeId === 1);
      if (notes !== null && notes.length > 0){

      }

      const auditLog = this.shipmentInformation.BOLDispatchNotesList.find(n => n.NoteTypeId === 3);
      if (auditLog !== null && auditLog.length > 0){

      }
    }

    this.bolPrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintBOLHandler.ashx?LadingID={0}&ClientID={1}&Ticket={2}',
                                        this.shipmentInformation.LadingID,this.shipmentInformation.ClientId,this.securityToken);

    this.shipmentlabelsPrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintLabelHandler.ashx?LadingID={0}&Ticket={1}',
                                        this.shipmentInformation.LadingID,this.securityToken);

    this.ratequotePrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintQuoteHandler.ashx?LadingID={0}&Ticket={1}',
                                        this.shipmentInformation.LadingID,this.securityToken);

    this.labelPrintURLEnable = false;
    this.noCopies = null;

    this.showSpinnerGrid = false;
  }

  async NoCopiesChange(){
    if (this.noCopies === '4' || this.noCopies === '6'){
      this.labelPrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintMultiCopyLabelHandler.ashx?LadingID={0}&NoOfCopy={1}&Ticket={2}',
        this.shipmentInformation.LadingID,this.noCopies,this.securityToken);
      this.labelPrintURLEnable = true;
    }
    else {
      this.labelPrintURLEnable = false;
    }
  }

  async ValidateEmail(){
    const emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.sendEmailClicked = emailregx.test(this.emailSendDocs) &&
      (this.emailBOL || this.emailShipmentLabels || this.emailRateQuote);
  }

  async SendDocsByEmail(sendEmail:boolean){
    
    if (!sendEmail){
      this.emailSendDocs = String.Empty;
      return;
    }

    const emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(emailregx.test(this.emailSendDocs) &&
      (this.emailBOL || this.emailShipmentLabels || this.emailRateQuote)){

      if (this.emailBOL){
        let emailBOLParameters: SendEmailParameters;

        let invoiceParameter: InvoiceParameter = {
          InvoiceDetailIDs: []
        };

        emailBOLParameters = {
          ClientID: this.shipmentInformation.ClientId,
          CarrierID : String.Empty,
          ApplicationID: 67,
          EventID: 44,
          EmailAddresses: this.emailSendDocs,
          LadingID: this.shipmentInformation.LadingID,
          UserRowID: 40306,
          InvoiceParameter: invoiceParameter,
          LadingIDs: [],
        }

        let emailBOLResponse = this.httpService.SendBolConfirmation(emailBOLParameters);
      }

      if (this.emailShipmentLabels){
        let emailBOLParameters: SendEmailParameters;

        let invoiceParameter: InvoiceParameter = {
          InvoiceDetailIDs: []
        };

        emailBOLParameters = {
          ClientID: this.shipmentInformation.ClientId,
          CarrierID : String.Empty,
          ApplicationID: 0,
          EventID: 0,
          EmailAddresses: this.emailSendDocs,
          LadingID: this.shipmentInformation.LadingID,
          UserRowID: 0,
          InvoiceParameter: invoiceParameter,
          LadingIDs: [],
        }

        let emailShipmentLabelResponse = this.httpService.SendMailLabelManually(emailBOLParameters);
      }

      if (this.emailRateQuote){
        let emailBOLParameters: SendEmailParameters;

        let invoiceParameter: InvoiceParameter = {
          InvoiceDetailIDs: []
        };

        emailBOLParameters = {
          ClientID: this.shipmentInformation.ClientId,
          CarrierID : String.Empty,
          ApplicationID: 56,
          EventID: 39,
          EmailAddresses: this.emailSendDocs,
          LadingID: this.shipmentInformation.LadingID,
          UserRowID: 13970,
          InvoiceParameter: invoiceParameter,
          LadingIDs: [],
        }

        let emailRateQuoteResponse = this.httpService.SendEmailManually(emailBOLParameters);
      }

      this.snackbar.open('Send mail sucessfully', null, {
        duration: 5000
      });
    }
  }
}
