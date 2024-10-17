import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

   showAddUserSubject = false;
   showAddArticle=false;
  closeDialog() {
    this.showAddUserSubject=false;
  }

  openDialog() {
    this.showAddUserSubject=true;
  }

  closeDialogueArticle(){
    this.showAddArticle=false;
  }
  openDialogueArticle(){
    this.showAddArticle=true;
  }
}
