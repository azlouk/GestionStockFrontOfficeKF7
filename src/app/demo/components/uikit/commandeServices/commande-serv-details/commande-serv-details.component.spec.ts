import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeServDetailsComponent } from './commande-serv-details.component';

describe('CommandeServDetailsComponent', () => {
  let component: CommandeServDetailsComponent;
  let fixture: ComponentFixture<CommandeServDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeServDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeServDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
