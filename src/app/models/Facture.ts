
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

export class Facture {
    id: number
    reference: string
    lignesFacture: LigneFacture []
    montant: number
    montantTaxe : number
    date: Date
    dateCreation: Date
    typeFacture:factureType
    depot: Depot;
    client: User
    transporteur:User
    provider:User
    tranches: Tranche[]
    paye: boolean
    reglement : number;
    restePayer : number

    private IsshowingDiolog:false ;
    constructor(_id?: number, _reference?: string,_depot?:Depot, _lignesFacture?: LigneFacture[], _montant?: number, _montantTaxe?: number, _date?: Date, _dateCreation?: Date, _typeFacture?: factureType, _client?: User, _transporteur?: User, _provider?: User, _tranches?: Tranche[] , _paye?: boolean, _reglement?: number ,_restePayer?:number) {
        this.id = _id || 0  ;
        this.reference = _reference || '';
        this.depot=_depot || new Depot() ;
        this.lignesFacture = _lignesFacture || [];
        this.montant = _montant || 0;
        this.montantTaxe = _montantTaxe || 0;
        this.date = _date || new Date;
        this.dateCreation = _dateCreation || new Date();
        this.typeFacture = _typeFacture || factureType.ENTREE;
        this.client = _client || new User();
        this.transporteur = _transporteur || new User();
        this.provider = _provider || new User();
        this.tranches = _tranches || [];
        this.paye = _paye || false;
        this.reglement = _reglement || 0;
        this.restePayer = _restePayer || 0;
        this.IsshowingDiolog=false ;
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

    get _lignesFacture(): LigneFacture[] {
        return this.lignesFacture;
    }

    set _lignesFacture(value: LigneFacture[]) {
        this.lignesFacture = value;
    }

    get _montant(): number {
        return this.montant;
    }

    set _montant(value: number) {
        this.montant = value;
    }

    get _montantTaxe(): number {
        return this.montantTaxe;
    }

    set _montantTaxe(value: number) {
        this.montantTaxe = value;
    }

    get _date(): Date {
        return this.date;
    }

    set _date(value: Date) {
        this.date = value;
    }

    get _dateCreation(): Date {
        return this.dateCreation;
    }

    set _dateCreation(value: Date) {
        this.dateCreation = value;
    }

    get _typeFacture(): factureType {
        return this.typeFacture;
    }

    set _typeFacture(value: factureType) {
        this.typeFacture = value;
    }

    get _client(): User {
        return this.client;
    }

    set _client(value: User) {
        this.client = value;
    }

    get _transporteur(): User {
        return this.transporteur;
    }

    set _transporteur(value: User) {
        this.transporteur = value;
    }

    get _provider(): User {
        return this.provider;
    }

    set _provider(value: User) {
        this.provider = value;
    }



    get _tranches(): Tranche[] {
        return this.tranches;
    }

    set _tranches(value: Tranche[] ) {
        this.tranches = value;
    }

    get _paye(): boolean {
        return this.paye;
    }

    set _paye(value: boolean) {
        this.paye = value;
    }

    get _reglement(): number {
        return this.reglement;
    }

    set _reglement(value: number) {
        this.reglement = value;
    }

    get _restePayer(): number {
        return this.restePayer;
    }

    set _restePayer(value: number) {
        this.restePayer = value;
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
        if (Array.isArray(this.tranches)) {
            // If _tranche is an array, calculate the sum
            return this.tranches.reduce((sum, tranche) => sum + tranche._montantTranche, 0);
        } else {
            // If _tranche is neither an array nor an object, return 0
            return 0;
        }
    }
    updateRestePayer(): void {
        this.restePayer = this.montant - this.getSommeTranches();
    }


}
