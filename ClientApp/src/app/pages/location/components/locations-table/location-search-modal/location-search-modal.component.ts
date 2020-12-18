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
import {Location} from '../../../../../Entities/Location';
import {HttpService} from "../../../../../common/http.service";
import {DatePipe} from "@angular/common";
import {GetLocationsParameters} from "../../../../../Entities/GetLocationsParameters";

@Component({
  selector: 'vex-location-search-modal',
  templateUrl: './location-search-modal.component.html',
  styleUrls: ['./location-search-modal.component.scss']
})
export class LocationSearchModalComponent implements OnInit {

  static id = 100;

  keyId = '1593399730488';

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icPhone = icPhone;

  checked: boolean = true;

  locationTypeSelected: null;
  getLocationsParameters: GetLocationsParameters;

  constructor(private httpService : HttpService, @Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<LocationSearchModalComponent>,
              private fb: FormBuilder,
              public datepipe: DatePipe) {
  }

  async ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Location;
    }

    this.form = this.fb.group({
      ShortName: this.defaults.ShortName || '',
      Name: this.defaults.Name || '',
      ContactName: this.defaults.ContactName || '',
      ContactPhone: this.defaults.ContactPhone || '',
      ContactEmail: this.defaults.ContactEmail || '',
    });
  }

  save() {
    let location = this.form.value;
    this.initGetLocationsParameter(location);
    this.httpService.getMasLocations(this.getLocationsParameters).then(locations => {
      this.dialogRef.close(locations);
    });
  }

  initGetLocationsParameter(data) {
    this.getLocationsParameters = {
      ClientId: 1,
      IsAccending: false,
      LocationID: null,
      Name: data.Name,
      ShortName: data.ShortName,
      ContactName: data.ContactName,
      ContactEmail: data.ContactEmail,
      ContactPhone: data.ContactPhone,
      OrderBy: "",
      PageNumber: 1,
      PageSize: 200,
      Status: null,
    }
  }
}
