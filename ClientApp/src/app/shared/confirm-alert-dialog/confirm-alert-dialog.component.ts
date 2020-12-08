import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'vex-confirm-alert-dialog',
  templateUrl: './confirm-alert-dialog.component.html',
  styleUrls: ['./confirm-alert-dialog.component.scss']
})
export class ConfirmAlertDialogComponent implements OnInit {

  alertConfirmFormGroup: FormGroup;
  title: string;
  message: string;
  confirmDialog: boolean;
  yesNoActions: boolean;

  acceptButtonLabel = 'Accept';

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.title = data.title;
      this.message = data.message;
      this.confirmDialog = data.confirmDialog;
      this.yesNoActions = data.yesNoActions;
  }

  ngOnInit(): void {
    // -- alertConfirmFormGroup fields
    this.alertConfirmFormGroup = this.fb.group({
      // emailToSendQuote: [this.title]
    });
    // --    
    console.log('this.confirmDialog: ', this.confirmDialog);

    if (this.yesNoActions){
      this.acceptButtonLabel = 'Yes';
    }
  }

  alertConfirmAccept(){
    this.dialogRef.close('Accepted');
    //this.dialogRef.close();
  }

  alertConfirmNo(){
    this.dialogRef.close('No');
    //this.dialogRef.close();
  }

  close(){
    this.dialogRef.close('Cancel');
  }

}
