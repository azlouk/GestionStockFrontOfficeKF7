import {User} from "./user";

export class  Tranche{
    private _id : number;
    private _description : string;
    private _dateEcheance : Date;
    private _montantTranche: number;
    private _user : User;
    private _statutPayement : boolean;

    constructor(id?:number,
                description?: string,
                dateEcheance?: Date,
                montantTranche?: number,
                user?: User,
                statutPayement? : boolean) {
        this._id = id || 0;
        this._description = description || '';
        this._dateEcheance = dateEcheance || new Date();
        this._montantTranche = montantTranche || 0;
        this._user = user || new User();
        this._statutPayement = statutPayement ||false;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get dateEcheance(): Date {
        return this._dateEcheance;
    }

    set dateEcheance(value: Date) {
        this._dateEcheance = value;
    }

    get montantTranche(): number {
        return this._montantTranche;
    }

    set montantTranche(value: number) {
        this._montantTranche = value;
    }


    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get statutPayement(): boolean {
        return this._statutPayement;
    }

    set statutPayement(value: boolean) {
        this._statutPayement = value;
    }
}
