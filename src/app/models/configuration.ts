import {Role} from "./role";

export class Configuration {
      id: number;
      description: string;
      role: Role;


    constructor(_id: number=0, _description: string="", _role: Role=new Role()) {
        this.id = _id;
        this.description = _description;
        this.role = _role;
    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _description(): string {
        return this.description;
    }

    public set _description(value: string) {
        this.description = value;
    }

    public get _role(): Role {
        return this.role;
    }

    public set _role(value: Role) {
        this.role = value;
    }
}
