import {Produit} from "./produit";
import {ServiceComp} from "./ServiceComp";

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

    // Getter et Setter pour _id
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    // Getter et Setter pour _venteQty
    public get venteQty(): number {
        return this._venteQty;
    }
    public set venteQty(value: number) {
        this._venteQty = value;
    }

    // Getter et Setter pour _prixVente
    public get prixVente(): number {
        return this._prixVente;
    }
    public set prixVente(value: number) {
        this._prixVente = value;
    }

    // Getter et Setter pour _produit
    public get produit(): Produit {
        return this._produit;
    }
    public set produit(value: Produit) {
        this._produit = value;
    }
}
