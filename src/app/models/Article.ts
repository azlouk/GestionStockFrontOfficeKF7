export enum UNITE {
    PIECE = 'PIECE',
    CM = 'CM',
    ML = 'ML',
    G = 'G',
}

export class Article {

    id: number;
    nom: string;
    description: string;
    unite: UNITE;


    constructor(_id: number=0, _nom: string="", _description: string="", _unite: UNITE=UNITE.CM) {
        this.id = _id;
        this.nom = _nom;
        this.description = _description;
        this.unite = _unite;
    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _nom(): string {
        return this.nom;
    }

    public set _nom(value: string) {
        this.nom = value;
    }

    public get _description(): string {
        return this.description;
    }

    public set _description(value: string) {
        this.description = value;
    }

    public get _unite(): UNITE {
        return this.unite;
    }

    public set _unite(value: UNITE) {
        this.unite = value;
    }
}
