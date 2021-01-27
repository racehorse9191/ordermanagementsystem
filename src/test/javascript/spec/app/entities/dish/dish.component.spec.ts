import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { DishComponent } from 'app/entities/dish/dish.component';
import { DishService } from 'app/entities/dish/dish.service';
import { Dish } from 'app/shared/model/dish.model';

describe('Component Tests', () => {
  describe('Dish Management Component', () => {
    let comp: DishComponent;
    let fixture: ComponentFixture<DishComponent>;
    let service: DishService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [DishComponent],
      })
        .overrideTemplate(DishComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DishComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DishService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Dish(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.dishes && comp.dishes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
