import {Authentification} from "./authentification";
import {Configuration} from "./configuration";

export class Role {
      id: number;
      name: string;
      authentification: Authentification;
      configurations: Configuration[];


    constructor(_id: number=0, _name: string="", _authentification: Authentification=new Authentification(), _configurations: Configuration[]=[]) {
        this.id = _id;
        this.name = _name;
        this.authentification = _authentification;
        this.configurations = _configurations;
    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _name(): string {
        return this.name;
    }

    public set _name(value: string) {
        this.name = value;
    }

    public get _authentification(): Authentification {
        return this.authentification;
    }

    public set _authentification(value: Authentification) {
        this.authentification = value;
    }

    public get _configurations(): Configuration[] {
        return this.configurations;
    }

    public set _configurations(value: Configuration[]) {
        this.configurations = value;
    }
}
