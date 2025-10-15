import { supabase } from '@/supabaseClient';
import db from '@/db';

export async function syncToSupabase() {
  const utilisateurs = await db.utilisateurs.toArray();

  for (const user of utilisateurs) {
    await supabase.from('utilisateurs').upsert(user, {
      onConflict: ['id']
    });
  }
}

export async function syncFromSupabase() {
  const { data, error } = await supabase.from('utilisateurs').select('*');
  if (error) return console.error('Erreur Supabase:', error);

  for (const user of data) {
    await db.utilisateurs.put(user);
  }
}

export function listenToSupabaseUpdates() {
  supabase
    .channel('realtime:utilisateurs')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'utilisateurs'
    }, async (payload) => {
      await db.utilisateurs.put(payload.new);
    })
    .subscribe();
}
