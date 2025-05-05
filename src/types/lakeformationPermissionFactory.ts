import { Permission } from "@aws-sdk/client-lakeformation";
import { ILakeFormationResource, TableResource, TableWithColumnsResource, DatabaseResource, LFTagResource } from "./permissions.js";

/**
 * This class represents a request to grant or revoke permissions in AWS Lake Formation.
 * It contains the necessary information to build the command parameters for the AWS SDK.
 */
export class LakeFormationPermissionRequest {
    constructor(
        public readonly principalArn: string,
        public readonly operation: 'GRANT' | 'REVOKE',
        public readonly permissions: Permission[],
        private readonly resource: ILakeFormationResource
    ) {}

    /**
     * Builds the command parameters for the AWS SDK based on the provided role name,
     * operation, permissions, and resource. 
     * @returns  An object containing the command parameters.
     */
    buildCommandParams() {
        return {
            Principal: { DataLakePrincipalIdentifier: this.principalArn },
            Resource: this.resource.buildResource(),
            Permissions: this.permissions,
        };
    }
}

/**
 * This class is a factory for creating LakeFormationPermissionRequest objects.
 * It provides static methods to create requests for different types of resources,
 * including tables, databases, and LF tags.
 */
export class LakeFormationPermissionFactory {
    /**
     * Creates a request to grant or revoke permissions on a table in AWS Lake Formation.
     * @param databaseName the nane of the database
     * @param tableName the name of the table 
     * @param roleName the name of the role
     * @param operation  the operation to perform (GRANT or REVOKE)
     * @param permissions  the permissions to grant or revoke
     * @returns a LakeFormationPermissionRequest object
     */
    static createTableRequest(
        databaseName: string,
        tableName: string,
        roleName: string,
        operation: 'GRANT' | 'REVOKE',
        permissions: Permission[] = ["SELECT"]
    ): LakeFormationPermissionRequest {
        const resource = new TableResource(databaseName, tableName);
        return new LakeFormationPermissionRequest(roleName, operation, permissions, resource);
    }

    /**
     * Creates a request to grant or revoke permissions on specific columns of a table in AWS Lake Formation.
     * @param databaseName the name of the database
     * @param tableName the name of the table
     * @param columns the list of columns
     * @param roleName the name of the role
     * @param operation the operation to perform (GRANT or REVOKE)
     * @param permissions the permissions to grant or revoke
     * @returns a LakeFormationPermissionRequest object
     */
    static createTableWithColumnsRequest(
        databaseName: string,
        tableName: string,
        columns: string[],
        roleName: string,
        operation: 'GRANT' | 'REVOKE',
        permissions: Permission[] = ["SELECT"]
    ): LakeFormationPermissionRequest {
        const resource = new TableWithColumnsResource(databaseName, tableName, columns);
        return new LakeFormationPermissionRequest(roleName, operation, permissions, resource);
    }

    /**
     * Creates a request to grant or revoke permissions on a database in AWS Lake Formation.
     * @param databaseName the name of the database
     * @param roleName the name of the role
     * @param operation the operation to perform (GRANT or REVOKE)
     * @param permissions the permissions to grant or revoke
     * @returns a LakeFormationPermissionRequest object
     */
    static createDatabaseRequest(
        databaseName: string,
        roleName: string,
        operation: 'GRANT' | 'REVOKE',
        permissions: Permission[] = ["CREATE_TABLE"]
    ): LakeFormationPermissionRequest {
        const resource = new DatabaseResource(databaseName);
        return new LakeFormationPermissionRequest(roleName, operation, permissions, resource);
    }

    /**
     * Creates a request to grant or revoke permissions on LF tags in AWS Lake Formation.
     * @param tagKey the key of the LF tag
     * @param tagValues the values of the LF tag
     * @param roleName the name of the role
     * @param operation the operation to perform (GRANT or REVOKE)
     * @param permissions the permissions to grant or revoke
     * @returns a LakeFormationPermissionRequest object
     */
    static createLFTagRequest(
        tagKey: string,
        tagValues: string[],
        roleName: string,
        operation: 'GRANT' | 'REVOKE',
        permissions: Permission[] = ["DESCRIBE"]
    ): LakeFormationPermissionRequest {
        const resource = new LFTagResource(tagKey, tagValues);
        return new LakeFormationPermissionRequest(roleName, operation, permissions, resource);
    }

    /**
     * Parses a table identifier string into a database name and table name.
     * @param tableIdentifier the table identifier string in the format <database_name>.<table_name>
     * @returns a tuple containing the database name and table name
     * @throws an error if the format is invalid
     */
    static parseTableIdentifier(tableIdentifier: string): [string, string] {
        const [dbName, tblName] = tableIdentifier.split(".");
        if (!dbName || !tblName) {
            throw new Error("Invalid table format. Expected format: <database_name>.<table_name>");
        }
        return [dbName, tblName];
    }
}