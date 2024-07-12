import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Swal from "sweetalert2";
import {ProduitService} from "../../../../layout/service/produit.service";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {NgxBarcode6Module} from "ngx-barcode6";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-generationcode',
    standalone: true,
    imports: [
        InputNumberModule,
        FormsModule,
        ButtonModule,
        NgxBarcode6Module,
        InputTextModule,
        CommonModule
    ],
    templateUrl: './generationcode.component.html',
    styleUrl: './generationcode.component.scss'
})
export class GenerationcodeComponent implements OnInit {
    @Output() DataCodeBarre = new EventEmitter<string>();
    @Input() inputFromParent: string;
    valueCodeBarre: string = '';
    nbcodeBarre: number = 1;
    numbersArray: any;
    Sufix: string = 'ABC';
    constructor(public produitService: ProduitService) {
     }

    ngOnInit() {
        this.numbersArray = Array.from({length: this.nbcodeBarre}, (_, index) => index);

    }

    imprimer(): boolean {
        /* Read more about handling dismissals below */
        const contenuImprimer = document.getElementById('contenuImprimerCodeBarreTEst');


        if (contenuImprimer) {
            // Ouvrez une nouvelle fenêtre avec des dimensions spécifiées
            const fenetreImpression = window.open('', 'PRINT', 'width=1000,height=800');

            if (fenetreImpression) {
                // Ajoutez le contenu à la fenêtre d'impression
                fenetreImpression.document.write(contenuImprimer.innerHTML);

                // Appelez la fonction d'impression
                fenetreImpression.document.close();
                fenetreImpression.print();
                fenetreImpression.close();
            } else {
                // Gestion d'erreur si la fenêtre n'a pas pu être ouverte
                console.error('La fenêtre d\'impression n\'a pas pu être ouverte.');
                return false
            }
        }
        return true;
    }


    async GenationCode() {
        const dattt: string = new Date().getTime() + '';
        this.valueCodeBarre = this.Sufix + '-' + dattt.slice(dattt.length - 7, dattt.length);

        this.numbersArray = await Array.from({length: this.nbcodeBarre}, (_, index) => index);

        this.DataCodeBarre.emit(this.valueCodeBarre)

        let timerInterval: number | undefined;
        Swal.fire({
            title: 'Auto close alert!',
            html: 'I will close in <b></b> milliseconds.',
            timer: this.nbcodeBarre * 20,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading(null)
                const b = Swal.getHtmlContainer().querySelector('b')
                if (b) {
                    // @ts-ignore
                    timerInterval = setInterval(() => {
                        // @ts-ignore
                        b.textContent = Swal.getTimerLeft()
                    }, 100);
                }
            },
            willClose: () => {
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
            }
        }).then((result) => {
            //const ok = this.imprimer();
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer');
            }
        });
    }

}
