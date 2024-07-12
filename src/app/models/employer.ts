import {   User} from "./user";
import {Authentification} from "./authentification";
 
export class Employer extends User {

      typeEmployer: string;
      tacheEmployer: string;


    constructor(typeEmployer: string="", tacheEmployer: string="") {
        super();
        this.typeEmployer = typeEmployer;
        this.tacheEmployer = tacheEmployer;
    }


    public get _typeEmployer(): string {
        return this.typeEmployer;
    }

    public set _typeEmployer(value: string) {
        this.typeEmployer = value;
    }

    public get _tacheEmployer(): string {
        return this.tacheEmployer;
    }

    public set _tacheEmployer(value: string) {
        this.tacheEmployer = value;
    }
}
