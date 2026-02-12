import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ErrorContainer } from 'src/app/core/models/ErrorContainer';
declare var $: any;

@Component({
  selector: 'error-viewer',
  templateUrl: './error-viewer.component.html',
  styleUrls: ['./error-viewer.component.scss']
})
export class ErrorViewerComponent implements OnInit, OnDestroy {

  private _error?: ErrorContainer;


  ngOnInit() {

  }

  ngOnDestroy() {

  }

  hideAlert() {
    $('#messageAlert').addClass('hidden');
  }

  @Input() set error(value: ErrorContainer) {
    this._error = value;
    $('#messageAlert').removeClass('hidden');
  }

  get error(): ErrorContainer | undefined {
    return this._error;
  }


}