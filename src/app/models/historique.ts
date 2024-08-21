import {Produit} from "./produit";

export class Historique {
     id: number;
     prixHistoriqueAchat: number;
     quantiteHistoriqueAchat: number;
    dateMisAjoure: Date ;


    constructor(_id: number=0, _prixHistoriqueAchat: number=0, _quantiteHistoriqueAchat: number=0, _dateMisAJoure = new Date()) {
        this.id = _id;
        this.prixHistoriqueAchat = _prixHistoriqueAchat;
        this.quantiteHistoriqueAchat = _quantiteHistoriqueAchat;
        this.dateMisAjoure = _dateMisAJoure;




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