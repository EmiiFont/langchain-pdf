import type { ConversationTokenBufferMemory } from "langchain/memory";
import { buildMemory } from "./sql_memory";

type MemoryBuilder = (chatArgs: any) => ConversationTokenBufferMemory;
export const memoryMap = new Map<string, MemoryBuilder>();
memoryMap.set('sql_buffer_memory', (chatArgs: any) => buildMemory(chatArgs));
