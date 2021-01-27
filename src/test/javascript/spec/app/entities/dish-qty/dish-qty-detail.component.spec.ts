import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { DishQtyDetailComponent } from 'app/entities/dish-qty/dish-qty-detail.component';
import { DishQty } from 'app/shared/model/dish-qty.model';

describe('Component Tests', () => {
  describe('DishQty Management Detail Component', () => {
    let comp: DishQtyDetailComponent;
    let fixture: ComponentFixture<DishQtyDetailComponent>;
    const route = ({ data: of({ dishQty: new DishQty(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [DishQtyDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(DishQtyDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DishQtyDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load dishQty on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.dishQty).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
