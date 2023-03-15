import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  currentUsername: string = '';
  constructor(private dialog: MatDialog, private data: DataService) { }

  ngOnInit(): void {

  }
  addUser() {
    this.data.setCurrentUser(this.currentUsername);
    this.dialog.closeAll();
  }
}
