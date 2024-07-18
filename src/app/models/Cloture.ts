import { Tranche } from './Tranche';
import {Employer} from "./employer";

export class Cloture  {
     id: number;
    etatCloture: boolean = true;
    dateCloture: Date;
    montantClotureValide: number;
    montantClotureEspece: number;
     employer: Employer;
     tranche: Tranche;

    constructor(id: number=0, etatCloture: boolean=false, dateCloture: Date=new  Date(), montantClotureValide: number=0, montantClotureEspece: number=0, employer: Employer=new Employer(), tranche: Tranche=new Tranche()) {
        this.id = id;
        this.etatCloture = etatCloture;
        this.dateCloture = dateCloture;
        this.montantClotureValide = montantClotureValide;
        this.montantClotureEspece = montantClotureEspece;
        this.employer = employer;
        this.tranche = tranche;
    }


    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _etatCloture(): boolean {
        return this.etatCloture;
    }

    public set _etatCloture(value: boolean) {
        this.etatCloture = value;
    }

    public get _dateCloture(): Date {
        return this.dateCloture;
    }

    public set _dateCloture(value: Date) {
        this.dateCloture = value;
    }

    public get _montantClotureValide(): number {
        return this.montantClotureValide;
    }

    public set _montantClotureValide(value: number) {
        this.montantClotureValide = value;
    }

    public get _montantClotureEspece(): number {
        return this.montantClotureEspece;
    }

    public set _montantClotureEspece(value: number) {
        this.montantClotureEspece = value;
    }

    public get _employer(): Employer {
        return this.employer;
    }

    public set _employer(value: Employer) {
        this.employer = value;
    }

    public get _tranche(): Tranche {
        return this.tranche;
    }

    public set _tranche(value: Tranche) {
        this.tranche = value;
    }
}
