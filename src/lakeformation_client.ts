import { LakeFormationClient, GrantPermissionsCommand, Permission } from "@aws-sdk/client-lakeformation";

// Initialize the Lake Formation client
const lakeFormationClient = new LakeFormationClient({region: process.env.AWS_REGION});

/**
 * Grants permissions to a role for a specific table in AWS Lake Formation.
 * @param table - The table name in the format <database_name>.<table_name>.
 * @param roleName - The ARN of the role to grant permissions to.
 * @param permissions - The list of permissions to grant (e.g., ["SELECT", "INSERT"]).
 */
export async function grantPermissions(table: string, roleName: string, permissions: Permission[] = ["SELECT"]) {
    const [databaseName, tableName] = table.split(".");

  if (!databaseName || !tableName) {
    throw new Error("Invalid table format. Expected format: <database_name>.<table_name>");
  }

  const command = new GrantPermissionsCommand({
    Principal: { DataLakePrincipalIdentifier: roleName },
    Resource: {
      Table: {
        DatabaseName: databaseName,
        Name: tableName,
      },
    },
    Permissions: permissions,
  });

  try {
    const response = await lakeFormationClient.send(command);
    console.log(`Permissions granted successfully:`, response);
    return response;
  } catch (error) {
    console.error(`Error granting permissions:`, error);
    throw error;
  }
}