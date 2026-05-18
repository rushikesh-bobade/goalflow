import type { ActionFunctionArgs } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const formData = await request.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  if (!title && !description) {
    return new Response(JSON.stringify({ error: 'Missing title or description' }), { status: 400 });
  }

  const prompt = `You are an expert OKR and Goal Setting Coach. 
Please rewrite the following goal into a perfect SMART goal (Specific, Measurable, Achievable, Relevant, Time-Bound).
Make it professional, motivating, and highly quantifiable.

Current Title: ${title || 'None'}
Current Description: ${description || 'None'}

Return your response in strict JSON format matching this schema:
{
  "title": "A concise, impactful SMART goal title (max 60 chars)",
  "description": "A detailed, measurable description outlining the exact targets and timeline."
}
Do not return any markdown or code block tags, just the JSON string.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to enhance goal.' }), { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Enhance Goal Error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
  }
}
