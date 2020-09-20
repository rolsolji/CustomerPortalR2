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
import { Accessorial } from '../../../../Entities/Accessorial';
import { InternalNote } from '../../../../Entities/InternalNote';
import { ShipmentCost } from '../../../../Entities/ShipmentCost';
import { MessageService } from "../../../../common/message.service";
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';


@Component({
  selector: 'vex-form-add-ship',
  templateUrl: './form-add-ship.component.html',
  styleUrls: ['./form-add-ship.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  accesorials: Accessorial[];    
  internalNotes: InternalNote[];
  showInternalNotesTitle: boolean = false;
  timesArray = ["", "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]  

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

  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;

  pcoAutoCompleteOptions: Observable<PostalData[]>;
  pcdAutoCompleteOptions: Observable<PostalData[]>;  

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private httpService : HttpService,
              private messageService: MessageService) {
  }

  addProductFormGroup(): FormGroup{
    return this.fb.group({
      Pallets: [null, Validators.required],
      Pieces: [null],
        Package: [3],
        ProductClass: [null, Validators.required],
        NMFC: [null],
        Description: [null, Validators.required],
        Length: [null, Validators.required],
        Width: [null, Validators.required],
        Height: [null, Validators.required],
        PCF: [null],
        Weight: [null, Validators.required],
        addToProductMaster: [null],
        Stackable: [null],
        Hazmat: [null]
    })
  }  

  get formProducts() { return <FormArray>this.productsAndAccessorialsFormGroup.get('products'); } 

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
      equipment: [null, Validators.required],
      priority: [null],
      customerref: [null],
      r2order: [null],
      r2pronumber: [null],
      paymentterms: [null],
      shipmentinfo: [null],
      pronumber: [null],
      mode: [null, Validators.required],
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
    
    this.confirmFormGroup = this.fb.group({
      terms: [null, Validators.requiredTrue]
    });

    try{
      this.securityToken = await this.httpService.getMainToken(); 
    }
    catch(ex){
      console.log(ex);
    }

    this.httpService.token = this.securityToken;

    let responseData = await this.httpService.getCountryList(this.keyId);   
    this.accesorials = await this.httpService.getGetClientMappedAccessorials(this.ClientID, this.keyId);
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

}
