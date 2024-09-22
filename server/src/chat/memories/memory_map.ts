import type { BufferMemory, BufferWindowMemory } from "langchain/memory";
import { buildMemory } from "./sql_memory";
import { builWindowBufferMemory } from "./window_memory";

type MemoryBuilder = (chatArgs: any) => BufferMemory | BufferWindowMemory;
export const memoryMap = new Map<string, MemoryBuilder>();
memoryMap.set('sql_buffer_memory', (chatArgs: any) => buildMemory(chatArgs));
memoryMap.set('sql_window_memory', (chatArgs: any) => builWindowBufferMemory(chatArgs))
