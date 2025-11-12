import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  const lots = await db.Lot.toArray();

  for (const lts of lots) {
    await supabase.from('Lot').upsert(lts, {
      onConflict: ['CodeLot']
    });
  }
}

export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Lot').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const lot of data) {
    await db.Lot.put(lot);
  }
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:Lot')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Lot' // Table any amin'ny supabase
    }, async (payload) => {
      await db.Lot.put(payload.new);
    })
    .subscribe();
}
