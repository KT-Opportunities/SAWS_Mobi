import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./Pages/home/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
  },
  {
    path: 'attachment-file',
    loadChildren: () => import('./Pages/side-bar-menu/chat/attachment-file/attachment-file.module').then( m => m.AttachmentFilePageModule)
  },
  {
    path: 'subscription-package/:id', // Define the route with the ID parameter
    loadChildren: () =>
      import('./Pages/side-bar-menu/subscription-package/subscription-package.module').then(
        (m) => m.SubscriptionPackagePageModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'login/:id', // Define the route with the ID parameter
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./auth/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./Pages/forecast/forecast.module').then((m) => m.ForecastPageModule),
  },

  {
    path: 'aviation-home',
    loadChildren: () =>
      import('./aviation-home/aviation-home.module').then(
        (m) => m.AviationHomePageModule
      ),
  },
  {
    path: 'color-coded',
    loadChildren: () =>
      import('./Pages/forecast/color-coded/color-coded.module').then(
        (m) => m.ColorCodedPageModule
      ),
  },
  {
    path: 'aviation-code',
    loadChildren: () =>
      import('./Pages/side-bar-menu/aviation-code/aviation-code.module').then(
        (m) => m.AviationCodePageModule
      ),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./Pages/side-bar-menu/news/news.module').then((m) => m.NewsPageModule),
  },
  {
    path: 'provide-feedback',
    loadChildren: () =>
      import('./Pages/side-bar-menu/provide-feedback/provide-feedback.module').then(
        (m) => m.ProvideFeedbackPageModule
      ),
  },
  {
    path: 'observation',
    loadChildren: () =>
      import('./Pages/observation/observation.module').then(
        (m) => m.ObservationPageModule
      ),
  },
  {
    path: 'observation/satelite',
    loadChildren: () =>
      import('./Pages/observation/satellite/satellite.module').then(
        (m) => m.SatelliteModule
      ),
  },
  {
    path: 'observation/observation-metar-history',
    loadChildren: () =>
      import('./Pages/observation/observation-metar-history/observation-metar-history.module').then(
        (m) => m.ObservationMetarHistoryPageModule
      ),
  },
  {
    path: 'aero-sport/cloud-cover',
    loadChildren: () =>
      import('./Pages/aerosport/cloud-cover/cloud-cover.module').then(
        (m) => m.CloudCoverModule
      ),
  },
  {
    path: 'message-list',
    loadChildren: () =>
      import('./Pages/side-bar-menu/provide-feedback/message-list/message-list.module').then(
        (m) => m.MessageListPageModule
      ),
  },
  {
    path: 'observation-metar-history',
    loadChildren: () =>
      import(
        './Pages/observation/observation-metar-history/observation-metar-history.module'
      ).then((m) => m.ObservationMetarHistoryPageModule),
  },
  {
    path: 'web-cam',
    loadChildren: () =>
      import('./Pages/observation/web-cam/web-cam.module').then((m) => m.WebCamPageModule),
  },
  {
    path: 'advisories',
    loadChildren: () =>
      import('./Pages/forecast/Advisories/advisories.module').then((m) => m.advisoriesPageModule),
  },

  {
    path: 'sigmet_airmet',
    loadChildren: () =>
      import('./Pages/forecast/sigmet_airmet/sigmet-airmet.module').then((m) => m.sigmetAirmetPageModule),
  },

  {
    path: 'sigmet-gamet',
    loadChildren: () =>
      import('./Pages/forecast/sigmet-gamet/sigmet-gamet.module').then((m) => m.sigmetGametPageModule),
  },
  {
    path: 'image-viewr',
    loadChildren: () => import('./Pages/image-viewr/image-viewr.module').then( m => m.ImageViewrPageModule)
  },
  {
    path: 'harmonized-grid',
    loadChildren: () => import('./Pages/forecast/harmonized-grid/harmonized-grid.module').then( m => m.HarmonizedGridPageModule)
  },
  {
    path: 'tsprobability',
    loadChildren: () => import('./Pages/aerosport/tsprobability/tsprobability.module').then( m => m.TSProbabilityPageModule)
  },
  {
    path: 'synoptic-analysis',
    loadChildren: () => import('./Pages/aerosport/synoptic-analysis/synoptic-analysis.module').then( m => m.SynopticAnalysisPageModule)
  },
  {
    path: 'aero-image-viewer',
    loadChildren: () => import('./Pages/aero-image-viewer/aero-image-viewer.module').then( m => m.AeroImageViewerPageModule)
  },
  {
    path: 'kwazul-natal',
    loadChildren: () => import('./Pages/aerosport/kwazul-natal/kwazul-natal.module').then( m => m.KwazulNatalPageModule)
  },
  {
    path: 'south-west-cape',
    loadChildren: () => import('./Pages/aerosport/south-west-cape/south-west-cape.module').then( m => m.SouthWestCapePageModule)
  },

 
 
  {
    path: 'central-interio',
    loadChildren: () => import('./Pages/aerosport/central-interio/central-interio.module').then( m => m.CentralInterioPageModule)
  },
  {
    path: 'aviation-home',
    loadChildren: () =>
      import('./aviation-home/aviation-home.module').then(
        (m) => m.AviationHomePageModule
      ),
  },
  {
    path: 'color-coded',
    loadChildren: () =>
      import('./Pages/forecast/color-coded/color-coded.module').then(
        (m) => m.ColorCodedPageModule
      ),
  },
  {
    path: 'aviation-code',
    loadChildren: () =>
      import('./Pages/side-bar-menu/aviation-code/aviation-code.module').then(
        (m) => m.AviationCodePageModule
      ),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./Pages/side-bar-menu/contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./Pages/side-bar-menu/news/news.module').then((m) => m.NewsPageModule),
  },
  {
    path: 'subscription-package',
    loadChildren: () =>
      import('./Pages/side-bar-menu/subscription-package/subscription-package.module').then(
        (m) => m.SubscriptionPackagePageModule
      ),
  },
   {
    path: 'subscription-Successful',
    loadChildren: () =>
      import('./Pages/side-bar-menu/subscription-package/subscription-package.module').then(
        (m) => m.SubscriptionPackagePageModule
      ),
  },
  {
    path: 'international',
    loadChildren: () =>
      import('./Pages/international/international.module').then(
        (m) => m.InternationalPageModule
      ),
  },
  {
    path: 'international/gpm',
    loadChildren: () =>
      import('./Pages/international/gpm/gpm.module').then(
        (m) => m.GpmModule
      ),
  },
  {
    path: 'international/grid-winds',
    loadChildren: () => import('./Pages/international/grid-winds/grid-winds.module').then( m => m.GridWindsPageModule)
  },
  {
    path: 'international/grid-maximum',
    loadChildren: () => import('./Pages/international/grid-maximum/grid-maximum.module').then( m => m.GridMaximumPageModule)
  },
  {
    path: 'flight-briefing',
    loadChildren: () =>
      import('./Pages/flight-briefing/flight-briefing.module').then(
        (m) => m.FlightBriefingPageModule
      ),
  },
  {
    path: 'observation/satelite',
    loadChildren: () =>
      import('./Pages/observation/satellite/satellite.module').then(
        (m) => m.SatelliteModule
      ),
  },
  {
    path: 'domestic',
    loadChildren: () =>
      import('./Pages/domestic/domestic.module').then((m) => m.DomesticPageModule),
  },
  {
    path: 'aero-sport',
    loadChildren: () =>
      import('./Pages/aerosport/aero-sport.module').then(
        (m) => m.AeroSportPageModule
      ),
  },
  {
    path: 'aero-sport/cloud-cover',
    loadChildren: () =>
      import('./Pages/aerosport/cloud-cover/cloud-cover.module').then(
        (m) => m.CloudCoverModule
      ),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./Pages/side-bar-menu/chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'observation-metar-history',
    loadChildren: () =>
      import(
        './Pages/observation/observation-metar-history/observation-metar-history.module'
      ).then((m) => m.ObservationMetarHistoryPageModule),
  },
  {
    path: 'web-cam',
    loadChildren: () =>
      import('./Pages/observation/web-cam/web-cam.module').then((m) => m.WebCamPageModule),
  },
  {
    path: 'advisories',
    loadChildren: () =>
      import('./Pages/forecast/Advisories/advisories.module').then((m) => m.advisoriesPageModule),
  },

  {
    path: 'sigmet_airmet',
    loadChildren: () =>
      import('./Pages/forecast/sigmet_airmet/sigmet-airmet.module').then((m) => m.sigmetAirmetPageModule),
  },

  {
    path: 'sigmet-gamet',
    loadChildren: () =>
      import('./Pages/forecast/sigmet-gamet/sigmet-gamet.module').then((m) => m.sigmetGametPageModule),
  },
  {
    path: 'image-viewr',
    loadChildren: () => import('./Pages/image-viewr/image-viewr.module').then( m => m.ImageViewrPageModule)
  },
  {
    path: 'harmonized-grid',
    loadChildren: () => import('./Pages/forecast/harmonized-grid/harmonized-grid.module').then( m => m.HarmonizedGridPageModule)
  },
  {
    path: 'tsprobability',
    loadChildren: () => import('./Pages/aerosport/tsprobability/tsprobability.module').then( m => m.TSProbabilityPageModule)
  },
  {
    path: 'synoptic-analysis',
    loadChildren: () => import('./Pages/aerosport/synoptic-analysis/synoptic-analysis.module').then( m => m.SynopticAnalysisPageModule)
  },
  {
    path: 'aero-image-viewer',
    loadChildren: () => import('./Pages/aero-image-viewer/aero-image-viewer.module').then( m => m.AeroImageViewerPageModule)
  },
  {
    path: 'kwazul-natal',
    loadChildren: () => import('./Pages/aerosport/kwazul-natal/kwazul-natal.module').then( m => m.KwazulNatalPageModule)
  },
  {
    path: 'south-west-cape',
    loadChildren: () => import('./Pages/aerosport/south-west-cape/south-west-cape.module').then( m => m.SouthWestCapePageModule)
  }, 
  // {
  //   path: 'central-interio',
  //   loadChildren: () => import('./Pages/central-interio/central-interio.module').then( m => m.CentralInterioPageModule)
  // },
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
