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
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icTwotoneCalendarToday from '@iconify/icons-ic/twotone-calendar-today';
import icBaselineImageNotSupported from '@iconify/icons-ic/baseline-image-not-supported';

import outlineSave from '@iconify/icons-ic/outline-save';
import outlinePrint from '@iconify/icons-ic/outline-print';
import outlineEmail from '@iconify/icons-ic/outline-email';

import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { Rate,Accessorial,AccessorialBase,ServiceLevel } from '../../../../Entities/rate';
import { ProductPackageType } from '../../../../Entities/ProductPackageType'
import { ProductFeatures } from '../../../../Entities/ProductFeatures'
import { ClientDefaultData } from '../../../../Entities/ClientDefaultData';
import { CatalogItem } from '../../../../Entities/CatalogItem';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge'
import { SaveQuoteParameters,BOlProductsList,BOLAccesorial,SellRate,AccountInvoiceCost } from '../../../../Entities/SaveQuoteParameters';
import { Quote } from '../../../../Entities/Quote';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, ReplaySubject } from 'rxjs';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectChange } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { async } from '@angular/core/testing';
import { Converter } from 'showdown';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from '../../../../common/message.service';
import { UtilitiesService } from '../../../../common/utilities.service';
import baselineAddCircleOutline from '@iconify/icons-ic/baseline-add-circle-outline';
import {AuthenticationService} from '../../../../common/authentication.service';
import {environment} from '../../../../../environments/environment';
import moment from 'moment';

export interface CountryState {
  name: string;
  population: string;
  flag: string;
}

export interface User {
  name: string;
}

