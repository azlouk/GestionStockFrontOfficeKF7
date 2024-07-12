import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {SafeUrl} from "@angular/platform-browser";
import {ButtonModule} from "primeng/button";

@Component({
    selector: 'app-generationqr',
    standalone: true,
    imports: [
        InputNumberModule,
        FormsModule,
        ButtonModule
    ],
    templateUrl: './generationqr.component.html',
    styleUrl: './generationqr.component.scss'
})
export class GenerationqrComponent implements OnInit {
    valueCodeQR: string = Date.now().toString();
    @ViewChild('printableContent') printableContent!: ElementRef;

    nbcodeQR: number = 1;
    numbersArray: any;
    Sufix: any = 'ABC';

    constructor() {
    }

    ngOnInit() {
        this.numbersArray = Array.from({length: this.nbcodeQR}, (_, index) => index);

    }

    imprimer(): void {

        /* Read more about handling dismissals below */
        alert("print")
        const contenuImprimer = document.getElementById("printableContent");
        const image = document.getElementById("imagecodeQr");
        if (contenuImprimer) {
            // Ouvrez une nouvelle fenêtre avec des dimensions spécifiées
            const fenetreImpression = window.open('', 'PRINT', 'width=600,height=600');

            if (fenetreImpression) {
                // Ajoutez le contenu à la fenêtre d'impression
                fenetreImpression.document.write('<html lang="fr"><head><title>Imprimer</title></head><body>');
                // @ts-ignore
                fenetreImpression.document.write('<img src=' + image.src + '/>');
                fenetreImpression.document.write('</body></html>');

                // Appelez la fonction d'impression
                fenetreImpression.document.close();
                fenetreImpression.print();
                fenetreImpression.close();
            } else {
                // Gestion d'erreur si la fenêtre n'a pas pu être ouverte
                console.error('La fenêtre d\'impression n\'a pas pu être ouverte.');
            }
        }
    }

    public qrCodeDownloadLink: SafeUrl = "";

    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }

    GetGeneratedate() {
        this.valueCodeQR = this.Sufix + '-' + (Date.now()).toString().substring(0, 6);
        //this.imprimer()
    }

    GenationCode() {
        this.GetGeneratedate();
    }
}
