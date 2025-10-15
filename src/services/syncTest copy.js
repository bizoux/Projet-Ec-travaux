import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  try {
    const tests = await db.Mainoeuvre.toArray();

    for (const tes of tests) {
      // Vérifie si la clé primaire existe (CodeMainOeuvre)
      if (!tes.CodeMainOeuvre) {
        console.warn('Objet ignoré, clé manquante :', tes);
        continue;
      }

      const { error } = await supabase.from('Mainoeuvre').upsert(tes, {
        onConflict: ['CodeMainOeuvre']
      });

      if (error) {
        console.error(`Erreur lors de l'upsert pour CodeMainOeuvre = ${tes.CodeMainOeuvre}`, error.message, error.details);
      } else {
        console.log(`Synchronisé : CodeMainOeuvre = ${tes.CodeMainOeuvre}`);
      }
    }
  } catch (err) {
    console.error('Erreur générale pendant la synchronisation vers Supabase :', err);
  }
}


export async function syncFromSupabase() {
  const { data, error } = await supabase.from('Mainoeuvre').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const tes of data) {
    await db.Mainoeuvre.put(tes);
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
