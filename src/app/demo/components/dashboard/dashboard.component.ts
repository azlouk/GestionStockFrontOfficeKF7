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
import {an} from "@fullcalendar/core/internal-common";
import {ChartData, ChartOptions, ChartType} from "chart.js";

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];



    subscription!: Subscription;

    produits: Produit[] = [];
    ventes: Vente[] = []
    data: any;
    options: any;

    chartDataVentes: any;
    chartDataFactures:any;
    chartOptions: any;
    chartDataFacturesMois: any;
    chartOptionsFactMois:any;
    public chartDataVentesMois: any;
    public chartOptionsMois: any;
    public chartType: ChartType = 'bar'; // Type de graphique


    chartDataCommande: any;
    chartDataCommandeMois: any;
    chartOptionsComd:any;
    constructor(private productService: ProductService, public layoutService: LayoutService,
                private route: Router, public servicestatistic: StatistiquesService, private venteservice: VenteService) {

    }

    ngOnInit() {
        this.getFacturesEtGainsParMois();
        this.getVenteDay();
        this.getfactureByDay();
        this.getVentesEtGainsParMois();
        this.getCommandesEtGainsParMois();
        this.getCommandesEtGainsParJours();

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
        }

    }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


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
        try {
            const value = await this.servicestatistic.getStatistic().toPromise();
            console.log(value);
            this.servicestatistic.statistic = value;
            // this.chartProduitsParUnite();
        } catch (error) {
            console.error('Error loading data', error);
        }
    }

    private sortDataByDate(data: any): any[] {
        return Object.keys(data).sort().map(date => ({
            date,
            value: data[date]
        }));
    }

//get ventes et gains par jour!
    getVenteDay() {
        this.servicestatistic.getVentesGainParJour().subscribe(data => {
            console.log('Données de ventes et gains par jour reçues :', data);

            if (data) {
                const sortedVentesData = this.sortDataByDate(data['ventes']);
                const sortedGainsData = this.sortDataByDate(data['gains']);

                this.chartDataVentes = {
                    labels: sortedVentesData.map(d => d.date),
                    datasets: [
                        {
                            label: 'Ventes par Jour',
                            data: sortedVentesData.map(d => d.value),
                            fill: false,
                            borderColor: '#0523cc'
                        },
                        {
                            label: 'Gains par Jour',
                            data: sortedGainsData.map(d => d.value),
                            fill: false,
                            borderColor: '#08c408'
                        }
                    ]
                };

                this.chartOptions = {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Montant'
                            }
                        }
                    }
                };
            }
        }, error => {
            console.error('Erreur lors de la récupération des ventes et gains par jour :', error);
        });
    }

