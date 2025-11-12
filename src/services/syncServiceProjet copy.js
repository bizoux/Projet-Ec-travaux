import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  try {
    const devis = await db.Devis.toArray();
      for (const dev of devis) {
        await supabase.from('devis').upsert(dev, {
          onConflict: ['idDevis']
        });
      }
  } catch (err) {
    console.error('Erreur générale pendant la synchronisation vers Supabase :', err);
  }
}


export async function syncFromSupabase() {
  const { data, error } = await supabase.from('devis').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const dev of data) {
    await db.Devis.put(dev);
  }
  
if (error) {
  console.error('Erreur Supabase:', error.message, error.details);
}
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:devis')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'devis'
    }, async (payload) => {
      await db.Devis.put(payload.new);
    })
    .subscribe();
}
