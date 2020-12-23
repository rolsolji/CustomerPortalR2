import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import {AuthGuardService as AuthGuard} from './common/auth-guard.service';
import { LocationListComponent } from './pages/location/location-list.component'
import { ProductListComponent } from './pages/product/product-list.component'

const childrenRoutes: VexRoutes = [
  {
    path: 'dashboards/analytics',
    loadChildren: () => import('./pages/dashboards/dashboard-analytics/dashboard-analytics.module').then(m => m.DashboardAnalyticsModule),
    canActivate: [AuthGuard]
    // redirectTo: '/'
  },
  {
      // path: '',
      // loadChildren: () => import('./pages/dashboards/dashboard-analytics/dashboard-analytics.module').then(m => m.DashboardAnalyticsModule),
      path: '',
      loadChildren: () => import('./pages/ui/forms/form-quick-quote/form-quick-quote.module').then(m => m.FormQuickQuoteModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'ui/forms/form-add-ship',
    loadChildren: () => import('./pages/ui/forms/form-add-ship/form-add-ship.module').then(m => m.FormAddShipModule),
  },
  // {
  //   // path: '',
  //   // loadChildren: () => import('./pages/dashboards/dashboard-analytics/dashboard-analytics.module').then(m => m.DashboardAnalyticsModule),
  //   path: 'shipmentboard',
  //   loadChildren: () => import('./pages/ui/forms/form-shipment-board/form-shipment-board.module').then(m => m.FormShipmentBoardModule),
  // },
  {
    path:'shipmentboard',
    children:[
      {
        path: 'LTLTL',
        // loadChildren: () => import('./pages/ui/forms/form-shipment-board/form-shipment-board.module').then(m => m.FormShipmentBoardModule)
        loadChildren: () => import('./pages/ui/forms/form-shipment-board/form-shipment-board.module').then(m => m.FormShipmentBoardModule)
      },
      {
        path: 'TL',
        // loadChildren: () => import('./pages/ui/forms/form-shipment-board/form-shipment-board.module').then(m => m.FormShipmentBoardModule)
        loadChildren: () => import('./pages/ui/forms/form-shipment-board-tl/form-shipment-board-tl.module').then(m => m.FormShipmentBoardTlModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
      path:'locations',
      children:[
        {
          path: 'list',
          //loadChildren: () => import('./pages/location/location-list.module').then(m => m.LocationListModule)
          component: LocationListComponent
        },
      ],
      canActivate: [AuthGuard]
  },
  {
    path:'products',
    children:[
      {
        path: 'list',
        component: ProductListComponent
      },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'apps',
    children: [
      {
        path: 'chat',
        loadChildren: () => import('./pages/apps/chat/chat.module').then(m => m.ChatModule),
        data: {
          toolbarShadowEnabled: true
        }
      },
      {
        path: 'social',
        loadChildren: () => import('./pages/apps/social/social.module').then(m => m.SocialModule)
      },
      {
        path: 'contacts',
        loadChildren: () => import('./pages/apps/contacts/contacts.module').then(m => m.ContactsModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./pages/apps/calendar/calendar.module').then(m => m.CalendarModule),
        data: {
          toolbarShadowEnabled: true
        }
      },
      {
        path: 'aio-table',
        loadChildren: () => import('./pages/apps/aio-table/aio-table.module').then(m => m.AioTableModule),
      },
      {
        path: 'help-center',
        loadChildren: () => import('./pages/apps/help-center/help-center.module').then(m => m.HelpCenterModule),
      },
      {
        path: 'scrumboard',
        loadChildren: () => import('./pages/apps/scrumboard/scrumboard.module').then(m => m.ScrumboardModule),
      },
      {
        path: 'editor',
        loadChildren: () => import('./pages/apps/editor/editor.module').then(m => m.EditorModule),
      },
    ]
  },
  {
    path: 'pages',
    children: [
      {
        path: 'pricing',
        loadChildren: () => import('./pages/pages/pricing/pricing.module').then(m => m.PricingModule)
      },
      {
        path: 'faq',
        loadChildren: () => import('./pages/pages/faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'guides',
        loadChildren: () => import('./pages/pages/guides/guides.module').then(m => m.GuidesModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('./pages/pages/invoice/invoice.module').then(m => m.InvoiceModule)
      },
      {
        path: 'error-404',
        loadChildren: () => import('./pages/pages/errors/error-404/error-404.module').then(m => m.Error404Module)
      },
      {
        path: 'error-500',
        loadChildren: () => import('./pages/pages/errors/error-500/error-500.module').then(m => m.Error500Module)
      }
    ]
  },
  {
    path: 'ui',
    children: [
      {
        path: 'components',
        loadChildren: () => import('./pages/ui/components/components.module').then(m => m.ComponentsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'forms/form-elements',
        loadChildren: () => import('./pages/ui/forms/form-elements/form-elements.module').then(m => m.FormElementsModule),
        data: {
          containerEnabled: true
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'forms/form-quick-quote',
        loadChildren: () => import('./pages/ui/forms/form-quick-quote/form-quick-quote.module').then(m => m.FormQuickQuoteModule),
        data: {
          containerEnabled: true
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'forms/form-shipment-board',
        loadChildren: () => import('./pages/ui/forms/form-shipment-board/form-shipment-board.module').then(m => m.FormShipmentBoardModule),
        canActivate: [AuthGuard]
        // data: {
        //   containerEnabled: true
        // }
      },
      {
        path: 'forms/form-wizard',
        loadChildren: () => import('./pages/ui/forms/form-wizard/form-wizard.module').then(m => m.FormWizardModule),
        data: {
          containerEnabled: true
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'forms/form-add-ship',
        loadChildren: () => import('./pages/ui/forms/form-add-ship/form-add-ship.module').then(m => m.FormAddShipModule),
        data: {
          containerEnabled: true
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'icons',
        loadChildren: () => import('./pages/ui/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'page-layouts',
        loadChildren: () => import('./pages/ui/page-layouts/page-layouts.module').then(m => m.PageLayoutsModule),
      },
    ]
  },
  {
    path: 'documentation',
    loadChildren: () => import('./pages/documentation/documentation.module').then(m => m.DocumentationModule),
  },
  {
    path: '**',
    loadChildren: () => import('./pages/pages/errors/error-404/error-404.module').then(m => m.Error404Module)
  }
];

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/pages/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/pages/auth/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: '',
    component: CustomLayoutComponent,
    children: childrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
