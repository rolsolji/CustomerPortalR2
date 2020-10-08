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
import { MessageService } from "../../../../common/message.service";
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
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
import { UtilitiesService } from "../../../../common/utilities.service";
import { DatePipe } from '@angular/common';    
import { MatListOption } from '@angular/material/list';
import { MatAccordion } from '@angular/material/expansion';
import icTwotoneCalendarToday from '@iconify/icons-ic/twotone-calendar-today';
import icBaselineImageNotSupported from '@iconify/icons-ic/baseline-image-not-supported';
import outlineSave from '@iconify/icons-ic/outline-save';
import outlinePrint from '@iconify/icons-ic/outline-print';
import outlineEmail from '@iconify/icons-ic/outline-email';
import { StepperSelectionEvent } from '@angular/cdk/stepper';


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
  ]
})
export class FormAddShipComponent implements OnInit {

  keyId: string = "1593399730488";
  ClientID: number = 8473;
  securityToken: string;

  quoteIdParameter: string;

  originCountries: Object;
  destinationCountries: Object;  
  packageTypes: Object;

  accessorialArray: AccessorialDetail[];    
  internalNotes: InternalNote[];
  showInternalNotesTitle: boolean = false;
  timesArray = ["", "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]  
  EquipmentOptions: EquipmentType[];
  PriorityOptions: ShipmentPriority[];
  ServiceLevelOptions: ServiceLevelDetail[];
  PaymentTerms: PaymentTerm[];
  ShipmentModeOptions: ShipmentMode[];
  ShipmentErrorOptions: ShipmentError[];  
  ShipmentCostObject: ShipmentCost;
  AccountInvoiceCostList: AccountInvoiceCostList[];
  displayedCostGridColumns: string[] = ['Code', 'Description', 'Amount'];
  TotalShipmentCost: number;
  showSpinner = false;
  getQuoteButtonClicked = false;
  spinnerMessage:string;
  ratesOpened: number[];
  sendEmailClicked: boolean = false;
  carrierImageUrl = "https://beta-customer.r2logistics.com/Handlers/CarrierLogoHandler.ashx?carrierID=";

  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  accessorials: AccessorialBase[] = [];
  accessorialIds: number[] = [];
  serviceLevels: ServiceLevel[] = [];
  rates: Rate[];
  ratesFiltered: Rate[];
  ratesCounter: number = 0;
  clientTLWeightLimit: string;
  clientDefaultData: ClientDefaultData;

  carrierSelected: string;

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

  equimentDescriptionSelected: string = '';
  priorityDescriptionSelected: string = '';
  serviceLevelDescriptionSelected: string = '';
  paymentTermDescriptionSelected: string = '';
  shipmentModeDescriptionSelected: string = '';

  pcoAutoCompleteOptions: Observable<PostalData[]>;
  pcdAutoCompleteOptions: Observable<PostalData[]>;  

  carrierAutoCompleteOptions: Observable<Object[]>;  

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private httpService : HttpService,
              private ratesService: RatesService,
              private messageService: MessageService,
              private utilitiesService: UtilitiesService,
              private datepipe: DatePipe) {
  }

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
        Hazmat: [false]
    })
  }  

  get formProducts() { return <FormArray>this.productsAndAccessorialsFormGroup.get('products'); }  
  get originPckupDate() { return this.originAndDestinationFormGroup.get('originpickupdate').value == null ? '' : new Date(this.originAndDestinationFormGroup.get('originpickupdate').value).toDateString(); }  
  get destExpDelDate() { return this.originAndDestinationFormGroup.get('destexpdeldate').value == null ? '' : new Date(this.originAndDestinationFormGroup.get('destexpdeldate').value).toDateString(); }  
  
  //Equipment change event
  selectChangeEquipment (event: any) {    
    this.fetchEquipment(event.value);
  }

  //Priority change event
  selectChangePriority (event: any) {    
    this.fetchPriority(event.value);
  }

  //Service Level change event
  selectChangeServiceLevel (event: any) {    
    this.fetchServiceLevel(event.value);
  }

  //Payment Term change event
   selectChangePaymentTerm (event: any) {    
    this.fetchPaymentTerm(event.value);
  }

  //Shipment Mode change event
  selectChangeShipmentMode (event: any) {    
    this.fetchShipmentMode(event.value);
  }
  
  async ngOnInit() {

    //Gets quotes parameter
    this.messageService.SharedQuoteParameter.subscribe(message => this.quoteIdParameter = message)

    //-- originAndDestinationFormGroup fields
    this.originAndDestinationFormGroup = this.fb.group({
      originname: [null, Validators.required],
      originadddress1: [null, Validators.required],
      originadddress2: [null],
      origincountry: [null, Validators.required],
      originpostalcode: [null, Validators.required],
      originstatename: [null, Validators.required],
      origincontact: [null],
      originphone: [null],
      originemail: [null, Validators.required],
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
      destemail: [null, Validators.required],
      // destnotes: [null],
      destexpdeldate: [null],
      destdelapptfrom: [null],
      destdelapptto: [null],  
      addToLocationsOrigin: [null],
      addToLocationsDest: [null]   
    });
    //--

    //-- productsAndAccessorialsFormGroup fields
    this.productsAndAccessorialsFormGroup = this.fb.group({
      products: this.fb.array([
        this.addProductFormGroup()
      ])   
    });
    //--

    //-- shipmentInfoFormGroup fields
    this.shipmentInfoFormGroup = this.fb.group({
      equipment: [7, Validators.required],
      priority: [null],
      customerref: [null],
      r2order: [null],
      r2pronumber: [null],
      paymentterms: [5],
      shipmentinfo: [null],
      pronumber: [null],
      mode: ["LTL", Validators.required],
      shipmentvalue: [null],
      valueperpound: [null],
      os_d: [null],
      servicelevel: [null, Validators.required],
      r2refno: [null],
      statuscode: [null],
      specialinstructions: [null],
      internalnote: [null]
    });
    //--  
    
    //-- confirmFormGroup fields
    this.confirmFormGroup = this.fb.group({
      carrier: [null, Validators.required],
      showTopCarriers: [10]
    });    
    //--

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
    this.accessorialArray = await this.httpService.getGetClientMappedAccessorials(this.ClientID, this.keyId);
    //this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);

    this.packageTypes = await this.httpService.getProductPackageType(this.keyId);   

    this.originCountries = responseData;
    this.destinationCountries = responseData;
    this.originSelectedCountry = responseData[0]; // US as default     
    this.destinationSelectedCountry = responseData[0]; // US as default    

    //-- Set default country for both countries dropdowns
    this.originAndDestinationFormGroup.controls['origincountry'].setValue(this.originSelectedCountry.CountryId, {onlySelf: false});
    this.originAndDestinationFormGroup.controls['destcountry'].setValue(this.destinationSelectedCountry.CountryId, {onlySelf: false});
    //--
    
    this.pcoAutoCompleteOptions = this.originAndDestinationFormGroup.get("originpostalcode").valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
            return this.pcoAutoCompleteFilter(val || '')
       })
      );

      this.pcdAutoCompleteOptions = this.originAndDestinationFormGroup.get("destpostalcode").valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.pcdAutoCompletefilter(val || '')             
        })
      );

    this.internalNotes = [];

    //-- Get Equipment Options
    this.EquipmentOptions = await this.httpService.getMasEquipment(this.keyId);

    //-- Get Priority Options
    this.PriorityOptions = await this.httpService.getMasShipmentPriority();

    //-- Get Service Level Options
    this.ServiceLevelOptions = await this.httpService.getMasServiceLevel(this.ClientID, this.keyId);

    //-- Get Payment Terms
    this.PaymentTerms = await this.httpService.getMasPaymentTerms();

    //-- Get Shipment Modes
    this.ShipmentModeOptions = await this.httpService.getShipmentMode(this.keyId);

    //-- Get Shipment Errors
    this.ShipmentErrorOptions = await this.httpService.getShipmentError(this.keyId);    

    //Get equipment description by default
    this.fetchEquipment(7);

    //Get payment term description by default
    this.fetchPaymentTerm(5);

    //Get shipment mode description by default
    this.fetchShipmentMode("LTL");


    //-- Get Shipment Costs
    this.ShipmentCostObject = await this.httpService.GetShipmentCostByLadingID(this.ClientID, this.keyId); 
    this.AccountInvoiceCostList = this.ShipmentCostObject.SellRates.AccountInvoiceCostList;
    this.TotalShipmentCost = this.ShipmentCostObject.SellRates.TotalBilledAmount;

    this.carrierAutoCompleteOptions = this.confirmFormGroup.get("carrier").valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this.carrierAutoCompletefilter(val || '')             
        })
      );

      this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);
    
      this.ratesOpened = []; //initiate ratesOpened array

    //console.log(this.ShipmentCostObject);
  }

  pcoAutoCompleteFilter(val: string): Observable<any[]> {
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }  

  pcoAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.originAndDestinationFormGroup.get('originstatename').setValue(event.option.value.StateName.trim());
    this.OriginPostalCode = String.Format("{0}-{1}",event.option.value.PostalCode,event.option.value.CityName.trim());  
    this.OriginPostalData = event.option.value;        
    this.originAndDestinationFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
  }

  pcdAutoCompletefilter(val: string): Observable<any[]> { 
    let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }  

  pcdAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.originAndDestinationFormGroup.get('deststatename').setValue(event.option.value.StateName.trim());
    this.DestinationPostalCode = String.Format("{0}-{1}",event.option.value.PostalCode,event.option.value.CityName.trim());  
    this.DestinationPostalData = event.option.value;        
    this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
  }

  postalData: PostalData[];
  postalDataDest: PostalData[];
  OriginPostalCode: string;
  OriginStateName: String;
  OriginPostalData: PostalData;
  OriginPickupDate: string;  

  async validateOriginPostalCode(event: KeyboardEvent){
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    this.OriginPostalCode = this.originAndDestinationFormGroup.get('originpostalcode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length == 5){
      let responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);  
      this.postalData = responseData;
      if (this.postalData != null && this.postalData.length > 0){        
        this.originAndDestinationFormGroup.get('originstatename').setValue(this.postalData[0].StateName.trim());
        this.OriginPostalCode = String.Format("{0}-{1}",this.postalData[0].PostalCode,this.postalData[0].CityName.trim());  
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

  //#region Destination Fields
  DestinationPostalCode: string;
  DestinationStateName: String;
  DestinationPostalData: PostalData;

  async validateDestinationPostalCode(event: KeyboardEvent){
    let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    this.DestinationPostalCode = this.originAndDestinationFormGroup.get('destpostalcode').value;
    if (this.DestinationPostalCode != null && this.DestinationPostalCode.trim().length == 5){
      let responseData = await this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,CountryId,this.keyId);
      this.postalDataDest = responseData;
      if (this.postalDataDest != null && this.postalDataDest.length > 0) 
      {        
        this.originAndDestinationFormGroup.get('deststatename').setValue(this.postalDataDest[0].StateName.trim());
        this.DestinationPostalCode = String.Format("{0}-{1}",this.postalDataDest[0].PostalCode,this.postalDataDest[0].CityName.trim());  
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
    (<FormArray>this.productsAndAccessorialsFormGroup.get('products')).push(this.addProductFormGroup());
  }

  removeNewProdField(index: number): void {  
    (<FormArray>this.productsAndAccessorialsFormGroup.get('products')).removeAt(index);      
  }

  submit() {
    //let test = this.shipInfoEquipment;

    this.snackbar.open('Shipment booked.', null, {
      duration: 5000
    });
  }

  addNewInternalNote(): void {  
    let note = {
      NoteId: (<InternalNote[]>this.internalNotes).length + 1,
      UserId: 1,
      UserName: "Admin",
      NoteText: this.shipmentInfoFormGroup.get('internalnote').value.trim(),
      Date: new Date()
    };

    this.internalNotes.push(note);
    this.shipmentInfoFormGroup.get('internalnote').setValue("");
    this.showInternalNotesTitle = true;
  }

  removeInternalNote(index: number): void {  
    (<InternalNote[]>this.internalNotes).splice(index, 1);      

    if (this.internalNotes.length > 0){
      this.showInternalNotesTitle = true;
    }
    else{
      this.showInternalNotesTitle = false;
    }
  } 

  // Event fired after view is initialized
  @ViewChild('stepper') stepper: MatStepper;
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
    let equimentDescription = "";
    if (this.EquipmentOptions != null && this.EquipmentOptions.length > 0){
      let equipment = <EquipmentType[]>this.EquipmentOptions.filter(equipment => equipment.EquipmentID == equipmentId);
      if (equipment != null){
        equimentDescription = equipment[0].Description;
      }
    }    
    this.equimentDescriptionSelected = equimentDescription;
    return equimentDescription;
  }

  fetchPriority(priorityId) {
    let priorityDescription = "";
    if (this.PriorityOptions != null && this.PriorityOptions.length > 0){
      let item = this.PriorityOptions.filter(item => item.PriorityID == priorityId);
      if (item != null){
        priorityDescription = item[0].Description;
      }
    }    
    this.priorityDescriptionSelected = priorityDescription;
    return priorityDescription;
  }

  fetchServiceLevel(serviceLevelId) {
    let serviceLevelDescription = "";
    if (this.ServiceLevelOptions != null && this.ServiceLevelOptions.length > 0){
      let item = this.ServiceLevelOptions.filter(item => item.ServiceLevelID == serviceLevelId);
      if (item != null){
        serviceLevelDescription = item[0].Description;
      }
    }    
    this.serviceLevelDescriptionSelected = serviceLevelDescription;
    return serviceLevelDescription;
  }

  fetchPaymentTerm(paymentTermId) {
    let Description = "";
    if (this.PaymentTerms != null && this.PaymentTerms.length > 0){
      let item = this.PaymentTerms.filter(item => item.PaymentTermID == paymentTermId);
      if (item != null){
        Description = item[0].Description;
      }
    }    
    this.paymentTermDescriptionSelected = Description;
    return Description;
  }

  fetchShipmentMode(modeCode) {
    let Description = "";
    if (this.ShipmentModeOptions != null && this.ShipmentModeOptions.length > 0){
      let item = this.ShipmentModeOptions.filter(item => item.ModeCode == modeCode);
      if (item != null){
        Description = item[0].Mode;
      }
    }    
    this.shipmentModeDescriptionSelected = Description;
    return Description;
  }

  Carrier: string;
  carrierData: Carrier[];

  async validateCarrier(event: KeyboardEvent){
    //--
    // let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    this.Carrier = this.confirmFormGroup.get('carrier').value;
    if (this.Carrier != null && this.Carrier.trim().length == 4){
      let responseData = await this.httpService.getCarrierData(this.ClientID, this.Carrier, this.keyId);
      this.carrierData = responseData;
      if (this.carrierData != null && this.carrierData.length > 0) 
      {        
        this.confirmFormGroup.get('carrier').setValue(String.Format("{0} - {1}",this.carrierData[0].CarrierID.trim(),this.carrierData[0].CarrierName.trim()));
        // this.DestinationPostalCode = String.Format("{0}-{1}",this.postalDataDest[0].PostalCode,this.postalDataDest[0].CityName.trim());  
        // this.DestinationPostalData = this.postalDataDest[0];               
        // this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
      }
      else
      {
        //this.DestinationStateName = String.Empty;
        this.Carrier = String.Empty;
        this.carrierData = null;
      }
    }         
  }

  carrierAutoCompletefilter(val: string): Observable<any[]> {     
    return this.httpService.carrierAutocomplete(this.ClientID, val, this.keyId)    
  }  

  carrierAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.confirmFormGroup.get('carrier').setValue(String.Format("{0} - {1}",event.option.value.CarrierID.trim(),event.option.value.CarrierName.trim()));
    this.carrierSelected = event.option.value.CarrierID.trim();
    // this.DestinationPostalCode = String.Format("{0}-{1}",event.option.value.PostalCode,event.option.value.CityName.trim());  
    // this.DestinationPostalData = event.option.value;        
    // this.originAndDestinationFormGroup.get('destpostalcode').setValue(this.DestinationPostalCode);
  }

  onGroupsChange(options: MatListOption[]) {    
    let selectedAccessorials = options.map(o => o.value)
    this.accessorials = [];
    this.accessorialIds = [];
    selectedAccessorials.forEach(a => {
      let accessorial: AccessorialBase = { 
        AccessorialID: a.AccessorialID, 
        AccessorialCode: a.AccesorialCode
      }

      this.accessorials.push(accessorial);
      this.accessorialIds.push(a.AccessorialID);      
    });    
  }

  async getQuote() {    
    this.getQuoteButtonClicked = true;        
    this.showSpinner = true;   
    let test = await this.getShipmentRates();       
    this.showSpinner = false;      
  }

  async getShipmentRates() {

    this.spinnerMessage = "Loading...";    

    let pickupDate = this.OriginPickupDate;
    let arrayProducts = this.productsAndAccessorialsFormGroup.get('products').value;

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
      "ShipmentDate": String.Format("/Date({0})/",this.originAndDestinationFormGroup.get('originpickupdate').value.getTime()),
      "Accessorials": this.accessorials,
      "AccessorialCodes": [],
      "TopN": this.confirmFormGroup.get('showTopCarriers').value,
      "ServiceLevelGrops": [],
      "ServiceLevels": [],//this.serviceLevels,
      "ServiceLevelCodes": [],
      //Ask
      "SCAC": this.carrierSelected,
      "EquipmentList": [],
      "IsBuyRates": false,
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
    console.log( this.rates);           
     
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
          let days: number = +r.TransitTime;
          today = this.utilitiesService.AddBusinessDays(today, days);
          r.ETA = String.Format("{0} (ETA)", this.datepipe.transform(today,'yyyy-MM-dd'));
        }
        else {
          r.ETA = String.Empty;
        }
      });     

      this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';      
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

  async selectQuote(index: number){
    // await this.save(index);
    // this.router.navigate(['/ui/forms/form-add-ship/'], { relativeTo: this.route });
    //routerLink="/ui/forms/form-add-ship"
  }

  async saveQuote(index: number){
    // await this.save(index);
    // this.router.navigate(['../shipmentboard/LTLTL/'], { relativeTo: this.route });
  }

  onChangeProductWeight(index: number): void{
    let product = this.productsAndAccessorialsFormGroup.get('products').value[index];     
    let PCF = this.calculatePCF(product.Pallets, product.Length, product.Width, product.Height, product.Weight);   
    (<FormArray>this.productsAndAccessorialsFormGroup.controls['products']).at(index).get("PCF").setValue(PCF);     
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

  clearRatesSection(){
    this.ratesCounter = 0;
    this.getQuoteButtonClicked = false;
  }

  previousFromLastStep(){
    this.clearRatesSection()
  }

  StepperSelectionChange(event: StepperSelectionEvent){
    //console.log(event);
    this.clearRatesSection()
  }

}
