import { Routes } from '@angular/router';
import { HomepageComponent } from './containers/homepage/homepage.component';
import { ROUTER_NAME } from './shared/services/custom-routing/constants';
import { isEmbedded } from '../environments/environment.development';
import { TranslationsComponent } from './containers/translations/translations.component';
import { TranslateComponent } from './containers/translate/translate.component';

export const PATHS = {
  HOME: 'home',
  LOGIN: 'login',
  TRANSLATIONS: 'translations',
  TRANSLATIONS_TRANSLATE_ID: 'translations/:id',
};

export const routes: Routes = [
  {
    path: PATHS.HOME,
    component: HomepageComponent,
    pathMatch: 'full',
  },
  {
    path: PATHS.TRANSLATIONS_TRANSLATE_ID,
    component: TranslateComponent,
    // pathMatch: 'full',
  },
  {
    path: PATHS.TRANSLATIONS,
    component: TranslationsComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: TranslationsComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: PATHS.TRANSLATIONS,
    pathMatch: 'full',
  },
];
