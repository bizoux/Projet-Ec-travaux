import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  try {
    const b = await db.bde.toArray();
      for (const bde of b) {
        await supabase.from('Bde').upsert(bde, {
          onConflict: ['Num']
        });
      }
  } catch (err) {
    console.error('Erreur générale pendant la synchronisation vers Supabase :', err);
  }
}


export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Bde').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const b of data) {
    await db.bde.put(b);
  }
  
if (error) {
  console.error('Erreur Supabase:', error.message, error.details);
}
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:Bde')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Bde'
    }, async (payload) => {
      await db.bde.put(payload.new);
    })
    .subscribe();
}
