import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import {Location} from '../../../../../Entities/Location';
import {HttpService} from "../../../../../common/http.service";
import {DatePipe} from "@angular/common";
import {Country} from "../../../../../Entities/Country";
import {BehaviorSubject, Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, startWith, switchMap} from "rxjs/operators";
import {PostalData} from "../../../../../Entities/PostalData";
import {String} from "typescript-string-operations";
import {User} from "../../../../../Entities/user.model";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../../../common/authentication.service";

@Component({
  selector: 'vex-location-create-update',
  templateUrl: './location-create-update.component.html',
  styleUrls: ['./location-create-update.component.scss']
})
export class LocationCreateUpdateComponent implements OnInit {

  static id = 100;

  keyId = '1593399730488';

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icPhone = icPhone;

  checked: boolean = true;
  approved: number = 1;
  clientID: number;

  locationTypes: {} = [];
  locationTypeSelected: null;
  originCountries: PostalData[] | Country = [];
  statesAndCities: PostalData[] = [];
  postalData: PostalData[];
  filteredCountriesOptions: Observable<PostalData[]>;
  filteredStatesOptions: Observable<PostalData[]>;
  filteredCitiesOptions: Observable<PostalData[]>;
  pcoAutoCompleteOptions: Observable<PostalData[]>;
  OriginStateName: string;
  OriginPostalCode: string;
  OriginPostalData: PostalData;
  user: User;

  public countries: BehaviorSubject<PostalData[]> = new BehaviorSubject<PostalData[]>(null);
  public states: BehaviorSubject<PostalData[]> = new BehaviorSubject<PostalData[]>(null);
  public cities: BehaviorSubject<PostalData[]> = new BehaviorSubject<PostalData[]>(null);

  constructor(
      private httpService : HttpService, @Inject(MAT_DIALOG_DATA) public defaults: any,
      private dialogRef: MatDialogRef<LocationCreateUpdateComponent>,
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      private au: AuthenticationService,
      public datepipe: DatePipe
  ) {
    this.clientID = this.au.getDefaultClient().ClientID;
  }

