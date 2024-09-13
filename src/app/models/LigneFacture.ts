import {Produit} from "./produit";
import {ServiceService} from "../layout/service/service.service";
import {ServiceComp} from "./ServiceComp";

export class LigneFacture {
     id: number;
     produit: Produit;
     quantite: number;
    montantTotal: number;
    prixAchat: number;
    prixVente: number;
    typeCalcule: string;
     idHistorique:number;

    constructor(_id?: number, _quantite?: number, _montantTotal?: number, _produit?: Produit, _prixAchat?: number, _prixVente?: number, _typeCalcule?: string, _idHistorique?: number) {
        this.id = _id || 0;
        this.produit = _produit || new Produit();
        this.quantite = _quantite || 0;
        this.montantTotal = _montantTotal || 0;
        this.prixAchat = _prixAchat || _produit != undefined ? _produit.prixUnitaire : 0;
        this.prixVente = _prixVente || _produit != undefined ? _produit!.prixUnitaire + _produit.gainUnitaire : 0;
        this.typeCalcule = _typeCalcule || "NoAction";
        this.idHistorique = _idHistorique || 0;


    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _produit(): Produit {
        return this.produit;
    }

    public set _produit(value: Produit) {
        this.produit = value;
    }

    public get _quantite(): number {
        return this.quantite;
    }

    public set _quantite(value: number) {
        this.quantite = value;
    }

    public get _montantTotal(): number {
        return this.montantTotal;
    }

    public set _montantTotal(value: number) {
        this.montantTotal = value;
    }

    public get _prixAchat(): number {
        return this.prixAchat;
    }

    public set _prixAchat(value: number) {
        this.prixAchat = value;
    }

    public get _prixVente(): number {
        return this.prixVente;
    }

    public set _prixVente(value: number) {
        this.prixVente = value;
    }

    public get _typeCalcule(): string {
        return this.typeCalcule;
    }

    public set _typeCalcule(value: string) {
        this.typeCalcule = value;
    }
}