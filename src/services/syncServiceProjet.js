import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  try {
    const projet = await db.Projet.toArray();
      for (const proj of projet) {
        await supabase.from('Projet').upsert(proj, {
          onConflict: ['idProj']
        });
      }
  } catch (err) {
    console.error('Erreur générale pendant la synchronisation vers Supabase :', err);
  }
}


export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Projet').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const proj of data) {
    await db.Projet.put(proj);
  }
  
if (error) {
  console.error('Erreur Supabase:', error.message, error.details);
}
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:Projet')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Projet'
    }, async (payload) => {
      await db.Projet.put(payload.new);
    })
    .subscribe();
}
