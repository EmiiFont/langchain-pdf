import { Langfuse } from "langfuse";
import { CallbackHandler } from "langfuse-langchain";

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: "https://us.cloud.langfuse.com"
});

// Initialize Langfuse callback handler
const langfuseLangchainHandler = new CallbackHandler({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: "https://us.cloud.langfuse.com"
});

export { langfuse, langfuseLangchainHandler };
