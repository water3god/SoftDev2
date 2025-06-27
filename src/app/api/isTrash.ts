// pages/api/vision.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

type Data = {
  labels?: { description: string; score: number }[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { imageUrl } = req.body;

  if (!imageUrl || typeof imageUrl !== 'string') {
    res.status(400).json({ error: 'No valid imageUrl provided' });
    return;
  }

  try {
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations?.map((label) => ({
      description: label.description ?? '',
      score: label.score ?? 0,
    })) ?? [];

    res.status(200).json({ labels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Vision API error' });
  }
}
