import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { OrderManagementSystemAppRoutingModule } from './app-routing.module';
import { OrderManagementSystemHomeModule } from './home/home.module';
import { OrderManagementSystemEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { UicomponentsModule } from './uicomponents/uicomponents.module';
import { OrderManagementSystemSharedModule } from './shared/shared.module';
import { OrderManagementSystemCoreModule } from './core/core.module';
import { SubscriptionService } from './shared/subscription.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OrderManagementSystemSharedModule,
    OrderManagementSystemCoreModule,
    OrderManagementSystemHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    OrderManagementSystemEntityModule,
    OrderManagementSystemAppRoutingModule,
    MatGridListModule,
    MatChipsModule,
    UicomponentsModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }],
})
export class OrderManagementSystemAppModule {}
