import { Route } from '@angular/router';
import { Authority } from '../../shared/constants/authority.constants';
import { RegisterComponent } from './register.component';

export const registerRoute: Route = {
  path: 'register',
  component: RegisterComponent,
  data: {
    authorities: [Authority.ADMIN],
    pageTitle: 'register.title',
  },
};
