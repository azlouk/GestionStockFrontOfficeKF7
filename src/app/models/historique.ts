import {Produit} from "./produit";

export class Historique {
     id: number;
     prixHistoriqueAchat: number;
     quantiteHistoriqueAchat: number;
     dateMisAjoure: Date;
     produit: Produit;

    constructor(_id: number, _prixHistoriqueAchat: number, _quantiteHistoriqueAchat: number, _dateMisAjoure?: Date,_produit?: Produit) {
        this.id = _id;
        this.prixHistoriqueAchat = _prixHistoriqueAchat;
        this.quantiteHistoriqueAchat = _quantiteHistoriqueAchat;
        this.dateMisAjoure = _dateMisAjoure || new Date();
        this.produit = _produit || new Produit();


    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _prixHistoriqueAchat(): number {
        return this.prixHistoriqueAchat;
    }

    set _prixHistoriqueAchat(value: number) {
        this.prixHistoriqueAchat = value;
    }

    get _quantiteHistoriqueAchat(): number {
        return this.quantiteHistoriqueAchat;
    }

    set _quantiteHistoriqueAchat(value: number) {
        this.quantiteHistoriqueAchat = value;
    }
}