import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userAddForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UsersService,
  ) { }


  ngOnInit(): void {
    this.userAddForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmation: ['', Validators.required],
      cni: ['', Validators.required],
      telephone: ['', Validators.required],
      situationFamille: ['', Validators.required],
      canalNotification: ['',Validators.required ],
      fonction:['',Validators.required],
      matricule:['',Validators.required],
      addresse:['',Validators.required],
      typeRole:[''],
      sexe:['',Validators.required],
    });
    

  }



  addUser() {
    const userObj = {
      prenom: this.userAddForm.get('prenom')?.value, // First name
      nom: this.userAddForm.get('nom')?.value, // Last name
      email: this.userAddForm.get('email')?.value, // Email
      telephone: this.userAddForm.get('telephone')?.value, // Phone number
      password: this.userAddForm.get('password')?.value, // Password
      confirmation: this.userAddForm.get('confirmation')?.value, // Confirm password
      cni: this.userAddForm.get('cni')?.value, // cni ID
      situationFamille: this.userAddForm.get('situationFamille')?.value,//this.userAddForm.get('situationFamille')?.value, // Family situation
      canalNotification: this.userAddForm.get('canalNotification')?.value, //'MAIL', // Notification channel
      sexe: this.userAddForm.get('sexe')?.value, // First name
      typeRole:'ADMIN', // Last name
      addresse:this.userAddForm.get('addresse')?.value,
      fonction:this.userAddForm.get('fonction')?.value,
      matricule:this.userAddForm.get('matricule')?.value

    };
    
    console.log('Adding user...validation ---', userObj);
    if (this.userAddForm.valid) {
  
    this.userService.addUsers(userObj).pipe(
      catchError((error) => {
     //   console.log('==========<<error>>===',error)
        this.snackBar.open(error.error.message || 'An error occurred', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });
        return of(null); // Ensure graceful handling
      })
    ).subscribe((data: any) => {
    // console.log('data---', data)
      if (data) {
        this.snackBar.open(data?.message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: 'green-snackbar'
        });
        this.router.navigate(['/login']);
      } else if (data) {
        this.snackBar.open('User registered successfully', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: 'red-snackbar' 
        });
        this.router.navigate(['/login']);
      }
    });
    } else {
  //    console.log('===========================')
      this.snackBar.open('Please fill out the form correctly', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'red-snackbar' 
      });
    }
  }







}
