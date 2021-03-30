// import { MenuListModel } from './../../shared/model/menu-list.model';
// import { HttpResponse } from '@angular/common/http';
// import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
// import { DishService } from '../../entities/dish/dish.service';
// import { DishToOrder } from '../../shared/model/dish-to-order';
// import { IMenu } from '../../shared/model/menu.model';
// import { MenuService } from '../../entities/menu/menu.service';
// import { Subscription } from 'rxjs';
// import { SubscriptionService } from '../../shared/subscription.service';
// import { DisplayCategory } from '../dish-category/dish-category.component';
// import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
// import { ActivatedRoute } from '@angular/router';
// import { ITables } from '../../shared/model/tables.model';

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DishService } from '../../../entities/dish/dish.service';
import { MenuService } from '../../../entities/menu/menu.service';
import { MenuListModel } from '../../../shared/model/menu-list.model';
import { IMenu } from '../../../shared/model/menu.model';
import { ITables } from '../../../shared/model/tables.model';
import { SubscriptionService } from '../../../shared/subscription.service';
import { DisplayCategory } from '../../dish-category/dish-category.component';

@Component({
  selector: 'jhi-qrmenu',
  templateUrl: './qrmenu.component.html',
  styleUrls: ['./qrmenu.component.scss'],
})
export class QRMenuComponent implements OnInit {
  @ViewChild('tabset')
  private tabs: NgbNav;
  showDescription: boolean = false;
  singleCategoryList: DisplayCategory = new DisplayCategory();
  categoryList: DisplayCategory[] = [];
  category: MenuListModel[] = [];
  dishSelected: boolean = false;
  selectedDishes: MenuListModel[] = [];
  selectedDishesQtys: MenuListModel[] = [];
  orderList: MenuListModel[] = [];
  todaySplMenu: MenuListModel[] = [];
  showOrderButton: boolean = false;
  detailRecivedSubscription: Subscription = new Subscription();
  activeTab: any;
  currentTable: ITables;
  private routeSub: Subscription = new Subscription();
  globalSearchItem: MenuListModel[] = [];
  constructor(
    protected dishService: DishService,
    protected menuService: MenuService,
    protected subscriptionService: SubscriptionService,
    protected cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.routeSub = this.route.params.subscribe(params => {
      this.currentTable = history.state;
    });
  }

  ngOnInit(): void {
    // this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
    //   if (obj.length != 0) {
    //     let checkButton = false;
    //     obj.filter(res => {
    //       if (res?.dishQty?.orderQty && res?.dishQty?.orderQty != 0) {
    //         checkButton = true;
    //       }
    //     });
    //     if (checkButton) {
    //       checkButton = false;
    //       if (this.activeTab == 2) {
    //         this.showOrderButton = false;
    //       } else {
    //         this.showOrderButton = true;
    //       }
    //     } else {
    //       this.showOrderButton = false;
    //     }
    //     this.orderList = obj;
    //     this.todaySplMenu = obj.filter(res => res?.dish?.isTodaysSpecial);
    //     this.updateMenuCategoryDishes();
    //   } else {
    //     this.orderList = [];
    //     this.showOrderButton = false;
    //     this.selectedDishes = [];
    //     this.dishSelected = false;
    //     this.todaySplMenu = obj;
    //     this.updateMenuCategoryDishes();
    //   }
    // });
    // console.log('todayspl=>', this.todaySplMenu);
    this.loadDishes();
  }
  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }
  loadDishes() {
    this.menuService.query().subscribe((res: HttpResponse<IMenu[]>) => {
      this.category = res.body || [];
      if (this.todaySplMenu.length == 0) {
        this.fetchTodaysSpl();
      }
      if (this.orderList.length != 0) {
        this.createDisplayCategory(this.orderList);
      } else {
        this.createDisplayCategory(this.category);
        this.globalSearchItem = this.constructQtyGroup(this.category);
      }
    });
  }

  constructQtyGroup(arr) {
    const ids = arr.map(o => o.dish.id);
    return arr.filter((res, index) => !ids.includes(res.dish.id, index + 1));
  }

  groupByFn = (item: any) => item?.dish?.category?.categoryName;

  selectedItem(selectedDish: any[]) {
    console.log('selectedDishes=>', this.selectedDishes);
    if (this.orderList.length != 0) {
      this.selectedDishesQtys = this.orderList.filter(res => this.selectedDishes.find(seldish => seldish.dish.id == res.dish.id));
    } else {
      this.selectedDishesQtys = this.category.filter(res => this.selectedDishes.find(seldish => seldish.dish.id == res.dish.id));
    }
    console.log('selectedDishesQtys=>', this.selectedDishesQtys);
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

  fetchTodaysSpl() {
    const tempTodaysSPl = this.category?.filter(res => res?.dish?.isTodaysSpecial);
    this.todaySplMenu = [];
    this.todaySplMenu = tempTodaysSPl;
    this.cd.detectChanges();
  }
  /* the section of cooking today's spl ends here*/
  /* this section is for cooking category data */
  updateMenuCategoryDishes() {
    const tempCategoryList = this.categoryList;
    tempCategoryList.forEach(res => {
      this.orderList.forEach(order => {
        res.menus.forEach(catMenu => {
          if (order.id == catMenu.id) {
            catMenu = order;
          }
        });
      });
    });
    this.categoryList = [];
    this.categoryList = tempCategoryList;
    this.cd.detectChanges();
  }

  createDisplayCategory(category) {
    const tempCatergoryList: DisplayCategory[] = [];
    category?.forEach(res => {
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
    if (this.orderList.length != 0) {
      this.globalSearchItem = this.constructQtyGroup(this.orderList);
    } else {
      this.globalSearchItem = this.constructQtyGroup(this.category);
    }
    this.updateMenuCategoryDishes();
  }
  /* the section of cooking category data ends here*/

  onSearchItemRemove(event: any) {
    if (this.orderList.length != 0) {
      this.orderList.forEach(ord => {
        if (ord.dish.id == event.value.dish.id) {
          ord.dishQty.orderQty = 0;
        }
      });
      this.selectedDishes = this.selectedDishes.filter(res => res.id != event.value.dish.id);
      this.selectedDishesQtys = this.selectedDishesQtys.filter(res => res.dish.id != event.value.dish.id);
      this.subscriptionService.updateOrder(this.orderList);
    } else {
      this.selectedDishes = this.selectedDishes.filter(res => res.dish.id != event.value.dish.id);
    }
  }
  onSearchClear() {
    this.selectedDishesQtys = [];
    this.selectedDishes = [];
    this.orderList.filter(res => (res.dishQty.orderQty = 0));
    this.subscriptionService.updateOrder(this.orderList);
  }
  clearItem(item) {
    this.selectedDishesQtys = this.selectedDishesQtys.filter(res => res.dish.id != item.dish.id);
    this.selectedDishes = this.selectedDishes.filter(res => res.dish.id != item.dish.id);
    this.orderList.filter(res => {
      if (res.dish.id === item.dish.id) {
        res.dishQty.orderQty = 0;
      }
    });
    this.subscriptionService.updateOrder(this.orderList);
  }
}
