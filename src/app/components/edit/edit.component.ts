import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from 'src/app/interfaces/team';
import { TeamService } from 'src/app/services/team.service';
import { PlayerService } from 'src/app/services/player.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService,
    private playerService: PlayerService,
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
      let oldDateFormat = this.data.player.dateOfBirth.split('.');
      let newDateFormat =
        oldDateFormat[1] + ' ' + oldDateFormat[0] + ' ' + oldDateFormat[2];
      this.dateOfBirth = new Date(newDateFormat);
      this.teamId = this.data.player.team._id;
      this.teamName = this.data.player.team._id;
    }
    this.teamService.getAllTeams().subscribe((res: any) => {
      this.allTeams = res.DATA;
    });
    console.log(this.data);
  }

  editTeam(name: string, id: number) {
    console.log(name, id);
    let body = { ID_ECHIPA: id, DENUMIRE: name };
    this.teamService.editTeam(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert(err);
      },
    });
    this.dialog.closeAll();
  }

  addTeam() {
    if (this.teamName) {
      console.log('adding team');
      let body = { DENUMIRE: this.teamName };
      this.teamService.addTeam(body).subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          alert(err);
        },
      });
      this.dialog.closeAll()
    } else {
      alert('Team Name is required');
    }
  }

  editPlayer() {
    let dateFormat = this.dateOfBirth
      ?.toLocaleString()
      .split(',')[0]
      .split('/');
    let newDateOfBirth =
      dateFormat![0] + '.' + dateFormat![1] + '.' + dateFormat![2];
    let body = {
      ID_JUCATOR: this.playerId,
      ID_ECHIPA: this.teamId,
      NUME: this.lastName,
      PRENUME: this.firstName,
      DATA_NASTERE: newDateOfBirth,
    };
    this.playerService.editPlayer(body).subscribe({
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
      let dateFormat = this.dateOfBirth
      ?.toLocaleString()
      .split(',')[0]
      .split('/');
    let newDateOfBirth =
      dateFormat![0] + '.' + dateFormat![1] + '.' + dateFormat![2];
      let body = {
        NUME: this.lastName,
        PRENUME: this.firstName,
        DATA_NASTERE: newDateOfBirth,
        ID_ECHIPA: this.teamId,
      };
      this.playerService.addPlayer(body).subscribe({
        next: (res) =>{

        },
        error: (err) =>{
          alert(err)
        }
      });
      this.dialog.closeAll();
    } else {
      alert('All fields are required');
    }
  }
}
