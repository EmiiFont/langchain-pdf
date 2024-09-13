import { z } from 'zod'

const MetadataSchema = z.object({
  conversation_id: z.string(),
  user_id: z.string(),
  pdf_id: z.string(),
}).catchall(z.unknown());

const ChatArgsSchema = z.object({
  conversation_id: z.string(),
  pdf_id: z.string(),
  metadata: MetadataSchema,
  streaming: z.boolean(),
}).catchall(z.unknown());


export { MetadataSchema, ChatArgsSchema }
