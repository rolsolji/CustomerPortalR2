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

  defaultClient: Client;
  filteredOptions: Observable<Client[]>;
  clientsForm: FormGroup;
  public clientsForUser$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>(null);

  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private authenticationService: AuthenticationService,
              private fb: FormBuilder,
  ) {
  }

  async ngOnInit() {
    let clientsForUserFromStorage = this.authenticationService.getClientsForUserFromStorage();
    if (clientsForUserFromStorage) {
      this.clientsForUser$.next(clientsForUserFromStorage);
    } else {
      clientsForUserFromStorage = await this.authenticationService.getClientsForUser(
        this.authenticationService.getUserFromStorage().UserID
      );
      this.clientsForUser$.next(clientsForUserFromStorage);
    }
    this.securityToken = this.authenticationService.ticket$.value;
    this.clientImage = `https://beta-customer.r2logistics.com/Handlers/ClientLogoHandler.ashx?ClientID=${this.authenticationService.getDefaultClient().ClientID}&id=e(${Math.random().toString().slice(2,11)})/&Ticket=${this.securityToken}`;
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
  }

  private _filter(value: string): Observable<Client[]> {
    const filterValue = value.toLowerCase();
    if (filterValue.length >= 3) {
      this.clientsForUser$.next(this.authenticationService.getClientsForUserFromStorage());
      this.clientsForUser$.next(this.clientsForUser$.value.filter(
        (option: Client) => option.ClientName.toLowerCase().indexOf(filterValue) === 0));
      return this.clientsForUser$.asObservable();
    }
    this.clientsForUser$.next([]);
    return this.clientsForUser$.asObservable();
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
