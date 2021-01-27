import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { DishQtyComponent } from 'app/entities/dish-qty/dish-qty.component';
import { DishQtyService } from 'app/entities/dish-qty/dish-qty.service';
import { DishQty } from 'app/shared/model/dish-qty.model';

describe('Component Tests', () => {
  describe('DishQty Management Component', () => {
    let comp: DishQtyComponent;
    let fixture: ComponentFixture<DishQtyComponent>;
    let service: DishQtyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [DishQtyComponent],
      })
        .overrideTemplate(DishQtyComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DishQtyComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DishQtyService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new DishQty(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.dishQties && comp.dishQties[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