  async ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Location;
    }

    this.locationTypes = await this.httpService.GetMasLocationType();
    this.originCountries = await this.httpService.getCountryList(this.keyId);
    this.user = this.httpService.getUserFromStorage();
    this.statesAndCities = [];

    const activateDate = this.defaults.ActivateDate ?
        new FormControl(new Date(this.datepipe.transform(this.defaults.ActivateDate?.toString().replace(/(^.*\()|([+-].*$)/g, '')))) : null;
    const deactivateDate = this.defaults.DeactivateDate ?
        new FormControl(new Date(this.datepipe.transform(this.defaults.DeactivateDate?.toString().replace(/(^.*\()|([+-].*$)/g, '')))) : null;

    this.form = this.fb.group({
      ShortName: this.defaults.ShortName || '',
      Name: this.defaults.Name || '',
      ActivateDate: activateDate || '',
      Address1: this.defaults.Address1 || '',
      Address2: this.defaults.Address2 || '',
      DeactivateDate: deactivateDate || '',
      country: this.getCountryNameById(this.defaults.CountryId || 1) || '',
      ReferenceCode: this.defaults.ReferenceCode || '',
      PostalCode: this.defaults.PostalCode || '',
      InAccountCode: this.defaults.InAccountCode || '',
      state: this.getStateNameById(this.defaults.CityId || '') || '',
      OutAccountCode: this.defaults.OutAccountCode || '',
      city: this.getCityNameById(this.defaults.CityId || '') || '',
      CreatedBy: new FormControl({value: this.defaults.CreatedBy ?? this.user.UserName, disabled: true}) || '',
      ContactName: this.defaults.ContactName || '',
      ContactPhone: this.defaults.ContactPhone || '',
      ContactEmail: this.defaults.ContactEmail || '',
      Notes: this.defaults.Notes || '',
      LocationType: this.defaults.LocationType || 4
    });
    this.checked = this.defaults.Status || true;
    this.approved = this.defaults.IsApproveLocation || 0;

    if (this.defaults.IsApproveLocation instanceof String) {
      this.approved = this.defaults.IsApproveLocation === 'YesLoc' ? 1 : 0;
    }

    this.pcoAutoCompleteOptions = this.form.get('PostalCode').valueChanges
        .pipe(
            startWith(''),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(val => {
              return this.pcoAutoCompleteFilter(val || '')
            })
        );

    this.filteredCountriesOptions = this.form.get('country').valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this._filterCountries(val || '')
        })
    );
    this.filteredStatesOptions = this.form.get('state').valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this._filterStates(val || '')
        })
    );
    this.filteredCitiesOptions = this.form.get('city').valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this._filterCities(val || '')
        }));

    this.form.get('PostalCode').valueChanges.subscribe(value => {
      return this._changeStateAndCity(value)
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createLocation().then(locationData => {
        this.httpService.InsertMasLocation(locationData).then(() => {
          this.dialogRef.close(locationData);
        })
      });
    } else if (this.mode === 'update') {
      this.updateLocation().then(locationData => {
        this.httpService.UpdateMasLocation(locationData).then(() => {
          this.dialogRef.close(locationData);
        })
      });
    }
  }

  async createLocation() {
    const location = this.form.value;
    const newLocation = await this.mapNewLocation(location);
    this.snackBar.open('Location added', null, {
      duration: 5000
    });
    return newLocation;
  }

  async updateLocation(): Promise<Location> {
    const location = this.form.value;
    const locationUpdated = await this.mapLocation(location);
    this.snackBar.open('Location modified', null, {
      duration: 5000
    });
    return locationUpdated;
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  async setCountryStatesCities(event) {
    this.statesAndCities = null;
    const countryId = event.option.value.CountryId;
    this.statesAndCities = await this.httpService.getPostalDataByPostalCode('', countryId.toString(), this.keyId);
  }

  pcoAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.OriginPostalData = event.option.value;
    this.form.get('PostalCode').setValue(event.option.value.StateName.trim());
    this.OriginPostalCode = String.Format('{0}-{1}',event.option.value.PostalCode,event.option.value.CityName.trim());
    this.form.get('PostalCode').setValue(this.OriginPostalCode);
  }

  pcoAutoCompleteFilter(val: string): Observable<any[]> {
    const CountryId = this.defaults.CountryId ?? '1';
    return this.httpService.postalCodeAutocomplete(val, CountryId, this.keyId)
  }

  private _changeStateAndCity(value) {
    if (value) {
      if (value instanceof Object) {
        this.form.get('state').setValue(value);
        this.form.get('city').setValue(value);
      } else {
        const filterValue = value;
        if (filterValue.length >= 4 && (typeof value === 'string')) {
          const stateAndCity = this.statesAndCities.filter(
              (option: PostalData) => option.PostalCode.toLowerCase().indexOf(filterValue) === 0);
          if (stateAndCity && stateAndCity[0]) {
            this.form.get('state').setValue(stateAndCity[0]);
            this.form.get('city').setValue(stateAndCity[0]);
          }
        }
      }
    }
  }

  private _filterCountries(value: string | PostalData): Observable<PostalData[]> {
    if (value) {
      const filterValue = (typeof value === 'string') ? value.toLowerCase() : value.CountryName.toLowerCase();
      if (filterValue.length >= 3) {
        if (Array.isArray(this.originCountries)) {
          this.countries.next(this.originCountries.filter(
              (option: PostalData) => option.CountryName.toLowerCase().indexOf(filterValue) === 0));
          this.countries.next(this.getUniqueListBy(this.countries.value, 'CountryName'));
        }
      }
    }
    return this.countries.asObservable();
  }

  private _filterStates(value: string | PostalData): Observable<PostalData[]> {
    if (value) {
      const filterValue = (typeof value === 'string') ? value.toLowerCase() : value.StateName.toLowerCase();
      if (filterValue.length >= 4) {
        this.states.next(this.statesAndCities.filter(
            (option: PostalData) => option.StateName.toLowerCase().indexOf(filterValue) === 0));
        this.states.next(this.getUniqueListBy(this.states.value, 'StateName'));
        return this.states.asObservable();
      }
    }
    this.states.next([]);
    return this.states.asObservable();
  }

  private _filterCities(value: string | PostalData): Observable<PostalData[]> {
    if (value) {
      const filterValue = (typeof value === 'string') ? value.toLowerCase() : value.CityName.toLowerCase();

      if (filterValue.length >= 4) {
        this.cities.next(this.statesAndCities.filter(
            (option: PostalData) => option.CityName.toLowerCase().indexOf(filterValue) === 0));
        this.cities.next(this.getUniqueListBy(this.cities.value, 'CityName'));
        return this.cities.asObservable();
      }
    }
    this.cities.next([]);
    return this.cities.asObservable();
  }

  getUniqueListBy(arr: PostalData[], key): PostalData[] {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  getCountryNameById(countryId) {
    if (Array.isArray(this.originCountries) && this.originCountries && this.originCountries.length > 0) {
      return this.originCountries.find(country => country.CountryId === countryId);
    }
    return undefined;
  }

  getStateNameById(cityId) {
    if (this.statesAndCities && this.statesAndCities.length > 0) {
      return this.statesAndCities.find(states => states.CityID === cityId)?.StateName
    }
    return undefined;
  }

  getCityNameById(cityId) {
    if (this.statesAndCities && this.statesAndCities.length > 0) {
      return this.statesAndCities.find(city => city.CityID === cityId)?.CityName
    }
    return undefined;
  }

  displayState(value?): string {
    if (this.statesAndCities !== null  && value && typeof value === 'string') {
      const selectedState = this.statesAndCities.find(state => state.StateName === value);
      if (selectedState) {
        return selectedState.StateName.trim()
      }
    } else if (value && value.StateName) {
      return value.StateName.trim();
    }
    return undefined;
  }

  displayCity(value): string {
    if (this.statesAndCities !== null  && value && typeof value === 'string') {
      const selectedCity = this.statesAndCities.find(city => city.CityName.trim() === value.trim());
      if (selectedCity) {
        return selectedCity.CityName.trim()
      }
    } else if (value && value.CityName) {
      return value.CityName.trim();
    }
    return undefined;
  }

  displayCountry(value): string {
    if (Array.isArray(this.originCountries) && this.originCountries !== null  && value && typeof value === 'string') {
      const selectedCountry = this.originCountries.find(country => country.CountryName.trim() === value.trim());
      if (selectedCountry) {
        return selectedCountry.CountryName.trim()
      }
    } else if (value && value.CountryName) {
      return value.CountryName.trim();
    }
    return undefined;
  }

  async mapLocation(locationData): Promise<Location> {
    const location = this.defaults;
    location.ActivateDate = String.Format('/Date({0})/',locationData.ActivateDate.getTime()) ?? this.defaults.ActivateDate;
    location.Address1 = locationData.Address1 ?? this.defaults.Address1;
    location.Address2 = locationData.Address2 ?? this.defaults.Address2;

    location.ContactEmail = locationData.ContactEmail ?? this.defaults.ContactEmail;
    location.ContactName = locationData.ContactName ?? this.defaults.ContactName;
    location.ContactPhone = locationData.ContactPhone ?? this.defaults.ContactPhone;
    if (locationData.country.CountryName) {
      location.CountryId = locationData.country.CountryId ?? this.defaults.CountryId;
      location.CountryName = locationData.country.CountryName ?? this.defaults.CountryName;
    }
    location.DeactivateDate = locationData.DeactivateDate instanceof Date
        ? String.Format('/Date({0})/',locationData.DeactivateDate.getTime())
        : this.defaults.DeactivateDate;
    location.InAccountCode = locationData.InAccountCode ?? this.defaults.InAccountCode;
    location.Name = locationData.Name ?? this.defaults.Name;
    location.Notes = locationData.Notes ?? this.defaults.Notes;
    location.OutAccountCode = locationData.OutAccountCode ?? this.defaults.OutAccountCode;

    const postalCode = await this.httpService.getPostalDataByPostalCode(locationData.PostalCode, location.CountryId.toString(), this.keyId);
    if (postalCode[0]) {
      location.PostalCode = locationData.PostalCode ?? this.defaults.PostalCode;
      location.PostalID = postalCode[0].PostalID ?? this.defaults.PostalID;
    } else {
      location.PostalCode = locationData.PostalCode ?? this.defaults.PostalCode;
      location.PostalID = locationData.PostalID ?? this.defaults.PostalID;
    }

    if (locationData.city instanceof Object) {
      location.CityId = locationData.city.CityID ?? this.defaults.CityId;
      location.CityName = locationData.city.CityName ?? this.defaults.CityName;
    } else {
      location.CityId = postalCode[0].CityID ?? this.defaults.CityId;
      location.CityName = postalCode[0].CityName ?? this.defaults.CityName;
    }

    location.ReferenceCode = locationData.ReferenceCode ?? this.defaults.ReferenceCode;
    location.ShortName = locationData.ShortName ?? this.defaults.ShortName;

    if (locationData.state instanceof Object) {
      location.StateCode = locationData.state.StateCode ?? this.defaults.StateCode;
      location.StateId = locationData.state.StateId ?? this.defaults.StateId;
      location.StateName = locationData.state.StateName ?? this.defaults.StateName;
    } else {
      location.StateCode = postalCode[0].StateCode ?? this.defaults.StateCode;
      location.StateId = postalCode[0].StateId ?? this.defaults.StateId;
      location.StateName = postalCode[0].StateName ?? this.defaults.StateName;
    }
    location.IsApproveLocation = this.approved === 0 ? 'NoLoc' : 'YesLoc' ;

    location.CreatedBy = this.defaults.CreatedBy;
    location.CreatedDate = this.defaults.CreatedDate;
    location.BaseCurrency = this.defaults.BaseCurrency;
    location.BilltoLocationID = this.defaults.BilltoLocationID;
    location.BusinessSize = this.defaults.BusinessSize;
    location.ClientId = this.defaults.ClientId;
    location.FaxNumber = this.defaults.FaxNumber;
    location.LocationGroup = this.defaults.LocationGroup;
    location.LocationGroupID = this.defaults.LocationGroupID;
    location.LocationID = this.defaults.LocationID;
    location.LocationType = this.defaults.LocationType;
    location.LocationTypeID = this.defaults.LocationTypeID;
    location.ModifiedBy = this.user.UserName ?? this.defaults.ModifiedBy;
    const currentTime = new Date();
    location.ModifiedDate = String.Format('/Date({0})/', currentTime.getTime()) ?? this.defaults.ModifiedDate;
    location.PickupCloseTime = this.defaults.PickupCloseTime;
    location.PickupStartTime = this.defaults.PickupStartTime;
    location.ShipperID = this.defaults.ShipperID;
    location.Status = this.checked ?? this.defaults.Status;
    location.UserID = this.defaults.UserID;
    location.UserToken = this.defaults.UserToken;

    return location;
  }

  async mapNewLocation(locationData): Promise<Location> {
    const location = new Location(null);
    if (locationData.ActivateDate instanceof Object) {
      location.ActivateDate = String.Format('/Date({0})/', locationData.ActivateDate.getTime());
    }
    location.Address1 = locationData.Address1;
    location.Address2 = locationData.Address2;

    location.ContactEmail = locationData.ContactEmail;
    location.ContactName = locationData.ContactName;
    location.ContactPhone = locationData.ContactPhone;
    location.CountryId = locationData.country.CountryId;
    location.CountryName = locationData.country.CountryName;

    location.DeactivateDate = locationData.DeactivateDate instanceof Date
        ? String.Format('/Date({0})/',locationData.DeactivateDate.getTime())
        : this.defaults.DeactivateDate;
    location.InAccountCode = locationData.InAccountCode;
    location.Name = locationData.Name;
    location.Notes = locationData.Notes;
    location.OutAccountCode = locationData.OutAccountCode;

    const postalCode = await this.httpService.getPostalDataByPostalCode(this.OriginPostalData.PostalCode, location.CountryId.toString(), this.keyId);
    if (postalCode.length > 0 && postalCode[0]) {
      location.PostalCode = locationData.PostalCode;
      location.PostalID = parseInt(postalCode[0].PostalID);
    } else {
      location.PostalCode = locationData.PostalCode;
      location.PostalID = locationData.PostalID;
    }

    if (locationData.city instanceof Object) {
      location.CityId = locationData.city.CityID;
      location.CityName = locationData.city.CityName;
    } else {
      location.CityId = parseInt(postalCode[0].CityID);
      location.CityName = postalCode[0].CityName;
    }

    location.ReferenceCode = locationData.ReferenceCode;
    location.ShortName = locationData.ShortName;

    location.StateCode = postalCode[0].StateCode;
    location.StateId = parseInt(postalCode[0].StateId);
    location.StateName = postalCode[0].StateName;
    location.IsApproveLocation = this.approved === 0 ? 'NoLoc' : 'YesLoc' ;

    const currentTime = new Date();
    location.CreatedBy = this.user.UserName;
    location.CreatedDate = String.Format('/Date({0})/', currentTime.getTime());
    location.ModifiedBy = this.user.UserName;
    location.ModifiedDate = String.Format('/Date({0})/', currentTime.getTime());
    location.ClientId = this.clientID;

    const groupLocations = await this.httpService.GetLocationGroupByClient(this.clientID);
    const group = groupLocations.find(groupLocation => groupLocation.GroupCode === 'STD');

    location.LocationGroupID = group.LocationGroupID;
    location.LocationGroup = group.Description;
    location.LocationTypeID = locationData.LocationType;

    location.Status = this.checked;
    location.UserID = this.user.UserID;
    location.UserToken = this.user.TokenString;

    return location;
  }

  async validateOriginPostalCode(event: KeyboardEvent) {
    const CountryId = this.defaults.CountryId ?? '1';
    this.OriginPostalCode = this.form.get('PostalCode').value;
    if (this.OriginPostalCode != null && this.OriginPostalCode.trim().length == 5){
      const responseData = await this.httpService.getPostalDataByPostalCode(this.OriginPostalCode,CountryId,this.keyId);
      this.statesAndCities = responseData;
      if (this.statesAndCities != null && this.statesAndCities.length > 0){
        this.form.get('PostalCode').setValue(this.postalData[0].StateName.trim());
        this.OriginPostalCode = String.Format('{0}-{1}',this.postalData[0].PostalCode,this.postalData[0].CityName.trim());
        this.OriginPostalData = this.postalData[0];
        this.form.get('PostalCode').setValue(this.OriginPostalCode);
      }
      else{
        this.OriginStateName = String.Empty;
        this.OriginPostalCode = String.Empty;
        this.OriginPostalData = null;
      }
    }
  }
}
