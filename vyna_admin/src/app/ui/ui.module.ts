import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HttpLoadingComponent } from "./http-loading/http-loading.component";
import { HttpLoadingNotifComponent } from "./http-loading-notif/http-loading-notif.component";
import { ErrorViewerComponent } from './error-viewer/error-viewer.component';
import { ErrorViewerPopinComponent } from './error-viewer/error-viewer-popin.component';
import { SanitizedHtmlPipe } from './html-sanityze/html-sanityze.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    declarations: [
		HttpLoadingComponent, HttpLoadingNotifComponent, 
        ErrorViewerComponent, ErrorViewerPopinComponent, SanitizedHtmlPipe
    ],
    exports: [
        HttpLoadingComponent,
        HttpLoadingNotifComponent,
        ErrorViewerComponent,
        ErrorViewerPopinComponent, SanitizedHtmlPipe
    ]
})
export class UiModule { }
