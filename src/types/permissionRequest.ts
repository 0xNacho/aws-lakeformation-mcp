import { Permission } from "@aws-sdk/client-lakeformation";

export type PermissionOperation = 'GRANT' | 'REVOKE';

/**
 * Class representing a permission request for AWS Lake Formation
 */
export class PermissionRequest {
    public readonly databaseName: string;
    public readonly tableName: string;
    
    constructor(
        table: string,
        public readonly roleName: string,
        public readonly operation: PermissionOperation = 'GRANT',
        public readonly fields: string[]  = [],
        public readonly permissions: Permission[] = ["SELECT"]
    ) {
        const [dbName, tblName] = table.split(".");
        if (!dbName || !tblName) {
            throw new Error("Invalid table format. Expected format: <database_name>.<table_name>");
        }
        this.databaseName = dbName;
        this.tableName = tblName;
    }

    public get fullTableName(): string {
        return `${this.databaseName}.${this.tableName}`;
    }
}