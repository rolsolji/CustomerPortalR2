import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
import {MatAccordion} from '@angular/material/expansion';
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


export interface CountryState {
  name: string;
  population: string;
  flag: string;
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

  stateCtrl = new FormControl();
  states: CountryState[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];
  filteredStates$ = this.stateCtrl.valueChanges.pipe(
    startWith(''),
    map(state => state ? this.filterStates(state) : this.states.slice())
  );

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  map: google.maps.Map;
  lat = 40.730610;
  lng = -73.935242;

  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
  };

  // mapInitializer() {
  //   this.map = new google.maps.Map(this.gmap.nativeElement, 
  //   this.mapOptions);
  //  }  

   rates: Rate[];
   ratesFiltered: Rate[];
   originCountries: Object;
   destinationCountries: Object;
   ratesCounter: number = 0;

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

   packageTypes: Object;
   productPackageType: ProductPackageType[];
   originpostalcodeControl = new FormControl('');
   destinationpostalcodeControl = new FormControl('');
   showLoadingPanel: boolean = false;
   panelOpenState = false;


  //  products: ProductFeatures[] = [
  //   {
  //     id:1,
  //     pallet: 0,
  //     pieces: 0,
  //     package: 0,
  //     freightClass: 0,
  //     nmfc: 0,
  //     large: 0,
  //     width: 0,
  //     height: 0,
  //     pcf: 0,
  //     totalWeight: 0,
  //     stackable: false,
  //     hazmat: false,
  //   }
  // ]

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef, 
    private ratesService: RatesService,
    private httpService : HttpService,
    private snackbar: MatSnackBar
    ) { }

  async ngOnInit() {    
    
    //-- Form Group fields
    this.quickQuoteFormGroup = this.fb.group({
      originpostalcode: [null, Validators.required],
      originstatename: [null, Validators.required],
      originpickupdate: [null, Validators.required],
      destinationpostalcode: [null, Validators.required],
      destinationstatename: [null, Validators.required],      
      products: this.fb.array([
        this.addProductFormGroup()
      ])

      // products: this.fb.group({
      //   pallet: [null, Validators.required],
      //   pieces: [null, Validators.required],
      //   package: [null, Validators.required],
      //   freightClass: [null, Validators.required],
      //   nmfc: [null],
      //   large: [null, Validators.required],
      //   width: [null, Validators.required],
      //   height: [null, Validators.required],
      //   pcf: [null],
      //   totalWeight: [null, Validators.required]        
      // })  
    });
    //--

    let responseData = await this.httpService.getContryList(this.keyId);   
    this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);    
    console.log(this.clientDefaultData);
    this.originCountries = responseData;
    this.destinationCountries = responseData;
    this.originSelectedCountry = responseData[0]; // US as default     
    this.destinationSelectedCountry = responseData[0]; // US as default      

    //console.log(this.originSelectedCountry);

    //console.log(this.destinationSelectedCountry);

    this.httpService.getProductPackageType(this.keyId).subscribe(date =>
      {this.packageTypes = date;
    });    
  }

  addProductFormGroup(): FormGroup{
    return this.fb.group({
      Pallets: [null, Validators.required],
      Pieces: [null, Validators.required],
        Package: [null],
        ProductClass: [null, Validators.required],
        NMFC: [null],
        Length: [null, Validators.required],
        Width: [null, Validators.required],
        Height: [null, Validators.required],
        PCF: [null],
        Weight: [null, Validators.required]      
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

  rightPanelImage: any = "../../../../../assets/img/demo/R2TestImage.png";

  async getQuote() {
    console.log(this.quickQuoteFormGroup.get('products').value);
    this.getQuoteButtonClicked = true;
    //this.rightPanelImage = "../../../../../assets/img/demo/TestImageRates.png";
    console.log('print at start.');  
    this.showSpinner = true;   
    let test = await this.getShipmentRates();       
    this.showSpinner = false;
    //this.cd.markForCheck(); 
    
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
    this.rightPanelImage = "../../../../../assets/img/demo/R2TestImage.png";
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

  filterStates(name: string) {
    return this.states.filter(state => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  //#region Origin Fields

  postalData: PostalData[];
  postalDataDest: PostalData[];
  OriginPostalCode: string;
  OriginStateName: String;
  OriginPostalData: PostalData;
  OriginPickupDate: string;



  async validateOriginPostalCode(){
    console.log(this.originSelectedCountry);
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    this.OriginPostalCode = this.quickQuoteFormGroup.get('originpostalcode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length > 0)
    {
      console.log('before...')
      let responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);
      console.log(responseData)     
      this.postalData = responseData;
      if (this.postalData != null && this.postalData.length > 0) 
      {        
        this.quickQuoteFormGroup.get('originstatename').setValue(this.postalData[0].StateName);
        this.OriginPostalCode = String.Format("{0}-{1}",this.OriginPostalCode,this.postalData[0].CityName);  
        this.OriginPostalData = this.postalData[0];        
        this.quickQuoteFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
      }
      else
      {
        this.OriginStateName = String.Empty;
        this.OriginPostalCode = String.Empty;
        this.OriginPostalData = null;
      }
      
      // console.log('before...')
      // this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId).subscribe(data => {
      //   console.log(data);
      //   this.postalData = data;       
      //   if (this.postalData != null && this.postalData.length > 0) 
      //   {
      //     this.OriginStateName = this.postalData[0].StateName;
      //     this.OriginPostalCode = String.Format("{0}-{1}",this.OriginPostalCode,this.postalData[0].CityName);  
      //     this.OriginPostalData = this.postalData[0];
      //   }
      //   else
      //   {
      //     this.OriginStateName = String.Empty;
      //     this.OriginPostalCode = String.Empty;
      //     this.OriginPostalData = null;
      //   }
      // });

      console.log('after...')      
    }
    
  }
  //#endregion

  //#region Destination Fields
  DestinationPostalCode: string;
  DestinationStateName: String;
  DestinationPostalData: PostalData;

  async validateDestinationPostalCode(){
    console.log(this.destinationSelectedCountry);
    let CountryId = this.destinationSelectedCountry == null ? "1": this.destinationSelectedCountry.CountryId.toString();
    this.DestinationPostalCode = this.quickQuoteFormGroup.get('destinationpostalcode').value;
    if (this.DestinationPostalCode != null && this.DestinationPostalCode.trim().length > 0){

      let responseData = await this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,CountryId,this.keyId);
      this.postalDataDest = responseData;
      if (this.postalDataDest != null && this.postalDataDest.length > 0) 
      {        
        this.quickQuoteFormGroup.get('destinationstatename').setValue(this.postalDataDest[0].StateName);
        this.DestinationPostalCode = String.Format("{0}-{1}",this.DestinationPostalCode,this.postalDataDest[0].CityName);  
        this.DestinationPostalData = this.postalDataDest[0];               
        this.quickQuoteFormGroup.get('destinationpostalcode').setValue(this.DestinationPostalCode);
      }
      else
      {
        this.DestinationStateName = String.Empty;
        this.DestinationPostalCode = String.Empty;
        this.DestinationPostalData = null;
      }

      // this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,CountryId,this.keyId).subscribe(data => {
      //   this.postalDataDest = data;       
      //   if (this.postalDataDest != null && this.postalDataDest.length > 0)
      //   {
      //     this.DestinationStateName = this.postalDataDest[0].StateName;
      //     this.DestinationPostalCode = String.Format("{0}-{1}",this.DestinationPostalCode,this.postalDataDest[0].CityName);
      //     this.destinationPostalData = this.postalDataDest[0];
      //   }
      //   else
      //   {
      //     this.DestinationStateName = String.Empty;
      //     this.DestinationPostalCode = String.Empty;
      //     this.destinationPostalData = null;
      //   }
      // });
    }         
  }
  //#endregion

  @Input() childProductField: ProductFeatures;
  @Output() parentProductFields = new EventEmitter<ProductFeatures>();


  addNewProdField(): void {
    // let prod: ProductFeatures =  {
    //   id:this.products.length + 1,
    //   pallet: 0,
    //   pieces: 0,
    //   package: 0,
    //   freightClass: 0,
    //   nmfc: 0,
    //   large: 0,
    //   width: 0,
    //   height: 0,
    //   pcf: 0,
    //   totalWeight: 0,
    //   stackable: false,
    //   hazmat: false,
    // } ;
    
    // this.products.push(prod);
    // console.log(`In method  addNewProdField field index is ${index} and field is ${JSON.stringify(JSON.stringify(prod))}`);
    
    (<FormArray>this.quickQuoteFormGroup.get('products')).push(this.addProductFormGroup());

  }

  removeNewProdField(index: number): void {  
    (<FormArray>this.quickQuoteFormGroup.get('products')).removeAt(index);      
  }

  async getShipmentRates()
    {
      let pickupDate = this.OriginPickupDate;
      let arrayProducts = this.quickQuoteFormGroup.get('products').value;

      // "Products": [
      //   {
      //     "Weight": "1000",
      //     "ProductClass": "50",
      //     "Pieces": "1",
      //     "Pallets": "1",
      //     "Length": "48",
      //     "Height": "48",
      //     "Width": 48,
      //     "PCF": "15.63"
      //   }
      // ],

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
        "ShipmentDate": "/Date(1593388800000)/",
        "Accessorials": [],
        "AccessorialCodes": [],
        "TopN": 10,
        "ServiceLevelGrops": [],
        "ServiceLevels": [],
        "ServiceLevelCodes": [],
        "SCAC": null,
        "EquipmentList": [],
        "IsDebug": false,
        "IsSuperAdmin": false,
        "AccessorialIDs": [],
        "SkeepCalculatePPS": false,
        "ProfileDescription": "**R2 BUY",
        "Origin":  this.OriginPostalData.PostalCode + ',' +  this.OriginPostalData.CityName + ',' + this.OriginPostalData.StateName,
        "Destination": this.DestinationPostalData.PostalCode + ',' +  this.DestinationPostalData.CityName + ',' + this.DestinationPostalData.StateName,
        "ShipmentStopList": []
      };

      // await this.ratesService.postRates(objRate).subscribe(res => { 
      //       //let artcl: Article = res.body;
      //       console.log('test rates API...');
      //       console.log(res.body);
      //       console.log(res.headers.get('Content-Type'));		
      //       this.rates = res.body;
      //       if (this.rates != null && this.rates.length > 0){
      //         this.ratesFiltered = this.rates.filter(rate => rate.CarrierCost > 0);
      //       }
            
      //       this.ratesCounter = this.ratesFiltered.length; 
      //     },
      //       (err: HttpErrorResponse) => {
      //             if (err.error instanceof Error ) {
      //               //A client-side or network error occurred.				 
      //               console.log('An error occurred:', err.error.message);
      //             } else {
      //               //Backend returns unsuccessful response codes such as 404, 500 etc.				 
      //               console.log('Backend returned status code: ', err.status);
      //               console.log('Response body:', err.error);
      //             }
      //           }
      //       );

      this.rates = await this.ratesService.postRates(objRate);
         
      // setTimeout(()=>{    //<<<---    using ()=> syntax       
      //   this.ratesCounter = 8;
      //   this.showSpinner = false;
      //   this.cd.markForCheck();        
      // }, 3000);
      console.log( this.rates); 
      if ( this.rates != null &&  this.rates.length > 0){
            this.ratesFiltered =  this.rates.filter(rate => rate.CarrierCost > 0);            
            this.ratesCounter = this.ratesFiltered.length; 
            this.snackbar.open(this.ratesCounter + ' rates retuned.', null, {
              duration: 5000
            });

            this.clientTLWeightLimit = (this.clientDefaultData.TLWeightLimit == null ? 0 : this.clientDefaultData.TLWeightLimit) + 'lb';
            //console.log(this.clientDefaultData);            
      }

      
          
     
    }
}
