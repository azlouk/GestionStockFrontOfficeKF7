
import { Produit } from "./produit";
import { User } from "./user";
import {Tranche} from "./Tranche";
import {Depot} from "./Depot";
import {LigneFacture} from "./LigneFacture";

export enum factureType{
    ENTREE = "FACTURE_ACHAT",
    SORTIE = "FACTURE_VENTE",
    VIDE = ""
}

export interface FactureInterface{
    id: number
    reference: string
    lignesFacture: LigneFacture []
    montant: number
    montantTaxe : number
    date: string
    dateCreation: Date
    facturetype:factureType
    client: User
    provider: User
    transporteur: User
    depot: Depot
    tranche: Tranche[] | Tranche
    paye: boolean
    reglement : number;
}
export class Facture {
    private _id: number
    private _reference: string
    private _lignesFacture: LigneFacture []
    private _montant: number
    private _montantTaxe : number
    private _date: Date
    private _dateCreation: Date
    private _typeFacture:factureType
    private _client: User
    private _transporteur:User
    private _provider:User
    private _depot: Depot
    private _tranche: Tranche[] | Tranche
    private _paye: boolean
    private _reglement : number;

    constructor(id?: number , reference?: string, quantite?: number, ligneFacture?: LigneFacture[], prixUnitaire?: number, montant?: number, montantTaxe? : number,reglement?:number, date?: Date, dateCreation? :Date, facturetype?: factureType, client?: User,transporteur?:User,provider?:User, depot?: Depot,tranche?:Tranche[], payee? : boolean) {
        this._id = id || 0;
        this._reference = reference || '';
        this._lignesFacture = ligneFacture || [];
        this._montant = montant || 0;
        this._montantTaxe = montantTaxe || 0;
        this._reglement = reglement ||0;
        this._date = date || new Date();
        this._dateCreation = dateCreation || new Date();
        this._typeFacture = facturetype || factureType.VIDE;
        this._client = client || new User();
        this._transporteur = transporteur || new User();
        this._provider=provider|| new User(),
            this._depot = depot || new Depot();
        this._tranche = tranche || new Tranche();
        this._paye= payee || false;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get reference(): string {
        return this._reference;
    }

    set reference(value: string) {
        this._reference = value;
    }


    get lignesFacture(): LigneFacture[] {
        return this._lignesFacture;
    }

    set lignesFacture(value: LigneFacture[]) {
        this._lignesFacture = value;
    }

    get montant(): number {
        return this._montant;
    }

    set montant(value: number) {
        this._montant = value;
    }

    get montantTaxe(): number {
        return this._montantTaxe;
    }

    set montantTaxe(value: number) {
        this._montantTaxe = value;
    }

    get reglement(): number {
        return this._reglement;
    }

    set reglement(value: number) {
        this._reglement = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }


    get dateCreation(): Date {
        return this._dateCreation;
    }

    set dateCreation(value: Date) {
        this._dateCreation = value;
    }

    get typeFacture(): factureType {
        return this._typeFacture;
    }

    set typeFacture(value: factureType) {
        this._typeFacture = value;
    }

    get client(): User {
        return this._client;
    }

    set client(value: User) {
        this._client = value;
    }

    get transporteur(): User {
        return this._transporteur;
    }

    set transporteur(value: User) {
        this._transporteur = value;
    }

    get provider(): User {
        return this._provider;
    }

    set provider(value: User) {
        this._provider = value;
    }

    get depot(): Depot {
        return this._depot;
    }

    set depot(value: Depot) {
        this._depot = value;
    }

    get tranche(): Tranche[] | Tranche {
        return this._tranche;
    }

    set tranche(value: Tranche[] | Tranche) {
        this._tranche = value;
    }


    get paye(): boolean {
        return this._paye;
    }

    set paye(value: boolean) {
        this._paye = value;
    }

    // getTotalFactureUnitaire(): number {
    //     let
    //         total : number = 0 ;
    //     this.ligneFacture.forEach((value :Produit) => {
    //       total+= value.totalUnit() ;
    //     }) ;
    //     return total ;
    // }
    getSommeTranches(): number {
        if (Array.isArray(this._tranche)) {
            // If _tranche is an array, calculate the sum
            return this._tranche.reduce((sum, tranche) => sum + tranche.montantTranche, 0);
        } else if (this._tranche instanceof Tranche) {
            // If _tranche is a single object, return its montant
            return this._tranche.montantTranche;
        } else {
            // If _tranche is neither an array nor an object, return 0
            return 0;
        }
    }
}
