import {User} from "./user";
import {Facture} from "./Facture";

export class Depot {
     id: number;  // Mettez à jour cette propriété
     nom: string;
     adresse: string;
     tel: number;
     capitale: number;
     description: string;
       responsable: User;
     factures: Facture[];


    constructor(_id: number=0, _nom: string="", _adresse: string="", _tel: number=0, _capitale: number=0, _description: string="", _responsable=new User(), _factures: Facture[]=[]) {
        this.id = _id;
        this.nom = _nom;
        this.adresse = _adresse;
        this.tel = _tel;
        this.capitale = _capitale;
        this.description = _description;
        this.responsable = _responsable;
        this.factures = _factures;
    }


    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _nom(): string {
        return this.nom;
    }

    public set _nom(value: string) {
        this.nom = value;
    }

    public get _adresse(): string {
        return this.adresse;
    }

    public set _adresse(value: string) {
        this.adresse = value;
    }

    public get _tel(): number {
        return this.tel;
    }

    public set _tel(value: number) {
        this.tel = value;
    }

    public get _capitale(): number {
        return this.capitale;
    }

    public set _capitale(value: number) {
        this.capitale = value;
    }

    public get _description(): string {
        return this.description;
    }

    public set _description(value: string) {
        this.description = value;
    }


    public get _responsable(): User {
        return this.responsable;
    }

    public set _responsable(value: User) {
        this.responsable = value;
    }

    public get _factures(): Facture[] {
        return this.factures;
    }

    public set _factures(value: Facture[]) {
        this.factures = value;
    }
}
