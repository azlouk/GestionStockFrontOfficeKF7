import {Employer} from "./employer";
import {Tranche} from "./Tranche";


export    class Cloture {
    id: number;
    etatCloture: boolean = true;
    dateCloture: Date;
    montantClotureValide: number;
    montantClotureEspece: number;
    employer: Employer;
    tranche: Tranche;


    constructor(_id?: number, _etatCloture?: boolean, _dateCloture?: Date, _montantClotureValide?: number, _montantClotureEspece?: number, _employer?: Employer, _tranche?: Tranche) {
        this.id = _id || 0;
        this.etatCloture = _etatCloture || false;
        this.dateCloture = _dateCloture || new Date();
        this.montantClotureValide = _montantClotureValide || 0;
        this.montantClotureEspece = _montantClotureEspece || 0;
        this.employer = _employer || new Employer();
        this.tranche = _tranche || new Tranche();
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _etatCloture(): boolean {
        return this.etatCloture;
    }

    set _etatCloture(value: boolean) {
        this.etatCloture = value;
    }

    get _dateCloture(): Date {
        return this.dateCloture;
    }

    set _dateCloture(value: Date) {
        this.dateCloture = value;
    }

    get _montantClotureValide(): number {
        return this.montantClotureValide;
    }

    set _montantClotureValide(value: number) {
        this.montantClotureValide = value;
    }

    get _montantClotureEspece(): number {
        return this.montantClotureEspece;
    }

    set _montantClotureEspece(value: number) {
        this.montantClotureEspece = value;
    }

    get _employer(): Employer {
        return this.employer;
    }

    set _employer(value: Employer) {
        this.employer = value;
    }

    get _tranche(): Tranche {
        return this.tranche;
    }

    set _tranche(value: Tranche) {
        this.tranche = value;
    }
}
