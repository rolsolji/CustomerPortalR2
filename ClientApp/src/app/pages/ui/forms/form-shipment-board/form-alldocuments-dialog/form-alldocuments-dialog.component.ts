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
import { environment } from '../../../../../../environments/environment';
import { String, StringBuilder } from 'typescript-string-operations';
import { AuthenticationService } from '../../../../../common/authentication.service';
import { UtilitiesService } from '../../../../../common/utilities.service';
import { Documents } from '../../../../../Entities/Documents';

@Component({
    selector: 'vex-form-alldocuments-dialog',
    templateUrl: './form-alldocuments-dialog.component.html',
    styleUrls: ['./form-alldocuments-dialog.component.scss']
})

export class FormAllDocumentsDialogComponent implements OnInit {

    icMoreVert = icMoreVert;
    icClose = icClose;

    icPrint = icPrint;
    icDownload = icDownload;
    icDelete = icDelete;

    icPerson = icPerson;
    icPhone = icPhone;

    allDocumentsList: Documents[];    
    selectedDocumentslist: Documents[];
    shortName: string;

    securityToken: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<FormAllDocumentsDialogComponent>,
        private authenticationService: AuthenticationService,
        private utilitiesService: UtilitiesService,
    ) {
        this.securityToken = this.authenticationService.ticket$.value;
    }

    ngOnInit() {
        this.allDocumentsList = this.data["documents"];        
        this.selectedDocumentslist = this.data["documents"];
        this.shortName = this.allDocumentsList[0].ShortName;
    }

    GetSelectedDocument(data: any) {        
        if (data.FilePath != null && data.FilePath != undefined && data.FilePath != "") {
            var DocumentURL = String.Format(environment.baseEndpoint + 'Handlers/DownLoadPODHandler.ashx?userToken=null&clientID={0}&imageName={1}&docType={2}&TMWUrl={3}&Ticket={4}',
                this.shortName, data.FilePath, data.DocType, data.TMWUrl, this.securityToken);
            window.open(DocumentURL);
        }
    }    

    GetBolDocuments(){
        this.selectedDocumentslist = this.allDocumentsList.filter(a=>a.DocType == "BOL");
    }

    GetPodDocuments(){
        this.selectedDocumentslist = this.allDocumentsList.filter(a=>a.DocType == "POD");
    }

    GetRwtDocuments(){
        this.selectedDocumentslist = this.allDocumentsList.filter(a=>a.DocType == "RWT");
    }

    GetICDocuments(){
        this.selectedDocumentslist = this.allDocumentsList.filter(a=>a.DocType == "IC");
    }

    GetOthDocuments(){
        this.selectedDocumentslist = this.allDocumentsList.filter(a=>a.DocType == "OTH");
    }

    GetAllDocuments(){
        this.selectedDocumentslist = this.allDocumentsList;
    }

    CloseDialogClick() {
        this.dialogRef.close();
    }
}