import { z } from 'zod';

export const createMessageSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(5000),
  }),
});

