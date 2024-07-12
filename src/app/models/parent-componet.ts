import {Component} from "@angular/core";
import {Produit} from "./produit";
import {Message} from "primeng/api";

@Component({
    selector: 'app-parent',
    templateUrl: './parent.component.html'
})
export class ParentComponent {
    parentMessage: Produit = new Produit();
    messages: Message[] = [];

    receiveMessage(event: any) {
        // handle the event
        this.messages.push({ severity: 'info', summary: 'Message Received', detail: 'You have received a new message.' });
    }
}
