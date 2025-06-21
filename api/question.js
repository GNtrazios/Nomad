import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  const { id, language } = req.query;

  const { data: question, error: qError } = await supabase
    .from('nomad.questions')
    .select('*')
    .eq('id', id)
    .eq('language', language)
    .single();

  if (qError) return res.status(500).json({ error: qError.message });

  const { data: answers, error: aError } = await supabase
    .from('nomad.answers')
    .select('answer, next_question_id')
    .eq('question_id', id)
    .eq('language', language)
    .order('answer', { ascending: true });

  if (aError) return res.status(500).json({ error: aError.message });

  res.status(200).json({
    id: question.id,
    language: question.language,
    question: question.question,
    is_result: question.is_result,
    description: question.description,
    options: answers
  });
}
