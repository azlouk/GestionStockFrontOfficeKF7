import {RoleEnum} from "./user";
import {Role} from "./role";

export class Authentification {

      id:number;
      username:String;
      motDePasse:String;
      token:String;
      role:RoleEnum;
      roles:Role[];


    constructor(_id: number=0, _username: String="", _motDePasse: String="", _token: String="", _role: RoleEnum=RoleEnum.EMPLOYER, _roles: Role[]=[]) {
        this.id = _id;
        this.username = _username;
        this.motDePasse = _motDePasse;
        this.token = _token;
        this.role = _role;
        this.roles = _roles;
    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _username(): String {
        return this.username;
    }

    public set _username(value: String) {
        this.username = value;
    }

    public get _motDePasse(): String {
        return this.motDePasse;
    }

    public set _motDePasse(value: String) {
        this.motDePasse = value;
    }

    public get _token(): String {
        return this.token;
    }

    public set _token(value: String) {
        this.token = value;
    }

    public get _role(): RoleEnum {
        return this.role;
    }

    public set _role(value: RoleEnum) {
        this.role = value;
    }

    public get _roles(): Role[] {
        return this.roles;
    }

    public set _roles(value: Role[]) {
        this.roles = value;
    }
}
