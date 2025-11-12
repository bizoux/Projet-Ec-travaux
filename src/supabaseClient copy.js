import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://johuyafwtdnkqvbxkwfg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvaHV5YWZ3dGRua3F2Ynhrd2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDczNzQsImV4cCI6MjA2ODIyMzM3NH0.sjQ2JwDoGZB65CBppP-zycq1y5Sd56hoP2oB-0ttI44';
export const supabase = createClient(supabaseUrl, supabaseKey);
