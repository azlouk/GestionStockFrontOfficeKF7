import {ServiceComp} from "./ServiceComp";
import {User} from "./user";
import {LigneCommande} from "./LigneCommande";


export enum Status {
    ENCOURS = 'ENCOURS',
    RETOUR = 'RETOUR',
    CONFIRME = 'CONFIRME'
}

export class CommandeServ {
    id: number;
    reference: string;
    dateCreation: string;
    dateEstimeeFin: string;
    dateValidationOuSortie: string;
    status: Status;
    paiement: boolean = false;
    prixTotal: number ;
    avance: number ;
    totalProduits: number;
    totalCoutService: number;
    prixSupplimentaire: number;
    descriptionPanne: string;
    nomPanne: string;
    descriptionprixSupplimentaire: string;
    services: ServiceComp[] = [];
    produits: LigneCommande [] = [];
    client: User;
    constructor(_id?: number,
                _reference?: string,
                _dateCreation?: string,
                _dateEstimeeFin?: string,
                _dateValidationOuSortie?: string,
                _paiement?: boolean,
                _status?: Status,
                _prixTotal?: number,
                _avance?: number,
                _descriptionPanne?: string,
                _nomPanne?: string,
                _totalProduits?: number,
                _totalCoutService?: number,
                _prixSupplimentaire?: number,
                _services?: ServiceComp[],
                _produits?: LigneCommande[],
                _client?: User,
                _descriptionprixSupplimentaire?: string) {
        this.id = _id || 0;
        this.reference = _reference || "";
        this.dateCreation = _dateCreation || new Date().toString();
        this.dateEstimeeFin = _dateEstimeeFin || new Date().toString();
        this.dateValidationOuSortie = _dateValidationOuSortie || new Date().toString();
        this.status = _status || Status.ENCOURS;
        this.prixTotal = _prixTotal || 0;
        this.paiement = _paiement || false;
        this.avance = _avance || 0;
        this.services = _services || [];
        this.produits = _produits || [];
        this.descriptionPanne = _descriptionPanne || "";
        this.nomPanne = _nomPanne || "";
        this.client = _client || new User();
        this.totalProduits = _totalProduits || 0;
        this.totalCoutService = _totalCoutService || 0;
        this.prixSupplimentaire = _prixSupplimentaire || 0;
        this.descriptionprixSupplimentaire = _descriptionprixSupplimentaire || "";
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _reference(): string {
        return this.reference;
    }

    set _reference(value: string) {
        this.reference = value;
    }

    get _dateCreation(): string {
        return this.dateCreation;
    }

    set _dateCreation(value: string) {
        this.dateCreation = value;
    }

    get _dateEstimeeFin(): string {
        return this.dateEstimeeFin;
    }

    set _dateEstimeeFin(value: string) {
        this.dateEstimeeFin = value;
    }

    get _dateValidationOuSortie(): string {
        return this.dateValidationOuSortie;
    }

    set _dateValidationOuSortie(value: string) {
        this.dateValidationOuSortie = value;
    }

    get _status(): Status {
        return this.status;
    }

    set _status(value: Status) {
        this.status = value;
    }

    get _prixTotal(): number {
        return this.prixTotal;
    }

    set _prixTotal(value: number) {
        this.prixTotal = value;
    }

    get _paiement(): boolean {
        return this.paiement;
    }

    set _paiement(value: boolean) {
        this.paiement = value;
    }

    get _avance(): number {
        return this.avance;
    }

    set _avance(value: number) {
        this.avance = value;
    }

    get _services(): ServiceComp[] {
        return this.services;
    }

    set _services(value: ServiceComp[]) {
        this.services = value;
    }

    get _produits(): LigneCommande[] {
        return this.produits;
    }

    set _produits(value: LigneCommande[]) {
        this.produits = value;
    }

    get _descriptionPanne(): string | null {
        return this.descriptionPanne;
    }

    set _descriptionPanne(value: string | null) {
        this.descriptionPanne = value;
    }

    get _nomPanne(): string | null {
        return this.nomPanne;
    }

    set _nomPanne(value: string | null) {
        this.nomPanne = value;
    }

    get _client(): User | null {
        return this.client;
    }

    set _client(value: User | null) {
        this.client = value;
    }

    get _totalProduits(): number {
        return this.totalProduits;
    }

    set _totalProduits(value: number) {
        this.totalProduits = value;
    }

    get _totalCoutService(): number {
        return this.totalCoutService;
    }

    set _totalCoutService(value: number) {
        this.totalCoutService = value;
    }

    get _prixSupplimentaire(): number {
        return this.prixSupplimentaire;
    }

    set _prixSupplimentaire(value: number) {
        this.prixSupplimentaire = value;
    }

    get _descriptionprixSupplimentaire(): string {
        return this.descriptionprixSupplimentaire;
    }

    set _descriptionprixSupplimentaire(value: string) {
        this.descriptionprixSupplimentaire = value;
    }

}



