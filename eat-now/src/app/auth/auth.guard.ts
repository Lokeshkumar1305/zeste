import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (loginService.isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
