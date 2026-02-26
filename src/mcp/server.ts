import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { databaseTools } from "./tools/database.js";
import { cacheTools } from "./tools/cache.js";
import { fileTools } from "./tools/file.js";
import { activityTools } from "./tools/activity.js";

const server = new Server(
  {
    name: "poc-mandiri-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Combine all tools
const allTools = [
  ...databaseTools,
  ...cacheTools,
  ...fileTools,
  ...activityTools,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find(t => t.name === request.params.name);

  if (!tool) {
    return {
      content: [{ type: "text" as const, text: `Tool ${request.params.name} not found` }],
      isError: true,
    };
  }

  try {
    const result = await tool.handler(request.params.arguments);
    return {
      content: [
        {
          type: "text" as const,
          text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP Server] Connected via stdio transport");
}

main().catch(error => {
  console.error("[MCP Server] Fatal error:", error);
  process.exit(1);
});
