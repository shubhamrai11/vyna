import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/services/http.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {


    contactForm!: FormGroup;
submitted = false;
isLoading = false;
    contact: any = null;

  constructor(private httpsService: HttpService, private fb: FormBuilder,private router: Router) { }

    noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  ngOnInit(): void {
  this.contactForm = this.fb.group({
    name: ['', Validators.required, this.noWhitespaceValidator.bind(this)],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [
    Validators.required,
    Validators.pattern(/^[1-9][0-9]*$/),
    this.noWhitespaceValidator.bind(this)
  ]],
    message: ['', Validators.required , this.noWhitespaceValidator.bind(this)]
  });

          this.getContactUs();
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

 onContactSubmit(): void {
    this.submitted = true;

    // ✅ Ensure trimming before final validation
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (typeof control?.value === 'string') {
        control.setValue(control.value.trim());
      }
    });

    if (this.contactForm.invalid) {
      return;
    }

    this.isLoading = true;
    const payload = this.contactForm.value;

    this.httpsService.contactForm(payload).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Your message has been sent successfully!');
        this.contactForm.reset();
        this.submitted = false;
        this.router.navigate(['/landing']);
      },
      error: () => {
        this.isLoading = false;
        alert('Something went wrong. Please try again later.');
      }
    });
  }
}

