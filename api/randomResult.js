import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  const { language } = req.query;

  const { data, error } = await supabase
    .schema('nomad')
    .from('questions')
    .select('*')
    .eq('is_result', true)
    .eq('language', language);

  if (error) return res.status(500).json({ error: error.message });

  const random = data[Math.floor(Math.random() * data.length)];

  res.status(200).json({
    id: random.id,
    language: random.language,
    question: random.question,
    is_result: true,
    description: random.description,
    options: [] // No options for result pages
  });
}
