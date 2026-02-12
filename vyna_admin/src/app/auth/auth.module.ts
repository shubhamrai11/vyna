import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule} from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule} from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { PagesModule } from '../pages/pages.module'; // Import PagesModule

import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpComponent } from './otp/otp.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EmailTemplateComponent } from './email-template/email-template.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    OtpComponent,
    ChangePasswordComponent,
    EmailTemplateComponent,
     
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    // HttpClientModule,
    // MatPaginatorModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    MatOptionModule,
    
    MatSelectModule,
   FormsModule,
   ReactiveFormsModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatButtonModule,
   MatSnackBarModule,
   MatSidenavModule,
   MatToolbarModule,
   RouterModule,
   MatMenuModule




  ]
})
export class AuthModule { }
