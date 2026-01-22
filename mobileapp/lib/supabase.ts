import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Fallback to dummy values to prevent runtime crash "supabaseUrl is required"
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-key';

let supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Verify availability or use fallback
if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http') || supabaseUrl.includes('your-project.supabase.co')) {
  console.log('[INFO] Supabase credentials missing. App will operate in Mock Data Mode.');
  supabaseUrl = FALLBACK_URL;
  supabaseAnonKey = FALLBACK_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
