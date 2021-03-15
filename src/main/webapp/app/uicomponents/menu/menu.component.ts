import { MenuListModel } from './../../shared/model/menu-list.model';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DishService } from '../../entities/dish/dish.service';
import { DishToOrder } from '../../shared/model/dish-to-order';
import { IMenu } from '../../shared/model/menu.model';
import { MenuService } from '../../entities/menu/menu.service';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../../shared/subscription.service';
import { DisplayCategory } from '../dish-category/dish-category.component';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ITables } from '../../shared/model/tables.model';

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
  orderList: MenuListModel[] = [];
  categoryList: DisplayCategory[] = [];
  activeTab: any;
  singleCategoryList: DisplayCategory = new DisplayCategory();
  currentTable: ITables;
  private routeSub: Subscription = new Subscription();
  constructor(
    protected dishService: DishService,
    protected menuService: MenuService,
    protected subscriptionService: SubscriptionService,
    protected cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.loadDishes();
    this.routeSub = this.route.params.subscribe(params => {
      this.currentTable = history.state;
    });
  }

  ngOnInit(): void {
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
      if (obj.length != 0) {
        if (this.activeTab == 2) {
          this.showOrderButton = false;
        } else {
          this.showOrderButton = true;
        }
        this.orderList = obj;
        this.updateMenuCategoryDishes();
        this.updateTOdaysSpl();
      } else {
        this.orderList = [];
        this.showOrderButton = false;
        this.selectedDishes = [];
        this.dishSelected = false;
        this.updateMenuCategoryDishes();
        this.updateTOdaysSpl();
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
        const tempQty = {};
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
          const index = this.categoryTemp.findIndex(x => x?.dish?.id === res?.dish?.id);
          const newData = {};
          Object.keys(res?.dishQty || []).forEach(key => {
            if (res?.dishQty) {
              newData[key] = res?.dishQty[key] || null;
            }
          });
          if (this.categoryTemp[index]?.dishQty) {
            res.dishQty = this.categoryTemp[index].dishQty;
            newData['menus'] = [res];
            this.categoryTemp[index]?.dishQty?.push(newData);
          }
        } else {
          this.singleCategory = res;
          const tempQty = {};
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

  selectedItem(selectedDish: any[]) {
    if (selectedDish.length != 0) {
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
  selectedActiveTab(event: any) {
    this.activeTab = event;
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
    menu.dishQty.forEach((res: any) => {
      if (res.orderQty) {
        qty = res.orderQty;
      }
    });
    if (qty) {
      return qty;
    } else {
      return 0;
    }
  }

  /* section to cooks for todays spl */
  updateTOdaysSpl() {
    const tempTodaysSPl = this.todaySplMenu;
    tempTodaysSPl.forEach(res => {
      this.orderList.forEach(order => {
        order?.dishQty?.forEach(ordMenu => {
          if (res.id == order.id) {
            res = order;
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
  }
  /* the section of cooking today's spl ends here*/
  /* this section is for cooking category data */
  updateMenuCategoryDishes() {
    const tempCategoryList = this.categoryList;
    tempCategoryList.forEach(res => {
      this.orderList.forEach(order => {
        res.menus.forEach(catMenu => {
          if (order.id == catMenu.id) {
            catMenu.dishQty.forEach(catQty => {
              order.dishQty.forEach(ordrQty => {
                if (catQty.id == ordrQty.id && ordrQty.orderQty) {
                  catQty.orderQty = ordrQty.orderQty;
                }
              });
            });
          }
        });
      });
    });
    tempCategoryList.filter(res => {
      if (res.menus) {
        res.menus.filter(menu => {
          let found = false;
          for (let i = 0; i < this.orderList.length; i++) {
            if (this.orderList[i].id == menu.id) {
              found = true;
              break;
            }
          }
          if (!found) {
            if (menu.dishQty.length != 0) {
              menu.dishQty.forEach(menuQty => {
                if (menuQty.orderQty) {
                  menuQty.orderQty = 0;
                }
              });
            }
          }
        });
      }
    });
    this.categoryList = [];
    this.categoryList = tempCategoryList;
    this.cd.detectChanges();
  }

  createDisplayCategory() {
    const tempCatergoryList: DisplayCategory[] = [];
    this.category?.forEach(res => {
      if (this.category.length == 0) {
        this.singleCategoryList.categoryName = res?.dish?.category?.categoryName || '';
        this.singleCategoryList.menus.push(res);
        tempCatergoryList.push(this.singleCategoryList);
        this.singleCategoryList = new DisplayCategory();
      } else {
        if (tempCatergoryList.find(obj => obj.categoryName === res?.dish?.category?.categoryName)) {
          const index = tempCatergoryList.findIndex(x => x.categoryName === res?.dish?.category?.categoryName);
          tempCatergoryList[index].menus.push(res);
        } else {
          this.singleCategoryList.categoryName = res?.dish?.category?.categoryName || '';
          this.singleCategoryList.menus.push(res);
          tempCatergoryList.push(this.singleCategoryList);
          this.singleCategoryList = new DisplayCategory();
        }
      }
    });
    this.categoryList = tempCatergoryList;
    this.updateMenuCategoryDishes();
    this.updateTOdaysSpl();
  }
  /* the section of cooking category data ends here*/

  onSearchItemRemove(event: any) {
    if (this.orderList.length != 0) {
      this.selectedDishes = this.selectedDishes.filter(res => res.id != event.value.id);
      this.orderList = this.orderList.filter(res => res.id != event.value.id);
      this.subscriptionService.updateOrder(this.orderList);
    } else {
      this.selectedDishes = this.selectedDishes.filter(res => res.id != event.value.id);
    }
  }
  onSearchClear() {
    this.orderList.filter(res => {
      res.dishQty.forEach(qty => {
        if (qty.orderQty) {
          qty.orderQty = 0;
        }
      });
    });
    this.subscriptionService.updateOrder([]);
  }
  clearItem(item) {
    if (this.orderList.length != 0) {
      this.orderList.filter(res => {
        if (res.id == item.id) {
          res.dishQty.forEach(qty => {
            if (qty.orderQty) {
              qty.orderQty = 0;
            }
          });
        }
      });
    }
    this.subscriptionService.updateOrder(this.orderList);
  }
}
