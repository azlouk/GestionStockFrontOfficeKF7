import {Produit} from "./produit";
import {ServiceService} from "../layout/service/service.service";
import {ServiceComp} from "./ServiceComp";

export class LigneFacture {
    private _id: number;
    private _produit: Produit;
    private _quantite: number;
    private _montantTotal: number;
    private _prixAchat : number;
    private _prixVente : number;
    private _typeCalcule: string;

    constructor(id?: number,  quantite?: number, montantTotal?:number, produit?:Produit,prixAchat?:number, prixVente?: number, typeCalcule?: string) {
        this._id = id || 0;
         this._produit = produit || new Produit();
        this._quantite = quantite || 0;
        this._montantTotal = montantTotal || 0;
        this._prixAchat = prixAchat || produit!=undefined?produit.prixUnitaire:0;
        this._prixVente = prixVente || produit!=undefined ? produit!.prixUnitaire+produit.gainUnitaire:0;
        this._typeCalcule=typeCalcule || "NoAction" ;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get typeCalcule(): string {
        return this._typeCalcule;
    }

    set typeCalcule(value: string) {
        this._typeCalcule = value;
    }

    get produit(): Produit {
        return this._produit;
    }

    set produit(value: Produit) {
        this._produit = value;
    }

    get quantite(): number {
        return this._quantite;
    }

    set quantite(value: number) {
        this._quantite = value;
    }

    get montantTotal(): number {
        return this._montantTotal;
    }

    set montantTotal(value: number) {
        this._montantTotal = value;
    }

    get prixAchat(): number {
        return this._prixAchat;
    }

    set prixAchat(value: number) {
        this._prixAchat = value;
    }


    public get prixVente(): number {
        return this._prixVente;
    }

    public set prixVente(value: number) {
        this._prixVente = value;
    }
}
