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




    async GenationCode() {
        const dattt: string = new Date().getTime() + '';
        this.valueCodeBarre =  dattt.slice(dattt.length - 8, dattt.length);

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
