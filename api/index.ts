import type { Request, Response } from 'express';
import { serverPromise } from '../server';

export default async function handler(req: Request, res: Response) {
  const app = await serverPromise;
  return app(req, res);
}
