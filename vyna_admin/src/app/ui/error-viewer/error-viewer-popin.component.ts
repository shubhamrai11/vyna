import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Subscription } from "rxjs";
import { ErrorContainer } from 'src/app/core/models/ErrorContainer';
declare var $: any;

@Component({
  selector: 'error-viewer-popin',
  templateUrl: './error-viewer-popin.component.html',
  styleUrls: ['./error-viewer-popin.component.scss']
})
export class ErrorViewerPopinComponent implements OnInit, OnDestroy {

  errorContainer?: ErrorContainer;
  errorSubscription?: Subscription;
 
  constructor(private errorHandlerService: ErrorHandlerService) {
  }

  ngOnInit() {
    console.debug('init ErrorViewerComponent');
    this.errorSubscription = this.errorHandlerService.errorsStatus.subscribe((value) => {
      console.error('Error details ', value);
      if (value && value.errors && value.errors.length) {
        this.errorContainer = value;
        $('#danger-header-modal').modal('show');
      }else {
        console.debug("Hide error by error-viewer ",  this.errorContainer );
      }
    });    
  }

  ngOnDestroy() {
    this.errorSubscription?.unsubscribe();
  }

}