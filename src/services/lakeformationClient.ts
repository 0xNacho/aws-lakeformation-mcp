import { LakeFormationClient, GrantPermissionsCommand, RevokePermissionsCommand, Permission } from "@aws-sdk/client-lakeformation";
import { LakeFormationPermissionFactory, LakeFormationPermissionRequest } from "../types/lakeformationPermissionFactory.js";

// Initialize the Lake Formation client
const lakeFormationClient = new LakeFormationClient({region: process.env.AWS_REGION});

export interface PermissionResult {
    success: boolean;
    message: string;
}

/**
 * Manages permissions using the Lake Formation Permission Factory
 */
export async function managePermissions(request: LakeFormationPermissionRequest): Promise<PermissionResult> {
    const commandParams = request.buildCommandParams();
    const Command = request.operation === 'GRANT' ? GrantPermissionsCommand : RevokePermissionsCommand;
    const command = new Command(commandParams);

    try {
        const result = await lakeFormationClient.send(command);
        return {
            success: true,
            message: JSON.stringify(result)
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(errorMessage);
    }
}

// Convenience methods for common operations
export async function grantTablePermissions(
    table: string,
    principal: string,
    permissions: Permission[] = ["SELECT"]
): Promise<PermissionResult> {
    const [dbName, tableName] = LakeFormationPermissionFactory.parseTableIdentifier(table);
    const request = LakeFormationPermissionFactory.createTableRequest(
        dbName,
        tableName,
        principal,
        'GRANT',
        permissions
    );
    return managePermissions(request);
}

export async function grantTableColumnsPermissions(
    table: string,
    columns: string[],
    principal: string,
    permissions: Permission[] = ["SELECT"]
): Promise<PermissionResult> {
    const [dbName, tableName] = LakeFormationPermissionFactory.parseTableIdentifier(table);
    const request = LakeFormationPermissionFactory.createTableWithColumnsRequest(
        dbName,
        tableName,
        columns,
        principal,
        'GRANT',
        permissions
    );
    return managePermissions(request);
}

export async function grantDatabasePermissions(
    databaseName: string,
    principal: string,
    permissions: Permission[] = ["CREATE_TABLE"]
): Promise<PermissionResult> {
    const request = LakeFormationPermissionFactory.createDatabaseRequest(
        databaseName,
        principal,
        'GRANT',
        permissions
    );
    return managePermissions(request);
}

export async function grantLFTagPermissions(
    tagKey: string,
    tagValues: string[],
    principal: string,
    permissions: Permission[] = ["DESCRIBE"]
): Promise<PermissionResult> {
    const request = LakeFormationPermissionFactory.createLFTagRequest(
        tagKey,
        tagValues,
        principal,
        'GRANT',
        permissions
    );
    return managePermissions(request);
}

// Revoke operations
export async function revokeTablePermissions(
    table: string,
    principal: string,
    permissions: Permission[] = ["SELECT"]
): Promise<PermissionResult> {
    const [dbName, tableName] = LakeFormationPermissionFactory.parseTableIdentifier(table);
    const request = LakeFormationPermissionFactory.createTableRequest(
        dbName,
        tableName,
        principal,
        'REVOKE',
        permissions
    );
    return managePermissions(request);
}

export async function revokeTableColumnsPermissions(
    table: string,
    columns: string[],
    principal: string,
    permissions: Permission[] = ["SELECT"]
): Promise<PermissionResult> {
    const [dbName, tableName] = LakeFormationPermissionFactory.parseTableIdentifier(table);
    const request = LakeFormationPermissionFactory.createTableWithColumnsRequest(
        dbName,
        tableName,
        columns,
        principal,
        'REVOKE',
        permissions
    );
    return managePermissions(request);
}

export async function revokeDatabasePermissions(
    databaseName: string,
    principal: string,
    permissions: Permission[] = ["CREATE_TABLE"]
): Promise<PermissionResult> {
    const request = LakeFormationPermissionFactory.createDatabaseRequest(
        databaseName,
        principal,
        'REVOKE',
        permissions
    );
    return managePermissions(request);
}

export async function revokeLFTagPermissions(
    tagKey: string,
    tagValues: string[],
    principal: string,
    permissions: Permission[] = ["DESCRIBE"]
): Promise<PermissionResult> {
    const request = LakeFormationPermissionFactory.createLFTagRequest(
        tagKey,
        tagValues,
        principal,
        'REVOKE',
        permissions
    );
    return managePermissions(request);
}