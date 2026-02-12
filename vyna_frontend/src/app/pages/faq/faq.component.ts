import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
      faq: any[] = [];
openedIndex: number | null = null;
  questionForm!: FormGroup;
isLoading = false;
submitted = false;


  constructor(private httpsService: HttpService, private fb: FormBuilder,private router: Router) { }


    ngOnInit(): void {
    this.questionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', [Validators.required, Validators.minLength(5)]],
    });

           this.getFAQ();
  }

  get f() {
    return this.questionForm.controls;
  }


getFAQ() {
  this.httpsService.getfaq().subscribe(
    (res: any) => {
      console.log('API Response:', res);
      if (res.status === 'success' && res.data?.length > 0) {
        this.faq = res.data;
      } else {
        this.faq = [];
      }
    },
    (error) => {
      console.error('Error fetching FAQ:', error);
    }
  );
}
toggleAccordion(index: number) {
  if (this.openedIndex === index) {
    this.openedIndex = null; // Close it
  } else {
    this.openedIndex = index; // Open it
  }
}

onSubmit(): void {
  this.submitted = true;

  if (this.questionForm.invalid) {
    alert('Please fill all required fields correctly.');
    return;
  }

  this.isLoading = true;
  const payload = this.questionForm.value;

  this.httpsService.faqForm(payload).subscribe({
    next: (res) => {
      this.isLoading = false;
      alert('Your question has been submitted successfully!');
      this.questionForm.reset();
      this.submitted = false;

      // ✅ Navigate to landing page
      this.router.navigate(['/landing']);
    },
    error: (err) => {
      this.isLoading = false;
      alert('Something went wrong. Please try again later.');
    }
  });
}


}
