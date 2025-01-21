import { z } from "zod";
import { HackerNewsClient } from "@agentic/hacker-news";
import { FirecrawlClient } from "@agentic/firecrawl";
import { BingClient } from "@agentic/bing";

type PluginsConfig = {
  [key: string]: {
    enabled: boolean;
    apiKey: string;
    cx?: string;
  };
};

export function createTools(plugins?: string) {
  const tools:
    | {
        [key: string]: {
          description: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parameters: z.ZodObject<any>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          execute: (params: any) => Promise<any>;
        };
      }
    | undefined = {
    rememberInformation: {
      description: `As a digital memory assistant, your role is to capture and store essential user information in the form of unique, concise memory strings. Focus on user preferences, settings, personal details, key decisions, and important context. Implement a method to ensure no duplicates are added to the memory array. Provide the final array of memory strings when requested. If asked about unrelated topics, respond with a specific message.

Detailed Instructions:
Capture Information: Extract user data related to preferences, settings, personal details, decisions, and context.
Check for Duplicates: Before adding a new entry, verify it does not duplicate existing memory strings.
Store Information: Add unique entries to an array of memory strings.
Respond to Queries: When queried, return the complete array of memory strings. If the query is off-topic, provide a predefined response.
Steps:
Extract Information: Identify and extract relevant information from user input.
Verify Uniqueness: Compare the new information against the existing memory strings to ensure it is unique.
Update Memory: If the information is unique, add it to the memory array.
Handle Queries: Return the memory array or a specific response based on the user's query.
Output Format:
Memory Array Response: Return the updated array of memory strings.
Off-topic Response: Return the string "Sorry, I can only help with memory-related questions."
Examples:
Example 1:
Input: "I prefer emails over calls for updates."
Reasoning: Extract the preference for emails over calls, check if it's unique, and add it to the memory array.
Output: ["I prefer emails over calls for updates."]
Example 2:
Input: "What's the weather like today?"
Reasoning: Recognize the query as off-topic and respond with the predefined message.
Output: "Sorry, I can only help with memory-related questions."
These examples demonstrate how to handle both relevant and irrelevant queries. Use these as a guide to manage different types of user interactions.`,
      parameters: z.object({
        memory: z
          .array(z.string())
          .optional()
          .describe("The info to remember!"),
      }),
      execute: async ({ memory }: { memory: string[] }) => {
        return memory || [];
      },
    },
    generateTitle: {
      description: `Create a concise and descriptive title for the conversation based on its context and content.

Guidelines:

Limit to 2-4 words.
Clearly describe the main topic.
Capture the essence of the conversation.
Use title case formatting.
Avoid generic titles like "Chat" or "Conversation."
Return the title as a single string.`,
      parameters: z.object({
        title: z.string().describe("The generated title for the conversation"),
      }),
      execute: async ({ title }: { title: string }) => {
        return title;
      },
    },
    getCurrentDate: {
      description: `Get the current date and time in ISO format.
      
      Returns the current date/time as a string.`,
      parameters: z.object({
        format: z
          .string()
          .optional()
          .describe("Optional date format specification"),
      }),
      execute: async () => {
        return new Date().toISOString();
      },
    },
    hackerNews: {
      description: `Retrieve the top stories from Hacker News. Always give links to the original source.`,
      parameters: z.object({
        count: z.number().optional().default(5),
      }),
      execute: async () => {
        const hn = new HackerNewsClient();
        const stories = await hn.getTopStories();
        return stories;
      },
    },
    calculator: {
      description: `Perform mathematical calculations. Supports basic arithmetic operations.
      
      Guidelines:
      - Use standard mathematical notation
      - Supports +, -, *, /, (), and basic math functions
      - Returns the calculated result
      Only accepts valid mathematical expressions:
      - Numbers and decimal points
      - Basic operators: +, -, *, /
      - Parentheses ()
      - No letters or other characters
      `,
      parameters: z.object({
        expr: z.string().describe("The mathematical expression to evaluate"),
      }),
      execute: async ({ expr }: { expr: string }) => {
        const res = eval(expr);
        return res;
      },
    },
  };

  if (plugins) {
    const pluginsArray: PluginsConfig = JSON.parse(plugins);

    const webSearch = {
      description: `Perform a web search using Google Custom Search API and return relevant results.
      
    Guidelines:
    - Return top search results
    - Include title and snippet for each result
    - Filter for relevant content only`,
      parameters: z.object({
        query: z.string().describe("The search query to execute"),
      }),
      execute: async ({ query }: { query: string }) => {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${
            pluginsArray["google-search"].apiKey
          }&cx=${pluginsArray["google-search"].cx}&q=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              "Accept-Encoding": "gzip",
            },
          }
        );
        const data = await res.json();
        return data;
      },
    };

    const webScrape = {
      description: `Scrape content from a web page and return relevant results.`,
      parameters: z.object({
        url: z.string().url().describe("The URL to scrape content from"),
      }),
      execute: async ({ url }: { url: string }) => {
        const firecrawl = new FirecrawlClient({
          apiKey: pluginsArray["firecrawl"].apiKey,
        });
        const res = await firecrawl.scrapeUrl({
          url,
        });
        return res;
      },
    };

    const bingWebSearch = {
      description: `Perform a web search using Bing Web Search API and return relevant results.`,
      parameters: z.object({
        query: z.string().describe("The search query to execute"),
      }),
      execute: async ({ query }: { query: string }) => {
        const bing = new BingClient({
          apiKey: pluginsArray["bing-search"].apiKey,
        });
        const res = await bing.search(query);
        return res;
      },
    };

    if (pluginsArray["google-search"]?.enabled) {
      tools.webSearch = webSearch;
    }

    if (pluginsArray["firecrawl"]?.enabled) {
      tools.webScrape = webScrape;
    }

    if (pluginsArray["bing-search"]?.enabled) {
      tools.bingWebSearch = bingWebSearch;
    }
  }

  return tools;
}

export default createTools;
