import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {Vente} from "./app/models/Vente";
import {jwtDecode} from "jwt-decode";


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
export function setToken(token: string) {
    localStorage.setItem("token", token);
}



export function getToken(): string {
    const token = localStorage.getItem("token")
    if (token !== null && token !== undefined) {
        return token.toString()
    } else {
        return "404";
    }
}

export function deleteToken() {
    //localStorage.clear()
    localStorage.removeItem("token")
}
export function getUserDecodeID(): any {
    const decoded = jwtDecode(getToken());
    return JSON.parse(JSON.stringify(decoded));
}

export function setTitleTicket(title:string) {
    localStorage.setItem("title",title)
}

export  function getTitleTicket() :string{
    const token = localStorage.getItem("title")
    if (token !== null && token !== undefined) {
        return token.toString()
    } else {
        return "";
    }
}

export  function setVentes(ventes :Vente[]) {
    localStorage.setItem("ventes",JSON.stringify(ventes)) ;
}

export function getVentes():Vente[] {
    const ventes = localStorage.getItem("ventes")
    if (ventes !== null && ventes !== undefined) {
        return JSON.parse(ventes) ;
    } else {
        return [];
    }
}
//test ici


export function  SetLastPageModification(NumberPage:number){
    localStorage.setItem("lastPageModif",NumberPage.toString()) ;
}
export function GetLastPageModification():number {
    const lastPageModif = localStorage.getItem("lastPageModif")
    if (lastPageModif !== null && lastPageModif !== undefined) {
        return parseInt(lastPageModif);
    } else {
        return 0;
    }
}
