import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates tool definitions for both GRANT and REVOKE operations.
 * @param baseName The base name of the tool without the operation prefix
 * @param description The description template for the tool
 * @param schema The input schema for the tool
 * @returns An array containing both GRANT and REVOKE tool definitions
 */
export function createPermissionTools(
    baseName: string,
    description: string,
    schema: Record<string, any>
): Tool[] {
    const baseSchema = {
        type: "object" as const,
        properties: schema,
        required: Object.keys(schema).filter(key => !schema[key].default)
    };

    return ['GRANT', 'REVOKE'].map(operation => ({
        name: `${operation.toLowerCase()}_${baseName}`,
        description: `${operation}s ${description}`,
        inputSchema: baseSchema
    }));
}

// Define tool schemas
const TABLE_SCHEMA = {
    table: { type: "string", description: "Name of the table (format: <database_name>.<table_name>)" },
    roleName: { type: "string", description: "Name of the role (format: arn:aws:iam::*:role/*)" },
    permissions: { type: "array", description: "List of permissions to grant", items: { type: "string" }, default: ["SELECT"] }
};

const TABLE_COLUMNS_SCHEMA = {
    table: { type: "string", description: "Name of the table (format: <database_name>.<table_name>)" },
    columns: { type: "array", description: "List of column names", items: { type: "string" } },
    roleName: { type: "string", description: "Name of the role (format: arn:aws:iam::*:role/*)" },
    permissions: { type: "array", description: "List of permissions to grant", items: { type: "string" }, default: ["SELECT"] }
};

const DATABASE_SCHEMA = {
    databaseName: { type: "string", description: "Name of the database" },
    roleName: { type: "string", description: "Name of the role (format: arn:aws:iam::*:role/*)" },
    permissions: { type: "array", description: "List of permissions to grant", items: { type: "string" }, default: ["CREATE_TABLE"] }
};

const LFTAG_SCHEMA = {
    tagKey: { type: "string", description: "The key of the LF tag" },
    tagValues: { type: "array", description: "List of tag values", items: { type: "string" } },
    roleName: { type: "string", description: "Name of the role (format: arn:aws:iam::*:role/*)" },
    permissions: { type: "array", description: "List of permissions to grant", items: { type: "string" }, default: ["DESCRIBE"] }
};

// Create tool definitions
export const TABLE_TOOLS = createPermissionTools(
    "table_permissions",
    "permissions on a table (all columns)",
    TABLE_SCHEMA
);

export const TABLE_COLUMNS_TOOLS = createPermissionTools(
    "table_columns_permissions",
    "permissions on specific table columns",
    TABLE_COLUMNS_SCHEMA
);

export const DATABASE_TOOLS = createPermissionTools(
    "database_permissions",
    "permissions on a database",
    DATABASE_SCHEMA
);

export const LFTAG_TOOLS = createPermissionTools(
    "lf_tag_permissions",
    "permissions on Lake Formation tags",
    LFTAG_SCHEMA
);

// Export all tools
export const ALL_TOOLS = [
    ...TABLE_TOOLS,
    ...TABLE_COLUMNS_TOOLS,
    ...DATABASE_TOOLS,
    ...LFTAG_TOOLS
];