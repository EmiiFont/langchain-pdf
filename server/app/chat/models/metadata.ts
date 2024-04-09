import { DynamicStructuredTool } from 'langchain/tools'
import { z } from 'zod'

export const metadata = new DynamicStructuredTool({
  name: 'metadata',
  description: 'Metadata for a PDF',
  schema: z.object({
    pdfId: z.string(),
    conversationId: z.string(),
    userId: z.string(),
  }),
  func: async ({ pdfId }): Promise<string> => {
    return pdfId.toString()
  },
})
