import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProgressBarModule } from '../components/progress-bar/progress-bar.module';
import { SearchModule } from '../components/search/search.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {ToolbarNotificationsModule} from './toolbar/toolbar-notifications/toolbar-notifications.module';
import {ToolbarUserModule} from './toolbar/toolbar-user/toolbar-user.module';
import {ToolbarSearchModule} from './toolbar/toolbar-search/toolbar-search.module';
import {IconModule} from '@visurel/iconify-angular';
import {NavigationModule} from './navigation/navigation.module';
import {NavigationItemModule} from '../components/navigation-item/navigation-item.module';
import {MegaMenuModule} from '../components/mega-menu/mega-menu.module';
import {ContainerModule} from '../directives/container/container.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    ProgressBarModule,
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
  exports: [LayoutComponent]
})
export class LayoutModule {
}
