import { Permission } from "@aws-sdk/client-lakeformation";

/**
 * This interface defines the structure for a Lake Formation resource.
 * It includes a method to build the resource object that can be used in permission requests.
 */
export interface ILakeFormationResource {
    /**
     * Builds the resource object for the Lake Formation permission request.
     * @returns An object representing the resource.
     */
    buildResource(): any;
}

/**
 * This type defines the structure for a permission request in AWS Lake Formation.
 * It includes the role name, permissions, and the operation (GRANT or REVOKE).
 */
export type PermissionRequest = {
    principalArn: string;
    permissions: Permission[];
    operation: 'GRANT' | 'REVOKE';
};

/**
 * This class represents a request to grant or revoke permissions in AWS Lake Formation.
 */
export abstract class BaseTableResource implements ILakeFormationResource {
    /**
     * Constructor for the BaseTableResource class.
     * @param databaseName The name of the database.
     * @param tableName The name of the table.
     */
    constructor(
        protected databaseName: string,
        protected tableName: string
    ) {}

    abstract buildResource(): any;
}

/**
 * This class represents a request to grant or revoke permissions on a table in AWS Lake Formation.
 * It extends the BaseTableResource class and includes the table name and database name.
 */
export class TableResource extends BaseTableResource {

    buildResource() {
        return {
            Table: {
                DatabaseName: this.databaseName,
                Name: this.tableName,
            }
        };
    }
}

/**
 * This class represents a request to grant or revoke permissions on specific columns of a table in AWS Lake Formation.
 * It extends the BaseTableResource class and includes the column names.
 */
export class TableWithColumnsResource extends BaseTableResource {
    /**
     * Builds the resource object for the table with columns.
     * @param databaseName the name of the database
     * @param tableName the name of the table
     * @param columns  the list of columns
     */
    constructor(
        databaseName: string,
        tableName: string,
        private columns: string[]
    ) {
        super(databaseName, tableName);
    }

    /**
     * Builds the resource object for the table with columns.
     * @returns An object representing the resource.
     */
    buildResource() {
        return {
            TableWithColumns: {
                DatabaseName: this.databaseName,
                Name: this.tableName,
                ColumnNames: this.columns
            }
        };
    }
}

/**
 * This class represents a request to grant or revoke permissions on a database in AWS Lake Formation.
 * It includes the database name and the operation (GRANT or REVOKE).
 */
export class DatabaseResource implements ILakeFormationResource {

    /**
     * Constructor for the DatabaseResource class.
     * @param databaseName The name of the database.
     */
    constructor(private databaseName: string) {}

    /**
     * Builds the resource object for the database.
     * @returns An object representing the resource.
     */
    buildResource() {
        return {
            Database: {
                Name: this.databaseName
            }
        };
    }
}

/**
 * This class represents a request to grant or revoke permissions on a data location in AWS Lake Formation.
 * It includes the resource ARN and the operation (GRANT or REVOKE).
 */
export class LFTagResource implements ILakeFormationResource {
    /**
     * Constructor for the LFTagResource class.
     * @param tagKey The key of the tag.
     * @param tagValues  The values of the tag.
     */
    constructor(
        private tagKey: string,
        private tagValues: string[]
    ) {}

    /**
     * Builds the resource object for the LF tag.
     * @returns An object representing the resource.
     */
    buildResource() {
        return {
            LFTag: {
                TagKey: this.tagKey,
                TagValues: this.tagValues
            }
        };
    }
}