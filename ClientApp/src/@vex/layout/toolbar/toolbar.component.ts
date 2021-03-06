import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import emojioneUS from '@iconify/icons-emojione/flag-for-flag-united-states';
import emojioneDE from '@iconify/icons-emojione/flag-for-flag-germany';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { ConfigService } from '../../services/config.service';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icBallot from '@iconify/icons-ic/twotone-ballot';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-ic/twotone-assignment';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { NavigationService } from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { PopoverService } from '../../components/popover/popover.service';
import { MegaMenuComponent } from '../../components/mega-menu/mega-menu.component';
import icSearch from '@iconify/icons-ic/twotone-search';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../../../app/common/http.service';
import {AuthenticationService} from '../../../app/common/authentication.service';
import {Client} from '../../../app/Entities/client.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {PostalData} from '../../../app/Entities/PostalData';
import { HtmlMsgByClient } from 'src/app/Entities/HtmlMsgByClient';
import { environment } from 'src/environments/environment';
import { Brand } from 'src/app/Entities/Brand';


@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  icSearch = icSearch;
  icBookmarks = icBookmarks;
  emojioneUS = emojioneUS;
  emojioneDE = emojioneDE;
  icMenu = icMenu;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icBallot = icBallot;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;

  searchCtrl = new FormControl();

  keyId = '1593399730488';
  // htmlMsgByClientObj: HtmlMsgByClient[];
  toolBarMessage: string;
  toolBarTitle: string;
  defaultClient: Client;
  filteredOptions: Observable<Client[]>;
  clientsForm: FormGroup;
  public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);
  public securityToken: string;
  public clientImage: string;

  private baseEndpoint: string;
  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private navigationService: NavigationService,
    private popoverService: PopoverService,
    private httpService : HttpService,
    public  authenticationService: AuthenticationService,
    private fb: FormBuilder,
  ) {
    this.clientsForUser$ = this.authenticationService.clientsForUser$;
    this.baseEndpoint = environment.baseEndpoint;
  }

  async ngOnInit() {
    let htmlMsgByClientObj: HtmlMsgByClient[];
    // htmlMsgByClientObj = await this.httpService.GetClientHtmlMsgByClientID(this.authenticationService.defaultClient$.value.ClientID);
    htmlMsgByClientObj = this.authenticationService.getClientHtmlMessages();
    
    let masBrandByClientObj: Brand[];
    masBrandByClientObj = this.authenticationService.getMasBrands();
    if(masBrandByClientObj && masBrandByClientObj.length > 0){
      this.toolBarMessage = masBrandByClientObj[0].BannerText;
    }
    
    /* If Banner text is missing in sub client then used it to R2 logistics level. */
    if (this.toolBarMessage == null || this.toolBarMessage == undefined || this.toolBarMessage == ''){
      const masBrandsDetailsOfR2 = await this.authenticationService.getMasBrandsByClientID(8473);
      if(masBrandsDetailsOfR2 != null && masBrandsDetailsOfR2 != undefined){
        this.toolBarMessage = masBrandsDetailsOfR2[0].BannerText;
      }
    }
    /* END */
    
    this.toolBarTitle = this.authenticationService.getDefaultClient().ClientName;
    this.defaultClient = this.authenticationService.getDefaultClient();
    this.securityToken = this.authenticationService.ticket$.value;
    this.clientImage = this.baseEndpoint + `Handlers/ClientLogoHandler.ashx?ClientID=${this.defaultClient.ClientID}&id=e(${Math.random().toString().slice(2,11)})/&Ticket=${this.securityToken}`;

    this.clientsForm = this.fb.group({
      client: [this.authenticationService.defaultClient$.value.ClientName, null],});

    this.filteredOptions = this.clientsForm.get('client').valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this._filter(val || '')
      })
    )
  }

  private _filter(value: string): Observable<Client[]> {
    const filterValue = value.toLowerCase();
    if (filterValue.length >= 3) {
      this.clientsForUser$.next(this.authenticationService.getClientsForUserFromStorage());
      this.clientsForUser$.next(this.clientsForUser$.value.filter(
        (option: Client) => option.ClientName.toLowerCase().indexOf(filterValue) === 0));
      return this.clientsForUser$.asObservable();
    }
    this.clientsForUser$.next(this.authenticationService.getClientsForUserFromStorage());
    return this.clientsForUser$.asObservable();
  }

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  openMegaMenu(origin: ElementRef | HTMLElement) {
    this.popoverService.open({
      content: MegaMenuComponent,
      origin,
      position: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]
    });
  }

  onChange(event) {
    const clientName = event.source.value;
    this.clientsForm.get('client').setValue(clientName);
    const _defaultClient = this.authenticationService.clientsForUser$.value.find(
      (client: Client) => client.ClientName === clientName);
    localStorage.setItem('defaultClient', JSON.stringify(_defaultClient));
    this.authenticationService.defaultClient$.next(_defaultClient);
    window.location.reload();
  }

  openSearch() {
    this.layoutService.openSearch();
  }
}
