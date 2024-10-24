import {Produit} from "./produit";

export class Statistic {

    private _nbproduit: number;
    private _totalprixunitaire: number;
    private _totalgainunitaire: number;
    private _totalgaingros: number;
    private _nbproduitexp: number;
    private _listproduitexp: Produit[] = [];
    private _allmodelCodeList: any;
    private _nbqtyproduit: number;
    private _sizeallimage: number;
    private _chartUnitaireGain: any;
    private _charteUnitairePrix: any;
    private _totalQuantiteProduitParUnite: any;
    private _nbArticle: number;
    private _nbVentes: number;
    private _nbFactures: number;
    private _nbService: number;
    private _nbCommande: number;
    private _totalFactures: number;
    private _totalGainFactures: number;
    private _totalVentes: number;
    private _totalGainVentes: number;


    constructor(nbproduit?: number,
                totalprixunitaire?: number,
                totalgainunitaire?: number,
                totalgaingros?: number,
                nbproduitexp?: number,
                listproduitexp?: Produit[],
                allmodelCodeList?: any,
                nbqtyproduit?: number,
                sizeallimage?: number,
                nbArticle?: number,
                nbVentes?: number,
                nbFactures?: number,
                nbService?: number,
                nbCommande?: number,
                totalFactures?: number,
                totalGainFactures?: number,
                totalVentes?: number,
                totalGainVentes?: number) {
        this._nbproduit = nbproduit || 0;
        this._totalprixunitaire = totalprixunitaire || 0;
        this._totalgainunitaire = totalgainunitaire || 0;
        this._totalgaingros = totalgaingros || 0;
        this._nbproduitexp = nbproduitexp || 0;
        this._listproduitexp = listproduitexp || [];
        this._allmodelCodeList = allmodelCodeList || [];
        this._nbqtyproduit = nbqtyproduit || 0;
        this._sizeallimage = sizeallimage || 0;
        this._chartUnitaireGain = {}
        this._charteUnitairePrix = {}
        this._totalQuantiteProduitParUnite = {}
        this._nbArticle = this.nbArticle || 0;
        this._nbVentes = this.nbVentes || 0;
        this._nbFactures = this.nbFactures || 0;
        this._nbService = this.nbService || 0;
        this._nbCommande = this.nbCommande || 0;
        this._totalFactures = totalFactures || 0;
        this._totalGainFactures = totalGainFactures || 0;
        this._totalVentes = totalVentes || 0;
        this._totalGainVentes = totalGainVentes || 0;
    }


    get totalQuantiteProduitParUnite(): any {
        return this._totalQuantiteProduitParUnite;
    }

    set totalQuantiteProduitParUnite(value: any) {
        this._totalQuantiteProduitParUnite = value;
    }

    get charteUnitairePrix(): any {
        return this._charteUnitairePrix;
    }

    set charteUnitairePrix(value: any) {
        this._charteUnitairePrix = value;
    }

    get chartUnitaireGain(): any {
        return this._chartUnitaireGain;
    }


    set chartUnitaireGain(value: any) {
        this._chartUnitaireGain = value;
    }

    get nbproduit(): number {
        return this._nbproduit;
    }

    set nbproduit(value: number) {
        this._nbproduit = value;
    }

    get totalprixunitaire(): number {
        return this._totalprixunitaire;
    }

    set totalprixunitaire(value: number) {
        this._totalprixunitaire = value;
    }

    get totalgainunitaire(): number {
        return this._totalgainunitaire;
    }

    set totalgainunitaire(value: number) {
        this._totalgainunitaire = value;
    }

    get totalgaingros(): number {
        return this._totalgaingros;
    }

    set totalgaingros(value: number) {
        this._totalgaingros = value;
    }

    get nbproduitexp(): number {
        return this._nbproduitexp;
    }

    set nbproduitexp(value: number) {
        this._nbproduitexp = value;
    }

    get listproduitexp(): Produit[] {
        return this._listproduitexp;
    }

    set listproduitexp(value: Produit[]) {
        this._listproduitexp = value;
    }

    get allmodelCodeList(): any {
        return this._allmodelCodeList;
    }

    set allmodelCodeList(value: any) {
        this._allmodelCodeList = value;
    }

    get nbqtyproduit(): number {
        return this._nbqtyproduit;
    }

    set nbqtyproduit(value: number) {
        this._nbqtyproduit = value;
    }

    get sizeallimage(): number {
        return this._sizeallimage;
    }

    set sizeallimage(value: number) {
        this._sizeallimage = value;
    }


    get nbArticle(): number {
        return this._nbArticle;
    }

    set nbArticle(value: number) {
        this._nbArticle = value;
    }

    get nbVentes(): number {
        return this._nbVentes;
    }

    set nbVentes(value: number) {
        this._nbVentes = value;
    }

    get nbFactures(): number {
        return this._nbFactures;
    }

    set nbFactures(value: number) {
        this._nbFactures = value;
    }

    get nbService(): number {
        return this._nbService;
    }

    set nbService(value: number) {
        this._nbService = value;
    }

    get nbCommande(): number {
        return this._nbCommande;
    }

    set nbCommande(value: number) {
        this._nbCommande = value;
    }

    get totalFactures
    (): number {
        return this._totalFactures
            ;
    }

    set totalFactures(value: number) {
        this._totalFactures = value;
    }

    get totalGainFactures(): number {
        return this._totalGainFactures;
    }
    set totalGainFactures(value: number) {
        this._totalGainFactures = value;
    }
    get totalVentes(): number {
        return this._totalVentes;
    }
    set totalVentes(value: number) {
        this._totalVentes = value;
    }
    get totalGainVentes(): number {
        return this._totalGainVentes;
    }
    set totalGainVentes(value: number) {
        this._totalGainVentes = value;
    }

}
