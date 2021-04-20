import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariablesPage } from './variables.page';

describe('VariablesPage', () => {
  let component: VariablesPage;
  let fixture: ComponentFixture<VariablesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
