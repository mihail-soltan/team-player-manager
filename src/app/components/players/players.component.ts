import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Player } from 'src/app/interfaces/player';
import { PlayerService } from 'src/app/services/player.service';
import { EditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  players: Player[] = []
  displayedColumns: string[] = [
    'STATUS',
    'ID_JUCATOR',
    'ECHIPA',
    'NUME',
    'PRENUME',
    'DATA_NASTERE',
    'ACTIV',
    'DATA_CREARE',
    'UTILIZATOR_CREARE',
    'DATA_MODIFICARE',
    'UTILIZATOR_MODIFICARE',
    'ACTION'
  ];
  table_config = {
    columns:  [
      {
        key: 'STATUS',
        heading: 'STATUS'
      },
      {
        key: 'ID_JUCATOR',
        heading: 'ID JUCATOR'
      },
      {
        key: "ECHIPA",
        heading: 'ECHIPA',
      },
      {
        key: 'NUME',
        heading: 'NUME',
      },
      {
        key: 'PRENUME',
        heading: 'PRENUME',
      },
      {
        key: 'DATA_NASTERE',
        heading: 'DATA NASTERE',
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
      } 
    ],
    primary_key_set: ['DENUMIRE'], // this is optional and to be used only if the table is editable
    table_data_changer: new Subject<any>(), // this is optional and to be used only if the table data needs to be refreshed
    ediTable: { // this is optional
      add: true, // this determines if the "Add New Row" button will be displayed
      edit: true // this determines if the "Edit Row" button will be displayed after each row
    }
  };
  dataSource!: MatTableDataSource<Player>;
  showActive: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private playerService: PlayerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllPlayers()
    this.playerService.RefreshRequired.subscribe(res=>{
      !this.showActive? this.getAllPlayers() : this.getActivePlayers()
    })
  }

  getAllPlayers() {
    this.playerService.getAllPlayers().subscribe((res: any) => {
      this.players = res.DATA;
      this.dataSource = new MatTableDataSource(this.players);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getActivePlayers() {
    this.playerService.getActivePlayers().subscribe((res: any) => {
      this.players = res.DATA
      this.dataSource = new MatTableDataSource(this.players);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    })
  }

  onShowActive(e: any){
    this.showActive = e.checked
    if(e.checked){
      this.getActivePlayers()
    }
    else{
      this.getAllPlayers()
    }
  }
  isDate(d: string) : boolean {
    return !isNaN(Date.parse(d)) 
  }

  isObject(o: string) : boolean {
    return typeof(o) === "object"
  }
  editPlayer(player: Player) {
    console.log("editing", player)
    this.openDialog(player);
  }

  restorePlayer(player: Player){
    console.log("restoring" + player)
    let body = {ID_JUCATOR: player.ID_JUCATOR}
    this.playerService.restorePlayer(body).subscribe({
      next: res=> {
        console.log(res)
      },
      error: err =>{
        alert(err)
      }
    })
  }

  deletePlayer(player: Player) {
    console.log("deleting" + player)
    let body = {ID_JUCATOR: player.ID_JUCATOR}
    this.playerService.deletePlayer(body).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
        alert(err)
      }
    })
  }

  openDialog(player: Player) {
    this.dialog.open(EditComponent, {
      data: {
        player,
        type: 'player',
        action: 'edit'
      }
    });
  }

  openAddDialog() {
    this.dialog.open(EditComponent, {
      data: {
        type: 'player',
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
