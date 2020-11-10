import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavItemModule } from './sidenav-item/sidenav-item.module';
import { ScrollbarModule } from '../../components/scrollbar/scrollbar.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SearchModule} from '../../components/search/search.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {ToolbarNotificationsModule} from '../toolbar/toolbar-notifications/toolbar-notifications.module';
import {ToolbarUserModule} from '../toolbar/toolbar-user/toolbar-user.module';
import {ToolbarSearchModule} from '../toolbar/toolbar-search/toolbar-search.module';
import {NavigationModule} from '../navigation/navigation.module';
import {RouterModule} from '@angular/router';
import {NavigationItemModule} from '../../components/navigation-item/navigation-item.module';
import {MegaMenuModule} from '../../components/mega-menu/mega-menu.module';
import {ContainerModule} from '../../directives/container/container.module';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    SidenavItemModule,
    ScrollbarModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    IconModule,
    SearchModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    ToolbarNotificationsModule,
    ToolbarUserModule,
    ToolbarSearchModule,
    IconModule,
    NavigationModule,
    RouterModule,
    NavigationItemModule,
    MegaMenuModule,
    ContainerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule
  ],
  exports: [SidenavComponent]
})
export class SidenavModule {
}
