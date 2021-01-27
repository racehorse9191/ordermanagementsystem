import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { TablesUpdateComponent } from 'app/entities/tables/tables-update.component';
import { TablesService } from 'app/entities/tables/tables.service';
import { Tables } from 'app/shared/model/tables.model';

describe('Component Tests', () => {
  describe('Tables Management Update Component', () => {
    let comp: TablesUpdateComponent;
    let fixture: ComponentFixture<TablesUpdateComponent>;
    let service: TablesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [TablesUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(TablesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TablesUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TablesService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Tables(123);
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
        const entity = new Tables();
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
