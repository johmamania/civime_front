import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSupabaseService } from '../services/auth-supabase.service';

export const adminSupabaseGuard = () => {
  const auth = inject(AuthSupabaseService);
  const router = inject(Router);
  const token = auth.getToken();

  if (token) {
    return true;
  }

  return router.createUrlTree(['/inicio']);
};
