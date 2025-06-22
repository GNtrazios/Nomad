import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { questionId, answerText, answerLanguage } = req.body;

  const { error } = await supabase.rpc('increment_answer_count', {
    questionid: questionId,
    answer_text: answerText,
    answer_language: answerLanguage,
  });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Count updated' });
}