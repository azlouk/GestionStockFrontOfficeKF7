import {User} from "./user";
import {LigneVente} from "./LigneVente";
import {Employer} from "./employer";
import {Client} from "./client";

export class Vente {

      id: number;
    paye: boolean;
      dateVente: Date;
      total: number;
      reglement: number;
      lignesVente: LigneVente[];
         employer: User;
         client: User;


    visible: boolean;
    isPrint: boolean;


    constructor(_id: number=0, _paye?: boolean, _dateVente: Date=new Date(), _total: number=0, _reglement: number=0, _lignesVente: LigneVente[]=[], _employer: User=new User(), _client: User=new User(), _visible: boolean=false, _isPrint: boolean=true) {
        this.id = _id;
        this.paye = _paye || false;
        this.dateVente = _dateVente;
        this.total = _total;

        this.reglement = _reglement;
        this.lignesVente = _lignesVente;
        this.employer = _employer;
        this.client = _client;
        this.visible = _visible;
        this.isPrint = _isPrint;
    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _dateVente(): Date {
        return this.dateVente;
    }

    public set _dateVente(value: Date) {
        this.dateVente = value;
    }

    public get _total(): number {
        return this.total;
    }

    public set _total(value: number) {
        this.total = value;
    }

    public get _reglement(): number {
        return this.reglement;
    }

    public set _reglement(value: number) {
        this.reglement = value;
    }

    public get _lignesVente(): LigneVente[] {
        return this.lignesVente;
    }

    public set _lignesVente(value: LigneVente[]) {
        this.lignesVente = value;
    }


    public get _employer(): User {
        return this.employer;
    }

    public set _employer(value: User) {
        this.employer = value;
    }

    public get _client(): User {
        return this.client;
    }

    public set _client(value: User) {
        this.client = value;
    }

    public get _visible(): boolean {
        return this.visible;
    }

    public set _visible(value: boolean) {
        this.visible = value;
    }

    public get _isPrint(): boolean {
        return this.isPrint;
    }

    public set _isPrint(value: boolean) {
        this.isPrint = value;
    }
}