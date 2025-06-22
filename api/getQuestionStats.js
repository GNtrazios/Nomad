// api/getQuestionStats.js
import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  const { data: questionStats, error } = await supabase
    .from('nomad_answerperquestionpercentage')
    .select('question, answer, clicks, percentage_of_question_clicks')
    
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(questionStats);
}
