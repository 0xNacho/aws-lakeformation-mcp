import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
    grantTablePermissions, 
    grantTableColumnsPermissions, 
    grantDatabasePermissions,
    grantLFTagPermissions,
    revokeTablePermissions,
    revokeTableColumnsPermissions,
    revokeDatabasePermissions,
    revokeLFTagPermissions
} from "./services/lakeformationClient.js";
import {
    TablePermissionArgs,
    TableColumnsPermissionArgs,
    DatabasePermissionArgs,
    LFTagPermissionArgs
} from "./types/toolArgs.js";
import { ALL_TOOLS } from "./types/mcpTools.js";

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
    tools: ALL_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (!args) {
        return {
            content: [{ type: "text", text: "Missing arguments" }],
            isError: true,
        };
    }

    try {
        switch (name) {
            case "grant_table_permissions": {
                const typedArgs = args as unknown as TablePermissionArgs;
                if (!typedArgs.table || !typedArgs.principal) {
                    throw new Error("Missing required arguments: table and roleName");
                }
                return handleResult(await grantTablePermissions(
                    typedArgs.table,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "grant_table_columns_permissions": {
                const typedArgs = args as unknown as TableColumnsPermissionArgs;
                if (!typedArgs.table || !typedArgs.columns || !typedArgs.principal) {
                    throw new Error("Missing required arguments: table, columns, and roleName");
                }
                return handleResult(await grantTableColumnsPermissions(
                    typedArgs.table,
                    typedArgs.columns,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "grant_database_permissions": {
                const typedArgs = args as unknown as DatabasePermissionArgs;
                if (!typedArgs.databaseName || !typedArgs.principal) {
                    throw new Error("Missing required arguments: databaseName and roleName");
                }
                return handleResult(await grantDatabasePermissions(
                    typedArgs.databaseName,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "grant_lf_tag_permissions": {
                const typedArgs = args as unknown as LFTagPermissionArgs;
                if (!typedArgs.tagKey || !typedArgs.tagValues || !typedArgs.principal) {
                    throw new Error("Missing required arguments: tagKey, tagValues, and roleName");
                }
                return handleResult(await grantLFTagPermissions(
                    typedArgs.tagKey,
                    typedArgs.tagValues,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "revoke_table_permissions": {
                const typedArgs = args as unknown as TablePermissionArgs;
                if (!typedArgs.table || !typedArgs.principal) {
                    throw new Error("Missing required arguments: table and roleName");
                }
                return handleResult(await revokeTablePermissions(
                    typedArgs.table,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "revoke_table_columns_permissions": {
                const typedArgs = args as unknown as TableColumnsPermissionArgs;
                if (!typedArgs.table || !typedArgs.columns || !typedArgs.principal) {
                    throw new Error("Missing required arguments: table, columns, and roleName");
                }
                return handleResult(await revokeTableColumnsPermissions(
                    typedArgs.table,
                    typedArgs.columns,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "revoke_database_permissions": {
                const typedArgs = args as unknown as DatabasePermissionArgs;
                if (!typedArgs.databaseName || !typedArgs.principal) {
                    throw new Error("Missing required arguments: databaseName and roleName");
                }
                return handleResult(await revokeDatabasePermissions(
                    typedArgs.databaseName,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            case "revoke_lf_tag_permissions": {
                const typedArgs = args as unknown as LFTagPermissionArgs;
                if (!typedArgs.tagKey || !typedArgs.tagValues || !typedArgs.principal) {
                    throw new Error("Missing required arguments: tagKey, tagValues, and roleName");
                }
                return handleResult(await revokeLFTagPermissions(
                    typedArgs.tagKey,
                    typedArgs.tagValues,
                    typedArgs.principal,
                    typedArgs.permissions
                ));
            }

            default:
                return {
                    content: [{ type: "text", text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error managing permissions: ${errorMessage}` }],
            isError: true,
        };
    }
});

function handleResult(result: { success: boolean; message: string }) {
    return {
        content: [{ type: "text", text: result.message }]
    };
}

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