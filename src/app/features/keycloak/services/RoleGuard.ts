import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, map, of, retry} from 'rxjs';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['roles'] || [];

  return authService.getUserInfo().pipe(
    retry(1),
    map(user => {
      const roles = (user as any)?.roles || [];

      const hasRequiredRole = requiredRoles.some(role => roles.includes(role));

      if (hasRequiredRole) {
        return true;
      } else {
        console.warn('[RoleGuard] Acceso denegado. Requiere roles:', requiredRoles, 'pero el usuario tiene:', roles);
        router.navigate(['/unauthorized']);
        return false;
      }
    }),
    catchError(err => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
