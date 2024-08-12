import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeServAjoutComponent } from './commande-serv-ajout.component';

describe('CommandeServAjoutComponent', () => {
  let component: CommandeServAjoutComponent;
  let fixture: ComponentFixture<CommandeServAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeServAjoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeServAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
