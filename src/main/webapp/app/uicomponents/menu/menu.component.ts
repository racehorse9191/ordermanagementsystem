import { dishQtyModel, MenuListModel } from './../../shared/model/menu-list.model';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DishService } from '../../entities/dish/dish.service';
import { DishToOrder } from '../../shared/model/dish-to-order';
import { IMenu } from '../../shared/model/menu.model';
import { MenuService } from '../../entities/menu/menu.service';
import { flatten } from '@angular/compiler';
import { merge, type } from 'jquery';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../../shared/subscription.service';
import { displayCategory } from '../dish-category/dish-category.component';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @ViewChild('tabset')
  private tabs: NgbNav;
  todaysSplVal: boolean = true;
  selectedDishes: MenuListModel[] = [];
  orders: number = 0;
  dishSelected: boolean = false;
  showDescription: boolean = false;
  dishToOrder: DishToOrder[] = [];
  menus?: MenuListModel[] = [];
  todaySplMenu: MenuListModel[] = [];
  categoryTemp: MenuListModel[] = [];
  category: MenuListModel[] = [];
  singleCategory: MenuListModel = new MenuListModel();
  detailRecivedSubscription: Subscription = new Subscription();
  showOrderButton: boolean = false;
  orderList: dishQtyModel[] = [];
  categoryList: displayCategory[] = [];
  singleCategoryList: displayCategory = new displayCategory();
  constructor(
    protected dishService: DishService,
    protected menuService: MenuService,
    protected subscriptionService: SubscriptionService,
    protected cd: ChangeDetectorRef
  ) {
    this.loadDishes();
  }

  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
      if (obj.length != 0) {
        this.showOrderButton = true;
        this.orderList = obj;
        this.updateMenuCategoryDishes();
        this.updateTOdaysSpl();
      } else {
        this.showOrderButton = false;
      }
    });
  }
  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }
  loadDishes() {
    this.menuService.query().subscribe((res: HttpResponse<IMenu[]>) => {
      this.menus = res.body || [];
      this.groupMenuByQty();
    });
  }
  groupMenuByQty() {
    this.menus?.forEach(res => {
      if (this.categoryTemp.length == 0) {
        this.singleCategory = res;
        let tempQty = {};
        Object.keys(this.singleCategory?.dishQty || []).forEach(key => {
          if (this.singleCategory?.dishQty) {
            tempQty[key] = this.singleCategory?.dishQty[key] || '';
          }
        });
        tempQty['menus'] = [res];
        this.singleCategory.dishQty = [...[tempQty]];
        this.categoryTemp.push(this.singleCategory);
        this.singleCategory = new MenuListModel();
      } else {
        if (this.categoryTemp.find(obj => obj?.dish?.id === res?.dish?.id)) {
          let index = this.categoryTemp.findIndex(x => x?.dish?.id === res?.dish?.id);
          let newData = {};
          Object.keys(res?.dishQty || []).forEach(key => {
            if (res?.dishQty) {
              newData[key] = res?.dishQty[key] || null;
            }
          });
          if (this.categoryTemp[index]?.dishQty) {
            newData['menus'] = [res];
            this.categoryTemp[index]?.dishQty?.push(newData);
          }
        } else {
          this.singleCategory = res;
          let tempQty = {};
          Object.keys(this.singleCategory?.dishQty || []).forEach(key => {
            if (this.singleCategory?.dishQty) {
              tempQty[key] = this.singleCategory?.dishQty[key];
            }
          });
          tempQty['menus'] = [res];
          this.singleCategory.dishQty = [...[tempQty]];
          this.categoryTemp.push(this.singleCategory);
          this.singleCategory = new MenuListModel();
        }
      }
    });
    this.category = this.categoryTemp;
    this.fetchTodaysSpl();
    this.createDisplayCategory();
  }

  groupByFn = (item: any) => item?.dish?.category?.categoryName;

  selectedItem(selectedApp: any[]) {
    console.log('selected app=>', selectedApp);
    if (selectedApp.length != 0) {
      this.dishSelected = true;
    } else {
      this.dishSelected = false;
    }
  }
  orderButtonClicked() {
    this.dishSelected = false;
    setTimeout(() => {
      this.tabs.select('2');
    }, 10);
  }
  selectedActiveTab(event) {
    console.log('active tab=>', event);
    if (event == 2) {
      this.showOrderButton = false;
    } else if (this.orderList.length != 0) {
      this.showOrderButton = true;
    } else {
      this.showOrderButton = false;
    }
  }

  fetchOrderQty(menu: any) {
    let qty: any = null;
    menu.dishQty.forEach(res => {
      if (res.orderQty) {
        qty = res.orderQty;
      }
    });
    if (qty) {
      return qty;
    } else {
      return '';
    }
  }

  /* section to cooks for todays spl */
  updateTOdaysSpl() {
    let tempTodaysSPl = this.todaySplMenu;
    tempTodaysSPl.forEach(res => {
      this.orderList.forEach(order => {
        order.menus.forEach(ordMenu => {
          if (res.id == ordMenu.id) {
            res = ordMenu;
          }
        });
      });
    });
    this.todaySplMenu = [];
    this.todaySplMenu = tempTodaysSPl;
    this.cd.detectChanges();
  }
  fetchTodaysSpl() {
    this.todaySplMenu = this.category?.filter(res => res?.dish?.isTodaysSpecial);
    console.log('todays spl=>', this.todaySplMenu);
  }
  /* the section of cooking today's spl ends here*/
  /* this section is for cooking category data */
  updateMenuCategoryDishes() {
    let tempCategoryList = this.categoryList;
    tempCategoryList.forEach(res => {
      this.orderList.forEach(order => {
        res.menus.forEach(catMenu => {
          order.menus.forEach(ordMenu => {
            if (ordMenu.id == catMenu.id) {
              catMenu = ordMenu;
            }
          });
        });
      });
    });
    this.categoryList = [];
    this.categoryList = tempCategoryList;
    this.cd.detectChanges();
  }

  createDisplayCategory() {
    let tempCatergoryList: displayCategory[] = [];
    this.category?.forEach(res => {
      if (this.category.length == 0) {
        this.singleCategoryList.categoryName = res?.dish?.category?.categoryName || '';
        this.singleCategoryList.menus.push(res);
        tempCatergoryList.push(this.singleCategoryList);
        this.singleCategoryList = new displayCategory();
      } else {
        if (tempCatergoryList.find(obj => obj.categoryName === res?.dish?.category?.categoryName)) {
          let index = tempCatergoryList.findIndex(x => x.categoryName === res?.dish?.category?.categoryName);
          tempCatergoryList[index].menus.push(res);
        } else {
          this.singleCategoryList.categoryName = res?.dish?.category?.categoryName || '';
          this.singleCategoryList.menus.push(res);
          tempCatergoryList.push(this.singleCategoryList);
          this.singleCategoryList = new displayCategory();
        }
      }
    });
    this.categoryList = tempCatergoryList;
  }
  /* the section of cooking category data ends here*/

  onSearchItemRemove(event) {
    console.log('onSearchItemRemove event=>', event);
    this.orderList = this.orderList.filter(res => res.menus.find(menu => menu.id != event.value.id));
    this.subscriptionService.updateOrder(this.orderList);
  }
  onSearchClear(event) {
    console.log('onSearchClear event=>', event);
    this.subscriptionService.updateOrder([]);
  }
}
