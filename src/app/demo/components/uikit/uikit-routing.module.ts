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
import {FactureDetailsComponent} from "./Factures/facture-details/facture-details.component";
import {ClotureComponent} from "./Ventes/cloture/cloture.component";
import {TrancheComponent} from "./tranche/tranche.component";
import {ServiceComponent} from "./Services/service/service.component";
import {AjoutServiceComponent} from "./Services/ajout-service/ajout-service.component";
import {CommandeServiceComponent} from "./commandeServices/commande-service/commande-service.component";
import {CommandeServAjoutComponent} from "./commandeServices/commande-serv-ajout/commande-serv-ajout.component";
import {CommandeServDetailsComponent} from "./commandeServices/commande-serv-details/commande-serv-details.component";
import {LoginComponent} from "../auth/login/login.component";
import {FactureVente} from "../../../models/FactureVente";
import {FactureVenteComponent} from "./FactureVente/facture-vente/facture-vente.component";
import {FactureVenteAjoutComponent} from "./FactureVente/facture-vente-ajout/facture-vente-ajout.component";
import {FactureVenteDetailsComponent} from "./FactureVente/facture-vente-details/facture-vente-details.component";
import {FactureAchatComponent} from "./FactureAchat/facture-achat/facture-achat.component";
import {FactureAchatAjoutComponent} from "./FactureAchat/facture-achat-ajout/facture-achat-ajout.component";
import {FactureAchatDetailsComponent} from "./FactureAchat/facture-achat-details/facture-achat-details.component";

@NgModule({
    imports: [RouterModule.forChild([

        { path: 'login', component:LoginComponent },
        { path: 'Users', component:UserComponent },
        { path: 'Add-user', component:AjoutUserComponent },
        {path:"Edit-user/:id", component:UpdateUserComponent},
        { path: 'produits', component:ProduitsComponent },
        { path: 'ajout-produit', component:ProduitAjoutComponent },
        { path: 'edit-produit/:id', component:ProduitAjoutComponent },
        { path: 'services', component:ServiceComponent },
        { path: 'ajout-service', component:AjoutServiceComponent },
        { path: 'edit-service/:id', component:AjoutServiceComponent },
        { path: 'POS', component:POSComponent },
        { path: 'Ventes', component: LigneVenteComponent },
        { path: 'depots', component:DepotComponent },
        { path: 'article', component:ArticleComponent },
        { path: 'caisse', component:CaisseComponent },

        { path: 'facture', component:FactureComponent },
        { path: 'add-facture', component:FactureAjoutComponent },
        { path: 'update-facture/:id', component:FactureAjoutComponent },
        { path: 'facture/:id', component:FactureDetailsComponent },

        { path: 'factureVente', component:FactureVenteComponent },
        { path: 'add-factureVente', component:FactureVenteAjoutComponent },
        { path: 'update-factureVente/:id', component:FactureVenteAjoutComponent },
        { path: 'factureVente/:id', component:FactureVenteDetailsComponent },

        { path: 'factureAchat', component:FactureAchatComponent },
        { path: 'add-factureAchat', component:FactureAchatAjoutComponent },
        { path: 'update-factureAchat/:id', component:FactureAchatAjoutComponent },
        { path: 'factureAchat/:id', component:FactureAchatDetailsComponent },




        { path: 'cloture', component:ClotureComponent },

        { path: 'tranches', component:TrancheComponent },

        { path: 'Commandes', component:CommandeServiceComponent },
        { path: 'Ajout-Commande', component:CommandeServAjoutComponent },
        { path: 'Edit-Commande/:id', component:CommandeServAjoutComponent },
        { path: 'CommandeServ/:id', component:CommandeServDetailsComponent },

        { path: 'menu', data: { breadcrumb: 'Menu' }, loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule) },
        { path: '**', redirectTo: '/notfound' },


    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
