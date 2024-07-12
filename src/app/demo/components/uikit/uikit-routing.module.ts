import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProduitsComponent} from "./Products/produits/produits.component";
import {ProduitAjoutComponent} from "./Products/produit-ajout/produit-ajout.component";
import {ArticleComponent} from "./Articles/article/article.component";
import {DepotComponent} from "./Depot/depot/depot.component";
import {FactureComponent} from "./Factures/facture/facture.component";
import {FactureAjoutComponent} from "./Factures/facture-ajout/facture-ajout.component";
import { AjoutUserComponent } from './users/ajout-user/ajout-user.component';
import { POSComponent } from './Ventes/pos/pos.component';
import { LigneVenteComponent } from './Ventes/ligne-vente/ligne-vente.component';
import { CaisseComponent } from './Ventes/caisse/caisse.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';
import { UserComponent } from './users/user/user.component'
@NgModule({
    imports: [RouterModule.forChild([

        { path: 'Users', component:UserComponent },
        { path: 'Add-user', component:AjoutUserComponent },
        {path:"Edit-user/:id", component:UpdateUserComponent},
        { path: 'produits', component:ProduitsComponent },
        { path: 'ajout-produit', component:ProduitAjoutComponent },
        { path: 'edit-produit/:id', component:ProduitAjoutComponent },
        { path: 'POS', component:POSComponent },
        { path: 'Ventes', component: LigneVenteComponent },
        { path: 'depots', component:DepotComponent },
        { path: 'article', component:ArticleComponent },
        { path: 'caisse', component:CaisseComponent },
        { path: 'facture', component:FactureComponent },
        { path: 'add-facture', component:FactureAjoutComponent },
        { path: 'menu', data: { breadcrumb: 'Menu' }, loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule) },
        { path: '**', redirectTo: '/notfound' },

    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
