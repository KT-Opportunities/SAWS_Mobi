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
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/chat/attachment-file/attachment-file.module'
      ).then((m) => m.AttachmentFilePageModule),
  },
  {
    path: 'subscription-package/:id', // Define the route with the ID parameter
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/subscription-package/subscription-package.module'
      ).then((m) => m.SubscriptionPackagePageModule),
  },

  // --- Auth url paths

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

  // --- Forecast url paths
  {
    path: 'forecast',
    loadChildren: () =>
      import('./Pages/forecast/forecast.module').then(
        (m) => m.ForecastPageModule
      ),
  },
  {
    path: 'forecast/sigmet-airmet',
    loadChildren: () =>
      import('./Pages/forecast/sigmet-airmet/sigmet-airmet.module').then(
        (m) => m.SigmetAirmetModule
      ),
  },
  {
    path: 'forecast/harmonized-grid',
    loadChildren: () =>
      import('./Pages/forecast/harmonized-grid/harmonized-grid.module').then(
        (m) => m.HarmonizedGridPageModule
      ),
  },
  {
    path: 'forecast/color-coded',
    loadChildren: () =>
      import('./Pages/forecast/taf-accuracy/taf-accuracy.module').then(
        (m) => m.TafAccuracyPageModule
      ),
  },

  {
    path: 'forecast/advisories',
    loadChildren: () =>
      import('./Pages/forecast/advisories/advisories.module').then(
        (m) => m.advisoriesPageModule
      ),
  },
  {
    path: 'forecast/color-coded-taf',
    loadChildren: () =>
      import('./Pages/forecast/color-coded-taf/color-coded-taf.module').then(
        (m) => m.ColorCodedTafModule
      ),
  },
  {
    path: 'forecast/color-coded-warnings',
    loadChildren: () =>
      import(
        './Pages/forecast/color-coded-warnings/color-coded-warnings.module'
      ).then((m) => m.ColorCodedWarningsModule),
  },
  {
    path: 'forecast/color-coded-sigment-airmet',
    loadChildren: () =>
      import(
        './Pages/forecast/color-coded-sigment-airmet/color-coded-sigment-airmet.module'
      ).then((m) => m.ColorCodedSigmentAirmetModule),
  },
  {
    path: 'forecast/take-off-data',
    loadChildren: () =>
      import('./Pages/forecast/take-off-data/take-off-data.module').then(
        (m) => m.TakeOffDatModule
      ),
  },
  {
    path: 'forecast/taf',
    loadChildren: () =>
      import('./Pages/forecast/taf/taf.module').then((m) => m.TafModule),
  },
  {
    path: 'forecast/recent-tafs',
    loadChildren: () =>
      import('./Pages/forecast/recent-tafs/recent-tafs.module').then(
        (m) => m.RecentTafsModule
      ),
  },
  {
    path: 'forecast/taf-accuracy',
    loadChildren: () =>
      import('./Pages/forecast/taf-accuracy/taf-accuracy.module').then(
        (m) => m.TafAccuracyPageModule
      ),
  },
  {
    path: 'forecast/trends',
    loadChildren: () =>
      import('./Pages/forecast/trends/trends.module').then(
        (m) => m.TrendsModule
      ),
  },
  {
    path: 'forecast/waf-harminized-grid-products',
    loadChildren: () =>
      import('./Pages/forecast/harmonized-grid/harmonized-grid.module').then(
        (m) => m.HarmonizedGridPageModule
      ),
  },
  {
    path: 'forecast/warnings',
    loadChildren: () =>
      import('./Pages/forecast/warnings/warnings.module').then(
        (m) => m.WarningsModule
      ),
  },

  // --- Home / Side menu  url paths
  {
    path: 'aviation-home',
    loadChildren: () =>
      import('./aviation-home/aviation-home.module').then(
        (m) => m.AviationHomePageModule
      ),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./Pages/side-bar-menu/news/news.module').then(
        (m) => m.NewsPageModule
      ),
  },
  {
    path: 'provide-feedback',
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/provide-feedback/provide-feedback.module'
      ).then((m) => m.ProvideFeedbackPageModule),
  },

  // --- Observation url paths
  {
    path: 'observation',
    loadChildren: () =>
      import('./Pages/observation/observation.module').then(
        (m) => m.ObservationPageModule
      ),
  },
  {
    path: 'observation/metar',
    loadChildren: () =>
      import('./Pages/observation/metar/metar.module').then(
        (m) => m.MetarModule
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
    path: 'observation/web-cam',
    loadChildren: () =>
      import('./Pages/observation/web-cam/web-cam.module').then(
        (m) => m.WebCamPageModule
      ),
  },
  {
    path: 'observation/metar-color-coded',
    loadChildren: () =>
      import(
        './Pages/observation/metar-color-coded/metar-color-coded.module'
      ).then((m) => m.MetarColorCodedModule),
  },
  {
    path: 'observation/metar-recent',
    loadChildren: () =>
      import('./Pages/observation/metar-recent/metar-recent.module').then(
        (m) => m.MetarRecentModule
      ),
  },
  {
    path: 'observation/metar-history',
    loadChildren: () =>
      import('./Pages/observation/metar-history/metar-history.module').then(
        (m) => m.MetarHistoryModule
      ),
  },
  {
    path: 'observation/speci',
    loadChildren: () =>
      import('./Pages/observation/speci/speci.module').then(
        (m) => m.SpeciModule
      ),
  },
  {
    path: 'observation/metar-taf-recent',
    loadChildren: () =>
      import(
        './Pages/observation/metar-taf-recent/metar-taf-recent.module'
      ).then((m) => m.MetarTafRecentModule),
  },
  {
    path: 'observation/radar',
    loadChildren: () =>
      import('./Pages/observation/radar/radar.module').then(
        (m) => m.RadarModule
      ),
  },
  {
    path: 'observation/weather-map',
    loadChildren: () =>
      import('./Pages/observation/weather-map/weather-map.module').then(
        (m) => m.WeatherMapModule
      ),
  },

  {
    path: 'message-list',
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/provide-feedback/message-list/message-list.module'
      ).then((m) => m.MessageListPageModule),
  },

  // --- other url paths

  {
    path: 'image-viewr',
    loadChildren: () =>
      import('./Pages/image-viewr/image-viewr.module').then(
        (m) => m.ImageViewrPageModule
      ),
  },

  {
    path: 'aero-image-viewer',
    loadChildren: () =>
      import('./Pages/aero-image-viewer/aero-image-viewer.module').then(
        (m) => m.AeroImageViewerPageModule
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
    path: 'subscription-successful',
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/subscription-package/subscription-package.module'
      ).then((m) => m.SubscriptionPackagePageModule),
  },
  {
    path: 'subscription-successful/:token',
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/subscription-package/subscription-package.module'
      ).then((m) => m.SubscriptionPackagePageModule),
  },
  {
    path: 'subscription-package',
    loadChildren: () =>
      import(
        './Pages/side-bar-menu/subscription-package/subscription-package.module'
      ).then((m) => m.SubscriptionPackagePageModule),
  },

  // --- International url paths
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
      import('./Pages/international/gpm/gpm.module').then((m) => m.GpmModule),
  },
  {
    path: 'international/grid-winds',
    loadChildren: () =>
      import('./Pages/international/grid-winds/grid-winds.module').then(
        (m) => m.GridWindsPageModule
      ),
  },
  {
    path: 'international/grid-maximum',
    loadChildren: () =>
      import('./Pages/international/grid-maximum/grid-maximum.module').then(
        (m) => m.GridMaximumPageModule
      ),
  },
  {
    path: 'international/humidity',
    loadChildren: () =>
      import('./Pages/international/humidity/humidity.module').then(
        (m) => m.HumidityModule
      ),
  },
  {
    path: 'international/image-browser',
    loadChildren: () =>
      import('./Pages/international/image-browser/image-browser.module').then(
        (m) => m.ImageBrowserModule
      ),
  },
  {
    path: 'international/graphic-sigmet-airmet',
    loadChildren: () =>
      import(
        './Pages/international/graphical-sigmet-airmet/graphical-sigmet-airmet.module'
      ).then((m) => m.GraphicalSigmetAirmetModule),
  },
  {
    path: 'international/sigwx-charts',
    loadChildren: () =>
      import('./Pages/international/sigwx-charts/sigwx-charts.module').then(
        (m) => m.SigwxChartsModule
      ),
  },

  // --- Flight-briefing url paths
  {
    path: 'flight-briefing',
    loadChildren: () =>
      import('./Pages/flight-briefing/flight-briefing.module').then(
        (m) => m.FlightBriefingPageModule
      ),
  },
  {
    path: 'flight-briefing/flight-edit',
    loadChildren: () =>
      import('./Pages/flight-briefing/edit/edit.module').then(
        (m) => m.EditModule
      ),
  },
  {
    path: 'flight-briefing/import-export',
    loadChildren: () =>
      import('./Pages/flight-briefing/import-export/import-export.module').then(
        (m) => m.ImportExportModule
      ),
  },
  {
    path: 'flight-briefing/flight-save',
    loadChildren: () =>
      import('./Pages/flight-briefing/save/save.module').then(
        (m) => m.SaveModule
      ),
  },
  {
    path: 'flight-briefing/flight-share',
    loadChildren: () =>
      import('./Pages/flight-briefing/share/share.module').then(
        (m) => m.ShareModule
      ),
  },
  {
    path: 'flight-briefing/import-departure-list',
    loadChildren: () =>
      import(
        './Pages/flight-briefing/import-departure-list/import-departure-list.module'
      ).then((m) => m.ImportDepartureListModule),
  },
  {
    path: 'flight-briefing/schedule-flight-report',
    loadChildren: () =>
      import(
        './Pages/flight-briefing/schedule-flight-report/schedule-flight-report.module'
      ).then((m) => m.ScheduleFlightReportModule),
  },

  // --- Domestic url paths
  {
    path: 'domestic',
    loadChildren: () =>
      import('./Pages/domestic/domestic.module').then(
        (m) => m.DomesticPageModule
      ),
  },
  {
    path: 'domestic/flight-document',
    loadChildren: () =>
      import('./Pages/domestic/flight-document/flight-document.module').then(
        (m) => m.FlightDocumentModule
      ),
  },
  {
    path: 'domestic/hourly-charts',
    loadChildren: () =>
      import('./Pages/domestic/hourly-charts/hourly-charts.module').then(
        (m) => m.HourlyChartsModule
      ),
  },
  {
    path: 'domestic/icao-locations',
    loadChildren: () =>
      import('./Pages/domestic/icao-locations/icao-locations.module').then(
        (m) => m.IcaoLocationsModule
      ),
  },
  {
    path: 'domestic/metar-maps',
    loadChildren: () =>
      import('./Pages/domestic/metar-maps/metar-maps.module').then(
        (m) => m.MetarMapsModule
      ),
  },
  {
    path: 'domestic/qnh-chart',
    loadChildren: () =>
      import('./Pages/domestic/qnh-chart/qnh-chart.module').then(
        (m) => m.QnhChartModule
      ),
  },
  {
    path: 'domestic/sigwx-charts',
    loadChildren: () =>
      import('./Pages/domestic/sigwx-charts/sigwx-charts.module').then(
        (m) => m.SigwxChartsModule
      ),
  },
  {
    path: 'domestic/take-off-data',
    loadChildren: () =>
      import('./Pages/domestic/take-off-data/take-off-data.module').then(
        (m) => m.TakeOffDataModule
      ),
  },
  {
    path: 'domestic/warnings',
    loadChildren: () =>
      import('./Pages/domestic/warnings/warnings.module').then(
        (m) => m.WarningsModule
      ),
  },
  {
    path: 'domestic/winds-charts',
    loadChildren: () =>
      import('./Pages/domestic/winds-charts/winds-charts.module').then(
        (m) => m.WindsChartsModule
      ),
  },
  {
    path: 'domestic/low-level-wind-profile',
    loadChildren: () =>
      import(
        './Pages/domestic/low-level-wind-profile/low-level-wind-profile.module'
      ).then((m) => m.LowLevelWindProfileModule),
  },

  // --- Auth url paths
  {
    path: 'aero-sport',
    loadChildren: () =>
      import('./Pages/aerosport/aero-sport.module').then(
        (m) => m.AeroSportPageModule
      ),
  },
  {
    path: 'aero-sport/central-interior',
    loadChildren: () =>
      import('./Pages/aerosport/central-interior/central-interior.module').then(
        (m) => m.CentralInteriorModule
      ),
  },

  {
    path: 'aero-sport/cloud-fore-cast',
    loadChildren: () =>
      import('./Pages/aerosport/cloud-fore-cast/cloud-fore-cast.module').then(
        (m) => m.CloudForeCastModule
      ),
  },
  {
    path: 'aero-sport/kwazulu-natal',
    loadChildren: () =>
      import('./Pages/aerosport/kwazul-natal/kwazul-natal.module').then(
        (m) => m.KwazulNatalPageModule
      ),
  },
  {
    path: 'aero-sport/south-west-cape',
    loadChildren: () =>
      import('./Pages/aerosport/south-west-cape/south-west-cape.module').then(
        (m) => m.SouthWestCapePageModule
      ),
  },
  {
    path: 'aero-sport/tsprobability',
    loadChildren: () =>
      import('./Pages/aerosport/tsprobability/tsprobability.module').then(
        (m) => m.TSProbabilityModule
      ),
  },
  {
    path: 'aero-sport/spot-graph-map',
    loadChildren: () =>
      import('./Pages/aerosport/sport-graph-map/sport-graph-map.module').then(
        (m) => m.SportGraphMapModule
      ),
  },
  {
    path: 'aero-sport/synoptic-analysis',
    loadChildren: () =>
      import(
        './Pages/aerosport/synoptic-analysis/synoptic-analysis.module'
      ).then((m) => m.SynopticAnalysisPageModule),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./Pages/side-bar-menu/chat/chat.module').then(
        (m) => m.ChatPageModule
      ),
  },
  {
    path: 'image-viewr',
    loadChildren: () =>
      import('./Pages/image-viewr/image-viewr.module').then(
        (m) => m.ImageViewrPageModule
      ),
  },
  {
    path: 'harmonized-grid',
    loadChildren: () =>
      import('./Pages/forecast/harmonized-grid/harmonized-grid.module').then(
        (m) => m.HarmonizedGridPageModule
      ),
  },

  {
    path: 'synoptic-analysis',
    loadChildren: () =>
      import(
        './Pages/aerosport/synoptic-analysis/synoptic-analysis.module'
      ).then((m) => m.SynopticAnalysisPageModule),
  },
  {
    path: 'aero-image-viewer',
    loadChildren: () =>
      import('./Pages/aero-image-viewer/aero-image-viewer.module').then(
        (m) => m.AeroImageViewerPageModule
      ),
  },
  {
    path: 'view-decoded',
    loadChildren: () =>
      import('./Pages/view-decoded/view-decoded.module').then(
        (m) => m.ViewDecodedPageModule
      ),
  },
  {
    path: 'view-symbol',
    loadChildren: () =>
      import('./Pages/view-symbol/view-symbol.module').then(
        (m) => m.ViewSymbolPageModule
      ),
  },
  {
    path: 'image-modal',
    loadChildren: () => import('./Pages/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'view-color-coded-style',
    loadChildren: () => import('./Pages/Pages/view-color-coded-style/view-color-coded-style.module').then( m => m.ViewColorCodedStylePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
