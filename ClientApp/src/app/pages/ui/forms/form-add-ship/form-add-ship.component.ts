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
import { ConfirmAlertDialogComponent } from '../confirm-alert-dialog/confirm-alert-dialog.component';
import { SaveQuoteParameters,BOlProductsList,BOLAccesorial,SellRate,AccountInvoiceCost } from '../../../../Entities/SaveQuoteParameters';
import { SaveQuoteData,BOlProductsListSQD,BOLAccesorialListSQD,AccountInvoiceCostListSQD, SellRatesSQD } from '../../../../Entities/SaveQuoteData';


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
    private dialog: MatDialog
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

  @ViewChild(MatAccordion) accordion: MatAccordion;

  accessorials: AccessorialBase[] = [];
  accessorialIds: number[] = [];
  serviceLevels: ServiceLevel[] = [];
  rates: Rate[];
  ratesFiltered: Rate[];
  ratesCounter = 0;
  clientTLWeightLimit: string;
  clientDefaultData: ClientDefaultData;
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

  addProductFormGroup(): FormGroup{
    return this.fb.group({
      Pallets: [null, Validators.required],
      Pieces: [null],
      PackageTypeID: [3],
        ProductClass: [null, Validators.required],
        NmfcNumber: [null, Validators.required],
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
      originemail: [null],
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
      destemail: [null],
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
      r2pronumber: [null],
      paymentterms: [5],
      shipmentinfo: [null],
      pronumber: [null],
      mode: ['LTL', Validators.required],
      shipmentvalue: [null],
      valueperpound: [null],
      os_d: [null],
      servicelevel: [1, Validators.required],
      r2refno: [null],
      statuscode: [null],
      specialinstructions: [null],
      internalnote: [null]
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

      if ( this.AccountInvoiceCostList != null &&  this.AccountInvoiceCostList.length > 0){
        this.costListFiltered =  this.AccountInvoiceCostList.filter(item => item.AccessorialCode != null && item.AccessorialCode !== '');
      }

      this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';
      this.TotalShipmentCost = this.ShipmentCostObject.SellRates.TotalBilledAmount;
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
      this.openDialog(RequiredFieldsValidationObj.isConfirmDialog, RequiredFieldsValidationObj.message);
    }else {
      this.snackbar.open('Shipment booked.', null, {
        duration: 5000
      });
    }        
  }

  addNewInternalNote(): void {
    const note = {
      NoteId: (this.internalNotes as InternalNote[]).length + 1,
      UserId: this.UserIDLoggedIn,
      UserName: 'Admin',
      NoteText: this.shipmentInfoFormGroup.get('internalnote').value.trim(),
      Date: new Date()
    };

    this.internalNotes.push(note);
    this.shipmentInfoFormGroup.get('internalnote').setValue('');
    this.showInternalNotesTitle = true;
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
    if (this.ServiceLevelOptions != null && this.ServiceLevelOptions.length > 0){
      const item = this.ServiceLevelOptions.filter(item => item.ServiceLevelID == serviceLevelId);
      if (item != null){
        serviceLevelDescription = item[0].Description;
      }
    }
    this.serviceLevelDescriptionSelected = serviceLevelDescription;
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
        AccessorialCode: a.AccesorialCode
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

    this.getQuoteButtonClicked = true;
    this.showSpinner = true;
    const test = await this.getShipmentRates();
    this.confirmFormGroup.get('carrier').setValue('');
    this.showSpinner = false;
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
      ProfileID: 11868,
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
      ServiceLevelCodes: [],
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

    this.rates = await this.ratesService.postRates(objRate);
    // console.log( this.rates);    
    if ( this.rates != null &&  this.rates.length > 0){
      this.ratesFiltered =  this.rates.filter(rate => rate.CarrierCost > 0);
      console.log(this.ratesFiltered);
      this.ratesCounter = this.ratesFiltered.length;
      this.snackbar.open(this.ratesCounter + ' rates retuned.', null, {
        duration: 5000
      });


      this.rates.forEach(r => {
        if (!String.IsNullOrWhiteSpace(r.TransitTime)){
          let today = new Date();
          const days: number = +r.TransitTime;
          today = this.utilitiesService.AddBusinessDays(today, days);
          r.ETA = String.Format('{0} (ETA)', this.datepipe.transform(today,'yyyy-MM-dd'));
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

      const accessorials = selectedRate.Accessorials.filter(item => item.AccessorialCode != null && item.AccessorialCode !== '');
      accessorials.forEach(a => {
        const accessorialInvoice: AccountInvoiceCostList = {
          AccessorialCode: a.AccessorialCode,
          Description: a.AccessorialDescription,
          BilledCost: a.AccessorialCharge
        }

        this.costListFiltered.push(accessorialInvoice);
      });

      this.TotalShipmentCost = selectedRate.TotalCostWithOutTrueCost;
      this.confirmFormGroup.get('carrier').setValue(selectedRate.CarrierName);
    }



  }

  async saveQuote(index: number){
    // await this.save(index);
    // this.router.navigate(['../shipmentboard/LTLTL/'], { relativeTo: this.route });
  }

  onChangeProductWeight(index: number): void{
    const product = this.productsAndAccessorialsFormGroup.get('products').value[index];
    const PCF = this.calculatePCF(product.Pallets, product.Length, product.Width, product.Height, product.Weight);
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

  setDefaultValuesInSteps() {
    let defaultoriginpostalcode = null;
    let defaultoriginstatename = null;
    let defaultpickupdate = null;
    let defaultdestpostalcode = null;
    let defaultdeststatename = null;
    let defaultDestExpDelDate = null;

    if (this.ShipmentByLadingObject == null){
      return;
    }        

    defaultoriginpostalcode = this.ShipmentByLadingObject.OrgZipCode.trim() + '-' + this.ShipmentByLadingObject.OrgCityName.trim();
    defaultoriginstatename = this.ShipmentByLadingObject.OrgStateName.trim();

    const tempPickupDate = moment.utc(this.ShipmentByLadingObject.PickupDate);
    defaultpickupdate = new Date(this.datepipe.transform(tempPickupDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy'));

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

    this.originAndDestinationFormGroup.controls.originname.setValue(this.ShipmentByLadingObject.OrgName, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originadddress1.setValue(this.ShipmentByLadingObject.OrgAdr1, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originadddress2.setValue(this.ShipmentByLadingObject.OrgAdr2, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.origincountry.setValue(this.ShipmentByLadingObject.OrgCountry, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.origincontact.setValue(this.ShipmentByLadingObject.OriginContactPerson, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originphone.setValue(this.ShipmentByLadingObject.OriginContactPhone, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originemail.setValue(this.ShipmentByLadingObject.OriginEmail, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.originpickupopen.setValue(this.ShipmentByLadingObject.RequestedPickupTimeFrom != null
      && this.ShipmentByLadingObject.RequestedPickupTimeFrom !== '' ? this.ShipmentByLadingObject.RequestedPickupTimeFrom : null,
      {onlySelf: false});
      this.originAndDestinationFormGroup.controls.originpickupclose.setValue(this.ShipmentByLadingObject.RequestedPickupTimeTo != null
        && this.ShipmentByLadingObject.RequestedPickupTimeTo !== '' ? this.ShipmentByLadingObject.RequestedPickupTimeTo : null,
        {onlySelf: false});

    this.originAndDestinationFormGroup.controls.destname.setValue(this.ShipmentByLadingObject.DestName, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destadddress1.setValue(this.ShipmentByLadingObject.DestAdr1, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destadddress2.setValue(this.ShipmentByLadingObject.DestAdr2, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destcountry.setValue(this.ShipmentByLadingObject.DestCountry, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destcontact.setValue(this.ShipmentByLadingObject.DestContactPerson, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destphone.setValue(this.ShipmentByLadingObject.DestContactPhone, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destemail.setValue(this.ShipmentByLadingObject.DestEmail, {onlySelf: false});


    const tempDestExpDelDate = moment.utc(this.ShipmentByLadingObject.PickupDate);
    defaultDestExpDelDate = new Date(this.datepipe.transform(tempDestExpDelDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy'));
    this.originAndDestinationFormGroup.controls.destexpdeldate.setValue(defaultDestExpDelDate, {onlySelf: false});
    
    this.originAndDestinationFormGroup.controls.destdelapptfrom.setValue(this.ShipmentByLadingObject.DeliveryAppointmentTimeFrom, {onlySelf: false});
    this.originAndDestinationFormGroup.controls.destdelapptto.setValue(this.ShipmentByLadingObject.DeliveryAppointmentTimeTo, {onlySelf: false});

    // --

    // -- Set values for Shipment Info fields    
    this.shipmentInfoFormGroup.get('equipment').setValue(this.ShipmentByLadingObject.EquipmentID == null ? 7 : this.ShipmentByLadingObject.EquipmentID); //-- need to check this one
    this.shipmentInfoFormGroup.get('priority').setValue(this.ShipmentByLadingObject.PriorityID == null ? 0 : this.ShipmentByLadingObject.PriorityID); //-- need to check this one
    this.shipmentInfoFormGroup.get('servicelevel').setValue(this.ShipmentByLadingObject.ServiceLevelID == null ? 1 : this.ShipmentByLadingObject.ServiceLevelID);
    this.shipmentInfoFormGroup.get('paymentterms').setValue(this.ShipmentByLadingObject.PaymentTermID == null ? 5 : this.ShipmentByLadingObject.PaymentTermID); //-- need to check this one
    this.shipmentInfoFormGroup.get('mode').setValue(this.ShipmentByLadingObject.Mode == null ? 'LTL' : this.ShipmentByLadingObject.Mode);    
    this.shipmentInfoFormGroup.controls.customerref.setValue(this.ShipmentByLadingObject.Ref1Value, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.r2order.setValue(this.ShipmentByLadingObject.Ref2Value, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.r2pronumber.setValue(this.ShipmentByLadingObject.Ref3Value, {onlySelf: false});    
    this.shipmentInfoFormGroup.controls.shipmentvalue.setValue(this.ShipmentByLadingObject.ShipmentValue, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.valueperpound.setValue(this.ShipmentByLadingObject.ValuePerPound, {onlySelf: false});   
    this.shipmentInfoFormGroup.controls.shipmentinfo.setValue(this.ShipmentByLadingObject.TrackingNumber, {onlySelf: false});
    this.shipmentInfoFormGroup.controls.pronumber.setValue(this.ShipmentByLadingObject.ProNumber, {onlySelf: false});    
    this.shipmentInfoFormGroup.controls.r2refno.setValue(this.ShipmentByLadingObject.BrokerReferenceNo, {onlySelf: false});    
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
        (this.productsAndAccessorialsFormGroup.controls.products as FormArray).at(currentProductIndex).get('ProductDescription').setValue(p.Description);

        counter += 1;
      });
    }

    if (this.ShipmentByLadingObject.BOLAccesorialList != null && this.ShipmentByLadingObject.BOLAccesorialList.length > 0){
      this.ShipmentByLadingObject.BOLAccesorialList.forEach(BOLAccesorial => {
        this.accessorialArray.forEach(AvailableAccesorial => {
          if (BOLAccesorial.AccesorialID == AvailableAccesorial.AccessorialID){
            const accessorial: AccessorialBase = {
              AccessorialID: AvailableAccesorial.AccessorialID,
              AccessorialCode: AvailableAccesorial.AccesorialCode
            }

            this.accessorials.push(accessorial);
            this.accessorialIds.push(AvailableAccesorial.AccessorialID);

            AvailableAccesorial.Selected = true;
          }
        });
      });
    }

    this.accessorialsSelectedQty = this.ShipmentByLadingObject.BOLAccesorialList.length; // Quantiry of accessorials selected

    // --

    // -- Set default values "Last/Confirm step" step
    this.confirmFormGroup.controls.carrier.setValue(this.ShipmentByLadingObject.CarrierName, {onlySelf: false});
    this.carrierSelected = this.ShipmentByLadingObject.CarrierCode;
    // --


  }

  openDialog(isConfirmDialog, pMessage){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Message',
      message: pMessage,
      confirmDialog: isConfirmDialog
    };

    const dialogRef = this.dialog.open(ConfirmAlertDialogComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //   data => console.log('Dialog output: ', data)
    // );

  }

  validateIfFieldsHaveChanged(){
    const bFieldsHaveChanged = false;
    if (this.ForceToReRate){
      return true;
    }
    
    if (this.ShipmentByLadingObject == null){
      
        if (this.productsUsedToRate != null && this.productsUsedToRate.length > 0){
          let productHasChanged = false;
          this.productsUsedToRate.forEach(p => {
            const currentProductIndex = (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1;
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
      if (this.ShipmentByLadingObject.BOlProductsList != null && this.ShipmentByLadingObject.BOlProductsList.length > 0){
        let productHasChanged = false;
        this.ShipmentByLadingObject.BOlProductsList.forEach(p => {
          const currentProductIndex = (this.productsAndAccessorialsFormGroup.controls.products as FormArray).length - 1;
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
        });

        if (productHasChanged){
          return true;
        }

      }

      if (this.ShipmentByLadingObject.BOLAccesorialList != null && this.ShipmentByLadingObject.BOLAccesorialList.length > 0){
        if (this.ShipmentByLadingObject.BOLAccesorialList.length !== this.accessorials.length)
        {
          // accessorials selected are different from the ones previously selected, so return true to re-rate
          return true;
        }else{
          let accessorialArrayFound: AccessorialBase[];
          let accessorialHasChanged = false;
          this.ShipmentByLadingObject.BOLAccesorialList.forEach(BOLAccesorial => {
            accessorialArrayFound = this.accessorials.filter(item => item.AccessorialID === BOLAccesorial.AccesorialID);
            if (accessorialArrayFound == null || accessorialArrayFound.length === 0){
              accessorialHasChanged = true;
              return true; // Previous accessorial selected not found in current list of accessorials, so return true (re-rate)
            }
          });

          if (accessorialHasChanged){
            return true;
          }
        }
      }

    }

    return bFieldsHaveChanged;
  }

  SaveAsQuote() {    
    const RequiredFieldsValidationObj = this.CheckAllRequiredFields();
    if (RequiredFieldsValidationObj.showWarningMessage){
       this.openDialog(RequiredFieldsValidationObj.isConfirmDialog, RequiredFieldsValidationObj.message);
    }else{
      if (this.ShipmentByLadingObject == null){
        // Insert as new quote
        this.saveNewQuote();
      }else{
        // Update quote
        this.updateQuote();
      }
    }  
  }

  async saveNewQuote(){

    this.spinnerMessage = 'Saving quote';
    this.showSpinner = true;

    // Start here rs
    // const selectedRate = this.selectedRateFromQuotes; // Selected rate

    // console.log('save quote start',selectedRate);

    // const arrayProducts = this.productsAndAccessorialsFormGroup.get('products').value;
    // const productList: BOlProductsListSQD[] = [];
    // let productsCounter = 1;
    // arrayProducts.forEach(p => {
    //   const prod : BOlProductsListSQD = {
    //     BOLProductID: productsCounter,
    //     Description: p.ProductDescription,
    //     Pallets: p.Pallets,
    //     Pieces: p.Pieces,
    //     Hazmat: p.HazMat,
    //     NMFC: p.NmfcNumber,
    //     Class: p.ProductClass,
    //     Weight: p.Weight,
    //     Height: p.Height,
    //     Lenght: p.Length,
    //     Width: p.Width,
    //     PackageTypeID: p.PackageTypeID,
    //     PCF: p.PCF,
    //     selectedProduct: {},
    //     Status: 1,
    //     SelectedProductClass: {},
    //     Stackable: p.Stackable,
    //     PortCode: 'C'
    //   }

    //   console.log('p', p);

    //   console.log('prod', prod);

    //   productList.push(prod);

    //   productsCounter = productsCounter + 1;
    // });

    // const accountInvoiceCostList: AccountInvoiceCostListSQD[] = [];

    // selectedRate.Accessorials.forEach(a => {
    //   const accountInvoiceCost: AccountInvoiceCostListSQD = {
    //     AccessorialID: a.AccessorialID,
    //     AccessorialCode: a.AccessorialCode,
    //     RatedCost: a.AccessorialCharge,
    //     BilledCost: a.AccessorialCharge,
    //     Description: a.AccessorialDescription,
    //     CostStatus: 1 // Ask
    //   }
    //   accountInvoiceCostList.push(accountInvoiceCost);
    // })

    // // Ask
    // // Freight
    // const accountInvoiceFreight: AccountInvoiceCostListSQD = {
    //   AccessorialID: 22,
    //   RatedCost: selectedRate.GrossAmount,
    //   BilledCost: selectedRate.GrossAmount,
    //   Description: 'Freight',
    //   AccessorialCode: 'FRT',
    //   CostStatus: 1
    // }
    // accountInvoiceCostList.push(accountInvoiceFreight);

    // // Fuel
    // const accountInvoiceFuel: AccountInvoiceCostListSQD = {
    //   AccessorialID: 23,
    //   RatedCost: selectedRate.FuelCost,
    //   BilledCost: selectedRate.FuelCost,
    //   Description: 'Fuel',
    //   AccessorialCode: 'FSC',
    //   CostStatus: 1
    // }
    // accountInvoiceCostList.push(accountInvoiceFuel);

    // // Discount
    // const accountInvoiceDiscount: AccountInvoiceCostListSQD = {
    //   AccessorialID: 24,
    //   RatedCost: -1 * selectedRate.Discount,
    //   BilledCost: -1 * selectedRate.Discount,
    //   Description: 'Discount',
    //   AccessorialCode: 'DIS',
    //   CostStatus: 1
    // }
    // accountInvoiceCostList.push(accountInvoiceDiscount);

    // const sellRate: SellRatesSQD = {
    //   SCAC: selectedRate.CarrierID,
    //   CarrierName: selectedRate.CarrierName,
    //   AccountInvoiceCostList: accountInvoiceCostList
    // }

    // const bolAccesorials: BOLAccesorialListSQD[] = [];
    // this.accessorials.forEach(a => {
    //   const acc: BOLAccesorialListSQD = {
    //     AccesorialID: a.AccessorialID,
    //     IsAccesorial: true
    //   }
    //   bolAccesorials.push(acc);
    // })

    // console.log('Prod', productList)

    // End here rs

    this.saveQuoteData = {
      ClientId: 8473,
      PickupDate: '/Date(1604901600000)/',
      DeliveryDate: null,
      OrgName: 'aaa',
      OrgAdr1: 'aaa',
      OrgAdr2: null,
      OrgCity: 85839,
      OrgState: 33,
      OrgZip: 19205236,
      OrgCountry: 1,
      DestName: 'bbb',
      DestAdr1: 'bbb',
      DestAdr2: null,
      DestCity: 90454,
      DestState: 63,
      DestZip: 19229270,
      DestCountry: 1,
      BillToName: 'R2 LOGISTICS ',
      BillToAdr1: '10739 DEERWOOD PARK BLVD',
      BillToAdr2: 'SUITE 103',
      BillToState: 59,
      BillToCity: 100326,
      BillToZip: 19215714,
      BillToCountry: 1,
      CarrierCode: 'UPGF',
      CarrierName: 'UPS FREIGHT',
      ProNumber: '333',
      SplNotes: 'special instructions',
      Ref1ID: 3759,
      Ref2ID: 3760,
      Ref3ID: 3761,
      Ref1Value: 'cr',
      Ref2Value: 'r2o',
      Ref3Value: 'r2prono',
      TransTime: '2',
      ShipCost: 139.86,
      FreightCost: 126,
      FuelCost: 13.86,
      AccsCost: 0,
      ShipperNotes: '',
      PaymentTermID: 5,
      OriginContactPerson: null,
      OriginContactPhone: '1111111111',
      DestContactPerson: null,
      DestContactPhone: '22222222222',
      OriginEmail: 'asd',
      DestEmail: 'asd2',
      EquipmentID: 7,
      ShipmentValue: '111',
      ValuePerPound: '222',
      PriorityID: 0,
      CarrierType: 'Direct',
      QuoteNumber: '',
      OriginTerminalAdd1: '240A SKIP LN',
      OriginTerminalCity: 'BAY SHORE',
      OriginTerminalState: 'NY',
      OriginTerminalZip: '11706',
      OriginTerminalFreePhone: '000-000-0000',
      OriginTerminalPhone: '631-667-5656',
      DestTerminalAdd1: '601 W 172ND ST',
      DestTerminalCity: 'SOUTH HOLLAND',
      DestTerminalState: 'IL',
      DestTerminalZip: '60473',
      DestTerminalFreePhone: '000-000-0000',
      DestTerminalPhone: '708-210-3810',
      OriginTerminalFax: '631-667-0024',
      DestTerminalFax: '708-210-9924',
      RequestedPickupDateFrom: '/Date(1604901600000)/',
      RequestedPickupTimeFrom: null,
      RequestedPickupTimeTo: null,
      OrgFaxNo: null,
      DestFaxNo: null,
      RequestedDeliveryDate: null,
      ServiceLevelID: 1,
      Miles: 803,
      BrokerCarrierCode: null,
      BrokerReferenceNo: 'r2refno',
      ShipmentErrorID: 0,
      BOlProductsList: [
        {
          BOLProductID: 1,
          Description: 'desc',
          Pallets: '1',
          Pieces: '1',
          Hazmat: undefined,
          NMFC: '123asd',
          Class: '50',
          Weight: '333',
          Height: '33',
          Lenght: '33',
          Width: '33',
          PackageTypeID: 3,
          PCF: '16.01',
          selectedProduct: {
          },
          Status: 1,
          SelectedProductClass: {
          },
          Stackable: true,
          PortCode: 'C',
        },
      ],
      BOLAccesorialList: [
      ],
      BOLDispatchNotesList: [
      ],
      BuyRates: {
        AccountInvoiceCostList: [
        ],
      },
      SellRates: {
        SCAC: 'UPGF',
        CarrierName: 'UPS FREIGHT',
        AccountInvoiceCostList: [
          {
            AccessorialID: 40,
            AccessorialCode: 'SSC',
            RatedCost: 0,
            BilledCost: 0,
            Description: 'SINGLE SHIPMENT',
            CostStatus: 1,
          },
          {
            AccessorialID: 22,
            RatedCost: 126,
            BilledCost: 126,
            Description: 'Freight',
            AccessorialCode: 'FRT',
            CostStatus: 1,
          },
          {
            AccessorialID: 23,
            RatedCost: 13.86,
            BilledCost: 13.86,
            Description: 'Fuel',
            AccessorialCode: 'FSC',
            CostStatus: 1,
          },
          {
            AccessorialID: 24,
            RatedCost: 0,
            BilledCost: 0,
            Description: 'Discount',
            AccessorialCode: 'DIS',
            CostStatus: 1,
          },
        ],
      },
      RefNo: 1,
      LoggedInUserId: 1,
      OrgCityName: 'ATLANTIC BEACH                ',
      OrgStateCode: 'NY ',
      OrgCountryCode: 'USA',
      OrgZipCode: '11509',
      OrgPostWithCity: '11509-ATLANTIC BEACH                ',
      DestCityName: 'CHICAGO HEIGHTS               ',
      DestStateCode: 'IL ',
      DestCountryCode: 'USA',
      DestZipCode: '60411',
      DestStateName: 'ILLINOIS                 ',
      DestPostalWithCity: '60411-CHICAGO HEIGHTS               ',
      BillToStateName: 'FLORIDA                  ',
      BillToPostalWithCity: '32256-100326',
      SellProfileID: 11868,
      OrgLocation: 'ATLANTIC BEACH                ,NY 11509',
      DestLocation: 'CHICAGO HEIGHTS               ,IL 60411',
      BillToCityName: 'JACKSONVILLE                  ',
      BillToStateCode: '59',
      BillToCountryCode: '1',
      BillToZipCode: '32256',
      SalesPersonList: [
      ],
      BolDocumentsList: [
      ],
      TrackingDetailsList: [
      ],
      ServiceLevelName: 'UPS Standard LTL',
      ServiceLevelCode: 'STD',
      RatingResultId: 45309867,
      Mode: 'LTL',
      BOLStopLists: [
      ],
      CostWithCustomerPercentage: 0,
      WaterfallList: [
      ],
      orgTerminalCityStateZipCode: 'BAY SHORE,NY,11706',
      destTerminalCityStateZipCode: 'SOUTH HOLLAND,IL,60473',
      WaterfallDetailsList: [
      ],
      StatusReasonCodeId: 0,
    }

    // this.saveQuoteData = {
    //   ClientId: this.ClientID,
    //   PickupDate: String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()),
    //   DeliveryDate: null,
    //   OrgName: this.originAndDestinationFormGroup.get('originname').value,
    //   OrgAdr1: this.originAndDestinationFormGroup.get('originadddress1').value,
    //   OrgAdr2: this.originAndDestinationFormGroup.get('originadddress2').value,      
    //   OrgCity: Number(this.OriginPostalData.CityID),
    //   OrgState: Number(this.OriginPostalData.StateId),
    //   OrgZip: Number(this.OriginPostalData.PostalID),
    //   OrgCountry: Number(this.OriginPostalData.CountryId),
    //   DestName: this.originAndDestinationFormGroup.get('destname').value,
    //   DestAdr1: this.originAndDestinationFormGroup.get('destadddress1').value,
    //   DestAdr2: this.originAndDestinationFormGroup.get('destadddress2').value,
    //   DestCity: Number(this.DestinationPostalData.CityID),
    //   DestState: Number(this.DestinationPostalData.StateId),
    //   DestZip: Number(this.DestinationPostalData.PostalID),
    //   DestCountry: Number(this.DestinationPostalData.CountryId),
    //   BillToName: this.clientDefaultData.BillToName,
    //   BillToAdr1: this.clientDefaultData.BillToAddress1,
    //   BillToAdr2: this.clientDefaultData.BillToAddress2,
    //   BillToState: this.clientDefaultData.BillToState,
    //   BillToCity: this.clientDefaultData.BillToCity,
    //   BillToZip: this.clientDefaultData.BillToPostal,
    //   BillToCountry: this.clientDefaultData.BillToCountry,
    //   CarrierCode: selectedRate.CarrierID,
    //   CarrierName: selectedRate.CarrierName,
    //   ProNumber: this.shipmentInfoFormGroup.get('pronumber').value.trim(),
    //   SplNotes: this.shipmentInfoFormGroup.get('specialinstructions').value,
    //   Ref1ID: this.ReferenceByClientIDField1,
    //   Ref2ID: this.ReferenceByClientIDField2,
    //   Ref3ID: this.ReferenceByClientIDField3,
    //   Ref1Value: this.shipmentInfoFormGroup.get('customerref').value.trim(),
    //   Ref2Value: this.shipmentInfoFormGroup.get('r2order').value.trim(),
    //   Ref3Value: this.shipmentInfoFormGroup.get('r2pronumber').value.trim(),
    //   TransTime: selectedRate.TransitTime,
    //   ShipCost: selectedRate.TotalCost,
    //   FreightCost: selectedRate.FreightCost,
    //   FuelCost: selectedRate.FuelCost,
    //   AccsCost: selectedRate.TotalAccCost,
    //   ShipperNotes: '',
    //   PaymentTermID: this.shipmentInfoFormGroup.get('paymentterms').value,
    //   OriginContactPerson: this.originAndDestinationFormGroup.get('origincontact').value,
    //   OriginContactPhone: this.originAndDestinationFormGroup.get('originphone').value,
    //   DestContactPerson: this.originAndDestinationFormGroup.get('destcontact').value,
    //   DestContactPhone: this.originAndDestinationFormGroup.get('destphone').value,
    //   OriginEmail: this.originAndDestinationFormGroup.get('originemail').value,
    //   DestEmail: this.originAndDestinationFormGroup.get('destemail').value,
    //   EquipmentID: this.shipmentInfoFormGroup.get('equipment').value,
    //   ShipmentValue: this.shipmentInfoFormGroup.get('shipmentvalue').value,
    //   ValuePerPound: this.shipmentInfoFormGroup.get('valueperpound').value,
    //   PriorityID: this.shipmentInfoFormGroup.get('priority').value,
    //   CarrierType: selectedRate.CarrierType,
    //   QuoteNumber: '',
    //   OriginTerminalAdd1: selectedRate.OriginTerminalAddress1,
    //   OriginTerminalCity: selectedRate.OriginTerminalCity,
    //   OriginTerminalState: selectedRate.OriginTerminalState,
    //   OriginTerminalZip: selectedRate.OriginTerminalZip,      
    //   OriginTerminalFreePhone: selectedRate.OriginTerminalFreePhone,
    //   OriginTerminalPhone: selectedRate.OriginTerminalPhoneNo,
    //   DestTerminalAdd1: selectedRate.DestTerminalAddress1,
    //   DestTerminalCity: selectedRate.DestTerminalCity,
    //   DestTerminalState: selectedRate.DestTerminalState,
    //   DestTerminalZip: selectedRate.DestTerminalZip,
    //   DestTerminalFreePhone: selectedRate.DestTerminalFreePhone,
    //   DestTerminalPhone: selectedRate.DestTerminalPhoneNo,
    //   OriginTerminalFax:  selectedRate.OriginTerminalFaxNo,
    //   DestTerminalFax: selectedRate.DestTerminalFaxNo,
    //   RequestedPickupDateFrom: this.originAndDestinationFormGroup.get('originpickupdate').value != null ? String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()) : null,
    //   RequestedPickupTimeFrom: this.originAndDestinationFormGroup.get('originpickupopen').value,
    //   RequestedPickupTimeTo: this.originAndDestinationFormGroup.get('originpickupclose').value,
    //   OrgFaxNo: null,
    //   DestFaxNo: null,
    //   RequestedDeliveryDate: this.originAndDestinationFormGroup.get('destexpdeldate').value != null ? String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('destexpdeldate').value.getTime()) : null,
    //   ServiceLevelID: this.shipmentInfoFormGroup.get('servicelevel').value,
    //   Miles: selectedRate.LaneWiseMiles,
    //   BrokerCarrierCode: null,
    //   BrokerReferenceNo: this.shipmentInfoFormGroup.get('r2refno').value,
    //   ShipmentErrorID: 0, 
    //   BOlProductsList: productList,
    //   BOLAccesorialList: bolAccesorials,
    //   BOLDispatchNotesList: [],
    //   BuyRates: {
    //     AccountInvoiceCostList: []
    //   },
    //   SellRates: sellRate,
    //   RefNo: selectedRate.ReferenceNo,
    //   LoggedInUserId: this.UserIDLoggedIn, // Continue HERERS  
    //   OrgCityName: this.OriginPostalData.CityName,
    //   OrgStateCode: this.OriginPostalData.StateCode,
    //   OrgCountryCode: this.OriginPostalData.CountryCode,
    //   OrgZipCode: this.OriginPostalData.PostalCode,
    //   OrgPostWithCity: this.OriginPostalData.PostalCode + '-' + this.OriginPostalData.CityName,
    //   DestCityName: this.DestinationPostalData.CityName,
    //   DestStateCode: this.DestinationPostalData.StateCode,
    //   DestCountryCode: this.DestinationPostalData.CountryCode,
    //   DestZipCode: this.DestinationPostalData.PostalCode,
    //   DestStateName: this.DestinationPostalData.StateName,
    //   DestPostalWithCity: this.DestinationPostalData.PostalCode + '-' + this.DestinationPostalData.CityName,
    //   BillToStateName: this.clientDefaultData.BillToStateName,
    //   BillToPostalWithCity: this.clientDefaultData.BillToPostalCode + '-' +  this.clientDefaultData.BillToCity,
    //   SellProfileID: selectedRate.ProfileID,
    //   OrgLocation:String.Format('{0},{1}{2}',this.OriginPostalData.CityName,this.OriginPostalData.StateCode,this.OriginPostalData.PostalCode),
    //   DestLocation:String.Format('{0},{1}{2}',this.DestinationPostalData.CityName,this.DestinationPostalData.StateCode,this.DestinationPostalData.PostalCode),
    //   BillToCityName: this.clientDefaultData.BillToCityName.toString(),
    //   BillToStateCode: this.clientDefaultData.BillToState.toString(),
    //   BillToCountryCode: this.clientDefaultData.BillToCountry.toString(),
    //   BillToZipCode: this.clientDefaultData.BillToPostalCode,
    //   SalesPersonList: [],
    //   BolDocumentsList: [],
    //   TrackingDetailsList: [],
    //   ServiceLevelName:selectedRate.ServiceLevel,
    //   ServiceLevelCode:selectedRate.SaasServiceLevelCode,
    //   RatingResultId: selectedRate.RatingResultId,
    //   Mode: this.shipmentInfoFormGroup.get('mode').value,
    //   BOLStopLists: [],
    //   CostWithCustomerPercentage: selectedRate.CostWithCustomerPercentage,
    //   WaterfallList: [],
    //   orgTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode),
    //   destTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode),
    //   WaterfallDetailsList: [],
    //   StatusReasonCodeId: 0 // Check if we need to get the StatusReasonCodeList
    // }

    // this.saveQuoteParameters = {
    //     ClientId: this.ClientID,
    //     PickupDate: String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()),
    //     OrgName: this.originAndDestinationFormGroup.get('originname').value,
    //     OrgAdr1: this.originAndDestinationFormGroup.get('originadddress1').value,
    //     OrgAdr2: this.originAndDestinationFormGroup.get('originadddress2').value,
    //     OrgCity: Number(this.OriginPostalData.CityID),
    //     OrgState: Number(this.OriginPostalData.StateId),
    //     OrgStateCode: this.OriginPostalData.StateCode,
    //     OrgStateName: this.OriginPostalData.StateName,
    //     OrgCountry: Number(this.OriginPostalData.CountryId),
    //     DestName: this.originAndDestinationFormGroup.get('destname').value,
    //     DestAdr1: this.originAndDestinationFormGroup.get('destadddress1').value,
    //     DestCity: Number(this.DestinationPostalData.CityID),
    //     DestState: Number(this.DestinationPostalData.StateId),
    //     DestStateCode: this.DestinationPostalData.StateCode,
    //     DestStateName: this.DestinationPostalData.StateName,
    //     DestCountry: Number(this.DestinationPostalData.CountryId),
    //     CarrierCode: selectedRate.CarrierID,
    //     CarrierName: selectedRate.CarrierName,
    //     TransTime: selectedRate.TransitTime,
    //     CarrierType: selectedRate.CarrierType,
    //     OriginTerminalName: selectedRate.OriginTerminalName,
    //     OriginTerminalAdd1: selectedRate.OriginTerminalAddress1,
    //     OriginTerminalAdd2: selectedRate.OriginTerminalAddress2,
    //     OriginTerminalCity: selectedRate.OriginTerminalCity,
    //     OriginTerminalState: selectedRate.OriginTerminalState,
    //     OriginTerminalZip: selectedRate.OriginTerminalZip,
    //     OriginTerminalContactPerson: selectedRate.OriginTerminalContactName,
    //     OriginTerminalFreePhone: selectedRate.OriginTerminalFreePhone,
    //     OriginTerminalPhone: selectedRate.OriginTerminalPhoneNo,
    //     OriginTerminalEmail: selectedRate.OriginTerminalEmail,
    //     DestTerminalName: selectedRate.DestTerminalName,
    //     DestTerminalAdd1: selectedRate.DestTerminalAddress1,
    //     DestTerminalAdd2: selectedRate.DestTerminalAddress2,
    //     DestTerminalCity: selectedRate.DestTerminalCity,
    //     DestTerminalState: selectedRate.DestTerminalState,
    //     DestTerminalZip: selectedRate.DestTerminalZip,
    //     DestTerminalContactPerson: selectedRate.DestTerminalContactName,
    //     DestTerminalFreePhone: selectedRate.DestTerminalFreePhone,
    //     DestTerminalPhone: selectedRate.DestTerminalPhoneNo,
    //     DestTerminalEmail: selectedRate.DestTerminalEmail,
    //     OriginTerminalFax: selectedRate.OriginTerminalFaxNo,
    //     DestTerminalFax: selectedRate.DestTerminalFaxNo,
        
    //     BOlProductsList: productList,
    //     BOLAccesorialList: bolAccesorials,
    //     BOLDispatchNotesList: [],
    //     BuyRates: null,
    //     SellRates: sellRate,

    //     LoggedInUserId: this.UserIDLoggedIn,
    //     OrgCityName:this.OriginPostalData.CityName,        
    //     OrgCountryCode:this.OriginPostalData.CountryCode,
    //     OrgZipCode:this.OriginPostalData.PostalCode,
    //     OrgZip: Number(this.OriginPostalData.PostalID),
    //     DestCityName:this.DestinationPostalData.CityName,        
    //     DestCountryCode:this.DestinationPostalData.CountryCode,
    //     DestZip: Number(this.DestinationPostalData.PostalID),
    //     DestZipCode:this.DestinationPostalData.PostalCode,
    //     OrgLocation:String.Format('{0},{1}{2}',this.OriginPostalData.CityName,this.OriginPostalData.StateCode,this.OriginPostalData.PostalCode),
    //     DestLocation:String.Format('{0},{1}{2}',this.DestinationPostalData.CityName,this.DestinationPostalData.StateCode,this.DestinationPostalData.PostalCode),
    //     SalesPersonList: [],
    //     BolDocumentsList: [],
    //     TrackingDetailsList: [],
    //     ServiceLevelName:selectedRate.ServiceLevel,
    //     ServiceLevelCode:selectedRate.SaasServiceLevelCode,
    //     RatingResultId:selectedRate.RatingResultId,        
    //     BOLStopLists: [],
    //     CostWithCustomerPercentage: selectedRate.CostWithCustomerPercentage,
    //     WaterfallList: [],
    //     orgTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode),
    //     destTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode),
    //     WaterfallDetailsList:null,
    //     Mode: this.shipmentInfoFormGroup.get('mode').value,
    //     EquipmentID: this.shipmentInfoFormGroup.get('equipment').value,
    //     PriorityID: this.shipmentInfoFormGroup.get('priority').value,
    //     ServiceLevelID: this.shipmentInfoFormGroup.get('servicelevel').value,
    //     PaymentTermID: this.shipmentInfoFormGroup.get('paymentterms').value,
    //     OriginContactPerson: this.originAndDestinationFormGroup.get('origincontact').value,
    //     OriginContactPhone: this.originAndDestinationFormGroup.get('originphone').value,
    //     OriginEmail: this.originAndDestinationFormGroup.get('originemail').value,
    //     DestContactPerson: this.originAndDestinationFormGroup.get('destcontact').value,
    //     DestContactPhone: this.originAndDestinationFormGroup.get('destphone').value,
    //     RequestedPickupTimeFrom: this.originAndDestinationFormGroup.get('originpickupopen').value,
    //     RequestedPickupTimeTo: this.originAndDestinationFormGroup.get('originpickupclose').value
    // };

    console.log('saveQuoteParameters',this.saveQuoteData)

    const responseData = await this.httpService.saveNewQuote(this.saveQuoteData);
    if (responseData != null && !String.IsNullOrWhiteSpace(responseData.ClientLadingNo))
    {
      this.messageService.SendQuoteParameter(responseData.ClientLadingNo);
      this.messageService.SendLadingIDParameter(responseData.LadingID.toString());
      this.snackbar.open('Quote saved successfully with LoadNo ' + responseData.ClientLadingNo, null, {
        duration: 5000
      });
    }
    else{
      this.snackbar.open('There was an error, try again.', null, {
        duration: 5000
      });
    }

    this.showSpinner = false;
  }

  async updateQuote(){
    this.spinnerMessage = 'Saving quote';
    this.showSpinner = true;

    const selectedRate = this.selectedRateFromQuotes; // Selected rate
    console.log('Quote has been rerated, selectedRate: ',selectedRate);

    const arrayProducts = this.productsAndAccessorialsFormGroup.get('products').value;
    const productList: BOlProductsListSBL[] = [];
    arrayProducts.forEach(p => {
      const prod : BOlProductsListSBL = {
        BOLProductID: p.BOLProductID,
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
        LadingID: this.ShipmentByLadingObject.LadingID
      }      

      productList.push(prod);
    });

    this.ShipmentByLadingObject.BOlProductsList = productList; // Update products

    // -- Update Origin and Destination fields
    this.ShipmentByLadingObject.OrgName = this.originAndDestinationFormGroup.get('originname').value;
    this.ShipmentByLadingObject.OrgAdr1 = this.originAndDestinationFormGroup.get('originadddress1').value;
    this.ShipmentByLadingObject.OrgAdr2 = this.originAndDestinationFormGroup.get('originadddress2').value;

    if (this.ShipmentByLadingObject.OrgZipCode !== this.OriginPostalData.PostalCode){
      this.ShipmentByLadingObject.OrgCity = Number(this.OriginPostalData.CityID);
      this.ShipmentByLadingObject.OrgState = Number(this.OriginPostalData.StateId);
      this.ShipmentByLadingObject.OrgCountry = Number(this.OriginPostalData.CountryId);
      this.ShipmentByLadingObject.OrgZip = Number(this.OriginPostalData.PostalID);      
    }

    this.ShipmentByLadingObject.OriginContactPerson = this.originAndDestinationFormGroup.get('origincontact').value;
    this.ShipmentByLadingObject.OriginContactPhone = this.originAndDestinationFormGroup.get('originphone').value;
    this.ShipmentByLadingObject.OriginEmail = this.originAndDestinationFormGroup.get('originemail').value;

    this.ShipmentByLadingObject.DestName = this.originAndDestinationFormGroup.get('destname').value;
    this.ShipmentByLadingObject.DestAdr1 = this.originAndDestinationFormGroup.get('destadddress1').value;
    this.ShipmentByLadingObject.DestAdr2 = this.originAndDestinationFormGroup.get('destadddress2').value;

    if (this.ShipmentByLadingObject.DestZipCode !== this.DestinationPostalData.PostalCode){
      this.ShipmentByLadingObject.DestCity = Number(this.DestinationPostalData.CityID);
      this.ShipmentByLadingObject.DestState = Number(this.DestinationPostalData.StateId);
      this.ShipmentByLadingObject.DestCountry = Number(this.DestinationPostalData.CountryId);
      this.ShipmentByLadingObject.DestZip = Number(this.DestinationPostalData.PostalID);
    }

    this.ShipmentByLadingObject.DestContactPerson = this.originAndDestinationFormGroup.get('destcontact').value;
    this.ShipmentByLadingObject.DestContactPhone = this.originAndDestinationFormGroup.get('destphone').value;
    this.ShipmentByLadingObject.DestEmail = this.originAndDestinationFormGroup.get('destemail').value;

    this.ShipmentByLadingObject.PickupDate = String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('originpickupdate').value.getTime());
    this.ShipmentByLadingObject.RequestedPickupTimeFrom = this.originAndDestinationFormGroup.get('originpickupopen').value;
    this.ShipmentByLadingObject.RequestedPickupTimeTo = this.originAndDestinationFormGroup.get('originpickupclose').value;   

    this.ShipmentByLadingObject.ExpectedDeliveryDate = String.Format('/Date({0})/',this.originAndDestinationFormGroup.get('destexpdeldate').value.getTime());
    this.ShipmentByLadingObject.DeliveryAppointmentTimeFrom = this.originAndDestinationFormGroup.get('destdelapptfrom').value;
    this.ShipmentByLadingObject.DeliveryAppointmentTimeTo = this.originAndDestinationFormGroup.get('destdelapptto').value;   
    // --

    // -- Update Shipment Information fields
    this.ShipmentByLadingObject.ProNumber = this.shipmentInfoFormGroup.get('pronumber').value.trim();
    this.ShipmentByLadingObject.SplNotes = this.shipmentInfoFormGroup.get('specialinstructions').value;   
    this.ShipmentByLadingObject.Ref1Value = this.shipmentInfoFormGroup.get('customerref').value.trim();
    this.ShipmentByLadingObject.Ref2Value = this.shipmentInfoFormGroup.get('r2order').value.trim();
    this.ShipmentByLadingObject.Ref3Value = this.shipmentInfoFormGroup.get('r2pronumber').value.trim();
    this.ShipmentByLadingObject.PaymentTermID = this.shipmentInfoFormGroup.get('paymentterms').value;
    this.ShipmentByLadingObject.ShipmentValue = this.shipmentInfoFormGroup.get('shipmentvalue').value;
    this.ShipmentByLadingObject.ValuePerPound = this.shipmentInfoFormGroup.get('valueperpound').value;
    this.ShipmentByLadingObject.PriorityID = this.shipmentInfoFormGroup.get('priority').value;
	  this.ShipmentByLadingObject.ServiceLevelID = this.shipmentInfoFormGroup.get('servicelevel').value;
	  this.ShipmentByLadingObject.BrokerReferenceNo = this.shipmentInfoFormGroup.get('r2refno').value;
	  this.ShipmentByLadingObject.Mode = this.shipmentInfoFormGroup.get('mode').value;
    // --

    const bolAccesorials: BOLAccesorialListSBL[] = [];
    this.accessorials.forEach(a => {
      const acc: BOLAccesorialListSBL = {
        AccesorialID: a.AccessorialID,
        IsAccesorial: true
      }
      bolAccesorials.push(acc);
    })

    this.ShipmentByLadingObject.BOLAccesorialList = bolAccesorials;

    if (selectedRate != null && selectedRate.CarrierID != null){
      const accountInvoiceCostList: AccountInvoiceCostListSBL[] = [];

      selectedRate.Accessorials.forEach(a => {
        const accountInvoiceCost: AccountInvoiceCostListSBL = {
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
      const accountInvoiceFreight: AccountInvoiceCostListSBL = {
        AccessorialID: 22,
        RatedCost: selectedRate.GrossAmount,
        BilledCost: selectedRate.GrossAmount,
        Description: 'Freight',
        AccessorialCode: 'FRT',
        CostStatus: 1
      }
      accountInvoiceCostList.push(accountInvoiceFreight);
  
      // Fuel
      const accountInvoiceFuel: AccountInvoiceCostListSBL = {
        AccessorialID: 23,
        RatedCost: selectedRate.FuelCost,
        BilledCost: selectedRate.FuelCost,
        Description: 'Fuel',
        AccessorialCode: 'FSC',
        CostStatus: 1
      }
      accountInvoiceCostList.push(accountInvoiceFuel);
  
      // Discount
      const accountInvoiceDiscount: AccountInvoiceCostListSBL = {
        AccessorialID: 24,
        RatedCost: -1 * selectedRate.Discount,
        BilledCost: -1 * selectedRate.Discount,
        Description: 'Discount',
        AccessorialCode: 'DIS',
        CostStatus: 1
      }
      accountInvoiceCostList.push(accountInvoiceDiscount);
  
      this.ShipmentByLadingObject.SellRates.SCAC = selectedRate.CarrierID;
      this.ShipmentByLadingObject.SellRates.CarrierName = selectedRate.CarrierName;
      this.ShipmentByLadingObject.SellRates.AccountInvoiceCostList = accountInvoiceCostList;      

      this.ShipmentByLadingObject.CarrierCode = selectedRate.CarrierID;
      this.ShipmentByLadingObject.CarrierName = selectedRate.CarrierName;
      this.ShipmentByLadingObject.TransTime = selectedRate.TransitTime;
      this.ShipmentByLadingObject.CarrierType = selectedRate.CarrierType;
      
      this.ShipmentByLadingObject.ShipCost = selectedRate.TotalCost;
      this.ShipmentByLadingObject.FreightCost = selectedRate.FreightCost;
      this.ShipmentByLadingObject.FuelCost = selectedRate.FuelCost;
      this.ShipmentByLadingObject.AccsCost = selectedRate.TotalAccCost;

      this.ShipmentByLadingObject.OriginTerminalName = selectedRate.OriginTerminalName;
      this.ShipmentByLadingObject.OriginTerminalAdd1 = selectedRate.OriginTerminalAddress1;
      this.ShipmentByLadingObject.OriginTerminalAdd2 = selectedRate.OriginTerminalAddress2;
      this.ShipmentByLadingObject.OriginTerminalCity = selectedRate.OriginTerminalCity;
      this.ShipmentByLadingObject.OriginTerminalState = selectedRate.OriginTerminalState;
      this.ShipmentByLadingObject.OriginTerminalZip = selectedRate.OriginTerminalZip;
      this.ShipmentByLadingObject.OriginTerminalContactPerson = selectedRate.OriginTerminalContactName;
      this.ShipmentByLadingObject.OriginTerminalFreePhone = selectedRate.OriginTerminalFreePhone;
      this.ShipmentByLadingObject.OriginTerminalPhone = selectedRate.OriginTerminalPhoneNo;
      this.ShipmentByLadingObject.OriginTerminalEmail = selectedRate.OriginTerminalEmail;
      this.ShipmentByLadingObject.DestTerminalName = selectedRate.DestTerminalName;
      this.ShipmentByLadingObject.DestTerminalAdd1 = selectedRate.DestTerminalAddress1;
      this.ShipmentByLadingObject.DestTerminalAdd2 = selectedRate.DestTerminalAddress2;
      this.ShipmentByLadingObject.DestTerminalCity = selectedRate.DestTerminalCity;
      this.ShipmentByLadingObject.DestTerminalState = selectedRate.DestTerminalState;
      this.ShipmentByLadingObject.DestTerminalZip = selectedRate.DestTerminalZip;
      this.ShipmentByLadingObject.DestTerminalContactPerson = selectedRate.DestTerminalContactName;
      this.ShipmentByLadingObject.DestTerminalFreePhone = selectedRate.DestTerminalFreePhone;
      this.ShipmentByLadingObject.DestTerminalPhone = selectedRate.DestTerminalPhoneNo;
      this.ShipmentByLadingObject.DestTerminalEmail = selectedRate.DestTerminalEmail;
      this.ShipmentByLadingObject.OriginTerminalFax = selectedRate.OriginTerminalFaxNo;
      this.ShipmentByLadingObject.DestTerminalFax = selectedRate.DestTerminalFaxNo;
      this.ShipmentByLadingObject.ServiceLevelName = selectedRate.ServiceLevel;
      this.ShipmentByLadingObject.ServiceLevelCode = selectedRate.SaasServiceLevelCode;
      this.ShipmentByLadingObject.RatingResultId = selectedRate.RatingResultId;
      this.ShipmentByLadingObject.Miles = selectedRate.LaneWiseMiles;
      this.ShipmentByLadingObject.RefNo = selectedRate.ReferenceNo;
      this.ShipmentByLadingObject.SellProfileID = selectedRate.ProfileID;
      this.ShipmentByLadingObject.CostWithCustomerPercentage = selectedRate.CostWithCustomerPercentage,
	    this.ShipmentByLadingObject.orgTerminalCityStateZipCode = String.Format('{0},{1},{2}',selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode);
      this.ShipmentByLadingObject.destTerminalCityStateZipCode = String.Format('{0},{1},{2}',selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode);

    }
    
    const responseData = await this.httpService.UpdateBOLHDR(this.ShipmentByLadingObject);
    if (responseData != null && !String.IsNullOrWhiteSpace(this.ShipmentByLadingObject.ClientLadingNo))
    {
      this.messageService.SendQuoteParameter(this.ShipmentByLadingObject.ClientLadingNo);
      this.messageService.SendLadingIDParameter(this.ShipmentByLadingObject.LadingID.toString());
      this.snackbar.open('Quote saved successfully', null, {
        duration: 5000
      });
    }
    else{
      this.snackbar.open('There was an error, try again.', null, {
        duration: 5000
      });
    }

    this.showSpinner = false;

  }


  CheckAllRequiredFields(){
    let RequiredFieldsValidationObj = {
      showWarningMessage: false,
      message: '',
      isConfirmDialog: false
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
    }else if(this.costListFiltered.length === 0){
      RequiredFieldsValidationObj.showWarningMessage = true;
      RequiredFieldsValidationObj.message = 'Please select a rate the shipment first.';
      RequiredFieldsValidationObj.isConfirmDialog = false;     
    }else{
      const fieldsHaveChanged = this.validateIfFieldsHaveChanged();
      if (fieldsHaveChanged){
        RequiredFieldsValidationObj.showWarningMessage = true;
        RequiredFieldsValidationObj.message = 'You have modified some value(s), that requires re-rate this shipment. If you will not re-rate, then this shipment will go to "Quote Modified" status. Do you want to re-rate?';
        RequiredFieldsValidationObj.isConfirmDialog = true;       
      }  
    }

    return RequiredFieldsValidationObj;
  }



}
