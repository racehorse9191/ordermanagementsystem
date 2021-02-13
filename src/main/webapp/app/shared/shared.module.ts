import { NgModule } from '@angular/core';
import { OrderManagementSystemSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { SanitizeHtmlPipe } from './custom-pipes/sanitize-html.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { TotalGstPipe } from './custom-pipes/total-gst.pipe';

@NgModule({
  imports: [OrderManagementSystemSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    SanitizeHtmlPipe,
    HasAnyAuthorityDirective,
    TotalGstPipe,
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    OrderManagementSystemSharedLibsModule,
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    SanitizeHtmlPipe,
    NgSelectModule,
    TotalGstPipe,
  ],
})
export class OrderManagementSystemSharedModule {}
