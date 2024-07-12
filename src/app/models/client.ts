import {User} from "./user";

export class Client extends User {
      typeClient: string;
      soldeClient: number;

    constructor(_typeClient: string="", _soldeClient: number=0) {
        super();
        this.typeClient = _typeClient;
        this.soldeClient = _soldeClient;
    }


    public get _typeClient(): string {
        return this.typeClient;
    }

    public set _typeClient(value: string) {
        this.typeClient = value;
    }

    public get _soldeClient(): number {
        return this.soldeClient;
    }

    public set _soldeClient(value: number) {
        this.soldeClient = value;
    }
}

