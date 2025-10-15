import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  try {
    const mainoeuvres = await db.Mainoeuvre.toArray();
      for (const main of mainoeuvres) {
        await supabase.from('Mainoeuvre').upsert(main, {
          onConflict: ['CodeMainOeuvre']
        });
      }
  } catch (err) {
    console.error('Erreur générale pendant la synchronisation vers Supabase :', err);
  }
}


export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Mainoeuvre').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const main of data) {
    await db.Mainoeuvre.put(main);
  }
  
if (error) {
  console.error('Erreur Supabase:', error.message, error.details);
}
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:Mainoeuvre')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Mainoeuvre'
    }, async (payload) => {
      await db.Mainoeuvre.put(payload.new);
    })
    .subscribe();
}
