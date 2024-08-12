import {User} from "./user";
import {LocalNgModuleData} from "@angular/compiler-cli/src/ngtsc/scope";

export class ServiceComp {
    id: number;
    nomServiceComp: string;
    descriptionServiceComp: string;
    coutService: number;
    dateDebutService: Date;
    dateFinService: Date;
    etatService: boolean = true;
    outService: boolean = true;
    users: User[];
    constructor(

        _id?: number,
        _nomServiceComp?: string,
        _descriptionServiceComp?: string,
        _coutService?: number,
        _dateDebutService?: Date,
        _dateFinService?: Date,
        _etatService?: boolean,
        _outService?: boolean,
        _users?: User[]
    ) {
        this.id = _id|| 0,
        this.nomServiceComp = _nomServiceComp|| '' ;
        this.descriptionServiceComp = _descriptionServiceComp || '';
        this.coutService = _coutService || 0;
        this.dateDebutService = _dateDebutService || new Date();
        this.dateFinService = _dateFinService || new Date();
        this.users = _users || [];
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _nomServiceComp(): string {
        return this.nomServiceComp;
    }

    set _nomServiceComp(value: string) {
        this.nomServiceComp = value;
    }

    get _descriptionServiceComp(): string {
        return this.descriptionServiceComp;
    }

    set _descriptionServiceComp(value: string) {
        this.descriptionServiceComp = value;
    }

    get _coutService(): number {
        return this.coutService;
    }

    set _coutService(value: number) {
        this.coutService = value;
    }

    get _dateDebutService(): Date {
        return this.dateDebutService;
    }

    set _dateDebutService(value: Date) {
        this.dateDebutService = value;
    }

    get _dateFinService(): Date {
        return this.dateFinService;
    }

    set _dateFinService(value: Date) {
        this.dateFinService = value;
    }

    get _etatService(): boolean {
        return this.etatService;
    }

    set _etatService(value: boolean) {
        this.etatService = value;
    }

    get _outService(): boolean {
        return this.outService;
    }

    set _outService(value: boolean) {
        this.outService = value;
    }

    get _users(): User[] {
        return this.users;
    }

    set _users(value: User[]) {
        this.users = value;
    }
}
