import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {DataViewModule} from "primeng/dataview";
import {PaginatorModule} from "primeng/paginator";


@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule,ConfirmDialogModule,ToastModule,DataViewModule,
        PaginatorModule,CommonModule,
    ],
    providers: [
        DatePipe,ConfirmationService,MessageService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
