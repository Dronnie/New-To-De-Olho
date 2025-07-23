import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticoDetalhes } from './politico-detalhes';

describe('PoliticoDetalhes', () => {
  let component: PoliticoDetalhes;
  let fixture: ComponentFixture<PoliticoDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticoDetalhes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticoDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
