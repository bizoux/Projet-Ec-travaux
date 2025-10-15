import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  const materiels = await db.materiel.toArray();

  for (const mat of materiels) {
    await supabase.from('Materiel').upsert(mat, {
      onConflict: ['Code']
    });
  }
}

export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Materiel').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const mat of data) {
    await db.materiel.put(mat);
  }
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:Materiel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Materiel'
    }, async (payload) => {
      await db.materiel.put(payload.new);
    })
    .subscribe();
}
