import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

import {grantPermissions} from "./lakeformation_client";

const GRANT_TOOL: Tool = {
  name: "grant_lakeformation_permissions_on_table",
  description: "Grants lakeformation permissions on a table",
  inputSchema: {
    type: "object",
    properties: {
      table: { type: "string", description: "Name of the table to get permissions on (fotmat: <database_name>.<table_name>" },
      roleName: { type: "string", default: 3, description: "Name of the role for that will be granted (in arn format)"},
    },
    required: ["table", "roleName"],
  },
};

// Server setup
const server = new Server(
  {
    name: "aws-lakefomarmation-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [GRANT_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "grant_lakeformation_permissions_on_table") {
    const { table, roleName} = args as Record<string, string>;

    await grantPermissions(table, roleName, ["SELECT", "INSERT"]);
    try {
      return {
        content: [{ type: "text", text: `Granting permissions to ${roleName} on table ${table}` }],
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error occurred: ${error}` }],
      };
    }
  } else {
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }
});

// Server startup
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AWS Lakeformation Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});