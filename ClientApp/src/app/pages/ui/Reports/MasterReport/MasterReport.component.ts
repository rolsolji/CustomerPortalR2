import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from 'src/app/common/authentication.service';
import { String, StringBuilder } from 'typescript-string-operations';
import { stagger80ms } from '../../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';
import icVerticalSplit from '@iconify/icons-ic/twotone-vertical-split';
import icVisiblity from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from 'src/app/Entities/client.model';
import { environment } from 'src/environments/environment';
// import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common'
import { ReportService } from '../report.service';
import { ShipmentMode } from 'src/app/Entities/ShipmentMode';
import { HttpService } from 'src/app/common/http.service';

@Component({
    selector: 'vex-report',
    templateUrl: './MasterReport.component.html',
    styleUrls: ['./MasterReport.component.scss'],
    animations: [
        stagger80ms,
        fadeInUp400ms,
        scaleIn400ms,
        fadeInRight400ms
    ],
})

export class MasterReportComponent implements OnInit {

    ReportHanderUrl: string;
    securityToken: string;
    private baseEndpoint: string;
    KPIFormGroup: FormGroup;
    defaultClient: Client;
    SelectedClientID: number;
    SelectedClientName: string;
    filteredOptions: Observable<Client[]>;
    public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);
    shipmentModes: ShipmentMode[] = [];
    shipmentModeSelected: null;

    @Input() reportTitle: string = '';

    @Input() isShowReportOption: boolean = false;
    @Input() isShipmentOrQuote: boolean = false;
    @Input() isShowClientName: boolean = false;
    @Input() isShowMode: boolean = false;
    @Input() isShowPickupDate: boolean = false;
    @Input() isShowInvoiceDate: boolean = false;
    @Input() isShowOnlyInvoiced: boolean = false;
    @Input() isShowAVGCostPerMile: boolean = false;
    @Input() isShowIncludeSubClient: boolean = false;

    constructor(private authenticationService: AuthenticationService, private fb: FormBuilder,
        private reportService: ReportService, public datepipe: DatePipe, private httpService: HttpService) {
        this.securityToken = this.authenticationService.ticket$.value;
        this.baseEndpoint = environment.baseEndpoint;
    }

    async ngOnInit() {
        this.KPIFormGroup = this.fb.group({
            client: [this.authenticationService.defaultClient$.value.ClientName, Validators.required],
            ModeCode: ['ALL'],
            pickupDateFrom: [null, Validators.required],
            pickupDateTo: [null, Validators.required],
            ReportType: ['pdf'],
            isOnlyInvoiced: [null],
            isAVGCostPerMile: [null],
            isIncludeSubClient: [null],
            isShipmentOrQuote: ['Shipments'],
            invoiceDateFrom: [null, Validators.required],
            invoiceDateTo: [null, Validators.required]
        });

        this.shipmentModes = await this.httpService.GetShipmentModeForReport();

        // this.KPIFormGroup.get('pickupDateFrom').valueChanges.subscribe(val => {
        //     if (this.KPIFormGroup.get('pickupDateFrom').value === null || this.KPIFormGroup.get('pickupDateFrom').value === "") { // for setting validations
        //       this.KPIFormGroup.get('invoiceDateFrom').setValidators(Validators.required);
        //       this.KPIFormGroup.get('invoiceDateTo').setValidators(Validators.required);
        //     } 
        //     else{
        //       this.KPIFormGroup.get('invoiceDateFrom').clearValidators();
        //       this.KPIFormGroup.get('invoiceDateTo').clearValidators();
        //     }
        //     this.KPIFormGroup.get('invoiceDateFrom').updateValueAndValidity();
        //     this.KPIFormGroup.get('invoiceDateTo').updateValueAndValidity();
        // });                

        this.filteredOptions = this.KPIFormGroup.get('client').valueChanges.pipe(
            startWith(''),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(val => {
                return this._filter(val || '')
            })
        )

        this.SelectedClientID = this.authenticationService.getDefaultClientFromStorage().ClientID;
        this.SelectedClientName = this.authenticationService.getDefaultClientFromStorage().ClientName.trim();
    }

    pickupDatevalueChange() {        
        if (this.KPIFormGroup.get('pickupDateFrom').value === null || this.KPIFormGroup.get('pickupDateFrom').value === "") { // for setting validations
            this.KPIFormGroup.get('invoiceDateFrom').setValidators(Validators.required);
            this.KPIFormGroup.get('invoiceDateTo').setValidators(Validators.required);
        }
        else {
            this.KPIFormGroup.get('invoiceDateFrom').clearValidators();
            this.KPIFormGroup.get('invoiceDateTo').clearValidators();
        }
        this.KPIFormGroup.get('invoiceDateFrom').updateValueAndValidity();
        this.KPIFormGroup.get('invoiceDateTo').updateValueAndValidity();        
    }

    invoiceDatevalueChange() {
        if (this.KPIFormGroup.get('invoiceDateFrom').value === null || this.KPIFormGroup.get('invoiceDateFrom').value === "") { // for setting validations
            this.KPIFormGroup.get('pickupDateFrom').setValidators(Validators.required);
            this.KPIFormGroup.get('pickupDateTo').setValidators(Validators.required);
        }
        else {
            this.KPIFormGroup.get('pickupDateFrom').clearValidators();
            this.KPIFormGroup.get('pickupDateTo').clearValidators();
        }
        this.KPIFormGroup.get('pickupDateFrom').updateValueAndValidity();
        this.KPIFormGroup.get('pickupDateTo').updateValueAndValidity();
    }    

    private _filter(value: string): Observable<Client[]> {
        var filterValue = "";
        if (value !== null && value !== undefined && value !== String.Empty) {
            filterValue = value.toLowerCase();
        }

        if (filterValue.length >= 3) {
            var matchedClient = this.clientsForUser$.value?.filter(x => x.ClientName.toUpperCase().startsWith(filterValue.toUpperCase()));
            if (matchedClient && matchedClient.length > 0) {
                this.clientsForUser$.next(this.clientsForUser$.value.filter(
                    (option: Client) => option.ClientName.toLowerCase().indexOf(filterValue) === 0));
                return this.clientsForUser$.asObservable();
            }
            else {
                var adminUserID = this.authenticationService.getDefaultClientFromStorage().AdminUserID;
                this.reportService.GetClientsForReportByUserAndClientName(adminUserID, filterValue).then((a) => {
                    this.clientsForUser$.next(a);
                });
                this.clientsForUser$.next(this.clientsForUser$.value.filter(
                    (option: Client) => option.ClientName.toLowerCase().indexOf(filterValue) === 0));
                return this.clientsForUser$.asObservable();
            }
        }

        this.clientsForUser$.next([]);
        return this.clientsForUser$.asObservable();
    }

    clientAutoCompleteSelected(object): void {
        this.KPIFormGroup.get('client').setValue(String.Format('{0}', object.ClientName.trim()));
        this.SelectedClientID = object.ClientID;
        this.SelectedClientName = object.ClientName.trim();
    }

    showReport() {

        var Mode = this.KPIFormGroup.get('ModeCode').value !== null && this.KPIFormGroup.get('ModeCode').value !== "ALL" ? this.KPIFormGroup.get('ModeCode').value : '';

        var PickupDateFrom = "";
        var PickupDateTo = "";
        var InvoiceDateFrom = "";
        var InvoiceDateTo = "";

        if (this.KPIFormGroup.get('pickupDateFrom').value !== null && this.KPIFormGroup.get('pickupDateFrom').value !== undefined && this.KPIFormGroup.get('pickupDateFrom').value !== "") {
            PickupDateFrom = this.datepipe.transform(this.KPIFormGroup.get('pickupDateFrom').value, 'MM/dd/yyyy');
        }

        if (this.KPIFormGroup.get('pickupDateTo').value !== null && this.KPIFormGroup.get('pickupDateTo').value !== undefined && this.KPIFormGroup.get('pickupDateTo').value !== "") {
            PickupDateTo = this.datepipe.transform(this.KPIFormGroup.get('pickupDateTo').value, 'MM/dd/yyyy');
        }

        if (this.KPIFormGroup.get('invoiceDateFrom').value !== null && this.KPIFormGroup.get('invoiceDateFrom').value !== undefined && this.KPIFormGroup.get('invoiceDateFrom').value !== "") {
            InvoiceDateFrom = this.datepipe.transform(this.KPIFormGroup.get('invoiceDateFrom').value, 'MM/dd/yyyy');
        }

        if (this.KPIFormGroup.get('invoiceDateTo').value !== null && this.KPIFormGroup.get('invoiceDateTo').value !== undefined && this.KPIFormGroup.get('invoiceDateTo').value !== "") {
            InvoiceDateTo = this.datepipe.transform(this.KPIFormGroup.get('invoiceDateTo').value, 'MM/dd/yyyy');
        }

        if (this.reportTitle === "Key Performance Indicator") {

            this.ReportHanderUrl = this.baseEndpoint + "Handlers/FmplsReviewReportHandler.ashx?ClientID=" + this.SelectedClientID;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ShipFromDate=" + PickupDateFrom + "&ShipToDate=" + PickupDateTo;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ExportType=pdf";
            this.ReportHanderUrl = this.ReportHanderUrl + "&InvoiceFromDate=&InvoiceToDate=";
            this.ReportHanderUrl = this.ReportHanderUrl + "&ReportType=-1";
            this.ReportHanderUrl = this.ReportHanderUrl + "&ClientShare=50"
            this.ReportHanderUrl = this.ReportHanderUrl + "&CorporateID=" + this.authenticationService.getDefaultClientFromStorage().ClientID;
            this.ReportHanderUrl = this.ReportHanderUrl + "&MaxWeight=0";
            this.ReportHanderUrl = this.ReportHanderUrl + "&ClientName=" + this.SelectedClientName;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ClientType=P";
            this.ReportHanderUrl = this.ReportHanderUrl + "&Mode=" + Mode;
            if (this.KPIFormGroup.get('isOnlyInvoiced').value === true) {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsInvoice=true";
            }
            else {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsInvoice=false";
            }

            if (this.KPIFormGroup.get('isAVGCostPerMile').value === true) {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsAvgCostperMile=true";
            }
            else {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsAvgCostperMile=false";
            }

            this.ReportHanderUrl = this.ReportHanderUrl + "&Ticket=" + this.securityToken;

            if (this.ReportHanderUrl !== null && this.ReportHanderUrl !== undefined && this.ReportHanderUrl !== "") {
                window.open(this.ReportHanderUrl);
            }
        }
        else if (this.reportTitle === "Carrier Performance") {

            this.ReportHanderUrl = this.baseEndpoint + "Handlers/ShipmentTimePerformanceHandler.ashx";
            this.ReportHanderUrl = this.ReportHanderUrl + "?ClientId=" + this.SelectedClientID;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ClientName=" + this.SelectedClientName;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ShipFromDate=" + PickupDateFrom + "&ShipToDate=" + PickupDateTo;

            if (this.KPIFormGroup.get('isIncludeSubClient').value === true) {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsIncludeSubClient=true";
            }
            else {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsIncludeSubClient=false";
            }

            this.ReportHanderUrl = this.ReportHanderUrl + "&ExportType=" + this.KPIFormGroup.get('ReportType').value;
            this.ReportHanderUrl = this.ReportHanderUrl + "&Mode=" + Mode;
            this.ReportHanderUrl = this.ReportHanderUrl + "&Ticket=" + this.securityToken;

            if (this.ReportHanderUrl !== null && this.ReportHanderUrl !== undefined && this.ReportHanderUrl !== "") {
                window.open(this.ReportHanderUrl);
            }
        }
        else if (this.reportTitle === "Shipment History") {

            this.ReportHanderUrl = this.baseEndpoint + "Handlers/LoadByClientForSellHandler.ashx";
            this.ReportHanderUrl = this.ReportHanderUrl + "?ClientId=" + this.authenticationService.getDefaultClientFromStorage().ClientID;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ClientName=" + this.authenticationService.getDefaultClientFromStorage().ClientName;

            if (this.KPIFormGroup.get('isShipmentOrQuote').value === "Shipments") {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsQuotes=" + false;
            }
            else {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsQuotes=" + true;
            }

            this.ReportHanderUrl = this.ReportHanderUrl + "&ShipFromDate=" + PickupDateFrom + "&ShipToDate=" + PickupDateTo;

            if (this.KPIFormGroup.get('isIncludeSubClient').value === true) {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsIncludeSubClient=" + true;
            }
            else {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsIncludeSubClient=" + false;
            }

            this.ReportHanderUrl = this.ReportHanderUrl + "&ExportType=" + this.KPIFormGroup.get('ReportType').value;
            this.ReportHanderUrl = this.ReportHanderUrl + "&Mode=" + Mode;
            this.ReportHanderUrl = this.ReportHanderUrl + "&Ticket=" + this.securityToken;

            if (this.ReportHanderUrl !== null && this.ReportHanderUrl !== undefined && this.ReportHanderUrl !== "") {
                window.open(this.ReportHanderUrl);
            }
        }
        else if (this.reportTitle === "Daily Activity") {

            this.ReportHanderUrl = this.baseEndpoint + "Handlers/DailyActivityShipmentHandler.ashx";
            this.ReportHanderUrl = this.ReportHanderUrl + "?ClientID=" + this.authenticationService.getDefaultClientFromStorage().ClientID;
            this.ReportHanderUrl = this.ReportHanderUrl + "&ClientName=" + this.authenticationService.getDefaultClientFromStorage().ClientName;

            if (PickupDateFrom !== "" && PickupDateTo !== "") {
                this.ReportHanderUrl = this.ReportHanderUrl + "&ShipDateFrom=" + PickupDateFrom + "&ShipDateTo=" + PickupDateTo;
            }

            if (InvoiceDateFrom !== "" && InvoiceDateTo !== "") {
                this.ReportHanderUrl = this.ReportHanderUrl + "&InvoiceDateFrom=" + InvoiceDateFrom + "&InvoiceDateTo=" + InvoiceDateTo;
            }

            if (this.KPIFormGroup.get('isIncludeSubClient').value === true) {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsIncludeSubClient=" + true;
            }
            else {
                this.ReportHanderUrl = this.ReportHanderUrl + "&IsIncludeSubClient=" + false;
            }

            this.ReportHanderUrl = this.ReportHanderUrl + "&ExportType=" + this.KPIFormGroup.get('ReportType').value;
            this.ReportHanderUrl = this.ReportHanderUrl + "&Mode=" + Mode;
            this.ReportHanderUrl = this.ReportHanderUrl + "&Ticket=" + this.securityToken;

            if (this.ReportHanderUrl !== null && this.ReportHanderUrl !== undefined && this.ReportHanderUrl !== "") {
                window.open(this.ReportHanderUrl);
            }
        }
    }
}