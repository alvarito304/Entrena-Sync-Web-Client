import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {map, retry} from 'rxjs';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
)=> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  return authService.getUserInfo().pipe(
    map(user => {
      const roles = (user as any)?.roles || [];
      if (roles.includes(requiredRole)) {
        return true;
      } else {
        router.navigate(['/unauthorized']);
        return false;
      }
    })
  );
};
