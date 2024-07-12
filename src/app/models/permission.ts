export interface IPermission{
    id?: number;
    api?: string;
    tableName?: string;

}
export class Permission {
    id: number;
    api: string;
    tableName: string;

    constructor(
        id: number = 0,
        api: string = '',
        tableName: string = '',
    ) {
        this.id = id;
        this.api = api;
        this.tableName = tableName;
    }


}
