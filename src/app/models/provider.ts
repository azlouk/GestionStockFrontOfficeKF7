import {User} from "./user";

export class Provider extends User {
     nomSociete: string;
     telephoneSociete: number;
     adresseSociete: string;
     emailSociete: string;


    constructor(_nomSociete: string="", _telephoneSociete: number=0, _adresseSociete: string="", _emailSociete: string="") {
        super();
        this.nomSociete = _nomSociete;
        this.telephoneSociete = _telephoneSociete;
        this.adresseSociete = _adresseSociete;
        this.emailSociete = _emailSociete;
    }

    public get _nomSociete(): string {
        return this.nomSociete;
    }

    public set _nomSociete(value: string) {
        this.nomSociete = value;
    }

    public get _telephoneSociete(): number {
        return this.telephoneSociete;
    }

    public set _telephoneSociete(value: number) {
        this.telephoneSociete = value;
    }

    public get _adresseSociete(): string {
        return this.adresseSociete;
    }

    public set _adresseSociete(value: string) {
        this.adresseSociete = value;
    }

    public get _emailSociete(): string {
        return this.emailSociete;
    }

    public set _emailSociete(value: string) {
        this.emailSociete = value;
    }
}
