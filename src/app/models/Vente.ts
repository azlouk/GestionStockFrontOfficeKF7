import {User} from "./user";
import {LigneVente} from "./LigneVente";

export class Vente {

    id: number;  // Mettez à jour cette propriété
    dateVente : string;
    nomClient: string;
    total: number;
    reglement: number;
    lignesVente :LigneVente[];
    employer :User  ;
    visible : boolean ;
    isPrint : boolean ;
    constructor(_id?: number,
                _dateVente?: string,
                _nomClient?: string,
                _total?: number,
                _reglement?: number,
                _lignesVente?: LigneVente[],
                _employer?: User,
                _visible?: boolean,
                _isPrint? :boolean) {
        this.id = _id || 0;
        this.dateVente = _dateVente || new Date().toString();
        // this.dateVente = _dateVente || new Date();
        this.nomClient = _nomClient;
        this.total = _total;
        this.reglement = _reglement;
        this.lignesVente = _lignesVente;
        this.employer = _employer;
        this.visible = _visible;
        this.isPrint = _isPrint || true;
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }


    get _dateVente(): string {
        return this.dateVente;
    }

    set _dateVente(value: string) {
        this.dateVente = value;
    }

    get _nomClient(): string {
        return this.nomClient;
    }

    set _nomClient(value: string) {
        this.nomClient = value;
    }

    get _total(): number {
        return this.total;
    }

    set _total(value: number) {
        this.total = value;
    }

    get _reglement(): number {
        return this.reglement;
    }

    set _reglement(value: number) {
        this.reglement = value;
    }

    get _lignesVente(): LigneVente[] {
        return this.lignesVente;
    }

    set _lignesVente(value: LigneVente[]) {
        this.lignesVente = value;
    }

    get _employer(): User {
        return this.employer;
    }

    set _employer(value: User) {
        this.employer = value;
    }

    get _visible(): boolean {
        return this.visible;
    }

    set _visible(value: boolean) {
        this.visible = value;
    }

    get _isPrint(): boolean {
        return this.isPrint;
    }

    set _isPrint(value: boolean) {
        this.isPrint = value;
    }

    public toggleIsPrint(): void {
        this.isPrint = !this.isPrint;
    }
}
