import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAchatAjoutComponent } from './facture-achat-ajout.component';

describe('FactureAchatAjoutComponent', () => {
  let component: FactureAchatAjoutComponent;
  let fixture: ComponentFixture<FactureAchatAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureAchatAjoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactureAchatAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
