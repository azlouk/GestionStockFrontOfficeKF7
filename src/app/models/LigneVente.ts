import {Produit} from "./produit";

export class LigneVente{
    private _id : number;
    private _venteQty :number;
    private _prixVente : number;
    private _produit : Produit;
    public focus : boolean = false;

    constructor(id?: number, venteQty?: number, prixVente?: number, produit? : Produit ) {
        this._id = id || 0;
        this._venteQty = venteQty || 0;
        this._prixVente = prixVente || 0;
        this._produit = produit || new Produit();
        this.focus=false;
    }



    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get venteQty(): number {
        return this._venteQty;
    }

    set venteQty(value: number) {
        this._venteQty = value;
    }

    get prixVente(): number {
        return this._prixVente;
    }

    set prixVente(value: number) {
        this._prixVente = value;
    }

    get produit(): Produit {
        return this._produit;
    }

    set produit(value: Produit) {
        this._produit = value;
    }
}
