import {Produit} from "./produit";

export class LigneFacture {
    private _id: number;
    private _produit: Produit;
    private _quantite: number;
    private _montantTotal: number;
    private _prixAchat : number;
    private _prixVente : number;

    constructor(id?: number,  quantite?: number, montantTotal?:number, produit?:Produit,prixAchat?:number, prixVente?: number ) {
        this._id = id || 0;
         this._produit = produit || new Produit();
        this._quantite = quantite || 0;
        this._montantTotal = montantTotal || 0;
        this._prixAchat = prixAchat || 0;
        this._prixVente = prixVente || 0;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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
}
