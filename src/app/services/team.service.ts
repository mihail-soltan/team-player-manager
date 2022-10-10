import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamsUrl: string = 'https://recrutare.compexin.ro/api/web/echipemihail';
  restoreTeamUrl: string = 'https://recrutare.compexin.ro/api/web/echipemihail/restore';
  activeTeamsUrl: string = 'https://recrutare.compexin.ro/api/web/echipemihail/active';

  constructor(private http: HttpClient) { }

  private _refreshrequired = new Subject<void>();

  get RefreshRequired(){
    return this._refreshrequired;
  }
  getAllTeams():Observable<object>{
    return this.http.get(this.teamsUrl);
  }

  getActiveTeams():Observable<object>{
    return this.http.get(this.activeTeamsUrl)
  }

  editTeam(body: any){
    return this.http.put(this.teamsUrl, body).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )
  }

  addTeam(body: any){
    return this.http.post(this.teamsUrl, body).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )
  }

  deleteTeam(teamId: any){
    return this.http.delete(this.teamsUrl, {body: teamId}).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )
  }

  restoreTeam(teamId: any){
    return this.http.post(this.restoreTeamUrl, teamId).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )   
  }
}
