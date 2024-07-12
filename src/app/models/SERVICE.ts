import {User} from "./user";

export  class SERVICE{
    private _id : number;
    private _nomServiceComp : string;
    private _descriptionServiceComp : string;
    private _users : User[]=[];
    private _coutService : number;
    private _etatService:boolean;
    private _outService :boolean;
    private _dateDebutService : Date;
    private _dateFinService : Date;
    private _visible:boolean=false;
    constructor(id?: number,
                nomServiceComp?: string,
                descriptionServiceComp?: string,
                user?: User [], coutService?: number,
                etatService?: boolean,
                outService?: boolean,
                dateDebutService?: Date,
                dateFinService?: Date) {
        this._id = id || 0;
        this._nomServiceComp = nomServiceComp || '';
        this._descriptionServiceComp = descriptionServiceComp || '';
        this._users = user || [];
        this._coutService = coutService || 0;
        this._etatService = etatService || false;
        this._outService = outService || false;
        this._dateDebutService = dateDebutService || new Date();
        this._dateFinService = dateFinService || new Date();
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get nomServiceComp(): string {
        return this._nomServiceComp;
    }

    set nomServiceComp(value: string) {
        this._nomServiceComp = value;
    }

    get descriptionServiceComp(): string {
        return this._descriptionServiceComp;
    }

    set descriptionServiceComp(value: string) {
        this._descriptionServiceComp = value;
    }

    get users(): User[] {
        return this._users;
    }

    set users(value: User[]) {
        this._users = value;
    }

    get coutService(): number {
        return this._coutService;
    }

    set coutService(value: number) {
        this._coutService = value;
    }

    get etatService(): boolean {
        return this._etatService;
    }

    set etatService(value: boolean) {
        this._etatService = value;
    }

    get outService(): boolean {
        return this._outService;
    }

    set outService(value: boolean) {
        this._outService = value;
    }

    get dateDebutService(): Date {
        return this._dateDebutService;
    }

    set dateDebutService(value: Date) {
        this._dateDebutService = value;
    }

    get dateFinService(): Date {
        return this._dateFinService;
    }

    set dateFinService(value: Date) {
        this._dateFinService = value;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }
}
