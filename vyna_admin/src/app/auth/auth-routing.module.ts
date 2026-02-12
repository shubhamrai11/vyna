import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpComponent } from './otp/otp.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EmailTemplateComponent } from './email-template/email-template.component';

const routes: Routes = [
 
 
  {
    path: '', component: LoginComponent  // Set landing page as the default route for the auth module
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'otp',
    component: OtpComponent
  },
  {
    path: 'reset-password/:token',
    component: ChangePasswordComponent
  },
  {
    path: 'account/account-activate',
    component: EmailTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
