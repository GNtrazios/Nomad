import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  const { id, language } = req.query;
  console.log('Incoming request with:', { id, language });

  const { data: question, error: qError } = await supabase
    .schema('nomad')
    .from('questions')
    .select('*')
    .eq('id', id)
    .eq('language', language)
    .single();

  if (qError) {
    console.error('Error fetching question:', qError);
    return res.status(500).json({ error: qError.message });
  }

  console.log('Fetched question:', question);

  const { data: answers, error: aError } = await supabase
    .schema('nomad')
    .from('answers')
    .select('answer, next_question_id')
    .eq('question_id', id)
    .eq('language', language)
    .order('answer', { ascending: true });

  if (aError) {
    console.error('Error fetching answers:', aError);
    return res.status(500).json({ error: aError.message });
  }

  console.log('Fetched answers:', answers);

  res.status(200).json({
    id: question.id,
    language: question.language,
    question: question.question,
    is_result: question.is_result,
    description: question.description,
    options: answers
  });
}
