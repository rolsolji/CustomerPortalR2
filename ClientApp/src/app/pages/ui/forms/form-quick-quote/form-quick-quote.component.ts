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
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
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
import outlineSave from '@iconify/icons-ic/outline-save';
import outlinePrint from '@iconify/icons-ic/outline-print';
import outlineEmail from '@iconify/icons-ic/outline-email';

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
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { async } from '@angular/core/testing';
import { Converter } from 'showdown';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from "../../../../common/message.service";
import { UtilitiesService } from "../../../../common/utilities.service";

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
  quickQuoteFormGroup: FormGroup;
  emailFormGroup: FormGroup;
  showSpinner = false;
  getQuoteButtonClicked = false;

  @HostListener('window:scroll')
  selectCtrl: FormControl = new FormControl();
  inputType = 'password';
  visible = false;

  keyId: string = "1593399730488";
  ClientID: number = 8473;
  clientDefaultData: ClientDefaultData;
  clientTLWeightLimit: string;
  carrierImageUrl = "https://beta-customer.r2logistics.com/Handlers/CarrierLogoHandler.ashx?carrierID=";
  securityToken: string;

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

  stateCtrl = new FormControl();
  
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

   rates: Rate[];
   ratesFiltered: Rate[];
   originCountries: Object;
   destinationCountries: Object;
   ratesCounter: number = 0;
   searchOriginPostalCode: boolean = true;
   searchDestinationPostalCode: boolean = true;

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
   showLoadingPanel: boolean = false;
   panelCollectionServiceState = false;
   panelDeliveryServiceState = false;
   ratesOpened: number[];
   sendEmailClicked: boolean = false;

   collectionServicesSelected: number = 0;
   collectionServicesDescription: string = "Select Collection Services";
   deliveryServicesSelected: number = 0;
   deliveryServicesDescription: string = "Select Delivery Services";  

  pcoAutoCompleteOptions: Observable<PostalData[]>;
  pcdAutoCompleteOptions: Observable<PostalData[]>;  

  saveQuoteParameters: SaveQuoteParameters;

  spinnerMessage:string;

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
    public datepipe: DatePipe
    ) { }

  async ngOnInit() {       
    
    //-- Main Form Group fields
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
      //#endregion
      products: this.fb.array([
        this.addProductFormGroup()
      ])    
    });

    //-- emailFormGroup fields
    this.emailFormGroup = this.fb.group({
      emailToSendQuote: [null, Validators.required]
    });
    //--
   
    try{
      this.securityToken = await this.httpService.getMainToken(); 
    }
    catch(ex){
      console.log(ex);
    }

    this.httpService.token = this.securityToken;

    let responseData = await this.httpService.getCountryList(this.keyId);   
    this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);

    this.originCountries = responseData;
    this.destinationCountries = responseData;
    this.originSelectedCountry = responseData[0]; // US as default     
    this.destinationSelectedCountry = responseData[0]; // US as default    
    
    this.packageTypes = await this.httpService.getProductPackageType(this.keyId);    

    this.pcoAutoCompleteOptions = this.quickQuoteFormGroup.get("originpostalcode").valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
            return this.pcoAutoCompleteFilter(val || '')
       })
      );
      
    this.pcdAutoCompleteOptions = this.quickQuoteFormGroup.get("destinationpostalcode").valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.pcdAutoCompletefilter(val || '')             
        })
      );

    this.ratesOpened = []; //initiate ratesOpened array

  } 

  pcoAutoCompleteFilter(val: string): Observable<any[]> {
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }  

  pcoAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.quickQuoteFormGroup.get('originstatename').setValue(event.option.value.StateName.trim());
    this.OriginPostalCode = String.Format("{0}-{1}",event.option.value.PostalCode,event.option.value.CityName.trim());  
    this.OriginPostalData = event.option.value;        
    this.quickQuoteFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
  }

  pcdAutoCompletefilter(val: string): Observable<any[]> { 
    let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }  

  pcdAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.quickQuoteFormGroup.get('destinationstatename').setValue(event.option.value.StateName.trim());
    this.DestinationPostalCode = String.Format("{0}-{1}",event.option.value.PostalCode,event.option.value.CityName.trim());  
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
      Status: 1      
    })
  }  

  get formProducts() { return <FormArray>this.quickQuoteFormGroup.get('products'); }  

  // ngAfterViewInit() {
  //   this.mapInitializer();
  // }
  isShow: boolean;
  topPosToStartShowing = 100;
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

  rightPanelImage: any = "assets/img/demo/R2TestImage.png";

  async getQuote() {    
    this.getQuoteButtonClicked = true;        
    this.showSpinner = true;   
    let test = await this.getShipmentRates();       
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
    this.rightPanelImage = "assets/img/demo/R2TestImage.png";
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
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

  //#region Origin Fields

  postalData: PostalData[] = [];
  postalDataDest: PostalData[] = [];
  OriginPostalCode: string;
  OriginStateName: String;
  OriginPostalData: PostalData;
  OriginPickupDate: string;

  validateCollectionServices(event,code: string){
    console.log("checked", code);
    if(event.checked){
      // Add a new control in the arrayForm
      let accessorial: AccessorialBase = { 
        AccessorialID: event.source.value, 
        AccessorialCode: code
      }

      this.accessorials.push(accessorial);
      this.accessorialIds.push(event.source.value);
    }
    /* unselected */
    else{
      console.log("unchecked", event.source.value);

      this.accessorials = this.accessorials.filter(a => a.AccessorialID !== event.source.value);
      this.accessorialIds = this.accessorialIds.filter(a => a !== event.source.value)
    }

    console.log(this.accessorials);

    this.collectionServicesSelected = 0;    
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('residential').value ? 1 : 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('limitedAccess').value ? 1 : 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('insidePickup').value ? 1 : 0;
    this.collectionServicesSelected += this.quickQuoteFormGroup.get('liftgateRequiredAtPickup').value ? 1 : 0;
    this.collectionServicesDescription = this.collectionServicesSelected > 0 ? String.Format("Selected: {0}", this.collectionServicesSelected) : "Select Collection Services";
  }

  validateDeliveryServices(event,code: string){

    console.log("checked", code);
    if(event.checked){
      // Add a new control in the arrayForm
      if (code == 'STD' || code == 'GTS') {
        let serviceLevel: ServiceLevel = {
          ServiceLevelID: event.source.value,
          ServiceLevelCode: code 
        }

        this.serviceLevels.push(serviceLevel);
      }
      else {
        let accessorial: AccessorialBase = { 
          AccessorialID: event.source.value, 
          AccessorialCode: code
        }
  
        this.accessorials.push(accessorial);
        this.accessorialIds.push(event.source.value);
      }
    }
    /* unselected */
    else{
      console.log("unchecked", event.source.value);
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
    this.deliveryServicesDescription = this.deliveryServicesSelected > 0 ? String.Format("Selected: {0}", this.deliveryServicesSelected) : "Select Delivery Services";
  }

  async getPostalCode(postalCode: string){
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    let responseData = await this.httpService.getPostalDataByPostalCode(postalCode,CountryId,this.keyId);
    this.postalData = responseData;
    return of (responseData);
  }

  async validateOriginPostalCode(event: KeyboardEvent){
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    this.OriginPostalCode = this.quickQuoteFormGroup.get('originpostalcode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length == 5){
      let responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);  
      this.postalData = responseData;
      if (this.postalData != null && this.postalData.length > 0){        
        this.quickQuoteFormGroup.get('originstatename').setValue(this.postalData[0].StateName.trim());
        this.OriginPostalCode = String.Format("{0}-{1}",this.postalData[0].PostalCode,this.postalData[0].CityName.trim());  
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
  //#endregion

  //#region Destination Fields
  DestinationPostalCode: string;
  DestinationStateName: String;
  DestinationPostalData: PostalData;

  async validateDestinationPostalCode(event: KeyboardEvent){
    let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    this.DestinationPostalCode = this.quickQuoteFormGroup.get('destinationpostalcode').value;
    if (this.DestinationPostalCode != null && this.DestinationPostalCode.trim().length == 5){
      let responseData = await this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,CountryId,this.keyId);
      this.postalDataDest = responseData;
      if (this.postalDataDest != null && this.postalDataDest.length > 0) 
      {        
        this.quickQuoteFormGroup.get('destinationstatename').setValue(this.postalDataDest[0].StateName.trim());
        this.DestinationPostalCode = String.Format("{0}-{1}",this.postalDataDest[0].PostalCode,this.postalDataDest[0].CityName.trim());  
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
  //#endregion

  @Input() childProductField: ProductFeatures;
  @Output() parentProductFields = new EventEmitter<ProductFeatures>();


  addNewProdField(): void {        
    (<FormArray>this.quickQuoteFormGroup.get('products')).push(this.addProductFormGroup());
  }

  removeNewProdField(index: number): void {  
    (<FormArray>this.quickQuoteFormGroup.get('products')).removeAt(index);      
  }

  async getShipmentRates() {

      this.spinnerMessage = "Loading...";

      let pickupDate = this.OriginPickupDate;
      let arrayProducts = this.quickQuoteFormGroup.get('products').value;

      let objRate = {
        "ClientID": this.ClientID,
        "ProfileID": 11868,
        "Products": arrayProducts,
        "SourcePostalCode": this.OriginPostalData.PostalCode,
        "SourceCityID": this.OriginPostalData.CityID,
        "SourceStateID": this.OriginPostalData.StateId,
        "SourceCountryID": this.OriginPostalData.CountryId,
        "SourceCountry": this.OriginPostalData.CountryCode,
        "SourceStateCode": this.OriginPostalData.StateCode,
        "SourceCityName": this.OriginPostalData.CityName,
        "DestPostalCode": this.DestinationPostalData.PostalCode,
        "DestCityID": this.DestinationPostalData.CityID,
        "DestStateID": this.DestinationPostalData.StateId,
        "DestCountryID": this.DestinationPostalData.CountryId,
        "DestCountry": this.DestinationPostalData.CountryCode,
        "DestStateCode": this.DestinationPostalData.StateCode,
        "DestCityName": this.DestinationPostalData.CityName,
        "ShipmentDate": String.Format("/Date({0})/",this.quickQuoteFormGroup.get('originpickupdate').value.getTime()),
        "Accessorials": this.accessorials,
        "AccessorialCodes": [],
        "TopN": 10,
        "ServiceLevelGrops": [],
        "ServiceLevels": this.serviceLevels,
        "ServiceLevelCodes": [],
        //Ask
        //"SCAC": null,
        "EquipmentList": [],
        "IsDebug": false,
        "IsSuperAdmin": false,
        "AccessorialIDs": this.accessorialIds,
        "SkeepCalculatePPS": false,
        //Ask
        //"ProfileDescription": "**R2 BUY",
        "Origin":  this.OriginPostalData.PostalCode + ',' +  this.OriginPostalData.CityName + ',' + this.OriginPostalData.StateName,
        "Destination": this.DestinationPostalData.PostalCode + ',' +  this.DestinationPostalData.CityName + ',' + this.DestinationPostalData.StateName,
        //Ask
        //"ShipmentStopList": []
      };

      console.log(objRate);
      
      this.rates = await this.ratesService.postRates(objRate);
      
      this.rates.forEach(r => {
        if (!String.IsNullOrWhiteSpace(r.TransitTime)){
          let today = new Date();
          let days: number = +r.TransitTime;
          today = this.utilitiesService.AddBusinessDays(today, days);
          r.ETA = String.Format("{0} (ETA)", this.datepipe.transform(today,'yyyy-MM-dd'));
        }
        else {
          r.ETA = String.Empty;
        }
      });

      

      // setTimeout(()=>{    //<<<---    using ()=> syntax       
      //   this.ratesCounter = 8;
      //   this.showSpinner = false;
      //   this.cd.markForCheck();        
      // }, 3000);
      //console.log( this.rates); 
      if ( this.rates != null &&  this.rates.length > 0){
            this.ratesFiltered =  this.rates.filter(rate => rate.CarrierCost > 0);           
            console.log(this.ratesFiltered);         
            this.ratesCounter = this.ratesFiltered.length; 
            this.snackbar.open(this.ratesCounter + ' rates retuned.', null, {
              duration: 5000
            });

            this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';
            //console.log(this.clientDefaultData);            
      }
  }
                        
  //#region RatesOpened
  addRateOpened(rateIndex: number): void{      
    let index: number = this.ratesOpened.indexOf(rateIndex);
    if (index == -1) {
      this.ratesOpened.push(rateIndex)
    }   
    
    this.sendEmailClicked = false;
  }

  removeRateClosed(rateIndex: number): void{     
    let index: number = this.ratesOpened.indexOf(rateIndex);
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
    //routerLink="/ui/forms/form-add-ship"
  }

  async saveQuote(index: number){
    await this.save(index);
    this.router.navigate(['../shipmentboard/LTLTL/'], { relativeTo: this.route });
  }

  async save(index: number){

    this.spinnerMessage = "Saving quote";
    this.showSpinner = true;

    console.log(index);

    let selectedRate = this.ratesFiltered[index];

    console.log("save quote start",selectedRate);

    let arrayProducts = this.quickQuoteFormGroup.get('products').value;
    let productList: BOlProductsList[] = [];
    arrayProducts.forEach(p => {
      let prod : BOlProductsList = {
        Description: "NA",
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

      console.log("p", p);

      console.log("prod", prod);

      productList.push(prod);
    });

    let accountInvoiceCostList: AccountInvoiceCost[] = [];
    
    selectedRate.Accessorials.forEach(a => {
      let accountInvoiceCost: AccountInvoiceCost = {
        AccessorialID: a.AccessorialID,
        RatedCost: a.AccessorialCharge,
        BilledCost: a.AccessorialCharge,
        Description: a.AccessorialDescription,
        CostStatus: 1 //Ask 
      }
      accountInvoiceCostList.push(accountInvoiceCost);
    })

    //Ask
    //Freight
    let accountInvoiceFreight: AccountInvoiceCost = {
      AccessorialID: 22,
      RatedCost: selectedRate.GrossAmount,
      BilledCost: selectedRate.GrossAmount,
      Description: "Freight",
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceFreight);

    //Fuel
    let accountInvoiceFuel: AccountInvoiceCost = {
      AccessorialID: 23,
      RatedCost: selectedRate.FuelCost,
      BilledCost: selectedRate.FuelCost,
      Description: "Fuel",
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceFuel);

    //Discount
    let accountInvoiceDiscount: AccountInvoiceCost = {
      AccessorialID: 24,
      RatedCost: -1 * selectedRate.Discount,
      BilledCost: -1 * selectedRate.Discount,
      Description: "Discount",
      CostStatus: 1
    }
    accountInvoiceCostList.push(accountInvoiceDiscount);

    let sellRate: SellRate = {
      SCAC: selectedRate.CarrierID,
      CarrierName: selectedRate.CarrierName,
      AccountInvoiceCostList: accountInvoiceCostList 
    }

    let bolAccesorials: BOLAccesorial[] = [];
    this.accessorials.forEach(a => {
      let acc: BOLAccesorial = {
        AccesorialID: a.AccessorialID,
        IsAccesorial: true
      }
      bolAccesorials.push(acc);
    })

    console.log("Prod", productList)

    this.saveQuoteParameters = {
        ClientId: this.ClientID,
        PickupDate: String.Format("/Date({0})/",this.quickQuoteFormGroup.get('originpickupdate').value.getTime()),
        OrgName: "NA",
        OrgAdr1: "NA",
        OrgCity: Number(this.OriginPostalData.CityID),
        OrgState: Number(this.OriginPostalData.StateId),
        OrgCountry: Number(this.OriginPostalData.CountryId),
        DestName: "NA",
        DestAdr1: "NA",
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
        //Ask
        ServiceLevelID: 1, //ask selectedRate.ServiceLevelCode,
        BOlProductsList: productList,
        BOLAccesorialList: bolAccesorials,
        BOLDispatchNotesList: [],
        BuyRates: null,
        SellRates: sellRate,
  
        LoggedInUserId: 1,
        OrgCityName:this.OriginPostalData.CityName,
        OrgStateCode:this.OriginPostalData.StateCode,
        OrgCountryCode:this.OriginPostalData.CountryCode,
        OrgZipCode:this.OriginPostalData.PostalCode,
        DestCityName:this.DestinationPostalData.CityName,
        DestStateCode:this.DestinationPostalData.StateCode,
        DestCountryCode:this.DestinationPostalData.CountryCode,
        DestZipCode:this.DestinationPostalData.PostalCode,
        OrgLocation:String.Format("{0},{1}{2}",this.OriginPostalData.CityName,this.OriginPostalData.StateCode,this.OriginPostalData.PostalCode),
        DestLocation:String.Format("{0},{1}{2}",this.DestinationPostalData.CityName,this.DestinationPostalData.StateCode,this.DestinationPostalData.PostalCode),
        SalesPersonList: [],
        BolDocumentsList: [],
        TrackingDetailsList: [],
        ServiceLevelName:selectedRate.ServiceLevel,
        ServiceLevelCode:selectedRate.SaasServiceLevelCode,
        RatingResultId:selectedRate.RatingResultId,
        Mode: "LTL", //Ask selectedRate.ModeType,
        BOLStopLists: [],
        CostWithCustomerPercentage: selectedRate.CostWithCustomerPercentage,
        WaterfallList: [],
        orgTerminalCityStateZipCode:String.Format("{0},{1},{2}",selectedRate.OriginTerminalCity,selectedRate.OriginTerminalState,selectedRate.OriginTerminalZipCode),
        destTerminalCityStateZipCode:String.Format("{0},{1},{2}",selectedRate.DestTerminalCity,selectedRate.DestTerminalState,selectedRate.DestTerminalZipCode),
        WaterfallDetailsList:null
    };

    console.log("saveQuoteParameters",this.saveQuoteParameters)
    
    let responseData = await this.httpService.saveQuote(this.saveQuoteParameters);
    if (!String.IsNullOrWhiteSpace(responseData.ClientLadingNo))
    {
      this.messageService.SendQuoteParameter(responseData.ClientLadingNo);
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
    let product = this.quickQuoteFormGroup.get('products').value[index];     
    let PCF = this.calculatePCF(product.Pallets, product.Length, product.Width, product.Height, product.Weight);
    //this.quickQuoteFormGroup.get('destinationstatename').setValue(this.postalDataDest[0].StateName.trim());
    //this.quickQuoteFormGroup.get('products')[index].setValue(product);
    (<FormArray>this.quickQuoteFormGroup.controls['products']).at(index).get("PCF").setValue(PCF); 
    //product.PCF = PCF;
   }

  calculatePCF(Pallets, Lenght, Width, Height, Weight): number {
    var length;
    var width;
    var height;
    var volum;
    var density;
    var perpallet;
    var PCF;
    if (Lenght != null && Lenght != "" && Width != null && Width != "" && Height != null && Height != "" &&
     Weight != null && Weight != "" && Lenght != 0 && Width != 0 && Height != 0 && Weight != 0) {
        length = parseInt(Lenght);
        width = parseInt(Width);
        height = parseInt(Height);
        if (length != null && length != "" && width != null && width != "" && height != null && height != null) {
            volum = (length * width * height) / 1728;
        }
        if (volum != null && volum != "" && volum != 0) {
            if (Pallets != null && Pallets != "" && Pallets != 0) {
                perpallet = parseFloat(Weight) / parseFloat(parseFloat(Pallets).toFixed(4));
                if (perpallet != null && perpallet != "" && perpallet != 0) {
                    density = parseFloat(perpallet) / parseFloat(parseFloat(volum).toFixed(4));
                }
            }
            else {
                density = parseFloat(Weight) / parseFloat(parseFloat(volum).toFixed(4));
            }
        }
        if (density != null && density != "") {
            PCF =  parseFloat(parseFloat(density).toFixed(2));
        }
    }


    return PCF;
  }
}
