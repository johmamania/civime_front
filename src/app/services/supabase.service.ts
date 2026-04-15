import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    const { url, anonKey } = environment.supabase;
    this.client = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
}
