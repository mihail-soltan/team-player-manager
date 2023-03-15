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
  currentUser: string = '';
  teams: Team[] = [];
  displayedColumns: string[] = [
    'name',
    'active',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'ACTION',
  ];
  table_config = {
    columns: [
      {
        key: 'name',
        heading: 'NAME',
      },
      {
        key: 'active',
        heading: 'ACTIVE',
      },
      {
        key: 'createdAt',
        heading: 'CREATED AT',
      },
      {
        key: 'createdBy',
        heading: 'CREATED BY',
      },
      {
        key: 'updatedAt',
        heading: 'UPDATED AT',
      },
      {
        key: 'updatedBy',
        heading: 'UPDATED BY',
      },
    ],
    // primary_key_set: ['DENUMIRE'], // this is optional and to be used only if the table is editable
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
    this.getTeams();
    this.teamService.RefreshRequired.subscribe((res) => {
     !this.showActive? this.getTeams() : this.getTeams(true)
    });
    this.currentUser = localStorage.getItem('currentUser') || 'Mihail';
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isDate(d: string): boolean {
    return !isNaN(Date.parse(d));
  }
  
// if active is true, get only active teams, else get all teams
  getTeams(active: boolean=false){
    this.teamService.getTeams(active).subscribe((res: any) => {
      this.teams = res;
      this.dataSource = new MatTableDataSource(this.teams);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onShowActive(e: any){
    this.showActive = e.checked
    if(this.showActive){
      this.getTeams(true)
    }
    else{
      this.getTeams()
    }
  }

  toggleTeamActiveState(id: string, updatedBy: string) {
    this.teamService.toggleTeamActiveState(id, updatedBy).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert(err);
      }
    })

  }
 
  openAddorEditDialog(team: any = {}, currentUser: string, action: string){
    this.dialog.open(EditComponent, {
      data: {
        team,
        currentUser,
        type: 'team',
        action: action
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
