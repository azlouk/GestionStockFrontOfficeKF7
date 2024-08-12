import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [
                    { label: 'Statistiques', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    {label: 'Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/uikit/Users'] },
                    { label: 'Prouits', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/produits'] },
                    { label: 'Articles', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/article'] },
                    { label: 'Depôts', icon: 'pi pi-fw pi-database', routerLink: ['/uikit/depots'] },
                    { label: 'Factures', icon: 'pi pi-fw pi-file-o', routerLink: ['/uikit/facture'] },
                    { label: 'Ventes', icon: 'pi pi-fw pi-cart-plus', routerLink: ['/uikit/Ventes'] },
                    { label: 'POS', icon: 'pi pi-fw pi-calculator', routerLink: ['/uikit/POS'] },
                    { label: 'Caisse', icon: 'pi pi-fw pi-wallet', routerLink: ['/uikit/caisse'] },
                    { label: 'Cloture', icon: 'pi pi-fw pi-key', routerLink: ['/uikit/cloture'] },
                ]
            }

        ];
    }
}
