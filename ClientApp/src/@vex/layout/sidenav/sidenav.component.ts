import { Component, Input, OnInit } from '@angular/core';
import { trackByRoute } from '../../utils/track-by';
import { NavigationService } from '../../services/navigation.service';
import icRadioButtonChecked from '@iconify/icons-ic/twotone-radio-button-checked';
import icRadioButtonUnchecked from '@iconify/icons-ic/twotone-radio-button-unchecked';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {AuthenticationService} from '../../../app/common/authentication.service';
import {Client} from '../../../app/Entities/client.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpService} from '../../../app/common/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() collapsed: boolean;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(map(config => config.sidenav.title));
  imageUrl$ = this.configService.config$.pipe(map(config => config.sidenav.imageUrl));
  showCollapsePin$ = this.configService.config$.pipe(map(config => config.sidenav.showCollapsePin));

  items = this.navigationService.items;
  trackByRoute = trackByRoute;
  icRadioButtonChecked = icRadioButtonChecked;
  icRadioButtonUnchecked = icRadioButtonUnchecked;
  private clientImage: string;
  private securityToken: string;

  contactName: string = "";
  contactPhone: string = "";
  contactEmail: string = "";

  defaultClient: Client;
  filteredOptions: Observable<Client[]>;
  clientsForm: FormGroup;
  public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);
  private baseEndpoint: string;
  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private authenticationService: AuthenticationService,
              private fb: FormBuilder,
              private httpService: HttpService
  ) {
    this.baseEndpoint = environment.baseEndpoint;
  }

  async ngOnInit() {
    this.securityToken = this.authenticationService.ticket$.value;
    this.clientImage = this.baseEndpoint + `Handlers/ClientLogoHandler.ashx?ClientID=${this.authenticationService.getDefaultClient().ClientID}&id=e(${Math.random().toString().slice(2,11)})/&Ticket=${this.securityToken}`;
    this.defaultClient = this.authenticationService.getDefaultClient();
    this.configService.updateConfig({
      sidenav: {
        title: this.authenticationService.getDefaultClient().ClientName,
        imageUrl: this.clientImage
      }
    });

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

    this.contactName = this.defaultClient.ContactName;
    this.contactPhone = this.defaultClient.ContactPhone;
    this.contactEmail = this.defaultClient.ContactEmail;
  }

  private _filter(value: string): Observable<Client[]> {
    const filterValue = value.toLowerCase();
    if (filterValue.length >= 3) {
      const user = this.authenticationService.getUserFromStorage();
      this.httpService.getClientsByClientName(
        user.UserID, value)
        .then((clients: Client[]) => {
          this.clientsForUser$.next(clients)
        });
      return this.clientsForUser$.asObservable();
    }
    this.clientsForUser$.next([]);
    return this.clientsForUser$.asObservable();
  }

  async onChange(event) {
    const clientName = event.source.value;
    this.clientsForm.get('client').setValue(clientName);
    const user = this.authenticationService.getUserFromStorage();

    this.httpService.getClientsByClientName(user.UserID, clientName).then(async (clients: Client[]) => {
        const _defaultClient = clients.find(
          (client: Client) => client.ClientName === clientName);

        localStorage.setItem('defaultClient', JSON.stringify(_defaultClient));
        this.authenticationService.defaultClient$.next(_defaultClient);

        const clientHtmlMessagesSetup = await this.authenticationService.getClientHtmlMsgByClientID(_defaultClient.ClientID);
        localStorage.setItem('clientHtmlMessages', JSON.stringify(clientHtmlMessagesSetup));
        this.authenticationService.clientHtmlMessages$.next(clientHtmlMessagesSetup);

        let masBrandsSetup = await this.authenticationService.getMasBrandsByClientID(_defaultClient.ClientID);
        if(masBrandsSetup && masBrandsSetup.length > 0){
          let ClientBannerText = masBrandsSetup[0].BannerText;
          if (ClientBannerText == null || ClientBannerText === ''){
            masBrandsSetup = await this.authenticationService.getMasBrandsByClientID(8473); // Get Client info with R2 Client as default
          }
        }
    
       
        localStorage.setItem('masBrands', JSON.stringify(masBrandsSetup));
        this.authenticationService.MasBrandForClient$.next(masBrandsSetup);

        window.location.reload();
      });
  }

  onMouseEnter() {
    this.layoutService.collapseOpenSidenav();
  }

  onMouseLeave() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }
}
