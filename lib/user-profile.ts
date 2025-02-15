import { supabase } from './supabase';

export async function createOrGetUserProfile(userId: string) {
  // First, check if the user profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error code
    console.error('Error fetching user profile:', fetchError);
    throw new Error('Failed to fetch user profile');
  }

  // If profile exists, return it
  if (existingProfile) {
    return existingProfile;
  }

  // If profile doesn't exist, create a new one
  const { data: newProfile, error: insertError } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: userId,
        credits: 3, // Default value
        tier: 'free', // Default value
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating user profile:', insertError);
    throw new Error('Failed to create user profile');
  }

  return newProfile;
} 