import { ChatOpenAI} from "@langchain/openai"
import { LLMChain } from "langchain/chains"
import { ChatPromptTemplate, HumanMessage} from "@langchain/core/prompts"
import { HumanMessage} from "@langchain/core/messages"


class StreamingHandler {
    async (message: any) {
        console.log(message)
    }
}

// Set up the streaming callback
////https://js.langchain.com/v0.2/docs/how_to/custom_callbacks/

const handleToken = (token) => {
  process.stdout.write(token);
};


const chatOpenAI = new ChatOpenAI({
  streaming: true,
  callbacks: [{
    handleLLMNewToken: handleToken,
  }],
})
const prompt = ChatPromptTemplate.fromTemplate("tell me a short story in {length} paragraphs.")

const formattedPrompt = await prompt.format({length: 2 });
const message = new HumanMessage(formattedPrompt);

await chatOpenAI.call([message]);

class StreamingChain extends LLMChain {
    constructor() {
        super({
            chatOpenAI,
            prompt,
        })
    }
   
}



