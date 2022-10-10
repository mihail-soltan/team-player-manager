import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersUrl: string = 'https://recrutare.compexin.ro/api/web/jucatorimihail';
  restorePlayerUrl: string = 'https://recrutare.compexin.ro/api/web/jucatorimihail/restore';
  activePlayersUrl: string = 'https://recrutare.compexin.ro/api/web/jucatorimihail/active';

  constructor(private http: HttpClient) { }
  
  private _refreshrequired = new Subject<void>();
  get RefreshRequired(){
    return this._refreshrequired;
  }
  getAllPlayers():Observable<object>{
    return this.http.get(this.playersUrl)
  }

  getActivePlayers():Observable<object>{
    return this.http.get(this.activePlayersUrl)
  }

  deletePlayer(playerId: any){
    return this.http.delete(this.playersUrl, {body: playerId}).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )
  }

  editPlayer(player: any){
    return this.http.put(this.playersUrl, player).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )
  }

  addPlayer(body: any) {
    return this.http.post(this.playersUrl, body).pipe(
      tap(() =>{
        this.RefreshRequired.next()
      })
    )
  }
  restorePlayer(playerId: any){
    return this.http.post(this.restorePlayerUrl, playerId).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )   
  }
}
