import { Permission } from "@aws-sdk/client-lakeformation";

/**
 * Type definitions for Lake Formation tool arguments
 */

export interface TablePermissionArgs {
    table: string;
    principal: string;
    permissions?: Permission[];
}

export interface TableColumnsPermissionArgs {
    table: string;
    columns: string[];
    principal: string;
    permissions?: Permission[];
}

export interface DatabasePermissionArgs {
    databaseName: string;
    principal: string;
    permissions?: Permission[];
}

export interface LFTagPermissionArgs {
    tagKey: string;
    tagValues: string[];
    principal: string;
    permissions?: Permission[];
}