import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderManagementSystemTestModule } from '../../../test.module';
import { MenuDetailComponent } from 'app/entities/menu/menu-detail.component';
import { Menu } from 'app/shared/model/menu.model';

describe('Component Tests', () => {
  describe('Menu Management Detail Component', () => {
    let comp: MenuDetailComponent;
    let fixture: ComponentFixture<MenuDetailComponent>;
    const route = ({ data: of({ menu: new Menu(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OrderManagementSystemTestModule],
        declarations: [MenuDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(MenuDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MenuDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load menu on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.menu).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
