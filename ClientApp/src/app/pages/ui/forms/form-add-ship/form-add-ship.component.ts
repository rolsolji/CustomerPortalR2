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

  originCountries: Object;
  destinationCountries: Object;  

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
  passwordFormGroup: FormGroup;
  confirmFormGroup: FormGroup; 

  phonePrefixOptions = ['+1', '+27', '+44', '+49', '+61', '+91'];

  passwordInputType = 'password';

  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private httpService : HttpService) {
  }

  async ngOnInit() {
    //-- Main Form Group fields
    this.originAndDestinationFormGroup = this.fb.group({
      origincountry: [null, Validators.required],
      originpostalcode: [null, Validators.required],
      originstatename: [null, Validators.required],
      originpickupdate: [null, Validators.required],
      destinationpostalcode: [null, Validators.required],
      destinationstatename: [null, Validators.required]     
    });


    // this.accountFormGroup = this.fb.group({
    //   username: [null, Validators.required],
    //   name: [null, Validators.required],
    //   email: [null, Validators.required],
    //   phonePrefix: [this.phonePrefixOptions[3]],
    //   phone: [],
    // });

    this.passwordFormGroup = this.fb.group({
      password: [
        null,
        Validators.compose(
          [
            Validators.required,
            Validators.minLength(6)
          ]
        )
      ],
      passwordConfirm: [null, Validators.required]
    });

    this.confirmFormGroup = this.fb.group({
      terms: [null, Validators.requiredTrue]
    });

    let responseData = await this.httpService.getCountryList(this.keyId);   
    //this.clientDefaultData = await this.httpService.getClientDefaultsByClient(this.ClientID, this.keyId);

    this.originCountries = responseData;
    this.destinationCountries = responseData;
    this.originSelectedCountry = responseData[0]; // US as default     
    this.destinationSelectedCountry = responseData[0]; // US as default      
  }

  postalData: PostalData[];
  postalDataDest: PostalData[];
  OriginPostalCode: string;
  OriginStateName: String;
  OriginPostalData: PostalData;
  OriginPickupDate: string;

  async validateOriginPostalCode(){
    console.log(this.originSelectedCountry);
    let CountryId = this.originSelectedCountry == null ? "1": this.originSelectedCountry.CountryId.toString();
    this.OriginPostalCode = this.originAndDestinationFormGroup.get('originpostalcode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length > 0)
    {
      console.log('before...')
      let responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);
      console.log(responseData)     
      this.postalData = responseData;
      if (this.postalData != null && this.postalData.length > 0) 
      {        
        this.originAndDestinationFormGroup.get('originstatename').setValue(this.postalData[0].StateName);
        this.OriginPostalCode = String.Format("{0}-{1}",this.OriginPostalCode,this.postalData[0].CityName);  
        this.OriginPostalData = this.postalData[0];        
        this.originAndDestinationFormGroup.get('originpostalcode').setValue(this.OriginPostalCode);
      }
      else
      {
        this.OriginStateName = String.Empty;
        this.OriginPostalCode = String.Empty;
        this.OriginPostalData = null;
      }            
    }
    
  }

  showPassword() {
    this.passwordInputType = 'text';
    this.cd.markForCheck();
  }

  hidePassword() {
    this.passwordInputType = 'password';
    this.cd.markForCheck();
  }

  submit() {
    this.snackbar.open('Hooray! You successfully created your account.', null, {
      duration: 5000
    });
  }
}