import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Team } from 'src/app/interfaces/team';
import { TeamService } from 'src/app/services/team.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit, AfterViewInit {
  teams: Team[] = [];
  displayedColumns: string[] = [
    'STATUS',
    'ID_ECHIPA',
    'DENUMIRE',
    'ACTIV',
    'DATA_CREARE',
    'UTILIZATOR_CREARE',
    'DATA_MODIFICARE',
    'UTILIZATOR_MODIFICARE',
    'ACTION',
  ];
  table_config = {
    columns: [
      {
        key: 'STATUS',
        heading: 'STATUS',
      },
      {
        key: 'ID_ECHIPA',
        heading: 'ID ECHIPA',
      },
      {
        key: 'DENUMIRE',
        heading: 'DENUMIRE',
      },
      {
        key: 'ACTIV',
        heading: 'ACTIV',
      },
      {
        key: 'DATA_CREARE',
        heading: 'DATA CREARE',
      },
      {
        key: 'UTILIZATOR_CREARE',
        heading: 'UTILIZATOR CREARE',
      },
      {
        key: 'DATA_MODIFICARE',
        heading: 'DATA MODIFICARE',
      },
      {
        key: 'UTILIZATOR_MODIFICARE',
        heading: 'UTILIZATOR MODIFICARE',
      },
    ],
    primary_key_set: ['DENUMIRE'], // this is optional and to be used only if the table is editable
    ediTable: {
      // this is optional
      add: true, // this determines if the "Add New Row" button will be displayed
      edit: true, // this determines if the "Edit Row" button will be displayed after each row
    },
  };
  dataSource!: MatTableDataSource<Team>;
  showActive: boolean = false;

  @Output() onRowEdit = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teamService: TeamService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.teams);
  }
  ngOnInit(): void {
    this.getAllTeams();
    this.teamService.RefreshRequired.subscribe((res) => {
     !this.showActive? this.getAllTeams() : this.getActiveTeams();
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isDate(d: string): boolean {
    return !isNaN(Date.parse(d));
  }

  getAllTeams() {
    this.teamService.getAllTeams().subscribe((res: any) => {
      this.teams = res.DATA;
      this.dataSource = new MatTableDataSource(this.teams);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getActiveTeams() {
    this.teamService.getActiveTeams().subscribe((res: any) =>{
      this.teams = res.DATA;
      this.dataSource = new MatTableDataSource(this.teams);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    })
  }

  onShowActive(e: any){
    this.showActive = e.checked
    if(e.checked){
      this.getActiveTeams()
    }
    else{
      this.getAllTeams()
    }
  }
  onEditTeam(team: Team) {
    this.openDialog(team);
  }

  restoreTeam(team: Team) {
    console.log('restoring', team);
    let body = { ID_ECHIPA: team.ID_ECHIPA };
    this.teamService.restoreTeam(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert(err);
      },
    });
  }

  deleteTeam(team: Team) {
    console.log('deleting', team);
    let body = { ID_ECHIPA: team.ID_ECHIPA };
    this.teamService.deleteTeam(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert(err);
      },
    });
  }
  openDialog(team: Team) {
    this.dialog.open(EditComponent, {
      data: {
        team,
        type: 'team',
        action: 'edit'
      }
    });
  }

  openAddDialog(){ 
    this.dialog.open(EditComponent, {
      data: {
        type: 'team',
        action: 'add'
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
