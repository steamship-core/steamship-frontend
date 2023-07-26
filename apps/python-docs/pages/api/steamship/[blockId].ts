import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        Allow: 'GET'
      }
    });
  }
  // get block Id from req
  const url = new URL(req.url);
  const blockId = url.searchParams.get('blockId');

  return fetch(`${process.env.STEAMSHIP_API_URL}/api/v1/block/${blockId}/raw`, {
    headers: {
      Authorization: `Bearer ${process.env.STEAMSHIP_API_KEY}`,
      'X-Workspace-Handle': 'logobot-example-03c'
    },
    method: 'GET'
  });
}
