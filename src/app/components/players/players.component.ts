import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Player } from 'src/app/interfaces/player';
import { DataService } from 'src/app/services/data.service';
import { EditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  currentUser: string = '';
  players: Player[] = [];
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'active',
    'team',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'ACTION',
  ];
  table_config = {
    columns: [
      {
        key: 'firstName',
        heading: 'FIRST NAME',
      },
      {
        key: 'lastName',
        heading: 'LAST NAME',
      },
      {
        key: 'dateOfBirth',
        heading: 'DATE OF BIRTH',
      },
      {
        key: 'active',
        heading: 'ACTIVE',
      },
      {
        key: 'team',
        heading: 'TEAM',
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
    table_data_changer: new Subject<any>(), // this is optional and to be used only if the table data needs to be refreshed
    ediTable: {
      // this is optional
      add: true, // this determines if the "Add New Row" button will be displayed
      edit: true, // this determines if the "Edit Row" button will be displayed after each row
    },
  };
  dataSource!: MatTableDataSource<Player>;
  showActive: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private data: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.data.currentUser.subscribe((res) => {
      this.currentUser = res;
    });
    this.getPlayers();
    this.data.RefreshRequired.subscribe((res) => {
      !this.showActive ? this.getPlayers() : this.getPlayers(true);
    });
    console.log(this.currentUser)
  }

  getPlayers(active: boolean = false) {
    this.data.getPlayers(active).subscribe((res: any) => {
      this.players = res;
      this.dataSource = new MatTableDataSource(this.players);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onShowActive(e: any) {
    this.showActive = e.checked;
    if (e.checked) {
      this.getPlayers(true);
    } else {
      this.getPlayers();
    }
  }
  isDate(d: string): boolean {
    return !isNaN(Date.parse(d));
  }

  isObject(o: string): boolean {
    return typeof o === 'object';
  }
  editPlayer(player: Player) {
    console.log('editing', player);
    this.openDialog(player);
  }

  togglePlayerActiveState(id: string, updatedBy: string) {
    this.data.togglePlayerActiveState(id, updatedBy).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert(err);
      },
    });
  }

  openDialog(player: Player) {
    this.dialog.open(EditComponent, {
      data: {
        player,
        type: 'player',
        action: 'edit',
      },
    });
  }

  openAddDialog() {
    this.dialog.open(EditComponent, {
      data: {
        type: 'player',
        action: 'add',
      },
    });
  }

  openAddorEditDialog(player: any = {}, currentUser: string, action: string){
    this.dialog.open(EditComponent, {
      data: {
        player,
        currentUser,
        type: 'player',
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
