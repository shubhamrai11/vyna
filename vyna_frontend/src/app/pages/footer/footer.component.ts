import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  newsletterForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
contact: any = null;

  constructor(private fb: FormBuilder, private httpsService: HttpService) {}

  ngOnInit(): void {

    this.getContactUs();
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Debug: Live form changes
    this.newsletterForm.valueChanges.subscribe(val => {
      console.log('Form changes:', val);
    });
  }

get f() {
  return this.newsletterForm.controls;
}

  onSubmit(): void {
    console.log('Form Submitted', this.newsletterForm.value); // Debug log

    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    this.httpsService.newsletter(this.newsletterForm.value).subscribe({
      next: (res) => {
        console.log('API Success:', res);
        this.successMessage = 'Subscription successful.';
        alert("Subscription successful")
        this.errorMessage = '';
        this.newsletterForm.reset();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.successMessage = '';
        this.errorMessage = 'Subscription failed. Try again.';
      }
    });
  }


  getContactUs() {
  this.httpsService.getContactUs().subscribe(
    (res: any) => {
      console.log('API Response:', res);
      if (res.status === 'success' && res.data?.length > 0) {
        this.contact = res.data[0];
      } else {
        this.contact = null;
      }
    },
    (error) => {
      console.error('Error fetching About us:', error);
    }
  );
}


}
