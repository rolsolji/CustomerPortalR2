import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input,
  Output, EventEmitter, HostListener, Pipe, PipeTransform } from '@angular/core';
import icDescription from '@iconify/icons-ic/twotone-description';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stagger80ms } from '../../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';
import icVerticalSplit from '@iconify/icons-ic/twotone-vertical-split';
import icVisiblity from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { PostalData } from '../../../../Entities/PostalData';
import { HttpService } from '../../../../common/http.service';
import { String, StringBuilder } from 'typescript-string-operations';
import { InternalNote } from '../../../../Entities/InternalNote';
import { ShipmentCost, AccountInvoiceCostList } from '../../../../Entities/ShipmentCost';
import { MessageService } from '../../../../common/message.service';
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap, pairwise } from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { EquipmentType } from '../../../../Entities/EquipmentType';
import { ShipmentPriority } from '../../../../Entities/ShipmentPriority';
import { ServiceLevelDetail } from '../../../../Entities/ServiceLevelDetail';
import { PaymentTerm } from '../../../../Entities/PaymentTerm';
import { ShipmentMode } from '../../../../Entities/ShipmentMode';
import { ShipmentError } from '../../../../Entities/ShipmentError';
import { MatStepper } from '@angular/material/stepper';
import { Carrier } from '../../../../Entities/Carrier';
import { Rate,Accessorial,AccessorialBase,ServiceLevel } from '../../../../Entities/rate';
import { AccessorialDetail } from 'src/app/Entities/AccessorialDetail';
import { RatesService } from '../../../../rates.service';
import { ClientDefaultData } from '../../../../Entities/ClientDefaultData';
import { UtilitiesService } from '../../../../common/utilities.service';
import { DatePipe } from '@angular/common';
import { MatListOption } from '@angular/material/list';
import { MatAccordion } from '@angular/material/expansion';
import icTwotoneCalendarToday from '@iconify/icons-ic/twotone-calendar-today';
import icBaselineImageNotSupported from '@iconify/icons-ic/baseline-image-not-supported';
import outlineSave from '@iconify/icons-ic/outline-save';
import outlinePrint from '@iconify/icons-ic/outline-print';
import outlineEmail from '@iconify/icons-ic/outline-email';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ShipmentByLading, BOlProductsListSBL, AccountInvoiceCostListSBL, BOLAccesorialListSBL, SellRatesSBL  } from '../../../../Entities/ShipmentByLading';
import * as moment from 'moment';
import {AuthenticationService} from '../../../../common/authentication.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ProductPackageType } from '../../../../Entities/ProductPackageType';
import { ReferenceByClient } from '../../../../Entities/ReferenceByClient';
import {environment} from '../../../../../environments/environment';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
//import { ConfirmAlertDialogComponent } from '../confirm-alert-dialog/confirm-alert-dialog.component';
import { SaveQuoteParameters,BOlProductsList,BOLAccesorial,SellRate,AccountInvoiceCost } from '../../../../Entities/SaveQuoteParameters';
import { SaveQuoteData,BOlProductsListSQD,BOLAccesorialListSQD,AccountInvoiceCostListSQD, SellRatesSQD } from '../../../../Entities/SaveQuoteData';
import { StatusReason } from '../../../../Entities/StatusReason';
import { Router, ActivatedRoute } from '@angular/router';
import {ConfirmAlertDialogComponent} from '../../../../../app/shared/confirm-alert-dialog/confirm-alert-dialog.component';
import { Country } from 'src/app/Entities/Country';
import { InvoiceParameter, SendEmailParameters } from 'src/app/Entities/SendEmailParameters';
import { PCFClientDefaults } from 'src/app/Entities/PCFClientDefaults';


