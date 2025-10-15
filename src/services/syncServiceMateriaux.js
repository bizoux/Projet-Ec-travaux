import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  try {
    const materiaux = await db.Materiaux.toArray();
      for (const mater of materiaux) {
        await supabase.from('Materiaux').upsert(mater, {
          onConflict: ['id']
        });
      }
  } catch (err) {
    console.error('Erreur générale pendant la synchronisation vers Supabase :', err);
  }
}


export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Materiaux').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const mater of data) {
    await db.Materiaux.put(mater);
  }
  
if (error) {
  console.error('Erreur Supabase:', error.message, error.details);
}
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:Materiaux')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Materiaux'
    }, async (payload) => {
      await db.Materiaux.put(payload.new);
    })
    .subscribe();
}
