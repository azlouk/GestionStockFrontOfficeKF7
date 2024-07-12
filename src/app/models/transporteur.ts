import {User} from "./user";

export class  Transporteur extends User {
    immatriculeV: string;


    constructor(_immatriculeV: string="") {
        super();
        this.immatriculeV = _immatriculeV;
    }

    public get _immatriculeV(): string {
        return this.immatriculeV;
    }

    public set _immatriculeV(value: string) {
        this.immatriculeV = value;
    }
}
