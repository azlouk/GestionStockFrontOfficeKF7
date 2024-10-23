import {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {LayoutService} from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) {
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [
                    {label: 'Statistiques', icon: 'pi pi-fw pi-home', routerLink: ['/']},
                    {label: 'Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/uikit/Users']},
                ]
            },
            {
                label: 'Gestion de Stocks',
                items: [
                    {label: 'Prouits', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/produits']},
                    {label: 'Articles', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/article']},
                    {label: 'Depôts', icon: 'pi pi-fw pi-database', routerLink: ['/uikit/depots']},

                ]
            },
            {
                label: 'Gestion de Ventes',
                items: [
                    {label: 'Services', icon: 'pi pi-fw pi-wrench', routerLink: ['/uikit/services']},
                    {label: 'POS', icon: 'pi pi-fw pi-calculator', routerLink: ['/uikit/POS']},
                    {label: 'Caisse', icon: 'pi pi-fw pi-wallet', routerLink: ['/uikit/caisse']},
                    {label: 'Cloture', icon: 'pi pi-fw pi-key', routerLink: ['/uikit/cloture']},
                    {label: 'Ventes', icon: 'pi pi-fw pi-cart-plus', routerLink: ['/uikit/Ventes']},
                ]
            },
            {
                label: 'System de Facturation',
                items: [
                    {label: 'Factures Ventes', icon: 'pi pi-fw pi-file-o', routerLink: ['/uikit/factureVente']},
                    {label: 'Factures Achats', icon: 'pi pi-fw pi-file-o', routerLink: ['/uikit/factureAchat']},
                    {label: 'Commandes-service', icon: 'pi pi-fw pi-cog', routerLink: ['/uikit/Commandes']},
                ]
            },

        ];
    }
}
