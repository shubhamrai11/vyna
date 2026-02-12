import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
    privacy: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private httpsService: HttpService) {}

  ngOnInit(): void {
    this.getPrivacyPolicy();
  }




  getPrivacyPolicy() {
    this.httpsService.getContent().subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res.status === 'success' && Array.isArray(res.data)) {
          // Find the Privacy Policy object dynamically
          this.privacy = res.data.find((item: any) => 
            item.role?.toLowerCase() === 'privacy policy'
          ) || null;
        } else {
          this.privacy = null;
        }
      },
      (error) => {
        console.error('Error fetching Privacy Policy:', error);
        this.privacy = null;
      }
    );
  }
}
