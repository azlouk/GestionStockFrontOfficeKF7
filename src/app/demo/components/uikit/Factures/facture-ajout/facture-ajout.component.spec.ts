import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAjoutComponent } from './facture-ajout.component';

describe('FactureAjoutComponent', () => {
  let component: FactureAjoutComponent;
  let fixture: ComponentFixture<FactureAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureAjoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
