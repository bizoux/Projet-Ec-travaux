import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdhpbzqvvpynvodvmvzz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaHBienF2dnB5bnZvZHZtdnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTA4OTEsImV4cCI6MjA3Nzk4Njg5MX0.wFvX1QCISQEbCpoRTjVeUvbfWDdZ35prJlmSE1nWkwU';
export const supabase = createClient(supabaseUrl, supabaseKey);
