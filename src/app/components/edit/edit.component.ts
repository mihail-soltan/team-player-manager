import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  teamId?: number;
  teamName: string = '';
  playerId?: number;
  firstName: string = '';
  lastName: string = '';
  dateOfBirth?: Date;
  newDate = new Date();
  allTeams: Team[] = [];
  
  ngOnInit(): void {
    if (this.data.type === 'team' && this.data.action === 'edit') {
      this.teamId = this.data.team._id;
      this.teamName = this.data.team.name;
    }
    if (this.data.type === 'player' && this.data.action === 'edit') {
      this.playerId = this.data.player._id;
      this.firstName = this.data.player.firstName;
      this.lastName = this.data.player.lastName;
      this.dateOfBirth = this.data.player.dateOfBirth;
      this.teamId = this.data.player.team._id;
      this.teamName = this.data.player.team._id;
    }
    this.dataService.getTeams().subscribe((res: any) => {
      this.allTeams = res;
    });
  }

  editTeam(data: any) {
    let body = {
      _id: data.team._id,
      name: this.teamName,
      updatedAt: Date.now(),
      updatedBy: data.currentUser,
    };
    this.dataService.editTeam(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert(err);
      },
    });
    this.dialog.closeAll();
  }

  addTeam(data: any) {
    if (this.teamName) {
      let body = { name: this.teamName, createdBy: data.currentUser };
      this.dataService.addTeam(body).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          alert(err);
        },
      });
      this.dialog.closeAll();
    } else {
      alert('Team Name is required');
    }
  }

  editPlayer(data: any) {
    let body = {
      _id: data.player._id,
      firstName: this.firstName,
      lastName: this.lastName,
      team: this.teamId,
      dateOfBirth: this.dateOfBirth,
      updatedAt: Date.now(),
      updatedBy: data.currentUser,
    };
    this.dataService.editPlayer(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.dialog.closeAll();
  }

  addPlayer() {
    if (this.firstName && this.lastName && this.dateOfBirth && this.teamId) {
      let body = {
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        team: this.teamId,
        createdBy: this.data.currentUser,
      };
      this.dataService.addPlayer(body).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          alert(err);
        },
      });
      this.dialog.closeAll();
    } else {
      alert('All fields are required');
    }
  }
}
