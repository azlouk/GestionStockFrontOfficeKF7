import {Produit} from "./produit";

export class LigneCommande {
    id: number | null;
    qtyV: number;
    prixVente: number;
    produit: Produit;

    constructor(_id?: number , _qtyV?: number, _prixVente?: number, _produit?: Produit) {
        this.id = _id || 0;
        this.qtyV = _qtyV || 0;
        this.prixVente = _prixVente || 0;
        this.produit = _produit ||new Produit();
    }

    get _id(): number | null {
        return this.id;
    }

    set _id(value: number | null) {
        this.id = value;
    }

    get _qtyV(): number {
        return this.qtyV;
    }

    set _qtyV(value: number) {
        this.qtyV = value;
    }

    get _prixVente(): number {
        return this.prixVente;
    }

    set _prixVente(value: number) {
        this.prixVente = value;
    }

    get _produit(): Produit {
        return this.produit;
    }

    set _produit(value: Produit) {
        this.produit = value;
    }
}