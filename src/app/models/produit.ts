import {Article} from "./Article";
import {File} from "./File";
import {Historique} from "./historique";
import Swal from "sweetalert2";


export interface CodeModel {
    id?: string;
    code?: string;
}

export class Produit {
    id: number;
    nom: string;
    prixUnitaire: number;

    prixGros: number;
    description: string;
    qantite: number;
    image: Blob;
    gainUnitaire: number;
    gainGros: number;
    files: File[];
    dateExpiration: Date;
    dateFabrication: Date;
    minQuantiteGros: number;
    taxe: number;
     remise: number;

    enable: boolean;
    dataqr: string;
    qantiteFacture: number;
    article: Article;
    levelstock: number;
    showDetails: boolean;
    checkedService: boolean;
    subdataqr: string[];
    historiques: Historique [];
    ugs:string;

    constructor(_id: number=0, _nom: string="", _prixUnitaire: number=0, _prixGros: number=0, _description: string="", _qantite: number=0, _image: Blob=new Blob(), _gainUnitaire: number=0, _gainGros: number=0, _files: File[]=[], _dateExpiration: Date=new Date(), _dateFabrication: Date=new Date(), _minQuantiteGros: number=0, _taxe: number=0, _enable: boolean=false, _dataqr: string="", _qantiteFacture: number=0, _article: Article=new Article(), _levelstock: number=0, _showDetails: boolean=false, _checkedService: boolean=false, _subdataqr: string[]=[], _historiques: Historique[]=[], _ugs: string="",_remise:number=0) {
        this.id = _id;
        this.nom = _nom;
        this.prixUnitaire = _prixUnitaire;
        this.prixGros = _prixGros;
        this.description = _description;
        this.qantite = _qantite;
        this.image = _image;
        this.gainUnitaire = _gainUnitaire;
        this.gainGros = _gainGros;
        this.files = _files;
        this.dateExpiration = _dateExpiration;
        this.dateFabrication = _dateFabrication;

        this.minQuantiteGros = _minQuantiteGros;
        this.taxe = _taxe;
        this.remise = _remise;
        this.enable = _enable;
        this.dataqr = _dataqr;
        this.qantiteFacture = _qantiteFacture;
        this.article = _article;
        this.levelstock = _levelstock;
        this.showDetails = _showDetails;
        this.checkedService = _checkedService;
        this.subdataqr = _subdataqr;
        this.historiques = _historiques;
        this.ugs = _ugs;
    }

    generateUGS(): string {
        if(this.article && this.dataqr){


            const firstNumber = this.dataqr.substring(0,2) ;
            const lastNumber = this.dataqr.substring(this.dataqr.length-2,this.dataqr.length);
            const firstTwoLetters = this.article.nom.substring(0, 2).toUpperCase();
            const ugs = `PR-${firstNumber}-${lastNumber}-${firstTwoLetters}`;
            this.ugs = ugs;
            return ugs;
        }else return "";
    }


     get _remise(): number {
        return this.remise;
    }

     set _remise(value: number) {
        this.remise = value;
    }
    public get _ugs(): string {
        return this.ugs;
    }

    public set _ugs(value: string) {
        this.ugs = value;
    }
    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _nom(): string {
        return this.nom;
    }

    set _nom(value: string) {
        this.nom = value;
    }

    get _prixUnitaire(): number {
        return this.prixUnitaire;
    }

    set _prixUnitaire(value: number) {
        this.prixUnitaire = value;
    }

    get _prixGros(): number {
        return this.prixGros;
    }

    set _prixGros(value: number) {
        this.prixGros = value;
    }

    get _description(): string {
        return this.description;
    }

    set _description(value: string) {
        this.description = value;
    }

    get _qantite(): number {
        return this.qantite;
    }

    set _qantite(value: number) {
        this.qantite = value;
    }

    get _image(): Blob {
        return this.image;
    }

    set _image(value: Blob) {
        this.image = value;
    }

    get _gainUnitaire(): number {
        return this.gainUnitaire;
    }

    set _gainUnitaire(value: number) {
        this.gainUnitaire = value;
    }

    get _gainGros(): number {
        return this.gainGros;
    }

    set _gainGros(value: number) {
        this.gainGros = value;
    }

    get _filesList(): File[] | [] {
        return this.files;
    }

    set _filesList(value: File[] | []) {
        this.files = value;
    }

    get _dateExpiration(): Date {
        return this.dateExpiration;
    }

    set _dateExpiration(value: Date) {
        this.dateExpiration = value;
    }

    get _dateFabrication(): Date {
        return this.dateFabrication;
    }

