// import { createOpenAI as createModel } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { z } from "zod";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface Preferences {
  programmingLanguage: string;
  useAnalogies: boolean;
  domainModeling: boolean;
  backwardPlanning: boolean;
  systemPrompt: string;
  customInstructions: string;
  userContext: string;
  autoSaveContext: Record<string, boolean>;
  topP: number;
  topK: number;
  temperature: number;
  maxTokens: number;
}

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant with expertise in software development, technology, and problem-solving. You provide clear, concise, and accurate responses while maintaining a professional and friendly demeanor.

Key behaviors:
- Write clean, maintainable, and well-documented code
- Follow best practices and design patterns
- Provide detailed explanations when needed
- Consider security, performance, and scalability
- Suggest improvements and alternatives when appropriate`;

const DEFAULT_USER_CONTEXT = `I am a software developer working on web applications. I have experience with JavaScript and React, and I'm currently learning TypeScript and Next.js. I'm interested in best practices for building scalable and maintainable applications.`;

const AUTO_SAVE_OPTIONS = [
  { id: "technologies", label: "Technologies mentioned" },
  { id: "projects", label: "Projects discussed" },
  { id: "preferences", label: "Code style preferences" },
  { id: "experience", label: "Experience level changes" },
  { id: "interests", label: "New interests or focus areas" },
];

const DEFAULT_PREFERENCES = {
  programmingLanguage: "typescript",
  useAnalogies: true,
  domainModeling: true,
  backwardPlanning: true,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  customInstructions: "",
  userContext: DEFAULT_USER_CONTEXT,
  autoSaveContext: AUTO_SAVE_OPTIONS.reduce<Record<string, boolean>>(
    (acc, option) => ({ ...acc, [option.id]: false }),
    {}
  ),
  topP: 0.9,
  topK: 40,
  temperature: 0.7,
  maxTokens: 1000,
};

export async function POST(req: Request) {
  const cookieStore = cookies();
  const openRouterApiKey = cookieStore.get("openRouterApiKey");
  const preferences = cookieStore.get("preferences");
  const preferencesData = preferences?.value
    ? (JSON.parse(preferences.value) as Preferences)
    : DEFAULT_PREFERENCES;

  const { messages, model: modelName } = await req.json();

  const openrouter = createOpenRouter({
    apiKey: openRouterApiKey?.value,
  });

  // const model = createModel({
  //   baseURL: "https://openrouter.ai/api/v1",
  //   apiKey: openRouterApiKey?.value,
  // });

  const result = streamText({
    // model: model(modelName),
    model: openrouter(modelName),
    messages,
    system: preferencesData.systemPrompt,
    temperature: preferencesData.temperature,
    topP: preferencesData.topP,
    topK: preferencesData.topK,
    maxTokens: preferencesData.maxTokens,
    tools: {
      imageGeneration: tool({
        description:
          "generate an image based on a given prompt and then give it back to user in an image format in md",
        parameters: z.object({
          prompt: z.string(),
        }),
        execute: async ({ prompt }) => {
          const openai = new OpenAI();
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
          });
          const image_url = response.data[0].url;
          return image_url;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
