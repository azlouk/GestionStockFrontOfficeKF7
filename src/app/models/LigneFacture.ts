import {Produit} from "./produit";

export class LigneFacture {
    private _id: number;
    private _referance: string;
    private _produit: Produit;
    private _quantite: number;
    private _montantTotal: number;

    constructor(id?: number,  quantite?: number, montantTotal?:number, produit?:Produit) {
        this._id = id || 0;
        //this._referance = referance || '';
         this._produit = produit || new Produit();
        this._quantite = quantite || 0;
        this._montantTotal = montantTotal || 0;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get referance(): string {
        return this._referance;
    }

    set referance(value: string) {
        this._referance = value;
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

// Add getters and setters if needed
}
