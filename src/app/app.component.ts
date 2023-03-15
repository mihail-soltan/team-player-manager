import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { DataService } from './services/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'team-manager';
  currentUser: string = '';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  username: string = 'Mihail';
  constructor(
    private observer: BreakpointObserver,
    private dialog: MatDialog,
    private data: DataService
  ) {}

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser')?.toString() || '';
    
    if (this.currentUser.length > 0) {
      this.data.setCurrentUser(this.currentUser);
    } else {
      const dialogRef: MatDialogRef<UserDialogComponent> = this.dialog.open(
        UserDialogComponent,
        { disableClose: true }
        );
        this.data.currentUser.subscribe((data) => (this.currentUser = data));
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
}
