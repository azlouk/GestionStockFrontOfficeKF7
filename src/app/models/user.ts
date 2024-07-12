 import {Authentification} from "./authentification";
import {IPermission, Permission} from "./permission";

export enum RoleEnum {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    RESPONSABLE = 'RESPONSABLE',
    EMPLOYER = 'EMPLOYER',
    TRANSPORTEUR = 'TRANSPORTEUR',
    CLIENT = 'CLIENT',
    FOURNISSEUR = 'FOURNISSEUR',
    ALL = 'Tous les rôles'
}

export class User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    telephone: number;
    adresse: string;
    role: RoleEnum;
    password: string;
    passwordConfirm: string;
    passwordConfirm1: string;
    soldeClient! : number;
    typeClient !: string;
    authentifications:any[]=[] ;
    userSelected:boolean=false;
    permission:IPermission[]=[];
    pwed:string  ;

    constructor(_id: number = 0, _firstname: string = "", _lastname: string = "", _email: string = "", _telephone: number = 0, _adresse: string = "", _role: RoleEnum = RoleEnum.EMPLOYER, _password: string = "", _authentification: Authentification[] = [], _permission: Permission[] = [], _pwed: string = "") {
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
    }


    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _firstname(): string {
        return this.firstname;
    }

    public set _firstname(value: string) {
        this.firstname = value;
    }

    public get _lastname(): string {
        return this.lastname;
    }

    public set _lastname(value: string) {
        this.lastname = value;
    }

    public get _email(): string {
        return this.email;
    }

    public set _email(value: string) {
        this.email = value;
    }

    public get _telephone(): number {
        return this.telephone;
    }

    public set _telephone(value: number) {
        this.telephone = value;
    }

    public get _adresse(): string {
        return this.adresse;
    }

    public set _adresse(value: string) {
        this.adresse = value;
    }

    public get _role(): RoleEnum {
        return this.role;
    }

    public set _role(value: RoleEnum) {
        this.role = value;
    }

    public get _password(): string {
        return this.password;
    }

    public set _password(value: string) {
        this.password = value;
    }


    public get _authentifications(): Authentification[] {
        return this.authentifications;
    }

    public set _authentifications(value: Authentification[]) {
        this.authentifications = value;
    }

    public get _permission(): IPermission[] {
        return this.permission;
    }

    public set _permission(value: IPermission[]) {
        this.permission = value;
    }

    public get _pwed(): string {
        return this.pwed;
    }

    public set _pwed(value: string) {
        this.pwed = value;
    }
}