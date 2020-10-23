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
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import {User} from '../../../Entities/user.model';

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
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: User,
              private dialogRef: MatDialogRef<UserUpdateComponentComponent>,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      // id: [UserUpdateComponentComponent.id++],
      // firstName: [this.defaults.FirstName || ''],
      // lastName: [this.defaults. || ''],
      // street: this.defaults. || '',
      // city: this.defaults.city || '',
      // zipcode: this.defaults.zipcode || '',
      // phoneNumber: this.defaults.phoneNumber || '',
      // notes: this.defaults.notes || ''
    });
  }

  save() {
    this.updateUser();
  }

  updateUser() {
    const user = this.form.value;
    // user.id = this.defaults.id;
    // https://beta-customer.r2logistics.com/Services/MASUserService.svc/json/UpdateMasUser
    // POST

    // fetch("https://beta-customer.r2logistics.com/Services/MASUserService.svc/json//GetMasUserByID?UserID=17932", {
    //   "headers": {
    //     "accept": "*/*",
    //     "accept-language": "en-US,en;q=0.9",
    //     "content-type": "application/json",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "ticket": "03D1C7F735B706C4B2B9AE4D522AAC7A42C296E0E75DF231F23030D81389177155789AFF86B7751D7F24EEBC6DEC1D5CAB81B6A865C5519FDF6F67EFE311D2C9BF0F897347C30B9951B75C485E80370EE6C3417D5ABE90120154801C0D53C19C4D4BC481DECD93EFFC960E6E0E15DD42E194DBB08B9AF5A16640ED5615A63C316A99372667AE60BCC591B67E5F7EC6D89202972658E67A8DC30A5DFE0CF1ACD1"
    //   },
    //   "referrer": "https://beta-customer.r2logistics.com/MainPage.aspx",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": null,
    //   "method": "GET",
    //   "mode": "cors",
    //   "credentials": "include"
    // });

    // fetch("https://beta-customer.r2logistics.com/Services/MASCityStatePostalService.svc/json//GetStateDataByCountryId?MASCountryId=1", {
    //   "headers": {
    //     "accept": "*/*",
    //     "accept-language": "en-US,en;q=0.9",
    //     "content-type": "application/json",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "ticket": "03D1C7F735B706C4B2B9AE4D522AAC7A42C296E0E75DF231F23030D81389177155789AFF86B7751D7F24EEBC6DEC1D5CAB81B6A865C5519FDF6F67EFE311D2C9BF0F897347C30B9951B75C485E80370EE6C3417D5ABE90120154801C0D53C19C4D4BC481DECD93EFFC960E6E0E15DD42E194DBB08B9AF5A16640ED5615A63C316A99372667AE60BCC591B67E5F7EC6D89202972658E67A8DC30A5DFE0CF1ACD1"
    //   },
    //   "referrer": "https://beta-customer.r2logistics.com/MainPage.aspx",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": null,
    //   "method": "GET",
    //   "mode": "cors",
    //   "credentials": "include"
    // });

    // fetch("https://beta-customer.r2logistics.com/Services/MASUserService.svc/json/GetMasUserStatus", {
    //   "headers": {
    //     "accept": "*/*",
    //     "accept-language": "en-US,en;q=0.9",
    //     "content-type": "application/json",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "ticket": "03D1C7F735B706C4B2B9AE4D522AAC7A42C296E0E75DF231F23030D81389177155789AFF86B7751D7F24EEBC6DEC1D5CAB81B6A865C5519FDF6F67EFE311D2C9BF0F897347C30B9951B75C485E80370EE6C3417D5ABE90120154801C0D53C19C4D4BC481DECD93EFFC960E6E0E15DD42E194DBB08B9AF5A16640ED5615A63C316A99372667AE60BCC591B67E5F7EC6D89202972658E67A8DC30A5DFE0CF1ACD1"
    //   },
    //   "referrer": "https://beta-customer.r2logistics.com/MainPage.aspx",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": null,
    //   "method": "GET",
    //   "mode": "cors",
    //   "credentials": "include"
    // });
    this.dialogRef.close(user);
  }

}
