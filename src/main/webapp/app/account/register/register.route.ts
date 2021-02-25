import { Route } from '@angular/router';
import { Authority } from '../../shared/constants/authority.constants';
import { RegisterComponent } from './register.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';

export const registerRoute: Route = {
  path: 'register',
  component: RegisterComponent,
  data: {
    authorities: [Authority.ADMIN],
    pageTitle: 'register.title',
  },
  canActivate: [UserRouteAccessService],
};