@Component({
  selector: 'vex-form-quick-quote',
  templateUrl: './form-quick-quote.component.html',
  styleUrls: ['./form-quick-quote.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})

export class FormQuickQuoteComponent implements OnInit {

  securityToken: string;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private ratesService: RatesService,
    private httpService : HttpService,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService
    ) {
    this.securityToken = this.authenticationService.ticket$.value;
  }

  get formProducts() { return this.quickQuoteFormGroup.get('products') as FormArray; }
  quickQuoteFormGroup: FormGroup;
  emailFormGroup: FormGroup;
  showSpinner = false;
  getQuoteButtonClicked = false;

  @HostListener('window:scroll')
  selectCtrl: FormControl = new FormControl();
  inputType = 'password';
  visible = false;

  keyId = '1593399730488';
  ClientID = this.authenticationService.getDefaultClient().ClientID;
  clientDefaultData: ClientDefaultData;
  clientTLWeightLimit: string;
  carrierImageUrl = environment.baseEndpoint +'Handlers/CarrierLogoHandler.ashx?carrierID=';
  UserIDLoggedIn = this.authenticationService.authenticatedUser$.value.UserID;  


  icPhone = icPhone;
  icCamera = icCamera;
  icMenu = icMenu;
  icArrowDropDown = icArrowDropDown;
  icSmartphone = icSmartphone;
  icPerson = icPerson;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icTwotoneCalendarToday = icTwotoneCalendarToday;
  icBaselineImageNotSupported = icBaselineImageNotSupported;
  outlineSave = outlineSave;
  outlinePrint = outlinePrint;
  outlineEmail = outlineEmail;
  baselineAddCircleOutline = baselineAddCircleOutline;

  stateCtrl = new FormControl();

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

   rates: Rate[];
   ratesFiltered: Rate[];
   originCountries: Object;
   destinationCountries: Object;
   ratesCounter = 0;
   searchOriginPostalCode = true;
   searchDestinationPostalCode = true;

  accessorials: AccessorialBase[] = [];
  accessorialIds: number[] = [];
  serviceLevels: ServiceLevel[] = [];

   originSelectedCountry: PostalData = {
    CityCode: '',
    CityID: null,
    CityName: '',
    CountryCode: '',
    CountryId: null,
    CountryName: '',
    IsActive: '',
    PostalCode: '',
    PostalID: '',
    StateCode: '',
    StateId: null,
    StateName: '',
   };

   destinationSelectedCountry: PostalData = {
    CityCode: '',
    CityID: null,
    CityName: '',
    CountryCode: '',
    CountryId: null,
    CountryName: '',
    IsActive: '',
    PostalCode: '',
    PostalID: '',
    StateCode: '',
    StateId: null,
    StateName: '',
   };

   packageTypes: Object;
   productPackageType: ProductPackageType[];
   originpostalcodeControl = new FormControl('');
   destinationpostalcodeControl = new FormControl('');
   showLoadingPanel = false;
   panelCollectionServiceState = false;
   panelDeliveryServiceState = false;
   ratesOpened: number[];
   sendEmailClicked = false;

   collectionServicesSelected = 0;
   collectionServicesDescription = 'Select Collection Services';
   deliveryServicesSelected = 0;
   deliveryServicesDescription = 'Select Delivery Services';

  pcoAutoCompleteOptions: Observable<PostalData[]>;
  pcdAutoCompleteOptions: Observable<PostalData[]>;

  saveQuoteParameters: SaveQuoteParameters;

  spinnerMessage:string;

  // ngAfterViewInit() {
  //   this.mapInitializer();
  // }
  isShow: boolean;
  topPosToStartShowing = 100;

  rightPanelImage: any = 'assets/img/demo/R2TestImage.png';
  noRatesFoundText = null;

  //#region Origin Fields

  postalData: PostalData[] = [];
  postalDataDest: PostalData[] = [];
  OriginPostalCode: string;
  OriginStateName: String;
  OriginPostalData: PostalData;
  OriginPickupDate: string;
  //#endregion

  //#region Destination Fields
  DestinationPostalCode: string;
  DestinationStateName: String;
  DestinationPostalData: PostalData;
  //#endregion

  @Input() childProductField: ProductFeatures;
  @Output() parentProductFields = new EventEmitter<ProductFeatures>();

  async ngOnInit() {

    // -- Main Form Group fields
    this.quickQuoteFormGroup = this.fb.group({
      originpostalcode: [null, Validators.required],
      originstatename: [null, Validators.required],
      originpickupdate: [null, Validators.required],
      destinationpostalcode: [null, Validators.required],
      destinationstatename: [null, Validators.required],
      //#region CollectionServices
      residential:[null],
      limitedAccess:[null],
      insidePickup:[null],
      liftgateRequiredAtPickup:[null],
      additionalInsured:[null],
      // collectionServices: this.fb.group({

      // }),
      //#endregion
      //#region Delivery Services
      deliveryResidential:[null],
      deliveryLimitedAccess:[null],
      standard:[null],
      guarantee:[null],
      callBeforeDelivery:[null],
      appointmentRequired:[null],
      protectfromFreezing:[null],
      insideDelivery:[null],
      sortAndSegregate:[null],
      blindShipment:[null],
      liftgateRequiredAtDelivery:[null],
      showCarriers: [10, [Validators.min(10),Validators.max(25),Validators.maxLength(2)]],
      //#endregion
      products: this.fb.array([
        this.addProductFormGroup()
      ])
    });

    // -- emailFormGroup fields
    this.emailFormGroup = this.fb.group({
      emailToSendQuote: [null, Validators.required]
    });
    // --


    const responseData = await this.httpService.getCountryList(this.keyId);
    this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);

    this.originCountries = responseData;
    this.destinationCountries = responseData;
    this.originSelectedCountry = responseData[0]; // US as default
    this.destinationSelectedCountry = responseData[0]; // US as default

    this.packageTypes = await this.httpService.getProductPackageType(this.keyId);

    this.pcoAutoCompleteOptions = this.quickQuoteFormGroup.get('originpostalcode').valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
            return this.pcoAutoCompleteFilter(val || '')
       })
      );

    this.pcdAutoCompleteOptions = this.quickQuoteFormGroup.get('destinationpostalcode').valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.pcdAutoCompletefilter(val || '')
        })
      );

    this.ratesOpened = []; // initiate ratesOpened array

  }

  pcoAutoCompleteFilter(val: string): Observable<any[]> {
    const CountryId = this.originSelectedCountry == null ? '1': this.originSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }

  pcoAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.quickQuoteFormGroup.get('originstatename').setValue(event.option.value.StateName.trim());
    this.OriginPostalCode = String.Format('{0}-{1}',event.option.value.PostalCode,event.option.value.CityName.trim());
    this.OriginPostalData = event.option.value;
    this.quickQuoteFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
  }

  pcdAutoCompletefilter(val: string): Observable<any[]> {
    const CountryId = this.destinationSelectedCountry == null ? '1': this.destinationSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }

  pcdAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.quickQuoteFormGroup.get('destinationstatename').setValue(event.option.value.StateName.trim());
    this.DestinationPostalCode = String.Format('{0}-{1}',event.option.value.PostalCode,event.option.value.CityName.trim());
    this.DestinationPostalData = event.option.value;
    this.quickQuoteFormGroup.get('destinationpostalcode').setValue(this.DestinationPostalCode);
  }

  addProductFormGroup(): FormGroup{
    return this.fb.group({
      Pallets: [null, Validators.required],
      Pieces: [null],
      PackageTypeID: [3],
      ProductClass: [null, Validators.required],
      NmfcNumber: [null],
      Length: [null, Validators.required],
      Width: [null, Validators.required],
      Height: [null, Validators.required],
      PCF: [null],
      Weight: [null, Validators.required],
      HazMat: false,
      Stackable: false,
      Status: 1,
      SaveProduct: false
    })
  }
  checkScroll() {

    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  async getQuote() {
    this.getQuoteButtonClicked = true;
    this.showSpinner = true;
    const test = await this.getShipmentRates();
    this.showSpinner = false;

    console.log('print at the end.');
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
  }

  clearQuoteAndFields(){
    this.ratesCounter = 0;
    this.getQuoteButtonClicked = false;
    this.rightPanelImage = 'assets/img/demo/R2TestImage.png';
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.panelCollectionServiceState = false;
    this.collectionServicesDescription = 'Select Collection Services';
    this.panelDeliveryServiceState = false;
    this.deliveryServicesDescription = 'Select Delivery Services';

    // -- Main Form Group fields
    this.quickQuoteFormGroup = this.fb.group({
      originpostalcode: [null, Validators.required],
      originstatename: [null, Validators.required],
      originpickupdate: [null, Validators.required],
      destinationpostalcode: [null, Validators.required],
      destinationstatename: [null, Validators.required],
      //#region CollectionServices
      residential:[null],
      limitedAccess:[null],
      insidePickup:[null],
      liftgateRequiredAtPickup:[null],
      // collectionServices: this.fb.group({

      // }),
      //#endregion
      //#region Delivery Services
      deliveryResidential:[null],
      deliveryLimitedAccess:[null],
      standard:[null],
      guarantee:[null],
      callBeforeDelivery:[null],
      appointmentRequired:[null],
      protectfromFreezing:[null],
      insideDelivery:[null],
      sortAndSegregate:[null],
      blindShipment:[null],
      liftgateRequiredAtDelivery:[null],
      showCarriers: [10, [Validators.min(10),Validators.max(25),Validators.maxLength(2)]],
      //#endregion
      products: this.fb.array([
        this.addProductFormGroup()
      ])
    });
  }

  togglePassword() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  validateCollectionServices(event,code: string){
    console.log('checked', code);
    if(event.checked){
      // Add a new control in the arrayForm
      const accessorial: AccessorialBase = {
        AccessorialID: event.source.value,
        AccessorialCode: code
      }

      this.accessorials.push(accessorial);
      this.accessorialIds.push(event.source.value);
    }
    /* unselected */
    else{
      console.log('unchecked', event.source.value);

      this.accessorials = this.accessorials.filter(a => a.AccessorialID !== event.source.value);
      this.accessorialIds = this.accessorialIds.filter(a => a !== event.source.value)
    }

    console.log(this.accessorials);

    this.collectionServicesSelected = 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('residential').value ? 1 : 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('limitedAccess').value ? 1 : 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('insidePickup').value ? 1 : 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('liftgateRequiredAtPickup').value ? 1 : 0;
    this.collectionServicesDescription = this.collectionServicesSelected > 0 ? String.Format('Selected: {0}', this.collectionServicesSelected) : 'Select Collection Services';
  }

  validateDeliveryServices(event,code: string){

    console.log('checked', code);
    if(event.checked){
      // Add a new control in the arrayForm
      if (code == 'STD' || code == 'GTS') {
        const serviceLevel: ServiceLevel = {
          ServiceLevelID: event.source.value,
          ServiceLevelCode: code
        }

        this.serviceLevels.push(serviceLevel);
      }
      else {
        const accessorial: AccessorialBase = {
          AccessorialID: event.source.value,
          AccessorialCode: code
        }

        this.accessorials.push(accessorial);
        this.accessorialIds.push(event.source.value);
      }
    }
    /* unselected */
    else{
      console.log('unchecked', event.source.value);
      if (code == 'STD' || code == 'GTS') {
        this.serviceLevels = this.serviceLevels.filter(s => s.ServiceLevelID !== event.source.value)
      }
      else {
        this.accessorials = this.accessorials.filter(a => a.AccessorialID !== event.source.value);
        this.accessorialIds = this.accessorialIds.filter(a => a !== event.source.value)
      }
    }

    console.log(this.accessorials);

    this.deliveryServicesSelected = 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('deliveryResidential').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('deliveryLimitedAccess').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('standard').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('guarantee').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('callBeforeDelivery').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('appointmentRequired').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('protectfromFreezing').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('insideDelivery').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('sortAndSegregate').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('blindShipment').value ? 1 : 0;
    this.deliveryServicesSelected += this.quickQuoteFormGroup.get('liftgateRequiredAtDelivery').value ? 1 : 0;
    this.deliveryServicesDescription = this.deliveryServicesSelected > 0 ? String.Format('Selected: {0}', this.deliveryServicesSelected) : 'Select Delivery Services';
  }

  async getPostalCode(postalCode: string){
    const CountryId = this.originSelectedCountry == null ? '1': this.originSelectedCountry.CountryId.toString();
    const responseData = await this.httpService.getPostalDataByPostalCode(postalCode,CountryId,this.keyId);
    this.postalData = responseData;
    return of (responseData);
  }

  async validateOriginPostalCode(event: KeyboardEvent){
    const CountryId = this.originSelectedCountry == null ? '1': this.originSelectedCountry.CountryId.toString();
    this.OriginPostalCode = this.quickQuoteFormGroup.get('originpostalcode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length == 5){
      const responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);
      this.postalData = responseData;
      if (this.postalData != null && this.postalData.length > 0){
        this.quickQuoteFormGroup.get('originstatename').setValue(this.postalData[0].StateName.trim());
        this.OriginPostalCode = String.Format('{0}-{1}',this.postalData[0].PostalCode,this.postalData[0].CityName.trim());
        this.OriginPostalData = this.postalData[0];
        this.quickQuoteFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
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
    this.DestinationPostalCode = this.quickQuoteFormGroup.get('destinationpostalcode').value;
    if (this.DestinationPostalCode != null && this.DestinationPostalCode.trim().length == 5){
      const responseData = await this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,CountryId,this.keyId);
      this.postalDataDest = responseData;
      if (this.postalDataDest != null && this.postalDataDest.length > 0)
      {
        this.quickQuoteFormGroup.get('destinationstatename').setValue(this.postalDataDest[0].StateName.trim());
        this.DestinationPostalCode = String.Format('{0}-{1}',this.postalDataDest[0].PostalCode,this.postalDataDest[0].CityName.trim());
        this.DestinationPostalData = this.postalDataDest[0];
        this.quickQuoteFormGroup.get('destinationpostalcode').setValue(this.DestinationPostalCode);
      }
      else
      {
        this.DestinationStateName = String.Empty;
        this.DestinationPostalCode = String.Empty;
        this.DestinationPostalData = null;
      }
    }
  }


  addNewProdField(): void {
    (this.quickQuoteFormGroup.get('products') as FormArray).push(this.addProductFormGroup());
  }

  removeNewProdField(index: number): void {
    (this.quickQuoteFormGroup.get('products') as FormArray).removeAt(index);
  }

  async getShipmentRates() {

      this.spinnerMessage = 'Loading...';

      const pickupDate = this.OriginPickupDate;
      const arrayProducts = this.quickQuoteFormGroup.get('products').value;

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
        ShipmentDate: String.Format('/Date({0})/',this.quickQuoteFormGroup.get('originpickupdate').value.getTime()),
        Accessorials: this.accessorials,
        AccessorialCodes: [],
        TopN: this.quickQuoteFormGroup.get('showCarriers').value,
        ServiceLevelGrops: [],
        ServiceLevels: this.serviceLevels,
        ServiceLevelCodes: [],
        // Ask
        // "SCAC": null,
        EquipmentList: [],
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
      if ( this.rates != null &&  this.rates.length > 0){
        this.rates.forEach(r => {
          if (!String.IsNullOrWhiteSpace(r.ExpectedDeliveryDate)){
            let expDelDate = null;
            // const tempExpDelDate = moment.utc(r.ExpectedDeliveryDate);
            // expDelDate = new Date(this.datepipe.transform(tempExpDelDate.toString().replace(/(^.*\()|([+-].*$)/g, ''),'MM/dd/yyyy'));         
            // r.ETA = String.Format('{0} (ETA)', this.datepipe.transform(expDelDate,'MM/dd/yyyy'));
            
            expDelDate = this.ConverteJsonDateToLocalTimeZone(r.ExpectedDeliveryDate);
            r.ETA = String.Format('{0} (ETA)', this.datepipe.transform(expDelDate,'MM/dd/yyyy'));
  
            // let today = new Date();
            // const days: number = +r.TransitTime;
            // today = this.utilitiesService.AddBusinessDays(today, days);
            // r.ETA = String.Format('{0} (ETA)', this.datepipe.transform(today,'yyyy-MM-dd'));
          }
          else {
            r.ETA = String.Empty;
          }
        });

        this.ratesFiltered =  this.rates.filter(rate => rate.CarrierCost > 0);
        // this.ratesFiltered =  this.rates;
        console.log(this.ratesFiltered);
        this.ratesCounter = this.ratesFiltered.length;
        this.snackbar.open(this.ratesCounter + ' rates returned.', null, {
          duration: 5000
        });

        this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';

      }else{
        this.noRatesFoundText = 'No rates found.';
      }                 
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

  async shipQuote(index: number){
    await this.save(index);
    this.router.navigate(['/ui/forms/form-add-ship/'], { relativeTo: this.route });
    // routerLink="/ui/forms/form-add-ship"
  }

  async saveQuote(index: number){
    await this.save(index);
    this.router.navigate(['../shipmentboard/LTLTL/'], { relativeTo: this.route });
  }

  async save(index: number){

    this.spinnerMessage = 'Saving quote';
    this.showSpinner = true;

    console.log(index);

    const selectedRate = this.ratesFiltered[index];

    console.log('save quote start',selectedRate);

    const arrayProducts = this.quickQuoteFormGroup.get('products').value;
    const productList: BOlProductsList[] = [];
    arrayProducts.forEach(p => {
      const prod : BOlProductsList = {
        Description: 'NA',
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
        Status: 1,
        SelectedProductClass: {},
        Stackable: p.Stackable
      }

      console.log('p', p);

      console.log('prod', prod);

      productList.push(prod);
    });

    const accountInvoiceCostList: AccountInvoiceCost[] = [];

    selectedRate.Accessorials.forEach(a => {
      const accountInvoiceCost: AccountInvoiceCost = {
        AccessorialID: a.AccessorialID,
        RatedCost: a.AccessorialCharge,
        BilledCost: a.AccessorialCharge,
        Description: a.AccessorialDescription,
        CostStatus: 1 // Ask
      }
      accountInvoiceCostList.push(accountInvoiceCost);
    })

    // Ask
    // Freight
    const accountInvoiceFreight: AccountInvoiceCost = {
      AccessorialID: 22,
      RatedCost: selectedRate.GrossAmount,
      BilledCost: selectedRate.GrossAmount,
      Description: 'Freight',
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceFreight);

    // Fuel
    const accountInvoiceFuel: AccountInvoiceCost = {
      AccessorialID: 23,
      RatedCost: selectedRate.FuelCost,
      BilledCost: selectedRate.FuelCost,
      Description: 'Fuel',
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceFuel);

    // Discount
    const accountInvoiceDiscount: AccountInvoiceCost = {
      AccessorialID: 24,
      RatedCost: -1 * selectedRate.Discount,
      BilledCost: -1 * selectedRate.Discount,
      Description: 'Discount',
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceDiscount);

    const sellRate: SellRate = {
      SCAC: selectedRate.CarrierID,
      CarrierName: selectedRate.CarrierName,
      AccountInvoiceCostList: accountInvoiceCostList
    }

    const bolAccesorials: BOLAccesorial[] = [];
    this.accessorials.forEach(a => {
      const acc: BOLAccesorial = {
        AccesorialID: a.AccessorialID,
        IsAccesorial: true
      }
      bolAccesorials.push(acc);
    })

    console.log('Prod', productList)

    this.saveQuoteParameters = {
        ClientId: this.ClientID,
        PickupDate: String.Format('/Date({0})/',this.quickQuoteFormGroup.get('originpickupdate').value.getTime()),
        OrgName: 'NA',
        OrgAdr1: 'NA',
        OrgCity: Number(this.OriginPostalData.CityID),
        OrgState: Number(this.OriginPostalData.StateId),
        OrgCountry: Number(this.OriginPostalData.CountryId),
        DestName: 'NA',
        DestAdr1: 'NA',
        DestCity: Number(this.DestinationPostalData.CityID),
        DestState: Number(this.DestinationPostalData.StateId),
        DestCountry: Number(this.DestinationPostalData.CountryId),
        CarrierCode: selectedRate.CarrierID,
        CarrierName: selectedRate.CarrierName,
        TransTime: selectedRate.TransitTime,
        CarrierType: selectedRate.CarrierType,
        OriginTerminalName: selectedRate.OriginTerminalName,
        OriginTerminalAdd1: selectedRate.OriginTerminalAddress1,
        OriginTerminalAdd2: selectedRate.OriginTerminalAddress2,
        OriginTerminalCity: selectedRate.OriginTerminalCity,
        OriginTerminalState: selectedRate.OriginTerminalState,
        OriginTerminalZip: selectedRate.OriginTerminalZip,
        OriginTerminalContactPerson: selectedRate.OriginTerminalContactName,
        OriginTerminalFreePhone: selectedRate.OriginTerminalFreePhone,
        OriginTerminalPhone: selectedRate.OriginTerminalPhoneNo,
        OriginTerminalEmail: selectedRate.OriginTerminalEmail,
        DestTerminalName: selectedRate.DestTerminalName,
        DestTerminalAdd1: selectedRate.DestTerminalAddress1,
        DestTerminalAdd2: selectedRate.DestTerminalAddress2,
        DestTerminalCity: selectedRate.DestTerminalCity,
        DestTerminalState: selectedRate.DestTerminalState,
        DestTerminalZip: selectedRate.DestTerminalZip,
        DestTerminalContactPerson: selectedRate.DestTerminalContactName,
        DestTerminalFreePhone: selectedRate.DestTerminalFreePhone,
        DestTerminalPhone: selectedRate.DestTerminalPhoneNo,
        DestTerminalEmail: selectedRate.DestTerminalEmail,
        OriginTerminalFax: selectedRate.OriginTerminalFaxNo,
        DestTerminalFax: selectedRate.DestTerminalFaxNo,
        // Ask
        ServiceLevelID: 1, // ask selectedRate.ServiceLevelCode,
        BOlProductsList: productList,
        BOLAccesorialList: bolAccesorials,
        BOLDispatchNotesList: [],
        BuyRates: null,
        SellRates: sellRate,

        LoggedInUserId: this.UserIDLoggedIn,
        OrgCityName:this.OriginPostalData.CityName,
        OrgStateCode:this.OriginPostalData.StateCode,
        OrgCountryCode:this.OriginPostalData.CountryCode,
        OrgZipCode:this.OriginPostalData.PostalCode,
        DestCityName:this.DestinationPostalData.CityName,
        DestStateCode:this.DestinationPostalData.StateCode,
        DestCountryCode:this.DestinationPostalData.CountryCode,
        DestZipCode:this.DestinationPostalData.PostalCode,
        OrgLocation:String.Format('{0},{1}{2}',this.OriginPostalData.CityName,this.OriginPostalData.StateCode,this.OriginPostalData.PostalCode),
        DestLocation:String.Format('{0},{1}{2}',this.DestinationPostalData.CityName,this.DestinationPostalData.StateCode,this.DestinationPostalData.PostalCode),
        SalesPersonList: [],
        BolDocumentsList: [],
        TrackingDetailsList: [],
        ServiceLevelName:selectedRate.ServiceLevel,
        ServiceLevelCode:selectedRate.SaasServiceLevelCode,
        RatingResultId:selectedRate.RatingResultId,
        Mode: 'LTL', // Ask selectedRate.ModeType,
        BOLStopLists: [],
        CostWithCustomerPercentage: selectedRate.CostWithCustomerPercentage,
        WaterfallList: [],
        orgTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode),
        destTerminalCityStateZipCode:String.Format('{0},{1},{2}',selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode),
        WaterfallDetailsList:null,
        EquipmentID: null
    };

    console.log('saveQuoteParameters',this.saveQuoteParameters)

    const responseData = await this.httpService.saveQuote(this.saveQuoteParameters);
    if (!String.IsNullOrWhiteSpace(responseData.ClientLadingNo))
    {
      this.messageService.SendQuoteParameter(responseData.ClientLadingNo);
      this.messageService.SendLadingIDParameter(responseData.LadingID.toString());
      this.snackbar.open('Quote is saved successfully with LoadNo ' + responseData.ClientLadingNo, null, {
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
  onChangeProductWeight(index: number): void{
    const product = this.quickQuoteFormGroup.get('products').value[index];
    const PCF = this.calculatePCF(product.Pallets, product.Length, product.Width, product.Height, product.Weight);
    (this.quickQuoteFormGroup.controls.products as FormArray).at(index).get('PCF').setValue(PCF);
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

  addShipmentButton(): void {
    this.messageService.SendQuoteParameter(String.Empty); // Clean LadingId parameter
    this.router.navigate(['/ui/forms/form-add-ship/'], { relativeTo: this.route });
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


}
