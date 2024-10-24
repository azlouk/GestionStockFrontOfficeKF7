import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {NavigationEnd, Router} from "@angular/router";
import {ElectronService} from "./layout/service/electron-service.service";
import {LayoutService} from "./layout/service/app.layout.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig ,private router: Router, private electronService: ElectronService,   public layoutService: LayoutService) { }

    ngOnInit() {
        this.layoutService.config();
        this.primengConfig.ripple = true;
        // Listen to route changes in Angular
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const currentRoute = event.urlAfterRedirects;

                // Notify Electron of the route change
                this.electronService.send('navigate-page', currentRoute);
            }
    }) ;
    }
}