    set _dateFabrication(value: Date) {
        this.dateFabrication = value;
    }

    get _minQuantiteGros(): number {
        return this.minQuantiteGros;
    }

    set _minQuantiteGros(value: number) {
        this.minQuantiteGros = value;
    }

    get _taxe(): number {
        return this.taxe;
    }

    set _taxe(value: number) {
        this.taxe = value;
    }

    get _enable(): boolean {
        return this.enable;
    }

    set _enable(value: boolean) {
        this.enable = value;
    }

    get _dataqr(): string {
        return this.dataqr;
    }

    set _dataqr(value: string) {
        this.dataqr = value;
    }

    get _qantiteFacture(): number {
        return this.qantiteFacture;
    }

    set _qantiteFacture(value: number) {
        this.qantiteFacture = value;
    }

    get _article(): Article {
        return this.article;
    }

    set _article(value: Article) {
        this.article = value;
    }

    get _levelstock(): number {
        return this.levelstock;
    }

    set _levelstock(value: number) {
        this.levelstock = value;
    }

    get _showDetails(): boolean {
        return this.showDetails;
    }

    set _showDetails(value: boolean) {
        this.showDetails = value;
    }

    get _checkedService(): boolean {
        return this.checkedService;
    }

    set _checkedService(value: boolean) {
        this.checkedService = value;
    }

    get _subdataqr(): string[] {
        return this.subdataqr;
    }

    set _subdataqr(value: string[]) {
        this.subdataqr = value;
    }

    get _files(): File[] {
        return this.files;
    }

    set _files(value: File[]) {
        this.files = value;
    }

    get _historiques(): Historique[] {
        return this.historiques;
    }

    set _historiques(value: Historique[]) {
        this.historiques = value;
    }

    // toJSON() {
    //     return {
    //         ...this,
    //         dateExpiration: this.dateExpiration ? this.dateExpiration.toISOString().split('T')[0] : null,
    //         dateFabrication: this.dateFabrication ? this.dateFabrication.toISOString().split('T')[0] : null
    //     };
    // }

    static copy(produit: Produit): Produit {
        const newProduit = new Produit();

        newProduit.id = produit.id;
        newProduit.nom = produit.nom;
        newProduit.prixUnitaire = produit.prixUnitaire;
        newProduit.prixGros = produit.prixGros;
        newProduit.description = produit.description;
        newProduit.qantite = produit.qantite;
        newProduit.image = produit.image;
        newProduit.gainUnitaire = produit.gainUnitaire;
        newProduit.gainGros = produit.gainGros;
        newProduit.files = produit.files ? [...produit.files] : [];
        newProduit.dateExpiration = produit.dateExpiration;
        newProduit.dateFabrication = produit.dateFabrication;
        newProduit.minQuantiteGros = produit.minQuantiteGros;
        newProduit.taxe = produit.taxe;
        newProduit.enable = produit.enable;
        newProduit.dataqr = produit.dataqr;
        newProduit.qantiteFacture = produit.qantiteFacture;
        newProduit.article = produit.article;
        newProduit.levelstock = produit.levelstock;
        newProduit.showDetails = produit.showDetails;
        newProduit.checkedService = produit.checkedService;
        newProduit.subdataqr = produit.subdataqr ? [...produit.subdataqr] : [];
        newProduit.historiques = produit.historiques ? [...produit.historiques] : [];

        return newProduit;
    }

    toJSON() {
        return {
            id: this.id,
            nom: this.nom,
            prixUnitaire: this.prixUnitaire,
            prixGros: this.prixGros,
            description: this.description,
            qantite: this.qantite,
            gainUnitaire: this.gainUnitaire,
            gainGros: this.gainGros,
            dateExpiration: this.formatDate(this.dateExpiration), // Format as needed
            dateFabrication: this.formatDate(this.dateFabrication), // Format as needed
            minQuantiteGros: this.minQuantiteGros,
            taxe: this.taxe,
            enable: this.enable,
            dataqr: this.dataqr,
            qantiteFacture: this.qantiteFacture,
            article: this.article,
            levelstock: this.levelstock,
            showDetails: this.showDetails,
            checkedService: this.checkedService,
            subdataqr: this.subdataqr,
            historiques: this.historiques,
            files: this.files, // If needed, you might want to convert these to a format suitable for sending
            ugs:this.ugs,
            remise:this.remise
        };
    }

    private formatDate(date: Date): string {
        if (!(date instanceof Date)) {
            date = new Date(date); // Convert it to a Date object if it's not already
        }

        // Ensure it's a valid date
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0]; // e.g., "2024-10-06"
        } else {
            throw new Error('Invalid date');

        }
    }

}
