export class Historique {
    private id: number;
    private prixHistoriqueAchat: number;
    private quantiteHistoriqueAchat: number;

    constructor(_id: number, _prixHistoriqueAchat: number, _quantiteHistoriqueAchat: number) {
        this.id = _id;
        this.prixHistoriqueAchat = _prixHistoriqueAchat;
        this.quantiteHistoriqueAchat = _quantiteHistoriqueAchat;
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