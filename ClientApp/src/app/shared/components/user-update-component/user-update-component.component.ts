import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import {MasUser} from '../../../Entities/mas-user.model';
import {HttpService} from '../../../common/http.service';
import {PostalData} from '../../../Entities/PostalData';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'vex-user-update-component',
  templateUrl: './user-update-component.component.html',
  styleUrls: ['./user-update-component.component.scss']
})
export class UserUpdateComponentComponent implements OnInit {

  static id = 100;

  form: FormGroup;

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icPhone = icPhone;


  keyId = '1593399730488';
  originCountries: object = null;
  statesAndCities: PostalData[] = null;
  masUserStatus: object = null;
  filteredStatesOptions: Observable<PostalData[]>;
  filteredCitiesOptions: Observable<PostalData[]>;


  public states: BehaviorSubject<PostalData[]> = new BehaviorSubject<PostalData[]>(null);
  public cities: BehaviorSubject<PostalData[]> = new BehaviorSubject<PostalData[]>(null);


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: MasUser,
              private dialogRef: MatDialogRef<UserUpdateComponentComponent>,
              private fb: FormBuilder,
              private httpService: HttpService) {
  }

  async ngOnInit() {
    this.originCountries = await this.httpService.getCountryList(this.keyId);
    this.statesAndCities = [];
    if (this.defaults.CountryID) {
      this.statesAndCities = await this.httpService.getPostalDataByPostalCode('', this.defaults.CountryID.toString(), this.keyId);
    }
    this.masUserStatus = await this.httpService.getMasUserStatus();
    this.form = this.fb.group({
      id: [UserUpdateComponentComponent.id++],
      firstName: [this.defaults.FirstName || '' ],
      lastName: [this.defaults.LastName || ''],
      address2: this.defaults.Address2 || '',
      address: this.defaults.Address || '',
      tenderEmail: this.defaults.TenderEmail || '',
      postal: this.defaults.PostalCode || '',
      country: this.defaults.CountryName || '',
      username: this.defaults.UserNickName || '',
      state: this.getStateNameById(this.defaults.StateID || '') || '',
      city: this.getCityNameById(this.defaults.CityId || '') || '',
      contactName: this.defaults.ContactName || '',
      contactPhone: this.defaults.ContactPhone || '',
      contactEmail: this.defaults.ContactEmail || '',
      status: this.defaults.Status || ''
    });

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

    this.form.get('postal').valueChanges.subscribe(value => {
      this._changeStateAndCity(value)
    })
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

  private _changeStateAndCity(value) {
    if (value) {
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
      const selectedState = this.statesAndCities.find(city => city.CityName.trim() === value.trim());
      if (selectedState) {
        return selectedState.CityName.trim()
      }
    } else if (value && value.CityName) {
      return value.CityName.trim();
    }
    return undefined;
  }

  getStateNameById(stateId) {
    if (this.statesAndCities && this.statesAndCities.length > 0) {
      return this.statesAndCities.find(states => states.StateId === stateId).StateName
    }
    return undefined;
  }

  getCityNameById(cityId) {
    if (this.statesAndCities && this.statesAndCities.length > 0) {
      return this.statesAndCities.find(city => city.CityID === cityId).CityName
    }
    return undefined;
  }

  async setCountryStatesCities(event) {
    this.statesAndCities = null;
    const countryId = event.source.value;
    this.statesAndCities = await this.httpService.getPostalDataByPostalCode('', countryId.toString(), this.keyId);
  }

  getPostalIdByCode(postalCode: string): number {
    if (this.statesAndCities && this.statesAndCities.length > 0) {
      const postalData =  this.statesAndCities.find(postal => postal.PostalCode === postalCode);
      // tslint:disable-next-line:radix
      return parseInt(postalData.PostalID);
    }
  }

  async save() {
    await this.updateUser();
  }

  mapUser() {
    const user: MasUser = this.defaults;
    const state = this.form.get('state').value;
    const city = this.form.get('city').value;
    const country = this.form.get('country').value;
    const postalCode = this.form.get('postal').value;

    user.FirstName = this.form.get('firstName').value;
    user.LastName = this.form.get('lastName').value;
    user.Address = this.form.get('address').value;
    user.Address2 = this.form.get('address2').value;
    user.TenderEmail = this.form.get('tenderEmail').value;
    user.PostalCode = postalCode;
    user.PostalId = this.getPostalIdByCode(postalCode);
    // tslint:disable-next-line:radix
    user.CountryID = parseInt(country);
    user.UserNickName = this.form.get('username').value;
    user.ContactName = this.form.get('contactName').value;
    user.ContactPhone = this.form.get('contactPhone').value;
    user.ContactEmail = this.form.get('contactEmail').value;
    user.Status = this.form.get('status').value;
    user.StateID = state.StateId;
    user.StateName = state.StateName;
    user.CityId = city.CityID;
    user.CityName = city.CityName;

    return user;
  }

  async updateUser() {
    const updatedUser = this.mapUser();

    await this.httpService.updateMasUser(updatedUser);

    this.dialogRef.close(updatedUser);
  }

}
