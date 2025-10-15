import { supabase } from '@/supabase'

// Inscription
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Connexion
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Déconnexion
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Récupérer l’utilisateur courant
export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}
