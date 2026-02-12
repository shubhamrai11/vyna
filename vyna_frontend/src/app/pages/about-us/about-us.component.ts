import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  aboutUs: any = null;
  sustain: any = null;
  promises: any[] = [];
    product: any[] = [];
award: any = null;
     imageList: any[] = [];
vision: any[] = [];
classList = ['bb', 'cc', 'dd'];
  constructor(private httpsService: HttpService) {}

  ngOnInit(): void {

        this.getAboutUs();
    this.getPromises();
    this.getAward();
    this.getVision();
    this.getSustainValues();
  }


  getAboutUs() {
  this.httpsService.getAboutUs().subscribe(
    (res: any) => {
      console.log('API Response:', res);

      if (res.status === 'success' && res.data?.length > 0) {
        this.aboutUs = res.data[0];
        this.imageList = this.aboutUs.image || [];

      } else {
        this.aboutUs = null;
      }
    },
    (error) => {
      console.error('Error fetching About Us:', error);
      this.aboutUs = null;
      this.imageList = [];
    }
  );
}

getSustainValues() {
  this.httpsService.getSustainValues().subscribe(
    (res: any) => {
      console.log('API Response:', res);

      if (res.status === 'success' && res.data?.length > 0) {
        // Store the entire array instead of just the first item
        this.sustain = res.data;
      } else {
        this.sustain = [];
      }
    },
    (error) => {
      console.error('Error fetching Sustain Values:', error);
      this.sustain = [];
    }
  );
}

    getPromises() {
    this.httpsService.getPromises().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.promises = res.data;
        } else {
          this.promises = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }


getAward() {
  this.httpsService.getAward().subscribe(
    (res: any) => {
      console.log('API Response:', res);
      if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
        this.award = res.data[0]; // Get the first (and only) award object
      } else {
        this.award = null;
      }
    },
    (error) => {
      console.error('Error fetching Awards:', error);
      this.award = null;
    }
  );
}


        getVision() {
    this.httpsService.getVision().subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && res.data) {
          this.vision = res.data;
        } else {
          this.vision = [];
        }
      },
      (error) => {
        console.error('Error fetching Categories:', error);
      }
    );
  }

  getClass(index: number) {
  return this.classList[index] || '';
}
  removeBlur(event: any) {
  event.target.classList.remove('blur');
}


}
