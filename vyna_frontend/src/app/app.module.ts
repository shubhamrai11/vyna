import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WildcardComponent } from './wildcard/wildcard.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatTabsModule } from '@angular/material/tabs';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';


import { DatePipe } from '@angular/common';


import { MatDatepickerModule } from '@angular/material/datepicker';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MatDialogModule } from '@angular/material/dialog';
import { PagesComponent } from './pages/pages.component';

// Fonction pour charger les fichiers de traduction
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WildcardComponent,
    PagesComponent,
  

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularEditorModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AngularEditorModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
   
    MatDatepickerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    HttpClientModule,
    RouterModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTabsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [AuthService, { provide: HTTP_INTERCEPTORS , useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AppModule {}
