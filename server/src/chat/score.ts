import { client } from './redis';

async function randomComponentByScore(componentName: string, componentMap: Map<string, Function>) {
  if (!["llm", "memory", "retriever"].includes(componentName)) {
    throw new Error(`Invalid component name: ${componentName}`);
  }

  const values = await client.hGetAll(`${componentName}_scores_values`);
  const counts = await client.hGetAll(`${componentName}_scores_counts`);

  const names = componentMap.keys();

  const avgScores = new Map();
  for (const name of names) {
    const score = parseInt(values[name] || "1");
    const count = parseInt(counts[name] || "1");
    const avg = score / count;
    console.log(name);
    avgScores.set(name, Math.max(avg, 0.1));
  }

  let sumScores = 0;
  for (const avg of avgScores.values()) {
    sumScores += avg;
  }
  const rnd = Math.random() * sumScores;
  let cumSum = 0;
  for (const [name, avg] of avgScores) {
    cumSum += avg;
    if (rnd <= cumSum) {
      return name;
    }
  }
}


async function score_conversation(conversationId: number, score: number, llm: string, retriever: string, memory: string) {
  score = Math.min(Math.max(score, 0), 1);

  console.log(`Scoring conversation ${conversationId} with score ${score}`)
  await client.hIncrBy("llm_scores_values", llm, score);
  await client.hIncrBy("llm_scores_counts", llm, 1);

  await client.hIncrBy("retriever_scores_values", retriever, score);
  await client.hIncrBy("retriever_scores_counts", retriever, 1);

  await client.hIncrBy("memory_scores_values", memory, score);
  await client.hIncrBy("memory_scores_counts", memory, 1);

}

async function get_scores() {
  const aggregates = <{ [key: string]: Record<string, Array<number>> }>{};
  aggregates["llm"] = {};
  aggregates["retriever"] = {};
  aggregates["memory"] = {};

  for (const [key, value] of Object.entries(aggregates)) {
    const values = await client.hGetAll(`${key}_scores_values`);
    const counts = await client.hGetAll(`${key}_scores_counts`);

    const names = Object.keys(values);

    const avgScores = new Map();
    for (const name of names) {
      const score = parseInt(values[name] || "1");
      const count = parseInt(counts[name] || "1");
      const avg = score / count;
      if (value[name]) {
        value[name].push(avg)
      } else {
        value[name] = [avg]
      }
    }
  }

  return aggregates
}

export { randomComponentByScore, score_conversation, get_scores }
