import {User} from "./user";

export class  Tranche{
     id : number;
     description : string;
     dateEcheance : Date;
     montantTranche: number;
     user : User;
     statutPayement : boolean;

    constructor(_id?: number, _description?: string, _dateEcheance?: Date, _montantTranche?: number, _user?: User, _statutPayement?: boolean) {
        this.id = _id || 0;
        this.description = _description || '';
        this.dateEcheance = _dateEcheance || new Date();
        this.montantTranche = _montantTranche || 0;
        this.user = _user || new User();
        this.statutPayement = _statutPayement || true;
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _description(): string {
        return this.description;
    }

    set _description(value: string) {
        this.description = value;
    }

    get _dateEcheance(): Date {
        return this.dateEcheance;
    }

    set _dateEcheance(value: Date) {
        this.dateEcheance = value;
    }

    get _montantTranche(): number {
        return this.montantTranche;
    }

    set _montantTranche(value: number) {
        this.montantTranche = value;
    }

    get _user(): User {
        return this.user;
    }

    set _user(value: User) {
        this.user = value;
    }

    get _statutPayement(): boolean {
        return this.statutPayement;
    }

    set _statutPayement(value: boolean) {
        this.statutPayement = value;
    }
}
