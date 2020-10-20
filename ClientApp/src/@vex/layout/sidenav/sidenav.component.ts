import { Component, Input, OnInit } from '@angular/core';
import { trackByRoute } from '../../utils/track-by';
import { NavigationService } from '../../services/navigation.service';
import icRadioButtonChecked from '@iconify/icons-ic/twotone-radio-button-checked';
import icRadioButtonUnchecked from '@iconify/icons-ic/twotone-radio-button-unchecked';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import {AuthenticationService} from '../../../app/common/authentication.service';

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

  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.securityToken = this.authenticationService.ticket$.value;
    this.clientImage = `https://beta-customer.r2logistics.com/Handlers/ClientLogoHandler.ashx?ClientID=${this.authenticationService.getDefaultClient().ClientID}&id=e(${Math.random().toString().slice(2,11)})/&Ticket=${this.securityToken}`;
    this.configService.updateConfig({
      sidenav: {
        title: this.authenticationService.getDefaultClient().ClientName,
        imageUrl: this.clientImage
      }
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
