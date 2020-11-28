import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import {Location} from '../../../../../Entities/Location';
import {HttpService} from "../../../../../common/http.service";
import {DatePipe} from "@angular/common";
import {Country} from "../../../../../Entities/Country";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'vex-location-create-update',
  templateUrl: './location-create-update.component.html',
  styleUrls: ['./location-create-update.component.scss']
})
export class LocationCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icEditLocation = icEditLocation;
  icPhone = icPhone;

  checked: boolean = true;

  locationTypes: {} = [];
  countries: Country[] | Country  = [];
  locationTypeSelected: null;
  countryControl = new FormControl();
  options: Country[] | Country = [];
  filteredOptions: Observable<Country[]>;

  private _filter(value: string): Country[] {
    if (Array.isArray(this.options)) {
      const filteredValue = value.toLowerCase();
      return this.options.filter(option => {
        return option.CountryName.toLowerCase().includes(filteredValue)
      });
    }
  }

  constructor(private httpService : HttpService, @Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<LocationCreateUpdateComponent>,
              private fb: FormBuilder,
              public datepipe: DatePipe) {
  }

  async ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Location;
    }

    this.locationTypes = await this.httpService.GetMasLocationType();
    this.options = await this.httpService.getCountryList(null);

    this.filteredOptions = this.countryControl.valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );

    const activateDate = this.defaults.ActivateDate ?
        new FormControl(new Date(this.datepipe.transform(this.defaults.ActivateDate?.toString().replace(/(^.*\()|([+-].*$)/g, '')))) : null;
    const DeactivateDate = this.defaults.DeactivateDate ?
        new FormControl(new Date(this.datepipe.transform(this.defaults.DeactivateDate?.toString().replace(/(^.*\()|([+-].*$)/g, '')))) : null;

    this.form = this.fb.group({
      ShortName: this.defaults.ShortName || '',
      Name: this.defaults.Name || '',
      ActivateDate: activateDate || '',
      Address1: this.defaults.Address1 || '',
      Address2: this.defaults.Address2 || '',
      DeactivateDate: DeactivateDate || '',
      CountryName: this.defaults.CountryName || '',
      ReferenceCode: this.defaults.ReferenceCode || '',
      PostalCode: this.defaults.PostalCode || '',
      InAccountCode: this.defaults.InAccountCode || '',
      StateCode: this.defaults.StateCode || '',
      OutAccountCode: this.defaults.OutAccountCode || '',
      CityName: this.defaults.CityName || '',
      CreatedBy: new FormControl({value: this.defaults.CreatedBy, disabled: this.isUpdateMode()}) || '',
      ContactName: this.defaults.ContactName || '',
      ContactPhone: this.defaults.ContactPhone || '',
      ContactEmail: this.defaults.ContactEmail || '',
      Notes: this.defaults.Notes || ''
    });
    this.checked = this.defaults.Status || true;
    this.locationTypeSelected = this.defaults.LocationTypeID || null;
    this.setDefaultCountry();
    // this.currentCountry = this.defaults.CountryName || '';
  }

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const location = this.form.value;

    // console.log(location)

    this.dialogRef.close(location);
  }

  async updateCustomer() {
    const location = this.form.value;
    const updatedLocation = new Location(location);
    // console.log(updatedLocation)
    location.LocationID = this.defaults.LocationID;
    location.BaseCurrency = this.defaults.BaseCurrency;
    location.BilltoLocationID = this.defaults.BilltoLocationID;
    location.BusinessSize = this.defaults.BusinessSize;
    // Missing auto complete for city
    location.CityId = this.defaults.CityId;
    location.ClientId = this.defaults.ClientId;
    // Missing auto complete for country
    location.CountryId = this.defaults.CountryId;

    // Missing created by info
    location.CreatedBy = this.defaults.CreatedBy;
    location.CreatedDate = this.defaults.CreatedDate;
    location.FaxNumber = this.defaults.FaxNumber;
    location.LocationGroup = this.defaults.LocationGroup;
    location.LocationGroupID = this.defaults.LocationGroupID;

    // Missing info from the select
    location.LocationType = this.defaults.LocationType;
    location.LocationTypeID = this.defaults.LocationTypeID;

    // Missing info updated by
    location.ModifiedBy = this.defaults.ModifiedBy;
    location.ModifiedDate = this.defaults.ModifiedDate;
    location.PickupCloseTime = this.defaults.PickupCloseTime;
    location.PickupStartTime = this.defaults.PickupStartTime;

    // Missing information from the postal
    location.PostalID = this.defaults.PostalID;

    location.ShipperID = this.defaults.ShipperID;
    location.StateId = this.defaults.StateId;
    location.StateName = this.defaults.StateName;

    // Missing info from the checkbox
    location.Status = this.defaults.Status;
    location.UserID = this.defaults.UserID;
    location.UserToken = this.defaults.UserToken;

    await this.httpService.getMasLocations(location)

    this.dialogRef.close(location);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  setDefaultCountry() {
    if (Array.isArray(this.options)){
      this.options.map(country => {
        this.countries[country.CountryName] = country.CountryId;
      });
      const currentCountry: Country = this.options.find(country => {
        return country.CountryName = this.defaults.CountryName
      });
      console.log(this.countries);
      this.countryControl.setValue( currentCountry.CountryName );
    }
  }

  async onCountryChange(event) {
    const countryId = this.countries[event.option.value];
    const countryStates = await this.httpService.getStateDataByCountryId(countryId, null);
    console.log(countryStates);
  }
}
