import {Produit} from "./produit";
import {ServiceComp} from "./ServiceComp";

export class LigneVente{
      id : number;
      venteQty :number;
      prixVente : number;
      produit : Produit;
      focus : boolean = false;


    constructor(_id?: number, _venteQty?: number, _prixVente?: number, _produit?: Produit, _focus?: boolean) {
        this.id = _id||0;
        this.venteQty = _venteQty||0;
        this.prixVente = _prixVente||0;
        this.produit = _produit|| new Produit();
        this.focus = _focus||false;
    }

    public get _id(): number {
        return this.id;
    }

    public set _id(value: number) {
        this.id = value;
    }

    public get _venteQty(): number {
        return this.venteQty;
    }

    public set _venteQty(value: number) {
        this.venteQty = value;
    }

    public get _prixVente(): number {
        return this.prixVente;
    }

    public set _prixVente(value: number) {
        this.prixVente = value;
    }

    public get _produit(): Produit {
        return this.produit;
    }

    public set _produit(value: Produit) {
        this.produit = value;
    }

    public get _focus(): boolean {
        return this.focus;
    }

    public set _focus(value: boolean) {
        this.focus = value;
    }
}
