import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icSmartphone from '@iconify/icons-ic/twotone-smartphone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icCamera from '@iconify/icons-ic/twotone-camera';
import icPhone from '@iconify/icons-ic/twotone-phone';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../@vex/animations/stagger.animation';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import {MatAccordion} from '@angular/material/expansion';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { RatesService } from '../../../../rates.service';
import { HttpService } from '../../../../common/http.service';
import { String, StringBuilder } from 'typescript-string-operations';
import { strict } from 'assert';
import icTwotoneCalendarToday from '@iconify/icons-ic/twotone-calendar-today';
import icBaselineImageNotSupported from '@iconify/icons-ic/baseline-image-not-supported';
import { StringifyOptions } from 'querystring';


export interface CountryState {
  name: string;
  population: string;
  flag: string;
}

export interface PostalData {
  CityCode: string;
  CityID: string;
  CityName: string;
  CountryCode: string;
  CountryId: string;
  CountryName: string;
  IsActive: string;
  PostalCode: string;
  PostalID: string;
  StateCode: string;
  StateId: string;
  StateName: string;
}

export interface productFeatures{
  id: number | null;
  pallet:string,
  pieces:string,
  package:string
  description:string
}

export const products: productFeatures[] = [
  {
      id:1,
      pallet: "",
      pieces: "",
      package:"",
      description: ""
  }
];



@Component({
  selector: 'vex-form-quick-quote',
  templateUrl: './form-quick-quote.component.html',
  styleUrls: ['./form-quick-quote.component.scss'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})

export class FormQuickQuoteComponent implements OnInit {
  @HostListener('window:scroll')
  selectCtrl: FormControl = new FormControl();
  inputType = 'password';
  visible = false;

  keyId: string = "1593399730488";

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

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, 
    this.mapOptions);
   }  

   rates: Object;
   ratesFiltered = [];
   countries: Object;
   ratesCounter: number = 0;   
   selectedCountry: string;

  constructor(
    private cd: ChangeDetectorRef, 
    private ratesService: RatesService,
    private httpService : HttpService
    ) { }

  ngOnInit() {
    this.httpService.getContryList(this.keyId).subscribe(data => 
      {this.countries = data;
      console.log(this.countries);
    });
  }

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

  getQuote() {
    this.rightPanelImage = "../../../../../assets/img/demo/TestImageRates.png";

    // let objRate: Object;
    // this.ratesService.postRates(objRate).subscribe(res => { 
    //   //let artcl: Article = res.body;
    //   console.log(res.body);
    //   console.log(res.headers.get('Content-Type'));		
    //   //this.loadAllArticles();	  
    // },
    //   (err: HttpErrorResponse) => {
    //         if (err.error instanceof Error) {
    //           //A client-side or network error occurred.				 
    //           console.log('An error occurred:', err.error.message);
    //         } else {
    //           //Backend returns unsuccessful response codes such as 404, 500 etc.				 
    //           console.log('Backend returned status code: ', err.status);
    //           console.log('Response body:', err.error);
    //         }
    //       }
    //   );


    this.httpService.getContryList(this.keyId).subscribe(data => 
      {this.countries = data;
      console.log(this.countries);
    });
     
    
    this.rates = this.ratesService.getRates();
    if (this.rates != null && this.rates.length > 0){
      this.ratesFiltered = this.rates.filter(rate => rate.CarrierCost > 0);
    }
    
    this.ratesCounter = this.ratesFiltered.length;
    console.log(this.rates);    

    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  clearQuoteAndFields(){
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

  postalData: Object; // PostalData[];
  OriginPostalCode: string;
  OriginStateName: String;

  validateOriginPostalCode(){
    console.log(this.selectedCountry);
    this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,'1',this.keyId).subscribe(data => {
      this.postalData = data;
      console.log(this.postalData);
      if (this.postalData != null || this.postalData.length > 0) 
      {
        this.OriginStateName = this.postalData[0].StateName;
        this.OriginPostalCode = String.Format("{0}-{1}",this.OriginPostalCode,this.postalData[0].CityName);
      }
      else
      {
        this.OriginStateName = String.Empty;
        this.OriginPostalCode = String.Empty;
      }
    });
  }
  //#endregion

  //#region Destination Fields
  DestinationPostalCode: string;
  DestinationStateName: String;

  validateDestinationPostalCode(){
    this.httpService.getPostalDataByPostalCode(this.DestinationPostalCode,'1',this.keyId).subscribe(data => {
      this.postalData = data;
      if (this.postalData != null)
      {
        this.DestinationStateName = this.postalData[0].StateName;
        this.DestinationPostalCode = String.Format("{0}-{1}",this.DestinationPostalCode,this.postalData[0].CityName);
      }
      else
      {
        this.DestinationStateName = String.Empty;
        this.DestinationPostalCode = String.Empty;
      }
    });
  }
  //#endregion

  @Input() childProductField: productFeatures;
  @Output() parentProductFields = new EventEmitter<productFeatures>();

  productField: productFeatures = {
    id:1,
    pallet: '',
    pieces: '',
    package:'',
    description: ''
  }

  products: productFeatures[] = [
    {
      id:1,
      pallet: '',
      pieces: '',
      package:'',
      description: ''
    }
  ]

  addNewProdField(index: number): void {
    let prod: productFeatures =  {
      "id":2,
      "pallet": "",
      "pieces": "",
      "package": "",
      "description":""
    } ;
    
    this.products.push(prod);
    console.log(`In method  addNewProdField field index is ${index} and field is ${JSON.stringify(JSON.stringify( this.productField))}`);
    this.parentProductFields.emit(this.productField);

  }

  removeNewProdField(index: number): void {
    if (index != 0)
    {
      this.products.splice(index, 1);
      console.log(`In method  removeNewProdField field index is ${index}`);
      this.parentProductFields.emit(this.productField);  
    }
  }
}
