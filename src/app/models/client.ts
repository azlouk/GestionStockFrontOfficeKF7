import {RoleEnum, User} from "./user";

export class Client extends User {
      typeClient: string;
      soldeClient: number;

    constructor(
        _id: number = 0,
        _firstname: string = "",
        _lastname: string = "",
        _email: string = "",
        _telephone: number = 0,
        _adresse: string = "",
        _role: RoleEnum = RoleEnum.CLIENT,
        _password: string = "",
        _authentification: any[] = [],
        _permission: any[] = [],
        _pwed: string = "",
        _typeClient: string = "",
        _soldeClient: number = 0
    ) {
        super(_id, _firstname, _lastname, _email, _telephone, _adresse, _role, _password, _authentification, _permission, _pwed);
        this.id = _id;
        this.firstname = _firstname;
        this.lastname = _lastname;
        this.email = _email;
        this.telephone = _telephone;
        this.adresse = _adresse;
        this.role = _role;
        this.password = _password;
        this.authentifications = _authentification;
        this.permission = _permission;
        this.pwed = _pwed;
        // this.typeClient = _typeClient;
        // this.soldeClient = _soldeClient;
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

