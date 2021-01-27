import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { OrderManagementSystemSharedModule } from 'app/shared/shared.module';
import { OrderManagementSystemCoreModule } from 'app/core/core.module';
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

@NgModule({
  imports: [
    BrowserModule,
    OrderManagementSystemSharedModule,
    OrderManagementSystemCoreModule,
    OrderManagementSystemHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    OrderManagementSystemEntityModule,
    OrderManagementSystemAppRoutingModule,
    MatGridListModule,
    MatChipsModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class OrderManagementSystemAppModule {}
