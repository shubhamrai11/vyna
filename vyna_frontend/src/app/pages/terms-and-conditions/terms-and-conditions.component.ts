import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
    terms: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private httpsService: HttpService) {}

  ngOnInit(): void {
    this.getTermsCondition();
  }




  getTermsCondition() {
    this.httpsService.getContent().subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res.status === 'success' && Array.isArray(res.data)) {
          // Find the Terms and Conditions object dynamically
          this.terms = res.data.find((item: any) =>
            item.role?.toLowerCase() === 'terms and conditions'
          ) || null;
        } else {
          this.terms = null;
        }
      },
      (error) => {
        console.error('Error fetching Terms & Conditions:', error);
        this.terms = null;
      }
    );
  }
}
