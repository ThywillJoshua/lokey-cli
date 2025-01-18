import { Routes } from '@angular/router';
import { HomepageComponent } from './containers/homepage/homepage.component';
import { ROUTER_NAME } from './shared/services/custom-routing/constants';
import { isEmbedded } from '../environments/environment.development';
import { TranslationsComponent } from './containers/translations/translations.component';

export const PATHS = {
  HOME: 'home',
  LOGIN: 'login',
  TRANSLATIONS: 'translations',
};

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: PATHS.HOME,
    component: HomepageComponent,
  },
  {
    path: PATHS.TRANSLATIONS,
    component: TranslationsComponent,
  },
  {
    path: '**',
    redirectTo: PATHS.HOME,
    pathMatch: 'full',
  },
];
