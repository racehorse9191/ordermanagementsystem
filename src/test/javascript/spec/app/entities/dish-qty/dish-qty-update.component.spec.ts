import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { DishQtyUpdateComponent } from 'app/entities/dish-qty/dish-qty-update.component';
import { DishQtyService } from 'app/entities/dish-qty/dish-qty.service';
import { DishQty } from 'app/shared/model/dish-qty.model';

describe('Component Tests', () => {
  describe('DishQty Management Update Component', () => {
    let comp: DishQtyUpdateComponent;
    let fixture: ComponentFixture<DishQtyUpdateComponent>;
    let service: DishQtyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [DishQtyUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(DishQtyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DishQtyUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DishQtyService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DishQty(123);
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
        const entity = new DishQty();
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
