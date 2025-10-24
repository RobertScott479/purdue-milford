import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';
import { UserRoleEnum } from './auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authService: AuthService) {}

  CanDeactivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRoles = route.data['expectedRoles'] as UserRoleEnum[];
    // const token = localStorage.getItem('token');
    // decode the token to get its payload
    // const tokenPayload = decode(token);
    // console.log(this.loadedUser.roles, expectedRoles)

    return this.authService.canExecute(expectedRoles, state.url);

    // const isInRole = this.authService.loadedUser.roles.some(role => expectedRoles.includes(role));

    // if (!this.authService.isAuthenticated || !isInRole) {
    //   this.router.navigate(['/login'], {
    //     queryParams: {
    //       return: state.url,
    //       message: 'You do not have permission to access this resource'
    //     }
    //   });
    //   return false;
    // }
    // return true;
  }
}

// export interface CanDeactivate<T> {
//   canDeactivate(component: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
//     Observable<boolean> | Promise<boolean> | boolean;
// }

@Injectable()
export class SaveFormsGuard {
  canDeactivate(component: any) {
    return component.canDeactivate();
  }
}
