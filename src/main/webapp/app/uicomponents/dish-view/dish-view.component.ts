import { MenuListModel, DishQtyModel } from './../../shared/model/menu-list.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DishToOrder } from '../../shared/model/dish-to-order';
import { SubscriptionService } from '../../shared/subscription.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CorosalModal } from '../../shared/model/corosal.model';
import { QtyGroupModel, QuantitiesModel } from '../../shared/model/qty-group.model';

@Component({
  selector: 'jhi-dish-view',
  templateUrl: './dish-view.component.html',
  styleUrls: ['./dish-view.component.scss'],
  providers: [NgbCarouselConfig],
})
export class DishViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dishes?: MenuListModel[] = [];
  @Input() showDescription?: boolean = true;
  @Input() todaysSpl?: boolean = false;
  @Input() isQRMenu?: boolean = false;
  orders: any[] = [];
  detailRecivedSubscription: Subscription = new Subscription();
  images: any[] = [];
  nonVegType: string = 'NON_VEG';
  vegType: string = 'VEG';
  selectedQty: any[] = [];
  dishPrice: any[] = [];
  dishesToOrder: MenuListModel[] = [];
  /* New vaiables*/
  corosal: CorosalModal[] = [];
  qtyGroup: QtyGroupModel[] = [];
  tempDish: MenuListModel[] = [];
  constructor(protected subscriptionService: SubscriptionService, config: NgbCarouselConfig, protected cd: ChangeDetectorRef) {
    config.interval = 5000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.orders = [];
    this.selectedQty = [];
    this.tempDish = this.dishes;
    this.tempDish = this.filterByDishName(this.tempDish);
    this.constructCorosol();
    this.constructQtyGroup();
    this.defaultSelectedQty();
  }

  ngOnInit(): void {
    console.log('in dishview qrmenu', this.isQRMenu);
    this.detailRecivedSubscription = this.subscriptionService.selectedorderOrderObservable.subscribe((obj: any[]) => {
      console.log('res=>', obj);
      if (obj && obj.length != 0) {
        this.dishesToOrder = obj;
      }
      this.cd.detectChanges();
    });
  }
  ngOnDestroy() {
    this.detailRecivedSubscription.unsubscribe();
  }
  constructCorosol() {
    this.dishes.forEach(res => {
      const corosal: CorosalModal = new CorosalModal();
      corosal.dishId = res.dish.id;
      corosal.dishDescription = res.dish.dishDescription;
      corosal.dishImage = res.dish.dishImage;
      corosal.dishName = res.dish.dishName;
      this.corosal.push(corosal);
    });
    const ids = this.corosal.map(o => o.dishName);
    this.corosal = [...this.corosal.filter(({ dishName }, index) => !ids.includes(dishName, index + 1))];
  }
  filterByDishName(arr) {
    const ids = arr.map(o => o.dish.id);
    return arr.filter((res, index) => !ids.includes(res.dish.id, index + 1));
  }
  qtyItems(menu: MenuListModel) {
    let qty = [];
    this.qtyGroup.forEach(res => {
      if (res.dishId == menu.dish.id) {
        qty = res.quantities;
      }
    });
    return qty;
  }
  constructQtyGroup() {
    this.qtyGroup = [];
    this.dishes.forEach(res => {
      const groupQty: QtyGroupModel = new QtyGroupModel();
      const qtyModel: QuantitiesModel = new QuantitiesModel();
      qtyModel.menuId = res.id;
      qtyModel.qtyId = res.dishQty.id;
      qtyModel.qtyName = res.dishQty.qtyName;
      qtyModel.orderQty = res.dishQty.orderQty;
      qtyModel.price = res.price;
      qtyModel.disabled = true;
      groupQty.dishId = res.dish.id;
      groupQty.quantities.push(qtyModel);
      this.qtyGroup.push(groupQty);
    });
    this.qtyGroup = this.groupBy(this.qtyGroup);
    console.log('qty=>', this.qtyGroup);
  }

  groupBy(array) {
    return array.reduce((acc, val, ind) => {
      const index = acc.findIndex(el => el.dishId === val.dishId);
      if (index !== -1) {
        const key = Object.keys(val)[1];
        acc[index]['quantities'].push(val['quantities'][0]);
      } else {
        acc.push(val);
      }
      return acc;
    }, []);
  }

  defaultSelectedQty() {
    this.tempDish.forEach((menu, index) => {
      this.qtyGroup.forEach(grp => {
        grp.quantities.forEach(qty => {
          if (menu.id == qty.menuId) {
            this.selectedQty.push(qty);
          }
        });
      });
    });
  }
  orderPlusClicked(index: any, menuId: any) {
    /*  if(!this.tempDish[index].dishQty.orderQty){
      this.tempDish[index].dishQty.orderQty = 1;
    }else{
      this.tempDish[index].dishQty.orderQty = this.tempDish[index].dishQty.orderQty+1 ;
    } */
    this.dishes.forEach(res => {
      if (res.id == menuId) {
        if (!res.dishQty.orderQty) {
          res.dishQty.orderQty = 1;
          res.isDishReady = false;
        } else {
          res.dishQty.orderQty = res.dishQty.orderQty + 1;
          res.isDishReady = false;
        }
      }
    });
    this.subscriptionService.updateOrder(this.dishes);
  }
  orderMinusClicked(index: any, menuId: any) {
    /*  if(!this.tempDish[index].dishQty.orderQty){
      this.tempDish[index].dishQty.orderQty = 0
    }else{
      if(this.tempDish[index].dishQty.orderQty > 0 ){
        this.tempDish[index].dishQty.orderQty = this.tempDish[index].dishQty.orderQty -1;
      }
    } */
    this.dishes.forEach(res => {
      if (res.id == menuId) {
        if (!res.dishQty.orderQty) {
          res.dishQty.orderQty = 0;
          res.isDishReady = false;
        } else {
          res.dishQty.orderQty = res.dishQty.orderQty - 1;
          res.isDishReady = false;
        }
      }
    });
    this.subscriptionService.updateOrder(this.dishes);
  }
  suborderPlusClicked(item: any) {
    if (!item.orderQty) {
      item.orderQty = 1;
    } else {
      item.orderQty = item.orderQty + 1;
    }
    this.dishes.forEach(res => {
      if (res.id == item.menuId) {
        if (!res.dishQty.orderQty) {
          res.dishQty.orderQty = 1;
          res.isDishReady = false;
        } else {
          res.dishQty.orderQty = res.dishQty.orderQty + 1;
          res.isDishReady = false;
        }
      }
    });
    this.subscriptionService.updateOrder(this.dishes);
  }

  subOrderMinusClicked(item: any) {
    if (!item.orderQty) {
      item.orderQty = 0;
    } else {
      item.orderQty = item.orderQty - 1;
    }
    this.dishes.forEach(res => {
      if (res.id == item.menuId) {
        if (!res.dishQty.orderQty) {
          res.dishQty.orderQty = 0;
          res.isDishReady = false;
        } else {
          res.dishQty.orderQty = res.dishQty.orderQty - 1;
          res.isDishReady = false;
        }
      }
    });
    this.subscriptionService.updateOrder(this.dishes);
  }

  removeRedundentObjects(arr: any[]) {
    const ids = arr.map(o => o.id);
    return arr.filter(({ id }, index) => !ids.includes(id, index + 1));
  }
}
