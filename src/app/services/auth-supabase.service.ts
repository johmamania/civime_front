import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthSupabaseService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly tokenStorageKey = 'supabase_admin_token';

  login(email: string, password: string): Observable<string> {
    return from(
      this.supabase.auth.signInWithPassword({
        email,
        password
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        const token = data.session?.access_token;
        if (!token) {
          throw new Error('No se recibió token de sesión.');
        }
        localStorage.setItem(this.tokenStorageKey, token);
        return token;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getUsernameFromToken(token: string): string {
    try {
      const payload = this.parseJwtPayload(token);
      const userMeta = payload['user_metadata'] ?? {};
      const appMeta = payload['app_metadata'] ?? {};

      const username =
        userMeta.user_name ??
        userMeta.username ??
        userMeta.full_name ??
        payload['name'] ??
        payload['preferred_username'] ??
        payload['email'] ??
        appMeta.provider;

      return typeof username === 'string' && username.trim()
        ? username.trim()
        : 'usuario';
    } catch {
      return 'usuario';
    }
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.tokenStorageKey);
    return from(this.supabase.auth.signOut()).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
      })
    );
  }

  private parseJwtPayload(token: string): Record<string, any> {
    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Token JWT inválido.');
    }
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json);
  }
}
