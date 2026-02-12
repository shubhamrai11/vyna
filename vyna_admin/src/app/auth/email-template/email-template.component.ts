import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import necessary modules
import { ActivatedRoute, Router } from '@angular/router';  // If you need the route params later
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css']
})
export class EmailTemplateComponent implements OnInit {
  otpForm!: FormGroup;
  isLoading: boolean = false;
  message: string = '';
  id: any
  constructor(private fb: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
    console.log("--------------",this.id)

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      otp2: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      otp3: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      otp4: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      otp5: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
      otp6: ['', [Validators.required, Validators.pattern('^[0-9]{1}$')]],
    });
  }

  // Handle input change: automatically focus next input field
  onInputChange(event: any, index: number) {
    const otpValue = event.target.value;
    if (otpValue.length === 1) {
      this.otpForm.get(`otp${index + 1}`)?.setValue(otpValue);
      if (index < 5) {  // Ensure it moves to the next field, within bounds
        const nextInput = document.getElementById(`otp${index + 1}`);
        nextInput?.focus();
      }
    }
  }

  // On form submission, collect OTP and call the API to verify OTP
  verifyOtp() {
    this.isLoading = true;
    const otp = Object.values(this.otpForm.value).join('');  // Combine OTP values into a string
    let otpObj = {
      id: this.id,
      codeActivation:otp

    }
 //   console.log('====otpobj',otpObj)
    if (this.otpForm.valid) {
      // Proceed with OTP verification logic
      this.userService.verifyOtp(otpObj).subscribe(
        (response) => {
          if(response?.status=='error'){
          this.snackBar.open(response.message, 'OK', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'red-snackbar'
          });
        }if(response?.status=='success'){
          this.snackBar.open(response.message, 'OK', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'green-snackbar'
          });
          this.router.navigate(['/login']);
        }
          
          this.isLoading = false;
        },
        (error) => {
         this.snackBar.open(error.error.message || 'An error occurred', 'OK', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                  panelClass: ['red-snackbar']
                });
                return of(null); // Ensure graceful handling
              })
        
    } else {
      
      this.snackBar.open('Please fill out the form correctly', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'red-snackbar'
      });
    }
    // Assuming you have an OTP service injected to handle API requests
    // Uncomment the actual API call


    // For demo purposes, simulating a successful OTP verification
    setTimeout(() => {
      this.isLoading = false;
      this.message = 'OTP verified successfully!'; // Example success message
    }, 2000);  // Simulating a delay for API response
  }
}
