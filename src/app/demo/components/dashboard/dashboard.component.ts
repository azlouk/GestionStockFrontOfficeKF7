import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {StatistiquesService} from "../../../layout/service/statistiques.service";
import {VenteService} from "../../../layout/service/vente.service";
import {Router} from "@angular/router";
import {getToken} from "../../../../main";
import {JsonPipe} from "@angular/common";
import {Produit} from "../../../models/produit";
import {Vente} from "../../../models/Vente";

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    produits: Produit[] = [];
    ventes: Vente[] = []
    data: any;
    data2: any;
    options: any;
    options2: any;
    constructor(private productService: ProductService, public layoutService: LayoutService,
                private route: Router, public servicestatistic: StatistiquesService, private venteservice: VenteService) {

    }

    ngOnInit() {
        this.venteservice.getVentes().subscribe(value => {
            this.ventes = value;
        })
        // console.log(getUserDecodeID().id);
        const token = getToken();
        //alert(token)
        if (token == null || token === '404') {
            this.route.navigate(['/auth/login'])
        } else {
            this.loadData();
            this.loadData2();
        }
        this.initChart();
        // this.productService.getProductsSmall().then(data => this.products = data);

        /* this.items = [
             { label: 'Add New', icon: 'pi pi-fw pi-plus' },
             { label: 'Remove', icon: 'pi pi-fw pi-minus' }
         ];*/
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        /* this.chartData = {
             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
             datasets: [
                 {
                     label: 'First Dataset',
                     data: [65, 59, 80, 81, 56, 55, 40],
                     fill: false,
                     backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                     borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                     tension: .4
                 },
                 {
                     label: 'Second Dataset',
                     data: [28, 48, 40, 19, 86, 27, 90],
                     fill: false,
                     backgroundColor: documentStyle.getPropertyValue('--green-600'),
                     borderColor: documentStyle.getPropertyValue('--green-600'),
                     tension: .4
                 }
             ]
         };
 */
        /* this.chartOptions = {
             plugins: {
                 legend: {
                     labels: {
                         color: textColor
                     }
                 }
             },
             scales: {
                 x: {
                     ticks: {
                         color: textColorSecondary
                     },
                     grid: {
                         color: surfaceBorder,
                         drawBorder: false
                     }
                 },
                 y: {
                     ticks: {
                         color: textColorSecondary
                     },
                     grid: {
                         color: surfaceBorder,
                         drawBorder: false
                     }
                 }
             }
         };*/
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }



    // @ts-ignore
    getServiceStatisticTotalQuantityFormatted(): string {
        const totalQuantiteProduitParUnite = this.servicestatistic.statistic.totalQuantiteProduitParUnite;
        // console.log('Données brutes :', totalQuantiteProduitParUnite);

        let formattedResult = '';

        for (let i = 0; i < totalQuantiteProduitParUnite.length; i++) {
            const unite = totalQuantiteProduitParUnite[i][0]; // Récupérer l'unité à partir du tableau imbriqué
            const total = totalQuantiteProduitParUnite[i][1]; // Récupérer le total à partir du tableau imbriqué
            formattedResult += `Unité: ${unite} \n Total: ${total}\n`;
        }


        return formattedResult.trim(); // Supprimer les espaces blancs supplémentaires à la fin
    }


    async loadData(): Promise<void> {
        await this.servicestatistic.getStatistic().subscribe(value => {
            console.log(value)
            this.servicestatistic.statistic = value
            this.chartVentes();

            //this.chartProduitsParUnite();

        }); // Using await with getStatistic method
    }

    async loadData2(): Promise<void> {
        await this.servicestatistic.getStatistic().subscribe(value => {
            console.log(value)
            this.servicestatistic.statistic = value
            this.chartProduitsParUnite();

            //this.chartProduitsParUnite();

        }); // Using await with getStatistic method
    }

    getdataNumbres(): number[] {
        let tab: number[] = [];
        this.servicestatistic.statistic.chartUnitaireGain.forEach((v: any) => {
            tab.push(parseInt(v.value))


        })
        // console.log(tab)
        return tab;
    }

    getdata(): number[] {
        let tab: number[] = [];
        this.servicestatistic.statistic.charteUnitairePrix.forEach((v: any) => {
            console.log("valeur;" + v)
            tab.push(parseInt(v))
        })
        console.log("tab :" + tab)
        return tab;
    }


    chartVentes() {
        console.log('Charte Unitaire Prix: ' + new JsonPipe().transform(this.servicestatistic.statistic.charteUnitairePrix));
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');



        this.data = {
            labels: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            datasets: [
                {
                    label: 'total sans réglement ',
                    backgroundColor: documentStyle.getPropertyValue('--primary-300'),
                    borderColor: documentStyle.getPropertyValue('--primary-300'),
                    data: this.getdataNumbres()

                },
                {
                    label: 'Total avec réglement',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-200'),
                    borderColor: documentStyle.getPropertyValue('--yellow-200'),
                    data: this.getdata()
                }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }

            }
        };
    }

    chartProduitsParUnite() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const labels = [];
        const data2 = [];

        // Utilisez les libellés des unités stockés dans la base de données comme labels
        for (const key in this.servicestatistic.statistic.totalQuantiteProduitParUnite) {
            if (Object.prototype.hasOwnProperty.call(this.servicestatistic.statistic.totalQuantiteProduitParUnite, key)) {
                const label = this.servicestatistic.statistic.totalQuantiteProduitParUnite[key][0]; // Utilisez le libellé de l'unité
                const value = this.servicestatistic.statistic.totalQuantiteProduitParUnite[key][1]; // Récupérer la valeur (le deuxième élément du tableau)
                labels.push(label);
                data2.push(value);
            }
        }
        const backgroundColors = [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500')
            // Ajoutez d'autres couleurs si nécessaire
        ];
        const hoverBackgroundColors = [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400')
            // Ajoutez d'autres couleurs si nécessaire
        ];

        this.data2 = {
            labels: labels,
            datasets: [
                {
                    data: data2,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: hoverBackgroundColors
                }
            ]
        };

        this.options2 = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
    }


    actualiser(): void {
        // Appel de la méthode loadData() pour actualiser les données
        this.ngOnInit();
        this.getServiceStatisticTotalQuantityFormatted();
        this.servicestatistic.statistic.nbproduit;
        this.servicestatistic.statistic.totalgainunitaire;

        this.servicestatistic.statistic.totalprixunitaire;
        this.servicestatistic.statistic.totalgaingros;
        this.servicestatistic.statistic.totalprixunitaire;


        /*this.getServiceStatisticTotalQuantityFormatted();
        this.ngOnInit();*/
    }


}


