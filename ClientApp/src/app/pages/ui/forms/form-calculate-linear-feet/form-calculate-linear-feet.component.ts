import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import { UtilitiesService } from '../../../../common/utilities.service';

@Component({
    selector: 'vex-form-calculate-linear-feet',
    templateUrl: './form-calculate-linear-feet.component.html',
    styleUrls: ['./form-calculate-linear-feet.component.scss']
})

export class FormCalculateLinearFeetComponent implements OnInit {

    icMoreVert = icMoreVert;
    icClose = icClose;

    icPrint = icPrint;
    icDownload = icDownload;
    icDelete = icDelete;

    icPerson = icPerson;
    icPhone = icPhone;

    IsStackable: boolean = false;
    StackableValue: string = "No";
    NumberOfPallets: number = 0;
    ProductLength: number = 0;
    ProductWidth: number = 0;
    ProductHeight: number = 0;
    TruckWidth: number = 102;
    TruckHeight: number = 150;
    LinearfeetValueOfStraight: any = 0;
    LinearfeetValueOfTurned: any = 0;
    LinearfeetValueOfPinWheeled: any = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<FormCalculateLinearFeetComponent>,
        private utilitiesService: UtilitiesService
    ) { }

    ngOnInit() {
        this.IsStackable = this.data.IsStackable;
        this.NumberOfPallets = this.data.NumberOfPallets;
        this.ProductLength = this.data.ProductLength;
        this.ProductWidth = this.data.ProductWidth;
        this.ProductHeight = this.data.ProductHeight;

        this.CalculateLinearfeetValue();
    }

    CalculateLinearfeetValue() {
        if (this.IsStackable === true) {
            this.StackableValue = "Yes";
        }
        else {
            this.StackableValue = "No";
        }

        this.LinearfeetValueOfStraight = this.utilitiesService.CalculateLinearfeetStraight(this.IsStackable, this.NumberOfPallets, this.ProductLength, this.ProductWidth, this.ProductHeight);
        this.LinearfeetValueOfTurned = this.utilitiesService.CalculateLinearfeetTurned(this.IsStackable, this.NumberOfPallets, this.ProductLength, this.ProductWidth, this.ProductHeight);
        this.LinearfeetValueOfPinWheeled = this.utilitiesService.CalculateLinearfeetPinWheeled(this.IsStackable, this.NumberOfPallets, this.ProductLength, this.ProductWidth, this.ProductHeight);
    }

    SelectLinearfeetStraight() {
        this.dialogRef.close(this.LinearfeetValueOfStraight);
    }

    SelectLinearfeetTurned() {
        this.dialogRef.close(this.LinearfeetValueOfTurned);
    }

    SelectLinearfeetPinWheeled() {
        this.dialogRef.close(this.LinearfeetValueOfPinWheeled);
    }

    CloseDialogClick(){
        this.dialogRef.close("");
    }
}