@Component({
  selector: 'vex-form-add-ship',
  templateUrl: './form-add-ship.component.html',
  styleUrls: ['./form-add-ship.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class FormAddShipComponent implements OnInit {

  securityToken: string;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private httpService : HttpService,
    private ratesService: RatesService,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    private datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.securityToken = this.authenticationService.ticket$.value;
  }

  get formProducts() { return this.productsAndAccessorialsFormGroup.get('products') as FormArray; }
  get originPckupDate() {
    return this.originAndDestinationFormGroup.get('originpickupdate').value == null ? '' : new Date(this.originAndDestinationFormGroup.get('originpickupdate').value).toDateString();
  }
  get destExpDelDate() {
    return this.originAndDestinationFormGroup.get('destexpdeldate').value == null ? '' : new Date(this.originAndDestinationFormGroup.get('destexpdeldate').value).toDateString();
  }

  keyId = '1593399730488';
  ClientID = this.authenticationService.getDefaultClient().ClientID;  
  UserIDLoggedIn = this.authenticationService.authenticatedUser$.value.UserID;  

  // localLadingIdParameter: string;

  originCountries: Object;
  destinationCountries: Object;
  packageTypes: any;

  accessorialArray: AccessorialDetail[];
  internalNotes: InternalNote[];
  showInternalNotesTitle = false;
  timesArray = ['', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']
  EquipmentOptions: EquipmentType[];
  PriorityOptions: ShipmentPriority[];
  ServiceLevelOptions: ServiceLevelDetail[];
  PaymentTerms: PaymentTerm[];
  ShipmentModeOptions: ShipmentMode[];
  ShipmentErrorOptions: ShipmentError[];
  ShipmentCostObject: ShipmentCost;
  AccountInvoiceCostList: AccountInvoiceCostList[];
  costListFiltered: AccountInvoiceCostList[];
  displayedCostGridColumns: string[] = ['Code', 'Description', 'Amount'];
  TotalShipmentCost: number;
  showSpinner = false;
  getQuoteButtonClicked = false;
  spinnerMessage:string;
  ratesOpened: number[]; 
  sendEmailClicked = false;
  carrierImageUrl = environment.baseEndpoint +'Handlers/CarrierLogoHandler.ashx?carrierID=';
  ShipmentByLadingObject: ShipmentByLading;
  ReferenceByClientOptions: ReferenceByClient[];
  StatusReasons: StatusReason[];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  accessorials: AccessorialBase[] = [];
  accessorialIds: number[] = [];
  serviceLevels: ServiceLevel[] = [];
  rates: Rate[];
  ratesFiltered: Rate[];
  ratesCounter = 0;
  clientTLWeightLimit: string;
  clientDefaultData: ClientDefaultData;
  clientPCFDefaultData: PCFClientDefaults;
  accessorialsSelectedQty = 0;

  carrierSelected: string;

  gDefaultoriginpostalcode = '';
  gDefaultdestpostalcode = '';
  gDefaultpickupdate = '';

  saveQuoteParameters: SaveQuoteParameters;
  saveQuoteData: SaveQuoteData;
  selectedRateFromQuotes: Rate;

  originSelectedCountry: PostalData = {
    CityCode: '',
    CityID: '',
    CityName: '',
    CountryCode: '',
    CountryId: '',
    CountryName: '',
    IsActive: '',
    PostalCode: '',
    PostalID: '',
    StateCode: '',
    StateId: '',
    StateName: '',
  };

  destinationSelectedCountry: PostalData = {
    CityCode: '',
    CityID: '',
    CityName: '',
    CountryCode: '',
    CountryId: '',
    CountryName: '',
    IsActive: '',
    PostalCode: '',
    PostalID: '',
    StateCode: '',
    StateId: '',
    StateName: '',
  };

  originAndDestinationFormGroup: FormGroup;
  productsAndAccessorialsFormGroup: FormGroup;
  shipmentInfoFormGroup: FormGroup;
  confirmFormGroup: FormGroup;
  emailFormGroup: FormGroup;

  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icTwotoneCalendarToday = icTwotoneCalendarToday;
  icBaselineImageNotSupported = icBaselineImageNotSupported;
  outlineSave = outlineSave;
  outlinePrint = outlinePrint;
  outlineEmail = outlineEmail;

  equimentDescriptionSelected = '';
  priorityDescriptionSelected = '';
  serviceLevelDescriptionSelected = '';
  ServiceLevelCodeSelected = '';
  paymentTermDescriptionSelected = '';
  shipmentModeDescriptionSelected = '';

  ReferenceByClientField1 = '';
  ReferenceByClientField2 = '';
  ReferenceByClientField3 = '';
  ReferenceByClientIDField1 = 0;
  ReferenceByClientIDField2 = 0;
  ReferenceByClientIDField3 = 0;

  ForceToReRate = false;
  accessorialsUsedToRate: AccessorialBase[] = [];
  productsUsedToRate: any[] = [];
  noRatesFoundText = null;

  gbProductHasChanged = false;

  ExpectedDeliveryDateCalculated: string;
  LoadNumber: string;
  ShowSaveAsQuoteButton = false;

  ShipmentAccessorialsStored: BOLAccesorialListSBL[];

  pcoAutoCompleteOptions: Observable<PostalData[]>;
  pcdAutoCompleteOptions: Observable<PostalData[]>;

  carrierAutoCompleteOptions: Observable<Object[]>;

  postalData: PostalData[];
  postalDataDest: PostalData[];
  OriginPostalCode: string;
  OriginStateName: string;
  OriginPostalData: PostalData;
  OriginPickupDate: string;

  //#region Destination Fields
  DestinationPostalCode: string;
  DestinationStateName: string;
  DestinationPostalData: PostalData;

  // Event fired after view is initialized
  @ViewChild('stepper') stepper: MatStepper;

  Carrier: string;
  carrierData: Carrier[];
  countryList: PostalData[];

  addProductFormGroup(): FormGroup{
    return this.fb.group({
      Pallets: [0, Validators.required],
      Pieces: [0],
      PackageTypeID: [3],
        ProductClass: [null, Validators.required],
        NmfcNumber: [null, [Validators.required, Validators.pattern('^([a-zA-Z0-9]{6})-([a-zA-Z0-9]{2})$')]],
        ProductDescription: [null, Validators.required],
        Length: [null, Validators.required],
        Width: [null, Validators.required],
        Height: [null, Validators.required],
        PCF: [null],
        Weight: [null, Validators.required],
        addToProductMaster: [false],
        Stackable: [false],
        Hazmat: [false],
        PackageTypeDescription: [null]
    })
  }

  // Equipment change event
  selectChangeEquipment (event: any) {
    this.fetchEquipment(event.value);
  }

  // Priority change event
  selectChangePriority (event: any) {
    this.fetchPriority(event.value);
  }

  // Service Level change event
  selectChangeServiceLevel (event: any) {
    this.fetchServiceLevel(event.value);
  }

  // Payment Term change event
   selectChangePaymentTerm (event: any) {
    this.fetchPaymentTerm(event.value);
  }

  // Shipment Mode change event
  selectChangeShipmentMode (event: any) {
    this.fetchShipmentMode(event.value);
  }

  getProductsFormGroup(index): FormGroup {
    const productsList = this.productsAndAccessorialsFormGroup.get('products') as FormArray;
    const formGroup = productsList.controls[index] as FormGroup;
    return formGroup;
  }

  async ngOnInit() {

    let localLadingIdParameter;
    // Gets quotes parameter
    this.messageService.SharedLadingIDParameter.subscribe(message => localLadingIdParameter = message);

    // -- originAndDestinationFormGroup fields
    this.originAndDestinationFormGroup = this.fb.group({
      originname: [null, Validators.required],
      originadddress1: [null, Validators.required],
      originadddress2: [null],
      origincountry: [null, Validators.required],
      originpostalcode: [null, Validators.required],
      originstatename: [null, Validators.required],
      origincontact: [null],
      originphone: [null],
      originemail: [null, Validators.email],
      // originnotes: [null],
      originpickupdate: [null, Validators.required],
      originpickupopen: [null],
      originpickupclose: [null],
      destname: [null, Validators.required],
      destadddress1: [null, Validators.required],
      destadddress2: [null],
      destcountry: [null, Validators.required],
      destpostalcode: [null, Validators.required],
      deststatename: [null, Validators.required],
      destcontact: [null],
      destphone: [null],
      destemail: [null, Validators.email],
      // destnotes: [null],
      destexpdeldate: [null],
      destdelapptfrom: [null],
      destdelapptto: [null],
      addToLocationsOrigin: [null],
      addToLocationsDest: [null]
    });
    // --

    // -- productsAndAccessorialsFormGroup fields
    this.productsAndAccessorialsFormGroup = this.fb.group({
      products: this.fb.array([
        this.addProductFormGroup()
      ])
    });
    // --

    // -- shipmentInfoFormGroup fields
    this.shipmentInfoFormGroup = this.fb.group({
      equipment: [7, Validators.required],
      priority: [0],
      customerref: [null],
      r2order: [null],
      r2pronumber: [{ value: null, disabled: true }],
      paymentterms: [{ value: 5, disabled: true }],
      shipmentinfo: [{ value: null, disabled: true }],
      pronumber: [{ value: null, disabled: true }],
      mode: [{ value: 'LTL', disabled: true }, Validators.required],
      shipmentvalue: [null],
      valueperpound: [null],
      os_d: [null],
      servicelevel: [1, Validators.required],
      r2refno: [{ value: null, disabled: true }],
      statuscode: [null],
      specialinstructions: [null],
      internalnote: [{ value: null, disabled: true }]
    });
    // --

    // -- confirmFormGroup fields
    this.confirmFormGroup = this.fb.group({
      carrier: [null],
      showTopCarriers: [10]
    });
    // --

    // -- emailFormGroup fields
    this.emailFormGroup = this.fb.group({
      emailToSendQuote: [null, Validators.required]
    });
    // --

    const responseData = await this.httpService.getCountryList(this.keyId);
    this.countryList = (responseData as PostalData[]);
    this.accessorialArray = await this.httpService.getGetClientMappedAccessorials(this.ClientID, this.keyId);
    this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);

    this.packageTypes = await this.httpService.getProductPackageType(this.keyId);

    this.originCountries = responseData;
    this.destinationCountries = responseData;
    this.originSelectedCountry = responseData[0]; // US as default
    this.destinationSelectedCountry = responseData[0]; // US as default

    // -- Set default country for both countries dropdowns
    this.originAndDestinationFormGroup.controls.origincountry.setValue(this.originSelectedCountry.CountryId, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destcountry.setValue(this.destinationSelectedCountry.CountryId, {onlySelf: false});
    // --

    this.pcoAutoCompleteOptions = this.originAndDestinationFormGroup.get('originpostalcode').valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
            return this.pcoAutoCompleteFilter(val || '')
       })
      );

      this.pcdAutoCompleteOptions = this.originAndDestinationFormGroup.get('destpostalcode').valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.pcdAutoCompletefilter(val || '')
        })
      );

    this.internalNotes = [];

    // -- Get Equipment Options
    this.EquipmentOptions = await this.httpService.getMasEquipment(this.keyId);

    // -- Get Priority Options
    this.PriorityOptions = await this.httpService.getMasShipmentPriority();

    // -- Get Service Level Options
    this.ServiceLevelOptions = await this.httpService.getMasServiceLevel(this.ClientID, this.keyId);

    // -- Get Payment Terms
    this.PaymentTerms = await this.httpService.getMasPaymentTerms();

    // -- Get Shipment Modes
    this.ShipmentModeOptions = await this.httpService.getShipmentMode(this.keyId);

    // -- Get Shipment Errors
    this.ShipmentErrorOptions = await this.httpService.getShipmentError(this.keyId);

    // -- Get Status Reasons
    this.StatusReasons = await this.httpService.GetStatusReasonCode(this.keyId);    

    // Get equipment description by default
    this.fetchEquipment(7);

    // Get payment term description by default
    this.fetchPaymentTerm(5);

    // Get shipment mode description by default
    this.fetchShipmentMode('LTL');

    // Get priority description by default
    this.fetchPriority(0);

    // Get service level description by default
    this.fetchServiceLevel(1);

    // -- Get Shipment information
    // this.ladingIdParameter = "2386566";
    // this.ladingIdParameter = "2386567";

    if (localLadingIdParameter != null && localLadingIdParameter.length > 0){
      // -- Get Service Level Options
      this.ShipmentByLadingObject = await this.httpService.GetShipmentByLadingID(localLadingIdParameter, this.keyId);
            
      this.setDefaultValuesInSteps()

      // -- Get Shipment Costs
      this.ShipmentCostObject = await this.httpService.GetShipmentCostByLadingID(localLadingIdParameter, this.keyId);
      this.AccountInvoiceCostList = this.ShipmentCostObject.SellRates.AccountInvoiceCostList;
      // this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);

      // if ( this.AccountInvoiceCostList != null &&  this.AccountInvoiceCostList.length > 0){
      //   this.costListFiltered =  this.AccountInvoiceCostList.filter(item => item.BilledCost > 0);
      // }

      this.costListFiltered = this.AccountInvoiceCostList;
      
      this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';

      // -- Sum all Bill Amounts from SellRates AccountInvoiceCostList
      const SumBilledAmount = this.AccountInvoiceCostList.filter(item => item.CostStatus !== 3)
      .reduce((sum, current) => sum + current.BilledCost, 0);
      // --

      this.TotalShipmentCost = SumBilledAmount + (this.ShipmentByLadingObject.CostWithCustomerPercentage === null ? 0 : this.ShipmentByLadingObject.CostWithCustomerPercentage);      
      
    }else{
      this.ShowSaveAsQuoteButton = true; // Show SaveAsQuote Button
    }
    // --



    this.carrierAutoCompleteOptions = this.confirmFormGroup.get('carrier').valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.carrierAutoCompletefilter(val || '')
        })
      );



      this.ratesOpened = []; // initiate ratesOpened array
      this.messageService.SendLadingIDParameter(String.Empty); // Clean LadingId parameter
      this.messageService.SendQuoteParameter(String.Empty); // Clean LadingCode parameter

      this.originAndDestinationFormGroup.get('originpostalcode')
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        console.log('originpostalcode PREV1', prev);
        console.log('originpostalcode NEXT1', next);
        if (prev !== next && this.costListFiltered != null && this.costListFiltered.length > 0){
          // if previous value is dif from the current value and also costs has already been calculated, force re-rate
          this.ForceToReRate = true;
        }
      });

      this.originAndDestinationFormGroup.get('destpostalcode')
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        console.log('destpostalcode PREV1', prev);
        console.log('destpostalcode NEXT1', next);
        if (prev !== next && this.costListFiltered != null && this.costListFiltered.length > 0){
          // if previous value is dif from the current value and also costs has already been calculated, force re-rate
          this.ForceToReRate = true;
        }
      });

      this.originAndDestinationFormGroup.get('originpickupdate')
      .valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        console.log('originpickupdate PREV1', prev);
        console.log('originpickupdate NEXT1', next);
        if (prev !== next && this.costListFiltered != null && this.costListFiltered.length > 0){
          // if previous value is dif from the current value and also costs has already been calculated, force re-rate
          this.ForceToReRate = true;
        }
      });     
  }

  get originEmail() {
    return this.originAndDestinationFormGroup.get('originemail');
  } 

  get destEmail() {
    return this.originAndDestinationFormGroup.get('destemail');
  } 

  pcoAutoCompleteFilter(val: string): Observable<any[]> {
    const CountryId = this.originSelectedCountry == null ? '1': this.originSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }

  pcoAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.originAndDestinationFormGroup.get('originstatename').setValue(event.option.value.StateName.trim());
    this.OriginPostalCode = String.Format('{0}-{1}',event.option.value.PostalCode,event.option.value.CityName.trim());
    this.OriginPostalData = event.option.value;
    this.originAndDestinationFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
  }

  pcdAutoCompletefilter(val: string): Observable<any[]> {
    const CountryId = this.destinationSelectedCountry == null ? '1': this.destinationSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }

  pcdAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.originAndDestinationFormGroup.get('deststatename').setValue(event.option.value.StateName.trim());
    this.DestinationPostalCode = String.Format('{0}-{1}',event.option.value.PostalCode,event.option.value.CityName.trim());
    this.DestinationPostalData = event.option.value;
    this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
  }

  async validateOriginPostalCode(event: KeyboardEvent){
    const CountryId = this.originSelectedCountry == null ? '1': this.originSelectedCountry.CountryId.toString();
    this.OriginPostalCode = this.originAndDestinationFormGroup.get('originpostalcode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length == 5){
      const responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);
      this.postalData = responseData;
      if (this.postalData != null && this.postalData.length > 0){
        this.originAndDestinationFormGroup.get('originstatename').setValue(this.postalData[0].StateName.trim());
        this.OriginPostalCode = String.Format('{0}-{1}',this.postalData[0].PostalCode,this.postalData[0].CityName.trim());
        this.OriginPostalData = this.postalData[0];
        this.originAndDestinationFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
      }
      else{
        this.OriginStateName = String.Empty;
        this.OriginPostalCode = String.Empty;
        this.OriginPostalData = null;
      }
    }
  }

  async validateDestinationPostalCode(event: KeyboardEvent){
    const CountryId = this.destinationSelectedCountry == null ? '1': this.destinationSelectedCountry.CountryId.toString();
    this.DestinationPostalCode = this.originAndDestinationFormGroup.get('destpostalcode').value;
    if (this.DestinationPostalCode != null && this.DestinationPostalCode.trim().length == 5){
      const responseData = await this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,CountryId,this.keyId);
      this.postalDataDest = responseData;
      if (this.postalDataDest != null && this.postalDataDest.length > 0)
      {
        this.originAndDestinationFormGroup.get('deststatename').setValue(this.postalDataDest[0].StateName.trim());
        this.DestinationPostalCode = String.Format('{0}-{1}',this.postalDataDest[0].PostalCode,this.postalDataDest[0].CityName.trim());
        this.DestinationPostalData = this.postalDataDest[0];
        this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
      }
      else
      {
        this.DestinationStateName = String.Empty;
        this.DestinationPostalCode = String.Empty;
        this.DestinationPostalData = null;
      }
    }
  }
  //#endregion

  addNewProdField(): void {
    (this.productsAndAccessorialsFormGroup.get('products') as FormArray).push(this.addProductFormGroup());
  }

  removeNewProdField(index: number): void {
    (this.productsAndAccessorialsFormGroup.get('products') as FormArray).removeAt(index);
  }

  BookShipmentSubmit() {    
    const RequiredFieldsValidationObj = this.CheckAllRequiredFields();
    if (RequiredFieldsValidationObj.showWarningMessage){
      this.openDialog(RequiredFieldsValidationObj.isConfirmDialog, RequiredFieldsValidationObj.message,
        RequiredFieldsValidationObj.yesNoActions, RequiredFieldsValidationObj.actionEvent, 'BookShipmentSubmit');
    }else {
      //const pickupTimesWarningMessage = this.PickupTwoHoursAndAfterOnePMValidations(); //TESTRS
      const pickupTimesWarningMessage = '';
      if (pickupTimesWarningMessage !== ''){
        this.openDialog(true, pickupTimesWarningMessage, true, 'pickupTimesValidations', 'BookShipmentSubmit');    
      }else{
        if (this.ShipmentByLadingObject == null){
          this.saveNewQuoteAndBookShipment(true);
        }else{
          this.updateQuote(true);
        }
      }      
    }
  }

  addNewInternalNote(): void {
    const internalNoteText = this.shipmentInfoFormGroup.get('internalnote').value;
    if (internalNoteText != null && internalNoteText.length > 0){
      const note = {
        NoteId: (this.internalNotes as InternalNote[]).length + 1,
        UserId: this.UserIDLoggedIn,
        UserName: 'Admin',
        NoteText: internalNoteText.trim(),
        Date: new Date()
      };
  
      this.internalNotes.push(note);
      this.shipmentInfoFormGroup.get('internalnote').setValue('');
      this.showInternalNotesTitle = true;
    }    
  }

  removeInternalNote(index: number): void {
    (this.internalNotes as InternalNote[]).splice(index, 1);

    if (this.internalNotes.length > 0){
      this.showInternalNotesTitle = true;
    }
    else{
      this.showInternalNotesTitle = false;
    }
  }
  // ngAfterViewInit() {
  //   //this.stepper.selectedIndex = 1;

  //   // To avoid "ExpressionChangedAfterItHasBeenCheckedError" error,
  //   // set the index in setTimeout
  //   setTimeout(()=>{
  //     this.stepper.selectedIndex = 1;
  //   },0);
  // }

  moveToStep(index) {
    this.stepper.selectedIndex = index;
  }

  fetchEquipment(equipmentId) {
    let equimentDescription = '';
    if (this.EquipmentOptions != null && this.EquipmentOptions.length > 0){
      const equipment = this.EquipmentOptions.filter(equipment => equipment.EquipmentID == equipmentId) as EquipmentType[];
      if (equipment != null){
        equimentDescription = equipment[0].Description;
      }
    }
    this.equimentDescriptionSelected = equimentDescription;
    return equimentDescription;
  }

  fetchPriority(priorityId) {
    let priorityDescription = '';
    if (this.PriorityOptions != null && this.PriorityOptions.length > 0){
      const item = this.PriorityOptions.filter(item => item.PriorityID == priorityId);
      if (item != null){
        priorityDescription = item[0].Description;
      }
    }
    this.priorityDescriptionSelected = priorityDescription;
    return priorityDescription;
  }

  fetchServiceLevel(serviceLevelId) {
    let serviceLevelDescription = '';
    let ServiceLevelCode = '';
    if (this.ServiceLevelOptions != null && this.ServiceLevelOptions.length > 0){
      const item = this.ServiceLevelOptions.filter(item => item.ServiceLevelID == serviceLevelId);
      if (item != null){
        serviceLevelDescription = item[0].Description;
        ServiceLevelCode = item[0].ServiceLevelCode;
      }
    }
    this.serviceLevelDescriptionSelected = serviceLevelDescription;
    this.ServiceLevelCodeSelected = ServiceLevelCode;
    return serviceLevelDescription;
  }

  fetchPaymentTerm(paymentTermId) {
    let Description = '';
    if (this.PaymentTerms != null && this.PaymentTerms.length > 0){
      const item = this.PaymentTerms.filter(item => item.PaymentTermID == paymentTermId);
      if (item != null){
        Description = item[0].Description;
      }
    }
    this.paymentTermDescriptionSelected = Description;
    return Description;
  }

  fetchShipmentMode(modeCode) {
    let Description = '';
    if (this.ShipmentModeOptions != null && this.ShipmentModeOptions.length > 0){
      const item = this.ShipmentModeOptions.filter(item => item.ModeCode == modeCode);
      if (item != null){
        Description = item[0].Mode;
      }
    }
    this.shipmentModeDescriptionSelected = Description;
    return Description;
  }

  async validateCarrier(event: KeyboardEvent){
    // --
    // let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    this.Carrier = this.confirmFormGroup.get('carrier').value;
    if (this.Carrier != null && this.Carrier.trim().length == 4){
      const responseData = await this.httpService.getCarrierData(this.ClientID, this.Carrier, this.keyId);
      this.carrierData = responseData;
      if (this.carrierData != null && this.carrierData.length > 0)
      {
        this.confirmFormGroup.get('carrier').setValue(String.Format('{0} - {1}',this.carrierData[0].CarrierID.trim(),this.carrierData[0].CarrierName.trim()));
        // this.DestinationPostalCode = String.Format("{0}-{1}",this.postalDataDest[0].PostalCode,this.postalDataDest[0].CityName.trim());
        // this.DestinationPostalData = this.postalDataDest[0];
        // this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
      }
      else
      {
        // this.DestinationStateName = String.Empty;
        this.Carrier = String.Empty;
        this.carrierData = null;
      }
    }
  }

  carrierAutoCompletefilter(val: string): Observable<any[]> {
    return this.httpService.carrierAutocomplete(this.ClientID, val, this.keyId)
  }

  carrierAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.confirmFormGroup.get('carrier').setValue(String.Format('{0} - {1}',event.option.value.CarrierID.trim(),event.option.value.CarrierName.trim()));
    this.carrierSelected = event.option.value.CarrierID.trim();
    // this.DestinationPostalCode = String.Format("{0}-{1}",event.option.value.PostalCode,event.option.value.CityName.trim());
    // this.DestinationPostalData = event.option.value;
    // this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
  }

  onGroupsChange(options: MatListOption[]) {
    const selectedAccessorials = options.map(o => o.value)
    this.accessorials = [];
    this.accessorialIds = [];
    selectedAccessorials.forEach(a => {
      const accessorial: AccessorialBase = {
        AccessorialID: a.AccessorialID,
        AccessorialCode: a.AccesorialCode,
        Description: a.Description        
      }

      this.accessorials.push(accessorial);
      this.accessorialIds.push(a.AccessorialID);
    });

    this.accessorialsSelectedQty = selectedAccessorials.length;
  }

  async getQuote() {

    let counter = 0;
    this.stepper._steps.forEach(step => {
      if (step.hasError){
        counter += 1;
      }
    });

    let message;
    if (counter > 0){
      message = 'Please complete all required fields.';
      this.openDialog(false, message);
      return;
    }

    let isMinPCFForQuickQuote = false;
    let tLMinimumPCFLimit = 0;
    this.clientPCFDefaultData = await this.httpService.GetPCFClientDefaultsByClient(this.ClientID.toString());    
    if (this.clientPCFDefaultData != null && this.clientPCFDefaultData.ShowTLPCFMessage){     
      tLMinimumPCFLimit = this.clientPCFDefaultData.TLMinimumPCFLimit;
      const arrayProducts = this.formProducts;    
      const filteredArrayPCFs: number[] = [];
      for (const control of arrayProducts.controls) {
        const product = control.value;
        if (product.Status !== 3 && product.PCF != null){         
          filteredArrayPCFs.push(product.PCF);
        }
     }

     if (filteredArrayPCFs != null && filteredArrayPCFs.length > 0){
       const foundedLowerPCFList = filteredArrayPCFs.filter(pcf => pcf < tLMinimumPCFLimit);
       if (foundedLowerPCFList != null && foundedLowerPCFList.length > 0){
          isMinPCFForQuickQuote = true;          
       }
     }
    }    

    if (isMinPCFForQuickQuote){
      this.openDialog(true, 'PCF is below ' + tLMinimumPCFLimit + ', there may be extra charges if you proceed booking this shipment.',null,'GetRates');
    }else{
      this.getQuoteButtonClicked = true;
      this.showSpinner = true;
      const test = await this.getShipmentRates();
      this.confirmFormGroup.get('carrier').setValue('');
      this.showSpinner = false;
    }   
  }

  async getShipmentRates() {

    this.spinnerMessage = 'Loading...';

    const pickupDate = this.OriginPickupDate;
    const arrayProducts = this.productsAndAccessorialsFormGroup.get('products').value;

    if (this.confirmFormGroup.get('carrier').value == null || this.confirmFormGroup.get('carrier').value === ''){
      this.carrierSelected = '';
    }

    const objRate = {
      ClientID: this.ClientID,
      ProfileID: this.clientDefaultData.ProfileID,
      Products: arrayProducts,
      SourcePostalCode: this.OriginPostalData.PostalCode,
      SourceCityID: this.OriginPostalData.CityID,
      SourceStateID: this.OriginPostalData.StateId,
      SourceCountryID: this.OriginPostalData.CountryId,
      SourceCountry: this.OriginPostalData.CountryCode,
      SourceStateCode: this.OriginPostalData.StateCode,
      SourceCityName: this.OriginPostalData.CityName,
      DestPostalCode: this.DestinationPostalData.PostalCode,
      DestCityID: this.DestinationPostalData.CityID,
      DestStateID: this.DestinationPostalData.StateId,
      DestCountryID: this.DestinationPostalData.CountryId,
      DestCountry: this.DestinationPostalData.CountryCode,
      DestStateCode: this.DestinationPostalData.StateCode,
      DestCityName: this.DestinationPostalData.CityName,
      ShipmentDate: String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()),
      Accessorials: this.accessorials,
      AccessorialCodes: [],
      TopN: this.confirmFormGroup.get('showTopCarriers').value,
      ServiceLevelGrops: [],
      ServiceLevels: [],// this.serviceLevels,
      ServiceLevelCodes: [this.ServiceLevelCodeSelected],
      // Ask
      SCAC: this.carrierSelected,
      EquipmentList: [],
      IsBuyRates: false,
      IsDebug: false,
      IsSuperAdmin: false,
      AccessorialIDs: this.accessorialIds,
      SkeepCalculatePPS: false,
      // Ask
      // "ProfileDescription": "**R2 BUY",
      Origin:  this.OriginPostalData.PostalCode + ',' +  this.OriginPostalData.CityName + ',' + this.OriginPostalData.StateName,
      Destination: this.DestinationPostalData.PostalCode + ',' +  this.DestinationPostalData.CityName + ',' + this.DestinationPostalData.StateName,
      // Ask
      // "ShipmentStopList": []
    };

    console.log(objRate);

    this.rates = await this.httpService.postRates(objRate);
    // console.log( this.rates);    
    if ( this.rates != null &&  this.rates.length > 0){
      this.ratesFiltered =  this.rates.filter(rate => rate.CarrierCost > 0);
      //this.ratesFiltered =  this.rates;
      //console.log(this.ratesFiltered);
      this.ratesCounter = this.ratesFiltered.length;
      this.snackbar.open(this.ratesCounter + ' rates returned.', null, {
        duration: 5000
      });


      this.rates.forEach(r => {
        if (!String.IsNullOrWhiteSpace(r.TransitTime)){
          let expDelDate = null;
          expDelDate = this.ConverteJsonDateToLocalTimeZone(r.ExpectedDeliveryDate);
          r.ETA = String.Format('{0} (ETA)', this.datepipe.transform(expDelDate,'MM/dd/yyyy'));         
        }
        else {
          r.ETA = String.Empty;
        }
      });

      this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';
    }
    else{
      this.noRatesFoundText = 'No rates found.';
    }

    this.ForceToReRate = false;
    this.productsUsedToRate = arrayProducts;
    this.accessorialsUsedToRate = this.accessorials;

    // Set default values again for origin and destination postcodes, also for pickup date
    this.gDefaultoriginpostalcode = this.originAndDestinationFormGroup.get('originpostalcode').value;
    this.gDefaultdestpostalcode = this.originAndDestinationFormGroup.get('destpostalcode').value;
    this.gDefaultpickupdate = this.originAndDestinationFormGroup.get('originpickupdate').value.toString();

  }

  //#region RatesOpened
  addRateOpened(rateIndex: number): void{
    const index: number = this.ratesOpened.indexOf(rateIndex);
    if (index == -1) {
      this.ratesOpened.push(rateIndex)
    }

    this.sendEmailClicked = false;
  }

  removeRateClosed(rateIndex: number): void{
    const index: number = this.ratesOpened.indexOf(rateIndex);
    if (index !== -1) {
        this.ratesOpened.splice(index, 1);
    }

    this.sendEmailClicked = false;
  }

  isRateOpened(rateIndex: number): boolean{
    return this.ratesOpened.some(function(r){ return r === rateIndex});
  }
  ////#endregion RatesOpened

  async selectQuote(index: number){
    this.ratesCounter = 0;
    this.getQuoteButtonClicked = false;

    const selectedRate = this.ratesFiltered[index];

    this.selectedRateFromQuotes = selectedRate;

    console.log(selectedRate);
    if (selectedRate != null){
      this.costListFiltered = [];

      const accessorialInvoiceFreightCost: AccountInvoiceCostList = {
        AccessorialCode: 'FRT',
        Description: 'Freight',
        BilledCost: selectedRate.GrossAmount
      }

      this.costListFiltered.push(accessorialInvoiceFreightCost);

      const accessorialInvoiceDiscount: AccountInvoiceCostList = {
        AccessorialCode: 'DIS',
        Description: 'Discount',
        BilledCost: -selectedRate.Discount
      }

      this.costListFiltered.push(accessorialInvoiceDiscount);

      const accessorialInvoiceFuelCost: AccountInvoiceCostList = {
        AccessorialCode: 'FSC',
        Description: 'Fuel',
        BilledCost: selectedRate.FuelCost
      }

      this.costListFiltered.push(accessorialInvoiceFuelCost);
     
      const accessorials = selectedRate.Accessorials.filter(a => a.AccessorialCharge > 0);
      accessorials.forEach(a => {
        const accessorialInvoice: AccountInvoiceCostList = {
          AccessorialCode: a.AccessorialCode,
          Description: a.AccessorialDescription,
          BilledCost: a.AccessorialCharge
        }

        this.costListFiltered.push(accessorialInvoice);                       
      });

      if (selectedRate.ShowTrueCost){
        this.TotalShipmentCost = selectedRate.TotalCost;
      }else{
        this.TotalShipmentCost = selectedRate.TotalCostWithOutTrueCost;
      }
      
      this.confirmFormGroup.get('carrier').setValue(selectedRate.CarrierName);      
    }



  }

  // actions = 1:save / 2:ship / 3:print / 4:email
  async saveQuote(index: number = null, rateSelectedAction: number = null){
    this.SaveAsQuote(index, rateSelectedAction);
  }

  onChangeCalculatePCF(index: number): void{
    // const product = this.productsAndAccessorialsFormGroup.get('products').value[index];
    // const PCF = this.calculatePCF(product.Pallets, product.Length, product.Width, product.Height, product.Weight);
    // (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(index).get('PCF').setValue(PCF);

    const product = this.productsAndAccessorialsFormGroup.get('products').value[index];
    const PCF = this.calculatePCF(product.Pallets, product.Length, product.Width, product.Height, product.Weight);
    if (PCF != null) {
      if (this.clientDefaultData.IsCalculateClassByPCF){
        const pcfclass = this.EstimateClassFromPCF(PCF);
        if (product.ProductClass !== pcfclass.toString()) {
          this.openDialog(true, 'Selected class is ' + product.ProductClass + ' and Estimated class is ' + pcfclass + '. Do you want to change ?', false, 'UpdateProductPCFClass', null, index, pcfclass);          
        }
      }

    }

    (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(index).get('PCF').setValue(PCF);
  }

  calculatePCF(Pallets, Lenght, Width, Height, Weight): number {
    let length;
    let width;
    let height;
    let volum;
    let density;
    let perpallet;
    let PCF;
    if (Lenght != null && Lenght != '' && Width != null && Width != '' && Height != null && Height != '' &&
     Weight != null && Weight != '' && Lenght != 0 && Width != 0 && Height != 0 && Weight != 0) {
        length = parseInt(Lenght);
        width = parseInt(Width);
        height = parseInt(Height);
        if (length != null && length != '' && width != null && width != '' && height != null && height != null) {
            volum = (length * width * height) / 1728;
        }
        if (volum != null && volum != '' && volum != 0) {
            if (Pallets != null && Pallets != '' && Pallets != 0) {
                perpallet = parseFloat(Weight) / parseFloat(parseFloat(Pallets).toFixed(4));
                if (perpallet != null && perpallet != '' && perpallet != 0) {
                    density = parseFloat(perpallet) / parseFloat(parseFloat(volum).toFixed(4));
                }
            }
            else {
                density = parseFloat(Weight) / parseFloat(parseFloat(volum).toFixed(4));
            }
        }
        if (density != null && density != '') {
            PCF =  parseFloat(parseFloat(density).toFixed(2));
        }
    }

    return PCF;
  }

  clearRatesSection(){
    this.ratesCounter = 0;
    this.getQuoteButtonClicked = false;
  }

  previousFromLastStep(){
    this.clearRatesSection()
  }

  async StepperSelectionChange(event: StepperSelectionEvent){
    console.log(event);

    if (event.selectedIndex === 2) // shipment info step selected
    {
        // -- Get Shipment Errors
        this.ReferenceByClientOptions = await this.httpService.GetReferenceByClient(this.ClientID, this.keyId);
        if (this.ReferenceByClientOptions != null && this.ReferenceByClientOptions.length > 0){
          this.ReferenceByClientField1 = this.ReferenceByClientOptions[0].Description.trim();
          this.ReferenceByClientIDField1 = this.ReferenceByClientOptions[0].ReferenceID;

          if (this.ReferenceByClientOptions.length > 1){
            this.ReferenceByClientField2 = this.ReferenceByClientOptions[1].Description.trim();
            this.ReferenceByClientIDField2 = this.ReferenceByClientOptions[1].ReferenceID;
          }

          if (this.ReferenceByClientOptions.length > 2){
            this.ReferenceByClientField3 = this.ReferenceByClientOptions[2].Description.trim();
            this.ReferenceByClientIDField3 = this.ReferenceByClientOptions[2].ReferenceID;
          }
        }
        else{ // If we can't get fields from API then set R2 fields as default
          this.ReferenceByClientField1 = 'Customer Ref #';
          this.ReferenceByClientField2 = 'R2 Order #';
          this.ReferenceByClientField3 = 'R2 Pro number';
        }


    }

    if (event.selectedIndex === 3) // last step selected
    {
      this.formProducts.value.forEach(prod => {
        const PackageItem = this.packageTypes.filter(item => item.PackageTypeID == prod.PackageTypeID);
        prod.PackageTypeDescription = (PackageItem.length > 0 ? PackageItem[0].PackageType : '');
      });
    }



    this.clearRatesSection()
  }

  async setDefaultValuesInSteps() {
    let defaultoriginpostalcode = null;
    let defaultoriginstatename = null;
    let defaultpickupdate = null;
    let defaultdestpostalcode = null;
    let defaultdeststatename = null;
    let defaultDestExpDelDate = null;

    if (this.ShipmentByLadingObject == null){      
      return;
    }        

    this.LoadNumber = this.ShipmentByLadingObject.ClientLadingNo;
    this.ShowSaveAsQuoteButton = (this.ShipmentByLadingObject.Status === 18 || this.ShipmentByLadingObject.Status === 17
      || this.ShipmentByLadingObject.Status === 12
      || this.ShipmentByLadingObject.Status === 10
      || this.ShipmentByLadingObject.Status === 13
      || this.ShipmentByLadingObject.Status === 14
      || this.ShipmentByLadingObject.Status === 11 ? true : false);
    defaultoriginpostalcode = this.ShipmentByLadingObject.OrgZipCode.trim() + '-' + this.ShipmentByLadingObject.OrgCityName.trim();
    defaultoriginstatename = this.ShipmentByLadingObject.OrgStateName.trim();

    // const tempPickupDate = moment.utc(this.ShipmentByLadingObject.PickupDate);
    // const strTempPickupDate = this.datepipe.transform(tempPickupDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy')
    // defaultpickupdate = new Date(strTempPickupDate);
    const strTempPickupDate = this.ConverteJsonDateToLocalTimeZone(this.ShipmentByLadingObject.PickupDate);
    defaultpickupdate = new Date(strTempPickupDate);
    

    // -- Calculate Expected Develiry Date
    this.ExpectedDeliveryDateCalculated = await this.httpService.CalculateExpectedDeliveryDate(this.keyId, this.ShipmentByLadingObject.TransTime, strTempPickupDate);    

    defaultdestpostalcode = this.ShipmentByLadingObject.DestZipCode.trim() + '-' + this.ShipmentByLadingObject.DestCityName.trim();
    defaultdeststatename = this.ShipmentByLadingObject.DestStateName.trim();

    this.gDefaultoriginpostalcode = defaultoriginpostalcode;
    this.gDefaultdestpostalcode = defaultdestpostalcode;
    this.gDefaultpickupdate = defaultpickupdate;

    const tempOriginPD: PostalData = {
      CityCode: '',
      CityID: this.ShipmentByLadingObject.OrgCity.toString(),
      CityName: this.ShipmentByLadingObject.OrgCityName.trim(),
      CountryCode: this.ShipmentByLadingObject.OrgCountryCode,
      CountryId: this.ShipmentByLadingObject.OrgCountry.toString(),
      CountryName: '',
      IsActive: '',
      PostalCode: this.ShipmentByLadingObject.OrgZipCode.trim(),
      PostalID: this.ShipmentByLadingObject.OrgZip.toString(),
      StateCode: this.ShipmentByLadingObject.OrgStateCode.trim(),
      StateId: this.ShipmentByLadingObject.OrgState.toString(),
      StateName: this.ShipmentByLadingObject.OrgStateName.trim(),
    };

    const tempDestPD: PostalData = {
      CityCode: '',
      CityID: this.ShipmentByLadingObject.DestCity.toString(),
      CityName: this.ShipmentByLadingObject.DestCityName.trim(),
      CountryCode: this.ShipmentByLadingObject.DestCountryCode,
      CountryId: this.ShipmentByLadingObject.DestCountry.toString(),
      CountryName: '',
      IsActive: '',
      PostalCode: this.ShipmentByLadingObject.DestZipCode.trim(),
      PostalID: this.ShipmentByLadingObject.DestZip.toString(),
      StateCode: this.ShipmentByLadingObject.DestStateCode.trim(),
      StateId: this.ShipmentByLadingObject.DestState.toString(),
      StateName: this.ShipmentByLadingObject.DestStateName.trim(),
    };    

    this.OriginPostalData = tempOriginPD;
    this.DestinationPostalData = tempDestPD;

    // -- Set default values "Origin and Destination" step
    this.originAndDestinationFormGroup.controls.originpostalcode.setValue(defaultoriginpostalcode, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originstatename.setValue(defaultoriginstatename, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originpickupdate.setValue(defaultpickupdate, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destpostalcode.setValue(defaultdestpostalcode, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.deststatename.setValue(defaultdeststatename, {onlySelf: false});

    this.originAndDestinationFormGroup.controls.originname.setValue(this.ShipmentByLadingObject.OrgName === 'NA' ? '' : this.ShipmentByLadingObject.OrgName, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originadddress1.setValue(this.ShipmentByLadingObject.OrgAdr1 === 'NA' ? '' : this.ShipmentByLadingObject.OrgAdr1, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originadddress2.setValue(this.ShipmentByLadingObject.OrgAdr2 === 'NA' ? '' : this.ShipmentByLadingObject.OrgAdr2, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.origincountry.setValue(this.ShipmentByLadingObject.OrgCountry, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.origincontact.setValue(this.ShipmentByLadingObject.OriginContactPerson === 'NA' ? '' : this.ShipmentByLadingObject.OriginContactPerson, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originphone.setValue(this.ShipmentByLadingObject.OriginContactPhone === 'NA' ? '' : this.ShipmentByLadingObject.OriginContactPhone, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originemail.setValue(this.ShipmentByLadingObject.OriginEmail === 'NA' ? '' : this.ShipmentByLadingObject.OriginEmail, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originpickupopen.setValue(this.ShipmentByLadingObject.RequestedPickupTimeFrom != null
      && this.ShipmentByLadingObject.RequestedPickupTimeFrom !== '' ? this.ShipmentByLadingObject.RequestedPickupTimeFrom : null,
      {onlySelf: false});
      this.originAndDestinationFormGroup.controls.originpickupclose.setValue(this.ShipmentByLadingObject.RequestedPickupTimeTo != null
        && this.ShipmentByLadingObject.RequestedPickupTimeTo !== '' ? this.ShipmentByLadingObject.RequestedPickupTimeTo : null,
        {onlySelf: false});

    this.originAndDestinationFormGroup.controls.destname.setValue(this.ShipmentByLadingObject.DestName === 'NA' ? '' : this.ShipmentByLadingObject.DestName, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destadddress1.setValue(this.ShipmentByLadingObject.DestAdr1 === 'NA' ? '' : this.ShipmentByLadingObject.DestAdr1, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destadddress2.setValue(this.ShipmentByLadingObject.DestAdr2 === 'NA' ? '' : this.ShipmentByLadingObject.DestAdr2, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destcountry.setValue(this.ShipmentByLadingObject.DestCountry, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destcontact.setValue(this.ShipmentByLadingObject.DestContactPerson === 'NA' ? '' : this.ShipmentByLadingObject.DestContactPerson, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destphone.setValue(this.ShipmentByLadingObject.DestContactPhone === 'NA' ? '' : this.ShipmentByLadingObject.DestContactPhone, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destemail.setValue(this.ShipmentByLadingObject.DestEmail === 'NA' ? '' : this.ShipmentByLadingObject.DestEmail, {onlySelf: false});
     
     defaultDestExpDelDate = new Date(this.ConverteJsonDateToLocalTimeZone(this.ExpectedDeliveryDateCalculated));
    // const tempDestExpDelDate = moment.utc(this.ExpectedDeliveryDateCalculated);
    // defaultDestExpDelDate = new Date(this.datepipe.transform(tempDestExpDelDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy'));    
    this.originAndDestinationFormGroup.controls.destexpdeldate.setValue(defaultDestExpDelDate, {onlySelf: false});
    
    this.originAndDestinationFormGroup.controls.destdelapptfrom.setValue(this.ShipmentByLadingObject.DeliveryAppointmentTimeFrom, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destdelapptto.setValue(this.ShipmentByLadingObject.DeliveryAppointmentTimeTo, {onlySelf: false});

    // --

    // -- Set values for Shipment Info fields    
    this.shipmentInfoFormGroup.get('equipment').setValue(this.ShipmentByLadingObject.EquipmentID == null || this.ShipmentByLadingObject.EquipmentID === 1 ? 7 : this.ShipmentByLadingObject.EquipmentID); //-- need to check this one
    this.shipmentInfoFormGroup.get('priority').setValue(this.ShipmentByLadingObject.PriorityID == null ? 0 : this.ShipmentByLadingObject.PriorityID); //-- need to check this one
    this.shipmentInfoFormGroup.get('servicelevel').setValue(this.ShipmentByLadingObject.ServiceLevelID == null ? 1 : this.ShipmentByLadingObject.ServiceLevelID);
    this.shipmentInfoFormGroup.get('paymentterms').setValue(this.ShipmentByLadingObject.PaymentTermID == null ? 5 : this.ShipmentByLadingObject.PaymentTermID); //-- need to check this one
    this.shipmentInfoFormGroup.get('mode').setValue(this.ShipmentByLadingObject.Mode == null ? 'LTL' : this.ShipmentByLadingObject.Mode);    
    this.shipmentInfoFormGroup.controls.customerref.setValue(this.ShipmentByLadingObject.Ref1Value === 'NA' ? '' : this.ShipmentByLadingObject.Ref1Value, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.r2order.setValue(this.ShipmentByLadingObject.Ref2Value === 'NA' ? '' : this.ShipmentByLadingObject.Ref2Value, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.r2pronumber.setValue(this.ShipmentByLadingObject.Ref3Value === 'NA' ? '' : this.ShipmentByLadingObject.Ref3Value, {onlySelf: false});    
    this.shipmentInfoFormGroup.controls.shipmentvalue.setValue(this.ShipmentByLadingObject.ShipmentValue === 'NA' ? '' : this.ShipmentByLadingObject.ShipmentValue, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.valueperpound.setValue(this.ShipmentByLadingObject.ValuePerPound === 'NA' ? '' : this.ShipmentByLadingObject.ValuePerPound, {onlySelf: false});   
    this.shipmentInfoFormGroup.controls.shipmentinfo.setValue(this.ShipmentByLadingObject.TrackingNumber === 'NA' ? '' : this.ShipmentByLadingObject.TrackingNumber, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.pronumber.setValue(this.ShipmentByLadingObject.ProNumber === 'NA' ? '' : this.ShipmentByLadingObject.ProNumber, {onlySelf: false});    
    this.shipmentInfoFormGroup.controls.r2refno.setValue(this.ShipmentByLadingObject.BrokerReferenceNo === 'NA' ? '' : this.ShipmentByLadingObject.BrokerReferenceNo, {onlySelf: false});  
    this.shipmentInfoFormGroup.controls.specialinstructions.setValue(this.ShipmentByLadingObject.SplNotes === 'NA' ? '' : this.ShipmentByLadingObject.SplNotes, {onlySelf: false});       
    // --

    // -- Set default values "Products and Accesorials" step
    if (this.ShipmentByLadingObject.BOlProductsList != null && this.ShipmentByLadingObject.BOlProductsList.length > 0){
      let counter = 1;
      this.ShipmentByLadingObject.BOlProductsList.forEach(p => {
        if (counter > 1){
          this.addNewProdField();
        }

        const currentProductIndex = (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1;
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Pallets').setValue(p.Pallets);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Pieces').setValue(p.Pieces);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('PackageTypeID').setValue(p.PackageTypeID);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('ProductClass').setValue(p.Class);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('NmfcNumber').setValue(p.NMFC);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Length').setValue(p.Lenght);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Width').setValue(p.Width);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Height').setValue(p.Height);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('PCF').setValue(p.PCF);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Weight').setValue(p.Weight);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Stackable').setValue(p.Stackable);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Hazmat').setValue(p.Hazmat);
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('ProductDescription').setValue(p.Description === 'NA' ? '' : p.Description);

        counter += 1;
      });
    }

    if (this.ShipmentByLadingObject.BOLAccesorialList != null && this.ShipmentByLadingObject.BOLAccesorialList.length > 0){
      this.ShipmentByLadingObject.BOLAccesorialList.forEach(BOLAccesorial => {
        this.accessorialArray.forEach(AvailableAccesorial => {
          if (BOLAccesorial.AccesorialID === AvailableAccesorial.AccessorialID){
            const accessorial: AccessorialBase = {
              AccessorialID: AvailableAccesorial.AccessorialID,
              AccessorialCode: AvailableAccesorial.AccesorialCode,
              Description: AvailableAccesorial.Description
            }

            this.accessorials.push(accessorial);
            this.accessorialIds.push(AvailableAccesorial.AccessorialID);

            this.accessorialsUsedToRate.push(accessorial);

            AvailableAccesorial.Selected = true;
          }
        });
      });

      this.ShipmentAccessorialsStored = this.ShipmentByLadingObject.BOLAccesorialList // Assign accessorials to global variable                  

    }

    this.accessorialsSelectedQty = this.ShipmentByLadingObject.BOLAccesorialList.length; // Quantity of accessorials selected

    // --

    // -- Set default values "Last/Confirm step" step
    this.confirmFormGroup.controls.carrier.setValue(this.ShipmentByLadingObject.CarrierName, {onlySelf: false});
    this.carrierSelected = this.ShipmentByLadingObject.CarrierCode;
    // --


  }

  openDialog(isConfirmDialog, pMessage, YesNoActions = false, actionEvent = null, method = null, productIndex = null, keyvalue = null){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Message',
      message: pMessage,
      confirmDialog: isConfirmDialog,
      yesNoActions: YesNoActions
    };

    const dialogRef = this.dialog.open(ConfirmAlertDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (data: string) => {    
      if (data != null && data === 'Accepted') {
        switch (actionEvent) {
          case 'UpdateProductPCFClass':
            const pcfclass = keyvalue;
            (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(productIndex).get('ProductClass').setValue(keyvalue.toString());
            break;
          case 'ReRate':
            this.confirmFormGroup.get('carrier').setValue(''); // clean current carrier to get all rates
            this.getQuote();
            break;
          case 'ShipmentBooked':           
            this.router.navigate(['../../../shipmentboard/LTLTL/'], { relativeTo: this.route });
            break;
          case 'QuoteSavedAndRedirectToBoard':           
            this.router.navigate(['../../../shipmentboard/LTLTL/'], { relativeTo: this.route });
            break;
          case 'GetRates':
            this.getQuoteButtonClicked = true;
            this.showSpinner = true;
            const test = await this.getShipmentRates();
            this.confirmFormGroup.get('carrier').setValue('');
            this.showSpinner = false;
            break;
          case 'pickupTimesValidations':
            let bookShipment;
            if (method === 'SaveAsQuote'){
              bookShipment = false;
            }else if (method === 'BookShipmentSubmit'){
              bookShipment = true;
            }
  
            if (this.ShipmentByLadingObject == null){
              // Insert as new quote
              this.saveNewQuoteAndBookShipment(bookShipment, true);
            }else{
              // Update quote
              this.updateQuote(bookShipment, true);
            }
            break;
        } 
      }else if (data != null && data === 'No') {
        if (actionEvent === 'ReRate'){
          let bookShipment;
          if (method === 'SaveAsQuote'){
            bookShipment = false;
          }else if (method === 'BookShipmentSubmit'){
            bookShipment = true;
          }

          if (this.ShipmentByLadingObject == null){
            // Insert as new quote
            this.saveNewQuoteAndBookShipment(bookShipment, true);
          }else{
            // Update quote
            this.updateQuote(bookShipment, true);
          }
        }
      }
    });

  }

  validateIfFieldsHaveChanged(){
    const bFieldsHaveChanged = false;
    if (this.ForceToReRate){
      return true;
    }
    
    if (this.ShipmentByLadingObject == null){
      
        if (this.productsUsedToRate != null && this.productsUsedToRate.length > 0){
          let productHasChanged = false;
          let currentProductIndex = 0;
          this.productsUsedToRate.forEach(p => {
            if (currentProductIndex > (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1){
              productHasChanged = true;
              return true;
            }

            //const currentProductIndex = (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1;
            if (p.Pallets !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Pallets').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Pieces !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Pieces').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.PackageTypeID !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('PackageTypeID').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.ProductClass !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('ProductClass').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.NmfcNumber !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('NmfcNumber').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Length !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Length').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Width !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Width').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Height !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Height').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.PCF !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('PCF').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Weight !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Weight').value){
              productHasChanged = true;
              return true;
            }

            currentProductIndex = currentProductIndex + 1;
          });

          if (productHasChanged){
            this.gbProductHasChanged = true;
            return true;
          }

        }

        if (this.accessorialsUsedToRate != null && this.accessorialsUsedToRate.length > 0){
          if (this.accessorialsUsedToRate.length !== this.accessorials.length)
          {
            // accessorials selected are different from the ones previously selected, so return true to re-rate
            return true;
          }else{
            let accessorialsFound : AccessorialBase[] = [];
            let accessorialHasChanged = false;
            this.accessorialsUsedToRate.forEach(Acc => {
              if (this.accessorials != null && this.accessorials.length > 0){
                accessorialsFound = this.accessorials.filter(item => item.AccessorialID === Acc.AccessorialID);
                if (accessorialsFound == null || accessorialsFound.length === 0){
                  accessorialHasChanged = true;
                  return true; // Previous accessorial selected not found in current list of accessorials, so return true (re-rate)
                }
              }
            });

            if (accessorialHasChanged){
              return true;
            }

          }
        }
    }
    else // costs have been already obtained, so compare current values with previous ones
    {
      // Validate if origin postal code has changed
      //const defaultoriginpostalcode = this.ShipmentByLadingObject.OrgZipCode.trim() + '-' + this.ShipmentByLadingObject.OrgCityName.trim();
      if (this.gDefaultoriginpostalcode !== this.originAndDestinationFormGroup.get('originpostalcode').value){
        return true;
      }

      // Validate if destination postal code has changed
      //const defaultdestpostalcode = this.ShipmentByLadingObject.DestZipCode.trim() + '-' + this.ShipmentByLadingObject.DestCityName.trim();
      if (this.gDefaultdestpostalcode !== this.originAndDestinationFormGroup.get('destpostalcode').value){
        return true;
      }

      // Validate if origin pickup date has changed
      // const tempPickupDate = moment.utc(this.ShipmentByLadingObject.PickupDate);
      // const defaultpickupdate = new Date(this.datepipe.transform(tempPickupDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy'));      
      if (this.gDefaultpickupdate.toString() !== this.originAndDestinationFormGroup.get('originpickupdate').value.toString()){
        return true;
      }

      // Validate if data in products has changed
      let productsToEvaluate;
      if (this.productsUsedToRate != null && this.productsUsedToRate.length > 0){
        productsToEvaluate = this.productsUsedToRate;
      }else{
        productsToEvaluate = this.ShipmentByLadingObject.BOlProductsList;
      }
      
      if (productsToEvaluate != null && productsToEvaluate.length > 0){
        //let currentProductIndex = (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1;
        let currentProductIndex = 0;
        let productHasChanged = false;
        productsToEvaluate.forEach(p => {          
          if (currentProductIndex > (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1){
            productHasChanged = true;
            return true;
          }

          if (p.Pallets !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Pallets').value){
            productHasChanged = true;
            return true;
          }

          if (p.Pieces !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Pieces').value){
            productHasChanged = true;
            return true;
          }

          
          if (p.PackageTypeID !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('PackageTypeID').value){
            productHasChanged = true;
            return true;
          }

          if (this.productsUsedToRate != null && this.productsUsedToRate.length > 0){
            if (p.ProductClass !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('ProductClass').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.NmfcNumber !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('NmfcNumber').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Length !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Length').value){
              productHasChanged = true;
              return true;
            }
          }else{
            if (p.Class !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('ProductClass').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.NMFC !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('NmfcNumber').value){
              productHasChanged = true;
              return true;
            }
  
            if (p.Lenght !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Length').value){
              productHasChanged = true;
              return true;
            }
          }
          

          if (p.Width !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Width').value){
            productHasChanged = true;
            return true;
          }

          if (p.Height !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Height').value){
            productHasChanged = true;
            return true;
          }

          if (p.PCF !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('PCF').value){
            productHasChanged = true;
            return true;
          }

          if (p.Weight !== (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('Weight').value){
            productHasChanged = true;
            return true;
          }

          currentProductIndex = currentProductIndex + 1;
        });

        if (productHasChanged){
          return true;
        }

      }

      if (this.accessorialsUsedToRate != null && this.accessorialsUsedToRate.length > 0){
        if (this.accessorialsUsedToRate.length !== this.accessorials.length)
        {
          // accessorials selected are different from the ones previously selected, so return true to re-rate
          return true;
        }else{
          let accessorialsFound : AccessorialBase[] = [];
          let accessorialHasChanged = false;
          this.accessorialsUsedToRate.forEach(Acc => {
            if (this.accessorials != null && this.accessorials.length > 0){
              accessorialsFound = this.accessorials.filter(item => item.AccessorialID === Acc.AccessorialID);
              if (accessorialsFound == null || accessorialsFound.length === 0){
                accessorialHasChanged = true;
                return true; // Previous accessorial selected not found in current list of accessorials, so return true (re-rate)
              }
            }
          });

          if (accessorialHasChanged){
            return true;
          }

        }
      }

      // if (this.ShipmentAccessorialsStored != null && this.ShipmentAccessorialsStored.length > 0){
      //   if (this.ShipmentAccessorialsStored.length !== this.accessorials.length)
      //   {
      //     // accessorials selected are different from the ones previously selected, so return true to re-rate
      //     return true;
      //   }else{
      //     let accessorialArrayFound: AccessorialBase[];
      //     let accessorialHasChanged = false;
      //     this.ShipmentAccessorialsStored.forEach(BOLAccesorial => {
      //       accessorialArrayFound = this.accessorials.filter(item => item.AccessorialID === BOLAccesorial.AccesorialID);
      //       if (accessorialArrayFound == null || accessorialArrayFound.length === 0){
      //         accessorialHasChanged = true;
      //         return true; // Previous accessorial selected not found in current list of accessorials, so return true (re-rate)
      //       }
      //     });

      //     if (accessorialHasChanged){
      //       return true;
      //     }
      //   }
      // }

    }

    return bFieldsHaveChanged;
  }

  // actions = 1:save / 2:ship / 3:print / 4:email
  SaveAsQuote(rateIndex = null, rateSelectedAction = null) {    
    const RequiredFieldsValidationObj = this.CheckAllRequiredFields();
    if (RequiredFieldsValidationObj.showWarningMessage){
       this.openDialog(RequiredFieldsValidationObj.isConfirmDialog, RequiredFieldsValidationObj.message,
        RequiredFieldsValidationObj.yesNoActions, RequiredFieldsValidationObj.actionEvent, 'SaveAsQuote');
    }else{
      const IsBookShipment = false;
      const ModifiedQuote = false;      
      const objRateSelected = {
        rateIndex: rateIndex,
        rateSelectedAction: rateSelectedAction,
        keyValue: null
      };

      if (objRateSelected && objRateSelected.rateIndex != null){
        if (rateSelectedAction === 4) // email
        {
          const email = this.emailFormGroup.get('emailToSendQuote').value;
          const emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

          if(!emailregx.test(email)){
            this.openDialog(false, 'Invalid email format.');    
            return;
          }

          objRateSelected.keyValue = email;
        }        
      }

      // const pickupTimesWarningMessage = this.PickupTwoHoursAndAfterOnePMValidations(); // TESTRS
      const pickupTimesWarningMessage = '';
      if (pickupTimesWarningMessage !== ''){
        this.openDialog(true, pickupTimesWarningMessage, true, 'pickupTimesValidations', 'SaveAsQuote');    
      }else {
        if (this.ShipmentByLadingObject == null){
          // Insert as new quote
          this.saveNewQuoteAndBookShipment(IsBookShipment, ModifiedQuote, objRateSelected);
        }else{
          // Update quote
          this.updateQuote(IsBookShipment, ModifiedQuote, objRateSelected);
        }
      }
      
    }  
  }

  async saveNewQuoteAndBookShipment(IsBookShipment = false, ModifiedQuote = false,  objRateSelected = null){

    this.spinnerMessage = 'Saving quote';
    
    this.showSpinner = true;
    
    let selectedRate: Rate;
    if (objRateSelected && objRateSelected.rateIndex != null){
      selectedRate = this.ratesFiltered[objRateSelected.rateIndex];
    }else{
      selectedRate = this.selectedRateFromQuotes; // Selected rate    
    }        

    const arrayProducts = this.productsAndAccessorialsFormGroup.get('products').value;
    const productList: BOlProductsListSQD[] = [];
    let productsCounter = 1;
    arrayProducts.forEach(p => {
      const prod : BOlProductsListSQD = {
        BOLProductID: productsCounter,
        Description: p.ProductDescription,
        Pallets: p.Pallets == null ? 0 : p.Pallets,
        Pieces: p.Pieces  == null ? 0 : p.Pieces,
        Hazmat: p.HazMat,
        NMFC: p.NmfcNumber,
        Class: p.ProductClass,
        Weight: p.Weight,
        Height: p.Height,
        Lenght: p.Length,
        Width: p.Width,
        PackageTypeID: p.PackageTypeID,
        PCF: p.PCF,
        selectedProduct: {},
        Status: 1,
        SelectedProductClass: {},
        Stackable: p.Stackable,
        PortCode: 'C'
      }

      console.log('p', p);

      console.log('prod', prod);

      productList.push(prod);

      productsCounter = productsCounter + 1;
    });

    const accountInvoiceCostList: AccountInvoiceCostListSQD[] = [];
    const filteredSelectRateAccessorials = selectedRate.Accessorials.filter(acc => acc.AccessorialCharge > 0);
    filteredSelectRateAccessorials.forEach(a => {
      const accountInvoiceCost: AccountInvoiceCostListSQD = {
        AccessorialID: a.AccessorialID,
        AccessorialCode: a.AccessorialCode,
        RatedCost: a.AccessorialCharge,
        BilledCost: a.AccessorialCharge,
        Description: a.AccessorialDescription,
        CostStatus: 1 // Ask
      }
      accountInvoiceCostList.push(accountInvoiceCost);
    })

    // Ask
    // Freight
    const accountInvoiceFreight: AccountInvoiceCostListSQD = {
      AccessorialID: 22,
      RatedCost: selectedRate.GrossAmount,
      BilledCost: selectedRate.GrossAmount,
      Description: 'Freight',
      AccessorialCode: 'FRT',
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceFreight);

    // Fuel
    const accountInvoiceFuel: AccountInvoiceCostListSQD = {
      AccessorialID: 23,
      RatedCost: selectedRate.FuelCost,
      BilledCost: selectedRate.FuelCost,
      Description: 'Fuel',
      AccessorialCode: 'FSC',
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceFuel);

    // Discount
    const accountInvoiceDiscount: AccountInvoiceCostListSQD = {
      AccessorialID: 24,
      RatedCost: -1 * selectedRate.Discount,
      BilledCost: -1 * selectedRate.Discount,
      Description: 'Discount',
      AccessorialCode: 'DIS',
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceDiscount);

    const sellRate: SellRatesSQD = {
      SCAC: selectedRate.CarrierID,
      CarrierName: selectedRate.CarrierName,
      AccountInvoiceCostList: accountInvoiceCostList
    }

    const bolAccesorials: BOLAccesorialListSQD[] = [];
    this.accessorials.forEach(a => {
      const acc: BOLAccesorialListSQD = {
        AccesorialID: a.AccessorialID,
        IsAccesorial: true
      }
      bolAccesorials.push(acc);
    })

    console.log('Prod', productList)

    // End here rs

    let statusReasonCodeId = 1 // "A03 - Incorrect Address" by default
    if (this.StatusReasons != null && this.StatusReasons.length > 0){
      statusReasonCodeId = this.StatusReasons[0].StatusReasonCodeId; // Take First by default  
    }

    this.saveQuoteData = {
      ClientId: this.ClientID,
      PickupDate: String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()),
      DeliveryDate: null,
      OrgName: this.originAndDestinationFormGroup.get('originname').value,
      OrgAdr1: this.originAndDestinationFormGroup.get('originadddress1').value,
      OrgAdr2: this.originAndDestinationFormGroup.get('originadddress2').value,      
      OrgCity: Number(this.OriginPostalData.CityID),
      OrgState: Number(this.OriginPostalData.StateId),
      OrgZip: Number(this.OriginPostalData.PostalID),
      OrgCountry: Number(this.OriginPostalData.CountryId),
      DestName: this.originAndDestinationFormGroup.get('destname').value,
      DestAdr1: this.originAndDestinationFormGroup.get('destadddress1').value,
      DestAdr2: this.originAndDestinationFormGroup.get('destadddress2').value,
      DestCity: Number(this.DestinationPostalData.CityID),
      DestState: Number(this.DestinationPostalData.StateId),
      DestZip: Number(this.DestinationPostalData.PostalID),
      DestCountry: Number(this.DestinationPostalData.CountryId),
      BillToName: this.clientDefaultData.BillToName,
      BillToAdr1: this.clientDefaultData.BillToAddress1,
      BillToAdr2: this.clientDefaultData.BillToAddress2,
      BillToState: this.clientDefaultData.BillToState,
      BillToCity: this.clientDefaultData.BillToCity,
      BillToZip: this.clientDefaultData.BillToPostal,
      BillToCountry: this.clientDefaultData.BillToCountry,
      CarrierCode: selectedRate.CarrierID,
      CarrierName: selectedRate.CarrierName,
      ProNumber: this.shipmentInfoFormGroup.get('pronumber').value,
      SplNotes: this.shipmentInfoFormGroup.get('specialinstructions').value,
      Ref1ID: this.ReferenceByClientIDField1,
      Ref2ID: this.ReferenceByClientIDField2,
      Ref3ID: this.ReferenceByClientIDField3,
      Ref1Value: (this.shipmentInfoFormGroup.get('customerref').value != null ? this.shipmentInfoFormGroup.get('customerref').value.trim() : ''),
      Ref2Value: (this.shipmentInfoFormGroup.get('r2order').value != null ? this.shipmentInfoFormGroup.get('r2order').value.trim() : ''),
      Ref3Value: this.shipmentInfoFormGroup.get('r2pronumber').value,
      TransTime: selectedRate.TransitTime,
      ShipCost: selectedRate.TotalCost,
      FreightCost: selectedRate.FreightCost,
      FuelCost: selectedRate.FuelCost,
      AccsCost: selectedRate.TotalAccCost,
      ShipperNotes: '',
      PaymentTermID: this.shipmentInfoFormGroup.get('paymentterms').value,
      OriginContactPerson: this.originAndDestinationFormGroup.get('origincontact').value,
      OriginContactPhone: this.originAndDestinationFormGroup.get('originphone').value,
      DestContactPerson: this.originAndDestinationFormGroup.get('destcontact').value,
      DestContactPhone: this.originAndDestinationFormGroup.get('destphone').value,
      OriginEmail: this.originAndDestinationFormGroup.get('originemail').value,
      DestEmail: this.originAndDestinationFormGroup.get('destemail').value,
      EquipmentID: this.shipmentInfoFormGroup.get('equipment').value,
      ShipmentValue: this.shipmentInfoFormGroup.get('shipmentvalue').value,
      ValuePerPound: this.shipmentInfoFormGroup.get('valueperpound').value,
      PriorityID: this.shipmentInfoFormGroup.get('priority').value,
      CarrierType: selectedRate.CarrierType,
      QuoteNumber: selectedRate.QuoteNumber,
      OriginTerminalAdd1: selectedRate.OriginTerminalAddress1,
      OriginTerminalCity: selectedRate.OriginTerminalCity,
      OriginTerminalState: selectedRate.OriginTerminalState,
      OriginTerminalZip: selectedRate.OriginTerminalZip,      
      OriginTerminalFreePhone: selectedRate.OriginTerminalFreePhone,
      OriginTerminalPhone: selectedRate.OriginTerminalPhoneNo,
      DestTerminalAdd1: selectedRate.DestTerminalAddress1,
      DestTerminalCity: selectedRate.DestTerminalCity,
      DestTerminalState: selectedRate.DestTerminalState,
      DestTerminalZip: selectedRate.DestTerminalZip,
      DestTerminalFreePhone: selectedRate.DestTerminalFreePhone,
      DestTerminalPhone: selectedRate.DestTerminalPhoneNo,
      OriginTerminalFax:  selectedRate.OriginTerminalFaxNo,
      DestTerminalFax: selectedRate.DestTerminalFaxNo,
      RequestedPickupDateFrom: this.originAndDestinationFormGroup.get('originpickupdate').value != null ? String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()) : null,
      RequestedPickupTimeFrom: this.originAndDestinationFormGroup.get('originpickupopen').value,
      RequestedPickupTimeTo: this.originAndDestinationFormGroup.get('originpickupclose').value,
      OrgFaxNo: null,
      DestFaxNo: null,
      RequestedDeliveryDate: this.originAndDestinationFormGroup.get('destexpdeldate').value != null ? String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('destexpdeldate').value.getTime()) : null,
      ServiceLevelID: this.shipmentInfoFormGroup.get('servicelevel').value,
      Miles: selectedRate.LaneWiseMiles,
      BrokerCarrierCode: null,
      BrokerReferenceNo: this.shipmentInfoFormGroup.get('r2refno').value,
      ShipmentErrorID: 0, 
      BOlProductsList: productList,
      BOLAccesorialList: bolAccesorials,
      BOLDispatchNotesList: [],
      BuyRates: {
        AccountInvoiceCostList: []
      },
      SellRates: sellRate,
      RefNo: selectedRate.ReferenceNo,
      LoggedInUserId: this.UserIDLoggedIn,
      OrgCityName: this.OriginPostalData.CityName,
      OrgStateCode: this.OriginPostalData.StateCode,
      OrgCountryCode: this.OriginPostalData.CountryCode,
      OrgZipCode: this.OriginPostalData.PostalCode,
      OrgPostWithCity: this.OriginPostalData.PostalCode + '-' + this.OriginPostalData.CityName,
      DestCityName: this.DestinationPostalData.CityName,
      DestStateCode: this.DestinationPostalData.StateCode,
      DestCountryCode: this.DestinationPostalData.CountryCode,
      DestZipCode: this.DestinationPostalData.PostalCode,
      DestStateName: this.DestinationPostalData.StateName,
      DestPostalWithCity: this.DestinationPostalData.PostalCode + '-' + this.DestinationPostalData.CityName,
      BillToStateName: this.clientDefaultData.BillToStateName,
      BillToPostalWithCity: this.clientDefaultData.BillToPostalCode + '-' +  this.clientDefaultData.BillToCity,
      SellProfileID: selectedRate.ProfileID,
      OrgLocation:String.Format('{0},{1}{2}',this.OriginPostalData.CityName,this.OriginPostalData.StateCode,this.OriginPostalData.PostalCode),
      DestLocation:String.Format('{0},{1}{2}',this.DestinationPostalData.CityName,this.DestinationPostalData.StateCode,this.DestinationPostalData.PostalCode),
      BillToCityName: this.clientDefaultData.BillToCityName.toString(),
      BillToStateCode: this.clientDefaultData.BillToState.toString(),
      BillToCountryCode: this.clientDefaultData.BillToCountry.toString(),
      BillToZipCode: this.clientDefaultData.BillToPostalCode,
      SalesPersonList: [],
      BolDocumentsList: [],
      TrackingDetailsList: [],
      ServiceLevelName:selectedRate.ServiceLevel,
      ServiceLevelCode:selectedRate.SaasServiceLevelCode,
      RatingResultId: selectedRate.RatingResultId,
      Mode: this.shipmentInfoFormGroup.get('mode').value,
      BOLStopLists: [],
      CostWithCustomerPercentage: selectedRate.CostWithCustomerPercentage,
      WaterfallList: [],
      orgTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode),
      destTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode),
      WaterfallDetailsList: [],
      StatusReasonCodeId: statusReasonCodeId,
      Status: (IsBookShipment || ModifiedQuote ? 2 : 10)
    }

    // Set error interceptor variable to false as default
    this.authenticationService.requestFailed$.next(false);

    if (ModifiedQuote){
      try{
        const responseData = await this.httpService.ModifiedQuote(this.saveQuoteData);
        if (!this.authenticationService.requestFailed$.value){         
          this.snackbar.open('Lading quote has been modified', null, {
            duration: 5000
          });
          this.router.navigate(['../../../shipmentboard/LTLTL/'], { relativeTo: this.route });
        }else{
          this.authenticationService.requestFailed$.next(false);
          this.snackbar.open('Error setting the record as modified.', null, {
            duration: 5000
          });
        }      
      }catch(e){
        this.authenticationService.requestFailed$.next(false);
        this.snackbar.open('Error setting the record as modified.', null, {
          duration: 5000
        });
      }      
      return;
    }

    if (IsBookShipment){
      const responseData = await this.httpService.OpenShipment(this.saveQuoteData);
      if (responseData != null && !String.IsNullOrWhiteSpace(responseData.ClientLadingNo))
      {
        this.messageService.SendQuoteParameter(responseData.ClientLadingNo);
        this.messageService.SendLadingIDParameter(responseData.LadingID.toString());
        // this.snackbar.open('Shipment Booked with LoadNo ' + responseData.ClientLadingNo, null, {
        //   duration: 5000
        // });
        this.openDialog(false, 'Shipment Booked with LoadNo: ' + responseData.ClientLadingNo + '. ', null, 'ShipmentBooked');
        const bolPrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintBOLHandler.ashx?LadingID={0}&ClientID={1}&Ticket={2}',
        responseData.LadingID.toString(),this.ClientID.toString(), this.securityToken);        
        window.open(bolPrintURL, '_blank');       
      }
      else{
        this.snackbar.open('Error booking the shipment.', null, {
          duration: 5000
        });
      }
    }else{
      const responseData = await this.httpService.saveNewQuote(this.saveQuoteData);
      if (responseData != null && !String.IsNullOrWhiteSpace(responseData.ClientLadingNo))
      {
        this.messageService.SendQuoteParameter(responseData.ClientLadingNo);
        this.messageService.SendLadingIDParameter(responseData.LadingID.toString());
        // this.snackbar.open('Quote saved successfully with LoadNo ' + responseData.ClientLadingNo, null, {
        //   duration: 5000
        // });

        this.openDialog(false, 'Quote saved successfully. Quote Number: ' + responseData.ClientLadingNo + '. ' + (objRateSelected.rateSelectedAction === 4 ? 'Email has been sent.' : ''), null, 
        'QuoteSavedAndRedirectToBoard', null, null, null);

        switch (objRateSelected.rateSelectedAction) {
          case 3: // print quote
            const ratequotePrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintQuoteHandler.ashx?LadingID={0}&Ticket={1}',
                                        responseData.LadingID,this.securityToken);
            window.open(ratequotePrintURL, '_blank');
            break;
          case 4: // email quote
            let emailBOLParameters: SendEmailParameters;

            const invoiceParameter: InvoiceParameter = {
              InvoiceDetailIDs: []
            };
    
            emailBOLParameters = {
              ClientID: this.ClientID,
              CarrierID : selectedRate.CarrierID,
              ApplicationID: 56,
              EventID: 39,
              EmailAddresses: objRateSelected.keyValue,
              LadingID: responseData.LadingID,
              UserRowID: 1,
              InvoiceParameter: invoiceParameter,
              LadingIDs: [],
            }
    
            this.httpService.SendEmailManually(emailBOLParameters);
            break;
        } 
        

        // this.router.navigate(['../../../shipmentboard/LTLTL/'], { relativeTo: this.route });
      }
      else{
        this.snackbar.open('Error saving as quote.', null, {
          duration: 5000
        });
      }
    }
    

    this.showSpinner = false;
  }

  async updateQuote(bookShipment = false, ModifiedQuote = false, objRateSelected = null){
    this.spinnerMessage = 'Saving quote';

    const localShipmentByLadingObject = this.ShipmentByLadingObject;

    if (bookShipment){
      this.spinnerMessage = 'Booking shipment';
      localShipmentByLadingObject.Status = 2; // Booked
    }

    if (ModifiedQuote){
      this.spinnerMessage = 'Saving quote as modified.';
      localShipmentByLadingObject.Status = 2; // Booked
    }

    this.showSpinner = true;

    let selectedRate: Rate;
    if (objRateSelected && objRateSelected.rateIndex != null){
      selectedRate = this.ratesFiltered[objRateSelected.rateIndex];
    }else{
      selectedRate = this.selectedRateFromQuotes; // Selected rate    
    }     
    
    console.log('Quote has been rerated, selectedRate: ',selectedRate);

    const arrayProducts = this.productsAndAccessorialsFormGroup.get('products').value;
    const productList: BOlProductsListSBL[] = [];
    
    arrayProducts.forEach(p => {
      
      let tempProductID = 0;
      if (localShipmentByLadingObject.BOlProductsList != null && localShipmentByLadingObject.BOlProductsList.length > 0){
        tempProductID = localShipmentByLadingObject.BOlProductsList[0].BOLProductID;
      }

      const prod : BOlProductsListSBL = {
        BOLProductID: tempProductID,
        Description: p.ProductDescription,
        Pallets: p.Pallets,
        Pieces: p.Pieces,
        Hazmat: p.HazMat,
        NMFC: p.NmfcNumber,
        Class: p.ProductClass,
        Weight: p.Weight,
        Height: p.Height,
        Lenght: p.Length,
        Width: p.Width,
        PackageTypeID: p.PackageTypeID,
        PCF: p.PCF,
        selectedProduct: {},
        Status: 2, // *
        SelectedProductClass: {},
        AddProductToParent: false, // *
        Stackable: p.Stackable,
        PortCode: 'C',
        HazmatContact: null,
        LadingID: localShipmentByLadingObject.LadingID
      }      

      productList.push(prod);
    });

    localShipmentByLadingObject.BOlProductsList = productList; // Update products

    // -- Update Origin and Destination fields
    localShipmentByLadingObject.OrgName = this.originAndDestinationFormGroup.get('originname').value;
    localShipmentByLadingObject.OrgAdr1 = this.originAndDestinationFormGroup.get('originadddress1').value;
    localShipmentByLadingObject.OrgAdr2 = this.originAndDestinationFormGroup.get('originadddress2').value;

    if (localShipmentByLadingObject.OrgZipCode !== this.OriginPostalData.PostalCode){
      localShipmentByLadingObject.OrgCity = Number(this.OriginPostalData.CityID);
      localShipmentByLadingObject.OrgState = Number(this.OriginPostalData.StateId);
      localShipmentByLadingObject.OrgCountry = Number(this.OriginPostalData.CountryId);
      localShipmentByLadingObject.OrgZip = Number(this.OriginPostalData.PostalID);      
    }

    localShipmentByLadingObject.OriginContactPerson = this.originAndDestinationFormGroup.get('origincontact').value;
    localShipmentByLadingObject.OriginContactPhone = this.originAndDestinationFormGroup.get('originphone').value;
    localShipmentByLadingObject.OriginEmail = this.originAndDestinationFormGroup.get('originemail').value;

    localShipmentByLadingObject.DestName = this.originAndDestinationFormGroup.get('destname').value;
    localShipmentByLadingObject.DestAdr1 = this.originAndDestinationFormGroup.get('destadddress1').value;
    localShipmentByLadingObject.DestAdr2 = this.originAndDestinationFormGroup.get('destadddress2').value;

    if (localShipmentByLadingObject.DestZipCode !== this.DestinationPostalData.PostalCode){
      localShipmentByLadingObject.DestCity = Number(this.DestinationPostalData.CityID);
      localShipmentByLadingObject.DestState = Number(this.DestinationPostalData.StateId);
      localShipmentByLadingObject.DestCountry = Number(this.DestinationPostalData.CountryId);
      localShipmentByLadingObject.DestZip = Number(this.DestinationPostalData.PostalID);
    }

    localShipmentByLadingObject.DestContactPerson = this.originAndDestinationFormGroup.get('destcontact').value;
    localShipmentByLadingObject.DestContactPhone = this.originAndDestinationFormGroup.get('destphone').value;
    localShipmentByLadingObject.DestEmail = this.originAndDestinationFormGroup.get('destemail').value;

    localShipmentByLadingObject.PickupDate = String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime());
    localShipmentByLadingObject.RequestedPickupTimeFrom = this.originAndDestinationFormGroup.get('originpickupopen').value;
    localShipmentByLadingObject.RequestedPickupTimeTo = this.originAndDestinationFormGroup.get('originpickupclose').value;   

    localShipmentByLadingObject.ExpectedDeliveryDate = String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('destexpdeldate').value.getTime());
    localShipmentByLadingObject.DeliveryAppointmentTimeFrom = this.originAndDestinationFormGroup.get('destdelapptfrom').value;
    localShipmentByLadingObject.DeliveryAppointmentTimeTo = this.originAndDestinationFormGroup.get('destdelapptto').value;   
    // --

    // -- Update Shipment Information fields
    localShipmentByLadingObject.EquipmentID = this.shipmentInfoFormGroup.get('equipment').value;
    localShipmentByLadingObject.ProNumber = this.shipmentInfoFormGroup.get('pronumber').value.trim();
    localShipmentByLadingObject.SplNotes = this.shipmentInfoFormGroup.get('specialinstructions').value;   
    localShipmentByLadingObject.Ref1Value = this.shipmentInfoFormGroup.get('customerref').value.trim();
    localShipmentByLadingObject.Ref2Value = this.shipmentInfoFormGroup.get('r2order').value.trim();
    localShipmentByLadingObject.Ref3Value = this.shipmentInfoFormGroup.get('r2pronumber').value.trim();
    localShipmentByLadingObject.PaymentTermID = this.shipmentInfoFormGroup.get('paymentterms').value;
    localShipmentByLadingObject.ShipmentValue = this.shipmentInfoFormGroup.get('shipmentvalue').value;
    localShipmentByLadingObject.ValuePerPound = this.shipmentInfoFormGroup.get('valueperpound').value;
    localShipmentByLadingObject.PriorityID = this.shipmentInfoFormGroup.get('priority').value;
	  localShipmentByLadingObject.ServiceLevelID = this.shipmentInfoFormGroup.get('servicelevel').value;
	  localShipmentByLadingObject.BrokerReferenceNo = this.shipmentInfoFormGroup.get('r2refno').value;
	  localShipmentByLadingObject.Mode = this.shipmentInfoFormGroup.get('mode').value;
    // --

    localShipmentByLadingObject.BillToPostalWithCity = this.clientDefaultData.BillToPostalCode + '-' +  this.clientDefaultData.BillToCity;
    localShipmentByLadingObject.OrgLocation = String.Format('{0},{1}{2}',this.OriginPostalData.CityName,this.OriginPostalData.StateCode,this.OriginPostalData.PostalCode);
    localShipmentByLadingObject.DestLocation =String.Format('{0},{1}{2}',this.DestinationPostalData.CityName,this.DestinationPostalData.StateCode,this.DestinationPostalData.PostalCode);
    localShipmentByLadingObject.DestPostalWithCity = this.DestinationPostalData.PostalCode + '-' + this.DestinationPostalData.CityName;
    localShipmentByLadingObject.OrgPostWithCity = this.OriginPostalData.PostalCode + '-' + this.OriginPostalData.CityName;

    localShipmentByLadingObject.OrgCountryCode = this.originSelectedCountry.CountryCode;
    localShipmentByLadingObject.DestCountryCode = this.destinationSelectedCountry.CountryCode;

    if ( this.countryList != null &&  this.countryList.length > 0){
      const filteredBillCountry = this.countryList.filter(country => country.CountryId === this.clientDefaultData.BillToCountry.toString());
      if (filteredBillCountry != null && filteredBillCountry.length > 0){
        localShipmentByLadingObject.BillToCountryCode = filteredBillCountry[0].CountryCode;
      }
    }
        
    const bolAccesorials: BOLAccesorialListSBL[] = [];
    this.accessorialArray.forEach(a => {
      let isSelectedAccesorial = false;
      const accesorialSelected = this.accessorials.filter(item => item.AccessorialID === a.AccessorialID);
      if (accesorialSelected != null && accesorialSelected.length > 0){
        isSelectedAccesorial = true;
      }

      const acc: BOLAccesorialListSBL = {
        AccesorialID: a.AccessorialID,
        IsAccesorial: isSelectedAccesorial
      }
      bolAccesorials.push(acc);
    })


    // this.accessorials.forEach(a => {
    //   const acc: BOLAccesorialListSBL = {
    //     AccesorialID: a.AccessorialID,
    //     IsAccesorial: true
    //   }
    //   bolAccesorials.push(acc);
    // })

    localShipmentByLadingObject.BOLAccesorialList = bolAccesorials;
    localShipmentByLadingObject.LoggedInUserId = this.UserIDLoggedIn;

    if (selectedRate != null && selectedRate.CarrierID != null){

      // -- accountInvoiceCostListBuyRates
      const accountInvoiceCostListBuyRates: AccountInvoiceCostListSBL[] = [];

      // -- accountInvoiceCostListSellRates
      const accountInvoiceCostListSellRates: AccountInvoiceCostListSBL[] = [];

      const filteredSelectRateAccessorials = selectedRate.Accessorials.filter(acc => acc.AccessorialCharge > 0);
      filteredSelectRateAccessorials.forEach(a => {

        let tempCostDetailID = 0;
        const filteredCostList = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.Description === a.AccessorialDescription);
        if (filteredCostList != null && filteredCostList.length > 0){
          tempCostDetailID = filteredCostList[0].CostDetailID;
        }

        const accountInvoiceCost: AccountInvoiceCostListSBL = {
          AccessorialID: a.AccessorialID,
          AccessorialCode: a.AccessorialCode,
          RatedCost: a.AccessorialCharge,
          BilledCost: a.AccessorialCharge,
          Description: a.AccessorialDescription,
          CostStatus: 1,
          CostDetailID: tempCostDetailID
        }
        accountInvoiceCostListBuyRates.push(accountInvoiceCost);

        let tempCostDetailIDSR = 0;
        const filteredCostListSR = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.Description === a.AccessorialDescription);
        if (filteredCostListSR != null && filteredCostListSR.length > 0){
          tempCostDetailIDSR = filteredCostListSR[0].CostDetailID;
        }

        const accountInvoiceCostSR: AccountInvoiceCostListSBL = {
          AccessorialID: a.AccessorialID,
          AccessorialCode: a.AccessorialCode,
          RatedCost: a.AccessorialCharge,
          BilledCost: a.AccessorialCharge,
          Description: a.AccessorialDescription,
          CostStatus: 1,
          CostDetailID: tempCostDetailIDSR
        }
        accountInvoiceCostListSellRates.push(accountInvoiceCostSR);
      });
        
      // Freight
      let FRTCostDetailID = 0;
      const filteredCostListFRT = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.AccessorialID === 22 && item.AccessorialCode === 'FRT');
      if (filteredCostListFRT != null && filteredCostListFRT.length > 0){
        FRTCostDetailID = filteredCostListFRT[0].CostDetailID;
      }
      const accountInvoiceFreight: AccountInvoiceCostListSBL = {
        AccessorialID: 22,
        RatedCost: selectedRate.GrossAmount,
        BilledCost: selectedRate.GrossAmount,
        Description: 'Freight',
        AccessorialCode: 'FRT',
        CostStatus: 1,
        CostDetailID: FRTCostDetailID
      }
      accountInvoiceCostListBuyRates.push(accountInvoiceFreight);
  
      // Fuel
      let FSCCostDetailID = 0;
      const filteredCostListFSC = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.AccessorialID === 23 && item.AccessorialCode === 'FSC');
      if (filteredCostListFSC != null && filteredCostListFSC.length > 0){
        FSCCostDetailID = filteredCostListFSC[0].CostDetailID;
      }
      const accountInvoiceFuel: AccountInvoiceCostListSBL = {
        AccessorialID: 23,
        RatedCost: selectedRate.FuelCost,
        BilledCost: selectedRate.FuelCost,
        Description: 'Fuel',
        AccessorialCode: 'FSC',
        CostStatus: 1,
        CostDetailID: FSCCostDetailID
      }
      accountInvoiceCostListBuyRates.push(accountInvoiceFuel);
  
      // Discount
      let DISCostDetailID = 0;
      const filteredCostListDIS = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.AccessorialID === 24 && item.AccessorialCode === 'DIS');
      if (filteredCostListDIS != null && filteredCostListDIS.length > 0){
        DISCostDetailID = filteredCostListDIS[0].CostDetailID;
      }
      const accountInvoiceDiscount: AccountInvoiceCostListSBL = {
        AccessorialID: 24,
        RatedCost: -1 * selectedRate.Discount,
        BilledCost: -1 * selectedRate.Discount,
        Description: 'Discount',
        AccessorialCode: 'DIS',
        CostStatus: 1,
        CostDetailID: DISCostDetailID
      }
      accountInvoiceCostListBuyRates.push(accountInvoiceDiscount);
      // --
        
      // Freight
      let FRTCostDetailIDSR = 0;
      const filteredCostListSRFRT = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.AccessorialID === 22 && item.AccessorialCode === 'FRT');
      if (filteredCostListSRFRT != null && filteredCostListSRFRT.length > 0){
        FRTCostDetailIDSR = filteredCostListSRFRT[0].CostDetailID;
      }
      const accountInvoiceFreightSR: AccountInvoiceCostListSBL = {
        AccessorialID: 22,
        RatedCost: selectedRate.GrossAmount,
        BilledCost: selectedRate.GrossAmount,
        Description: 'Freight',
        AccessorialCode: 'FRT',
        CostStatus: 1,
        CostDetailID: FRTCostDetailIDSR
      }
      accountInvoiceCostListSellRates.push(accountInvoiceFreightSR);
  
      // Fuel
      let FSCCostDetailIDSR = 0;
      const filteredCostListSRFSC = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.AccessorialID === 23 && item.AccessorialCode === 'FSC');
      if (filteredCostListSRFSC != null && filteredCostListSRFSC.length > 0){
        FSCCostDetailIDSR = filteredCostListSRFSC[0].CostDetailID;
      }
      const accountInvoiceFuelSR: AccountInvoiceCostListSBL = {
        AccessorialID: 23,
        RatedCost: selectedRate.FuelCost,
        BilledCost: selectedRate.FuelCost,
        Description: 'Fuel',
        AccessorialCode: 'FSC',
        CostStatus: 1,
        CostDetailID: FSCCostDetailIDSR
      }
      accountInvoiceCostListSellRates.push(accountInvoiceFuelSR);
  
      // Discount
      let DISCostDetailIDSR = 0;
      const filteredCostListSRDIS = this.ShipmentCostObject.SellRates.AccountInvoiceCostList.filter(item => item.AccessorialID === 24 && item.AccessorialCode === 'DIS');
      if (filteredCostListSRDIS != null && filteredCostListSRDIS.length > 0){
        DISCostDetailIDSR = filteredCostListSRDIS[0].CostDetailID;
      }
      const accountInvoiceDiscountSR: AccountInvoiceCostListSBL = {
        AccessorialID: 24,
        RatedCost: -1 * selectedRate.Discount,
        BilledCost: -1 * selectedRate.Discount,
        Description: 'Discount',
        AccessorialCode: 'DIS',
        CostStatus: 1,
        CostDetailID: DISCostDetailIDSR
      }
      accountInvoiceCostListSellRates.push(accountInvoiceDiscountSR);
      // --
  
      // -- Sell and Buy rates
      localShipmentByLadingObject.SellRates.SCAC = selectedRate.CarrierID;
      localShipmentByLadingObject.SellRates.CarrierName = selectedRate.CarrierName;
      localShipmentByLadingObject.BuyRates.AccountInvoiceCostList = accountInvoiceCostListBuyRates;   
      localShipmentByLadingObject.SellRates.AccountInvoiceCostList = accountInvoiceCostListSellRates;   
                   
      localShipmentByLadingObject.SellRates.BolNumber = this.ShipmentCostObject.SellRates.BolNumber;
      localShipmentByLadingObject.SellRates.CarrierName = selectedRate.CarrierName;
      localShipmentByLadingObject.SellRates.CrAcID = this.ShipmentCostObject.SellRates.CrAcID;
      localShipmentByLadingObject.SellRates.DrAcID = this.ShipmentCostObject.SellRates.DrAcID;
      localShipmentByLadingObject.SellRates.InvDetailID = this.ShipmentCostObject.SellRates.InvDetailID;
      localShipmentByLadingObject.SellRates.SCAC = selectedRate.CarrierID;      
      localShipmentByLadingObject.SellRates.SaasRefID = this.ShipmentCostObject.SellRates.SaasRefID;
      localShipmentByLadingObject.SellRates.ShipDate = this.ShipmentCostObject.SellRates.ShipDate;
      localShipmentByLadingObject.SellRates.TotalBilledAmount = selectedRate.TotalCost; // this.ShipmentCostObject.SellRates.TotalBilledAmount;
      localShipmentByLadingObject.SellRates.TotalPaidAmount = this.ShipmentCostObject.SellRates.TotalPaidAmount;
      localShipmentByLadingObject.SellRates.TotalRatedCost = selectedRate.TotalCost; // this.ShipmentCostObject.SellRates.TotalRatedCost;
      localShipmentByLadingObject.SellRates.UserId = this.ShipmentCostObject.SellRates.UserId;
      localShipmentByLadingObject.SellRates.VoucherTypeID = this.ShipmentCostObject.SellRates.VoucherTypeID;
      localShipmentByLadingObject.SellRates.QuoteAmt = this.ShipmentCostObject.SellRates.QuoteAmt;
      localShipmentByLadingObject.SellRates.InvoiceAmt = this.ShipmentCostObject.SellRates.InvoiceAmt;
      localShipmentByLadingObject.SellRates.IsApprove = this.ShipmentCostObject.SellRates.IsApprove;
      localShipmentByLadingObject.SellRates.IsSynchronized = this.ShipmentCostObject.SellRates.IsSynchronized;
      
      localShipmentByLadingObject.BuyRates.BolNumber = this.ShipmentCostObject.BuyRates.BolNumber;
      localShipmentByLadingObject.BuyRates.CarrierName = selectedRate.CarrierName;
      localShipmentByLadingObject.BuyRates.CrAcID = this.ShipmentCostObject.BuyRates.CrAcID;
      localShipmentByLadingObject.BuyRates.DrAcID = this.ShipmentCostObject.BuyRates.DrAcID;
      localShipmentByLadingObject.BuyRates.InvDetailID = this.ShipmentCostObject.BuyRates.InvDetailID;
      localShipmentByLadingObject.BuyRates.SCAC = selectedRate.CarrierID;
      localShipmentByLadingObject.BuyRates.SaasRefID = this.ShipmentCostObject.BuyRates.SaasRefID;
      localShipmentByLadingObject.BuyRates.ShipDate = this.ShipmentCostObject.BuyRates.ShipDate;
      localShipmentByLadingObject.BuyRates.TotalBilledAmount = selectedRate.TotalCost; // this.ShipmentCostObject.BuyRates.TotalBilledAmount;
      localShipmentByLadingObject.BuyRates.TotalPaidAmount = this.ShipmentCostObject.BuyRates.TotalPaidAmount;
      localShipmentByLadingObject.BuyRates.TotalRatedCost = selectedRate.TotalCost; // this.ShipmentCostObject.BuyRates.TotalRatedCost;
      localShipmentByLadingObject.BuyRates.UserId = this.ShipmentCostObject.BuyRates.UserId;
      localShipmentByLadingObject.BuyRates.VoucherTypeID = this.ShipmentCostObject.BuyRates.VoucherTypeID;
      localShipmentByLadingObject.BuyRates.QuoteAmt = this.ShipmentCostObject.BuyRates.QuoteAmt;
      localShipmentByLadingObject.BuyRates.InvoiceAmt = this.ShipmentCostObject.BuyRates.InvoiceAmt;
      localShipmentByLadingObject.BuyRates.IsApprove = this.ShipmentCostObject.BuyRates.IsApprove;
      localShipmentByLadingObject.BuyRates.IsSynchronized = this.ShipmentCostObject.BuyRates.IsSynchronized;
      // --

      localShipmentByLadingObject.CarrierCode = selectedRate.CarrierID;
      localShipmentByLadingObject.CarrierName = selectedRate.CarrierName;
      localShipmentByLadingObject.TransTime = selectedRate.TransitTime;
      localShipmentByLadingObject.CarrierType = selectedRate.CarrierType;
      
      localShipmentByLadingObject.ShipCost = selectedRate.TotalCost;
      localShipmentByLadingObject.FreightCost = selectedRate.FreightCost;
      localShipmentByLadingObject.FuelCost = selectedRate.FuelCost;
      localShipmentByLadingObject.AccsCost = selectedRate.TotalAccCost;

      localShipmentByLadingObject.OriginTerminalName = selectedRate.OriginTerminalName;
      localShipmentByLadingObject.OriginTerminalAdd1 = selectedRate.OriginTerminalAddress1;
      localShipmentByLadingObject.OriginTerminalAdd2 = selectedRate.OriginTerminalAddress2;
      localShipmentByLadingObject.OriginTerminalCity = selectedRate.OriginTerminalCity;
      localShipmentByLadingObject.OriginTerminalState = selectedRate.OriginTerminalState;
      localShipmentByLadingObject.OriginTerminalZip = selectedRate.OriginTerminalZip;
      localShipmentByLadingObject.OriginTerminalContactPerson = selectedRate.OriginTerminalContactName;
      localShipmentByLadingObject.OriginTerminalFreePhone = selectedRate.OriginTerminalFreePhone;
      localShipmentByLadingObject.OriginTerminalPhone = selectedRate.OriginTerminalPhoneNo;
      localShipmentByLadingObject.OriginTerminalEmail = selectedRate.OriginTerminalEmail;
      localShipmentByLadingObject.DestTerminalName = selectedRate.DestTerminalName;
      localShipmentByLadingObject.DestTerminalAdd1 = selectedRate.DestTerminalAddress1;
      localShipmentByLadingObject.DestTerminalAdd2 = selectedRate.DestTerminalAddress2;
      localShipmentByLadingObject.DestTerminalCity = selectedRate.DestTerminalCity;
      localShipmentByLadingObject.DestTerminalState = selectedRate.DestTerminalState;
      localShipmentByLadingObject.DestTerminalZip = selectedRate.DestTerminalZip;
      localShipmentByLadingObject.DestTerminalContactPerson = selectedRate.DestTerminalContactName;
      localShipmentByLadingObject.DestTerminalFreePhone = selectedRate.DestTerminalFreePhone;
      localShipmentByLadingObject.DestTerminalPhone = selectedRate.DestTerminalPhoneNo;
      localShipmentByLadingObject.DestTerminalEmail = selectedRate.DestTerminalEmail;
      localShipmentByLadingObject.OriginTerminalFax = selectedRate.OriginTerminalFaxNo;
      localShipmentByLadingObject.DestTerminalFax = selectedRate.DestTerminalFaxNo;
      localShipmentByLadingObject.ServiceLevelName = selectedRate.ServiceLevel;
      localShipmentByLadingObject.ServiceLevelCode = selectedRate.SaasServiceLevelCode;
      localShipmentByLadingObject.RatingResultId = selectedRate.RatingResultId;
      localShipmentByLadingObject.QuoteNumber = selectedRate.QuoteNumber;
      localShipmentByLadingObject.Miles = selectedRate.LaneWiseMiles;
      localShipmentByLadingObject.RefNo = selectedRate.ReferenceNo;
      localShipmentByLadingObject.SellProfileID = selectedRate.ProfileID;
      localShipmentByLadingObject.CostWithCustomerPercentage = selectedRate.CostWithCustomerPercentage,
	    localShipmentByLadingObject.orgTerminalCityStateZipCode = String.Format('{0},{1},{2}',selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode);
      localShipmentByLadingObject.destTerminalCityStateZipCode = String.Format('{0},{1},{2}',selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode);

    }else{
      localShipmentByLadingObject.SellRates.AccountInvoiceCostList = this.ShipmentCostObject.SellRates.AccountInvoiceCostList;                     
      localShipmentByLadingObject.SellRates.BolNumber = this.ShipmentCostObject.SellRates.BolNumber;
      localShipmentByLadingObject.SellRates.CarrierName = this.ShipmentCostObject.SellRates.CarrierName;
      localShipmentByLadingObject.SellRates.CrAcID = this.ShipmentCostObject.SellRates.CrAcID;
      localShipmentByLadingObject.SellRates.DrAcID = this.ShipmentCostObject.SellRates.DrAcID;
      localShipmentByLadingObject.SellRates.InvDetailID = this.ShipmentCostObject.SellRates.InvDetailID;
      localShipmentByLadingObject.SellRates.SCAC = this.ShipmentCostObject.SellRates.SCAC;
      localShipmentByLadingObject.SellRates.SaasRefID = this.ShipmentCostObject.SellRates.SaasRefID;
      localShipmentByLadingObject.SellRates.ShipDate = this.ShipmentCostObject.SellRates.ShipDate;
      localShipmentByLadingObject.SellRates.TotalBilledAmount = this.ShipmentCostObject.SellRates.TotalBilledAmount;
      localShipmentByLadingObject.SellRates.TotalPaidAmount = this.ShipmentCostObject.SellRates.TotalPaidAmount;
      localShipmentByLadingObject.SellRates.TotalRatedCost = this.ShipmentCostObject.SellRates.TotalRatedCost;
      localShipmentByLadingObject.SellRates.UserId = this.ShipmentCostObject.SellRates.UserId;
      localShipmentByLadingObject.SellRates.VoucherTypeID = this.ShipmentCostObject.SellRates.VoucherTypeID;
      localShipmentByLadingObject.SellRates.QuoteAmt = this.ShipmentCostObject.SellRates.QuoteAmt;
      localShipmentByLadingObject.SellRates.InvoiceAmt = this.ShipmentCostObject.SellRates.InvoiceAmt;
      localShipmentByLadingObject.SellRates.IsApprove = this.ShipmentCostObject.SellRates.IsApprove;
      localShipmentByLadingObject.SellRates.IsSynchronized = this.ShipmentCostObject.SellRates.IsSynchronized;

      localShipmentByLadingObject.BuyRates.AccountInvoiceCostList = this.ShipmentCostObject.BuyRates.AccountInvoiceCostList;
      localShipmentByLadingObject.BuyRates.BolNumber = this.ShipmentCostObject.BuyRates.BolNumber;
      localShipmentByLadingObject.BuyRates.CarrierName = this.ShipmentCostObject.BuyRates.CarrierName;
      localShipmentByLadingObject.BuyRates.CrAcID = this.ShipmentCostObject.BuyRates.CrAcID;
      localShipmentByLadingObject.BuyRates.DrAcID = this.ShipmentCostObject.BuyRates.DrAcID;
      localShipmentByLadingObject.BuyRates.InvDetailID = this.ShipmentCostObject.BuyRates.InvDetailID;
      localShipmentByLadingObject.BuyRates.SCAC = this.ShipmentCostObject.BuyRates.SCAC;
      localShipmentByLadingObject.BuyRates.SaasRefID = this.ShipmentCostObject.BuyRates.SaasRefID;
      localShipmentByLadingObject.BuyRates.ShipDate = this.ShipmentCostObject.BuyRates.ShipDate;
      localShipmentByLadingObject.BuyRates.TotalBilledAmount = this.ShipmentCostObject.BuyRates.TotalBilledAmount;
      localShipmentByLadingObject.BuyRates.TotalPaidAmount = this.ShipmentCostObject.BuyRates.TotalPaidAmount;
      localShipmentByLadingObject.BuyRates.TotalRatedCost = this.ShipmentCostObject.BuyRates.TotalRatedCost;
      localShipmentByLadingObject.BuyRates.UserId = this.ShipmentCostObject.BuyRates.UserId;
      localShipmentByLadingObject.BuyRates.VoucherTypeID = this.ShipmentCostObject.BuyRates.VoucherTypeID;
      localShipmentByLadingObject.BuyRates.QuoteAmt = this.ShipmentCostObject.BuyRates.QuoteAmt;
      localShipmentByLadingObject.BuyRates.InvoiceAmt = this.ShipmentCostObject.BuyRates.InvoiceAmt;
      localShipmentByLadingObject.BuyRates.IsApprove = this.ShipmentCostObject.BuyRates.IsApprove;
      localShipmentByLadingObject.BuyRates.IsSynchronized = this.ShipmentCostObject.BuyRates.IsSynchronized;

    }

    // -- Validate if no buy rates are set up so put same rates from sell rates
    if (localShipmentByLadingObject.BuyRates.AccountInvoiceCostList === null || localShipmentByLadingObject.BuyRates.AccountInvoiceCostList.length === 0){
      localShipmentByLadingObject.BuyRates.AccountInvoiceCostList = localShipmentByLadingObject.SellRates.AccountInvoiceCostList;
    }
    // --
    
    // Set error interceptor variable to false as default
    this.authenticationService.requestFailed$.next(false);

    if (ModifiedQuote){
      try{
        const responseData = await this.httpService.ModifiedQuoteWithLadingData(localShipmentByLadingObject);
        if (!this.authenticationService.requestFailed$.value){
          this.messageService.SendQuoteParameter(localShipmentByLadingObject.ClientLadingNo);
          this.messageService.SendLadingIDParameter(localShipmentByLadingObject.LadingID.toString());
          this.snackbar.open('Lading quote has been modified', null, {
            duration: 5000
          });
          this.router.navigate(['../../../shipmentboard/LTLTL/'], { relativeTo: this.route });
        }else{
          this.authenticationService.requestFailed$.next(false);
          this.snackbar.open('Error setting the record as modified.', null, {
            duration: 5000
          });
        }      
      }catch(e){
        this.authenticationService.requestFailed$.next(false);
        this.snackbar.open('Error setting the record as modified.', null, {
          duration: 5000
        });
      }

      return;
    }

    try{
      const responseData = await this.httpService.UpdateBOLHDR(localShipmentByLadingObject);
      if (!this.authenticationService.requestFailed$.value){
        this.messageService.SendQuoteParameter(localShipmentByLadingObject.ClientLadingNo);
        this.messageService.SendLadingIDParameter(localShipmentByLadingObject.LadingID.toString());
        if (!bookShipment){
          // this.snackbar.open('Quote saved successfully', null, {
          //   duration: 5000
          // });
          this.openDialog(false, 'Quote saved successfully. Quote Number: ' + localShipmentByLadingObject.ClientLadingNo + '. ' + (objRateSelected.rateSelectedAction === 4 ? 'Email has been sent.' : ''), null, 
          'QuoteSavedAndRedirectToBoard', null, null, null);
  
          switch (objRateSelected.rateSelectedAction) {
            case 3: // print quote
              const ratequotePrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintQuoteHandler.ashx?LadingID={0}&Ticket={1}',
              localShipmentByLadingObject.LadingID,this.securityToken);
              window.open(ratequotePrintURL, '_blank');
              break;
            case 4: // email quote
              let emailBOLParameters: SendEmailParameters;
  
              const invoiceParameter: InvoiceParameter = {
                InvoiceDetailIDs: []
              };
      
              emailBOLParameters = {
                ClientID: this.ClientID,
                CarrierID : selectedRate.CarrierID,
                ApplicationID: 56,
                EventID: 39,
                EmailAddresses: objRateSelected.keyValue,
                LadingID: localShipmentByLadingObject.LadingID,
                UserRowID: 1,
                InvoiceParameter: invoiceParameter,
                LadingIDs: [],
              }
      
              this.httpService.SendEmailManually(emailBOLParameters);
              break;
          } 

        }else{
          this.openDialog(false, 'Shipment Booked with LoadNo: ' + localShipmentByLadingObject.LadingID.toString() + '. ', null, 'ShipmentBooked');
          const bolPrintURL = String.Format(environment.baseEndpoint + 'Handlers/PrintBOLHandler.ashx?LadingID={0}&ClientID={1}&Ticket={2}',
          localShipmentByLadingObject.LadingID.toString(),this.ClientID.toString(), this.securityToken);        
          window.open(bolPrintURL, '_blank');  
        }
      }else{
        this.authenticationService.requestFailed$.next(false);
        this.snackbar.open('Error updating the record.', null, {
          duration: 5000
        });
      }      
    }catch(e){
      this.authenticationService.requestFailed$.next(false);
      this.snackbar.open('Error updating the record.', null, {
        duration: 5000
      });
    }        

    this.showSpinner = false;

  }


  CheckAllRequiredFields(){
    let RequiredFieldsValidationObj = {
      showWarningMessage: false,
      message: '',
      isConfirmDialog: false,
      yesNoActions: false,
      actionEvent: ''
    }
    
    let counter = 0;
    this.stepper._steps.forEach(step => {
      if (step.hasError){
        counter += 1;
      }
    });

    // let message;
    if (counter > 0){
      RequiredFieldsValidationObj.showWarningMessage = true;
      RequiredFieldsValidationObj.message = 'Please complete all required fields.';
      RequiredFieldsValidationObj.isConfirmDialog = false;     
    }else if(this.costListFiltered == null || this.costListFiltered.length === 0){
      RequiredFieldsValidationObj.showWarningMessage = true;
      RequiredFieldsValidationObj.message = 'Please rate the shipment first.';
      RequiredFieldsValidationObj.isConfirmDialog = false;     
    }else{
      const fieldsHaveChanged = this.validateIfFieldsHaveChanged();
      if (fieldsHaveChanged){
        RequiredFieldsValidationObj.showWarningMessage = true;
        RequiredFieldsValidationObj.message = 'You have modified some value(s) that may affect the rate of this shipment. If you do not click re-rate this may delay booking of this load and/or the quoted amount of this shipment. Do you want to re-rate?';
        RequiredFieldsValidationObj.isConfirmDialog = true;
        RequiredFieldsValidationObj.yesNoActions = true;
        RequiredFieldsValidationObj.actionEvent = 'ReRate';
      }  
    }

    return RequiredFieldsValidationObj;
  }

  ConverteJsonDateToLocalTimeZone(JsonDate: string) {
    let d = new Date();
    let ShipDate;
    let offset = d.getTimezoneOffset();

    let JsonDateDate;
    if (JsonDate.toString().indexOf('Date(') === -1) {
        JsonDateDate = new Date(JsonDate);
        JsonDateDate = JsonDateDate.getTime();

        JsonDateDate = parseInt(offset.toString()) * 60000 * (-1) + parseInt(JsonDate);

        JsonDateDate = '\/Date(' + JsonDate.toString() + ')\/';
    }

    if (JsonDate.toString().indexOf('-') !== -1) {

        let timeoffsetfromservicedate = JsonDate.toString().substring(JsonDate.toString().indexOf('-') + 1, JsonDate.toString().indexOf(')/'));

        let leftOffSetHour = parseInt(timeoffsetfromservicedate.toString().substring(0, 2)) * 60;
        let offsethour = parseInt(leftOffSetHour.toString()) + parseInt(timeoffsetfromservicedate.toString().substring(2, 4));

        let totalmillsecond = parseInt(offset.toString()) * 60000 + parseInt(parseInt(JsonDate.toString().substring(6)).toString()) - parseInt(offsethour.toString()) * 60000;

        ShipDate = new Date(totalmillsecond);
    }
    else {
        let totalmillsecond;
        if (JsonDate.toString().indexOf('+') > 0) {

            let timeoffsetfromservicedate = JsonDate.toString().substring(JsonDate.toString().indexOf('+') + 1, JsonDate.toString().indexOf(')/'));

            let leftoffsethour = parseInt(timeoffsetfromservicedate.toString().substring(0, 2)) * 60;
            let offsethour = parseInt(leftoffsethour.toString()) + parseInt(timeoffsetfromservicedate.toString().substring(2, 4));

            totalmillsecond = parseInt(offset.toString()) * 60000 + parseInt(parseInt(JsonDate.toString().substring(6)).toString()) + parseInt(offsethour.toString()) * 60000;

            ShipDate = new Date(totalmillsecond);
        }
        else {
            totalmillsecond = parseInt(parseInt(JsonDate.toString().substring(6)).toString());


            let utcMonth = new Date(totalmillsecond).getUTCMonth() + 1;
            let utcDay = new Date(totalmillsecond).getUTCDate();
            let utcYear = new Date(totalmillsecond).getUTCFullYear()

            let formatedUtcShipDate = utcMonth + '/' + utcDay + '/' + utcYear;

            ShipDate = new Date(formatedUtcShipDate);
        }

    }


    let getMonth = ShipDate.getMonth() + 1;
    let getDay = ShipDate.getDate();
    let getYear = ShipDate.getFullYear()

    let formatedShipDate = getMonth + '/' + getDay + '/' + getYear;
    return formatedShipDate;
  } 

  EstimateClassFromPCF(pCF) {

    var PCF = pCF;
    var newClass = 0;
    
    if (PCF < 1)
        newClass = 500;
    if (PCF >= 1 && PCF < 2)
        newClass = 400;
    if (PCF >= 2 && PCF < 3)
        newClass = 300;
    if (PCF >= 3 && PCF < 4)
        newClass = 250;
    if (PCF >= 4 && PCF < 5)
        newClass = 200;
    if (PCF >= 5 && PCF < 6)
        newClass = 175;
    if (PCF >= 6 && PCF < 7)
        newClass = 150;
    if (PCF >= 7 && PCF < 8)
        newClass = 125;
    if (PCF >= 8 && PCF < 9)
        newClass = 110;
    if (PCF >= 9 && PCF < 10.5)
        newClass = 100;
    if (PCF >= 10.5 && PCF < 12)
        newClass = 92.5;
    if (PCF >= 12 && PCF < 13.5)
        newClass = 85;
    if (PCF >= 13.5 && PCF < 15)
        newClass = 77.5;
    if (PCF >= 15 && PCF < 22.5)
        newClass = 70;
    if (PCF >= 22.5 && PCF < 30)
        newClass = 65;
    if (PCF >= 30 && PCF < 35)
        newClass = 60;
    if (PCF >= 35 && PCF < 50)
        newClass = 55;
    if (PCF >= 50)
        newClass = 50;

    return newClass;
  } 

  ConvertTime12HoursTo24Hours(InputTime) {
    let NewTime = 0;

    const Time = parseInt(InputTime.substr(0, 2));
    const meridiem = InputTime.slice(-2);


    if (meridiem === "AM" && Time === 12) {
        NewTime = 0;
    }
    else {
        NewTime = Time;
    }
    if (meridiem === "PM") {
        NewTime = Time + 12;
    }

    return NewTime;
  }

  PickupTwoHoursAndAfterOnePMValidations() {
    let warningMessage = '';
      
    const fromTime = this.ConvertTime12HoursTo24Hours(this.originAndDestinationFormGroup.get('originpickupopen').value);
    const ToTime = this.ConvertTime12HoursTo24Hours(this.originAndDestinationFormGroup.get('originpickupclose').value);
                 
        if (fromTime < ToTime) {
          const diffTime = ToTime - fromTime;
            if (diffTime < 2) {    
              warningMessage = 'Scheduled Pickups Require a Minimum 2-Hour Window Between Pickup Open Time & Pickup Close Time';                
            }
            else if (fromTime > 13) {
                warningMessage = 'Same day pickup requests scheduled after 1:00 PM relevant to the pickup location could miss pickup and be rescheduled for the following business day. To Confirm Equipment Availability please contact your account representative.';                            
            }           
        }
        else if (fromTime > 13) {
            warningMessage = 'Same day pickup requests scheduled after 1:00 PM relevant to the pickup location could miss pickup and be rescheduled for the following business day. To Confirm Equipment Availability please contact your account representative.';          
        }  
        
    return warningMessage;
    
  }  

}
