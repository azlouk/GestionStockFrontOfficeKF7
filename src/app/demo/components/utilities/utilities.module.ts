import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilitiesRoutingModule } from './utilities-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
    imports: [
        UtilitiesRoutingModule,
        InputTextModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule
    ],
    declarations: []
})
export class UtilitiesModule { }
