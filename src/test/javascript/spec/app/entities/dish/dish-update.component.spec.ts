import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { DishUpdateComponent } from 'app/entities/dish/dish-update.component';
import { DishService } from 'app/entities/dish/dish.service';
import { Dish } from 'app/shared/model/dish.model';

describe('Component Tests', () => {
  describe('Dish Management Update Component', () => {
    let comp: DishUpdateComponent;
    let fixture: ComponentFixture<DishUpdateComponent>;
    let service: DishService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [DishUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(DishUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DishUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DishService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Dish(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Dish();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
