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
      description: `Store and manage user information as unique memory strings. Captures preferences, settings, and important context while preventing duplicates.

Examples:
- Input: "I prefer emails over calls"
- Output: ["User prefers emails over calls"]

Returns memory array for queries, or "Sorry, I can only help with memory-related questions" for off-topic requests.`,
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
