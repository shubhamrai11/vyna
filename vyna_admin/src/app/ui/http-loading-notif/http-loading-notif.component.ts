import { Directive, OnDestroy, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { HttpLoadingService } from 'src/app/core/services/http-loading.service';
import { Subscription } from "rxjs";
declare var $: any;

@Directive({
  selector: 'http-loading-notif'
})
export class HttpLoadingNotifComponent implements OnInit, OnDestroy, OnChanges {

  @Input() text: string | null = null;
  @Input() enable: boolean = false;
  loading: boolean = false;
  loadingSubscription: Subscription = new Subscription();
  toastNotification: any;

  constructor(private httpLoadingService: HttpLoadingService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.httpLoadingService.loadingStatus.subscribe((value) => {
      //if (!this.enable) 
      //return;
      this.loading = value;
      if (this.loading) {
        this.notifLoading();
      } else {
        this.stopNotifLoading();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

  reInitLaoder() {
    this.loadingSubscription.unsubscribe();
    this.ngOnInit();
  }

  private notifLoading() {
    var options = {
      //heading: "Traitement en cours",
      text: '<div class="d-flex align-items-center"><div class="spinner-border text-light" role="status"></div><span class="ml-2">' + this.text + '</span></div>',
      // text: '<div class="submit-message" style="display: block; color: #FFFFFF; position: fixed; left: 49.7%; top: 54.5%;">' + this.text + '</div>',
      position: "bottom-right",
      hideAfter: false,
      bgColor: "#323a46",// "rgba(21, 101 ,192,0.9)",
      loaderBg: "#323a46" //"#3688fc" //"rgba(0,0,0,0.2)" 
    };

    $.toast().reset('all');
    this.toastNotification = $.toast(options);
  }

  private stopNotifLoading() {
    if (this.toastNotification) {
      this.toastNotification.reset();
    }
  }

}