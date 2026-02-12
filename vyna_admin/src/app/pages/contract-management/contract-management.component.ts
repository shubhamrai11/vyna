import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.css']
})
export class ContractManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  logout() {
    // Navigate to the root route and reload the page
    this.router.navigateByUrl('/').then(() => {
      // Reload the page to ensure you go back to the home page
      window.location.reload();
    });
  }
}
