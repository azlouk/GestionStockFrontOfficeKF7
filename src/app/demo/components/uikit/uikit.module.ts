import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIkitRoutingModule } from './uikit-routing.module';
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {FormsModule} from "@angular/forms";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {TableModule} from "primeng/table";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CalendarModule} from "primeng/calendar";
import {GenerationcodeComponent} from "../utilities/generationcode/generationcode.component";
import {FileUploadModule} from "primeng/fileupload";
import {ListboxModule} from "primeng/listbox";
import {InputNumberModule} from "primeng/inputnumber";
import {GenerationqrComponent} from "../utilities/generationqr/generationqr.component";
import {DialogModule} from "primeng/dialog";
import {InputSwitchModule} from "primeng/inputswitch";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
@NgModule({
    imports: [
        CommonModule,
        UIkitRoutingModule,
        ConfirmDialogModule,
        ToastModule,
        FormsModule,
        ConfirmPopupModule,
        TableModule,
        InputTextareaModule,
        CalendarModule,
        GenerationcodeComponent,
        FileUploadModule,
        ListboxModule,
        InputNumberModule,
        GenerationqrComponent,
        DialogModule,
        InputSwitchModule,
        DropdownModule,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService]

})
export class UIkitModule { }
