import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStorageService } from '../services/auth.storage.service';

export const authGuard: CanActivateFn = () => {
  const authStorageService = inject(AuthStorageService);
  const router = inject(Router);

  const isLoggedIn = authStorageService.isLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
