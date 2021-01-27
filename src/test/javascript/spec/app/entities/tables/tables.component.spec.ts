import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { TablesComponent } from 'app/entities/tables/tables.component';
import { TablesService } from 'app/entities/tables/tables.service';
import { Tables } from 'app/shared/model/tables.model';

describe('Component Tests', () => {
  describe('Tables Management Component', () => {
    let comp: TablesComponent;
    let fixture: ComponentFixture<TablesComponent>;
    let service: TablesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [TablesComponent],
      })
        .overrideTemplate(TablesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TablesComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TablesService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Tables(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.tables && comp.tables[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