//get factures et gains par jour!
    getfactureByDay(): void {
        this.servicestatistic.getFacturesGainParJour().subscribe(data => {
            console.log('Données des factures et gains reçues :', data);

            if (data) {
                const sortedVentesData = this.sortDataByDate(data.ventes);
                const sortedGainsData = this.sortDataByDate(data.gains);

                this.chartDataFactures = {
                    labels: sortedVentesData.map(d => d.date),
                    datasets: [
                        {
                            label: 'Ventes par Jour',
                            data: sortedVentesData.map(d => d.value),
                            fill: false,
                            borderColor: '#0523cc'
                        },
                        {
                            label: 'Gains par Jour',
                            data: sortedGainsData.map(d => d.value),
                            fill: false,
                            borderColor: '#66BB6A'
                        }
                    ]
                };

                this.chartOptions = {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Montant'
                            },
                            ticks: {
                                min: 0,
                                stepSize: 100
                            }
                        }
                    }
                };
            }
        }, error => {
            console.error('Erreur lors de la récupération des factures et gains :', error);
        });
    }

    //get ventes par mois!

    getVentesEtGainsParMois(): void {
        this.servicestatistic.getVentesEtGainsParMois().subscribe(data => {
            console.log('Données des ventes et gains reçues :', data);

            if (data) {
                const sortedVentesData = this.sortDataByDate(data['ventes']);
                const sortedGainsData = this.sortDataByDate(data['gains']);

                this.chartDataVentesMois = {
                    labels: sortedVentesData.map(d => d.date),
                    datasets: [
                        {
                            label: 'Ventes par Mois',
                            data: sortedVentesData.map(d => d.value),
                            backgroundColor: '#FFA726',
                            stack: 'Stack 0'
                        },
                        {
                            label: 'Gains par Mois',
                            data: sortedGainsData.map(d => d.value),
                            backgroundColor: '#66BB6A',
                            stack: 'Stack 1'
                        }
                    ]
                };

                this.chartOptionsMois = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y.toFixed(2);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mois'
                            },
                            stacked: true
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Montant'
                            },
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                stepSize: 100
                            }
                        }
                    }
                };
            }
        }, error => {
            console.error('Erreur lors de la récupération des ventes et gains par mois :', error);
        });
    }

    getFacturesEtGainsParMois(): void {
        this.servicestatistic.getFacturesEtGainsParMois().subscribe(data => {
            console.log('Données des factures et gains par mois reçues :', data);

            if (data) {
                const sortedVentesData = this.sortDataByDate(data['ventes']);
                const sortedGainsData = this.sortDataByDate(data['gains']);

                this.chartDataFacturesMois = {
                    labels: sortedVentesData.map(d => d.date),
                    datasets: [
                        {
                            label: 'Factures par Mois',
                            data: sortedVentesData.map(d => d.value),
                            backgroundColor: '#FFA726',
                            stack: 'stack0'
                        },
                        {
                            label: 'Gains par Mois',
                            data: sortedGainsData.map(d => d.value),
                            backgroundColor: '#66BB6A',
                            stack: 'stack1'
                        }
                    ]
                };

                this.chartOptionsFactMois = {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mois'
                            },
                            stacked: false,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Montant'
                            },
                            stacked: false,
                            ticks: {
                                beginAtZero: true,
                                stepSize: 100
                            }
                        }
                    }
                };
            }
        }, error => {
            console.error('Erreur lors de la récupération des factures et gains par mois :', error);
        });
    }
    getCommandesEtGainsParMois(): void {
        this.servicestatistic.getCommandesEtGainsParMois().subscribe(data => {
            console.log('Données des commandes et gains par mois reçues :', data);

            if (data) {
                const sortedVentesData = this.sortDataByDate(data['ventes']);
                const sortedGainsData = this.sortDataByDate(data['gains']);

                this.chartDataCommandeMois = {
                    labels: sortedVentesData.map(d => d.date),
                    datasets: [
                        {
                            label: 'Factures par Mois',
                            data: sortedVentesData.map(d => d.value),
                            backgroundColor: '#FFA726',
                            stack: 'stack0'
                        },
                        {
                            label: 'Gains par Mois',
                            data: sortedGainsData.map(d => d.value),
                            backgroundColor: '#66BB6A',
                            stack: 'stack1'
                        }
                    ]
                };

                this.chartOptionsComd = {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mois'
                            },
                            stacked: false,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Montant'
                            },
                            stacked: false,
                            ticks: {
                                beginAtZero: true,
                                stepSize: 100
                            }
                        }
                    }
                };
            }
        }, error => {
            console.error('Erreur lors de la récupération des factures et gains par mois :', error);
        });
    }
    getCommandesEtGainsParJours(): void {
        this.servicestatistic.getCommandesEtGainsParJour().subscribe(data => {
            console.log('Données des factures et gains par mois reçues :', data);

            if (data) {
                const sortedVentesData = this.sortDataByDate(data['ventes']);
                const sortedGainsData = this.sortDataByDate(data['gains']);

                this.chartDataCommande = {
                    labels: sortedVentesData.map(d => d.date),
                    datasets: [
                        {
                            label: 'Factures par Mois',
                            data: sortedVentesData.map(d => d.value),
                            backgroundColor: '#FFA726',
                            stack: 'stack0'
                        },
                        {
                            label: 'Gains par Mois',
                            data: sortedGainsData.map(d => d.value),
                            backgroundColor: '#66BB6A',
                            stack: 'stack1'
                        }
                    ]
                };

                this.chartOptionsComd = {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mois'
                            },
                            stacked: false,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Montant'
                            },
                            stacked: false,
                            ticks: {
                                beginAtZero: true,
                                stepSize: 100
                            }
                        }
                    }
                };
            }
        }, error => {
            console.error('Erreur lors de la récupération des factures et gains par mois :', error);
        });
    }



}

