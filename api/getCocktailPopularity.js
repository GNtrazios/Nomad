import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  const { data: cocktailpopularity, error } = await supabase
    .from('nomad_cocktailpopularity')
    .select('cocktail, popularity, popularitypercentage');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(cocktailpopularity);
}
