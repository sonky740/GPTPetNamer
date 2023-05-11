import { NextApiRequest, NextApiResponse } from 'next';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function API(req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured',
      },
    });
    return;
  }

  const variables = req.body.variables || '';
  if (variables.trim().length === 0) {
    res.status(500).json({
      error: {
        message: 'Variables name is required',
      },
    });
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Suggest three variable names for the following "${variables}."`,
      temperature: 0.8,
      max_tokens: 100,
    });
    res.status(200).json({ result: response.data.choices[0].text });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occured during your request',
        },
      });
    }
  }
}
