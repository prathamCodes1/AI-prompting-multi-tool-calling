import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: "http://localhost:1234/v1",
  supportsStructuredOutputs: true,
});
export const model = lmstudio("qwen2.5-7b-instruct");
