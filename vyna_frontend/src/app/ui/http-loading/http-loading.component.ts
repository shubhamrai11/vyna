import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpLoadingService } from 'src/app/core/services/http-loading.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'http-loading',
  inputs: ['text'],
  templateUrl: './http-loading.component.html',
  styleUrls: ['./http-loading.component.scss']
})
export class HttpLoadingComponent implements OnInit, OnDestroy {

  text: string|null = null;
  loading: boolean = false;
  loadingSubscription: Subscription = new Subscription();

  constructor(private httpLoadingService: HttpLoadingService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.httpLoadingService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}