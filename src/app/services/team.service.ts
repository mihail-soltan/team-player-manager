import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  // teamsUrl: string = 'https://recrutare.compexin.ro/api/web/echipemihail';
  teamsUrl: string = "https://team-manager-backend-production.up.railway.app/teams"
  restoreTeamUrl: string = 'https://recrutare.compexin.ro/api/web/echipemihail/restore';
  activeTeamsUrl: string = `${this.teamsUrl}/active`

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

  getTeams(active: boolean = false):Observable<object> {
    return this.http.get(active? this.activeTeamsUrl : this.teamsUrl)
  }

  editTeam(body: any){
    const url = `${this.teamsUrl}/${body._id}`
    return this.http.put(url, body).pipe(
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

  toggleTeamActiveState(teamId: any, updatedBy: string){
    const url = `${this.teamsUrl}/${teamId}/active`
    return this.http.put(url, {updatedBy: updatedBy}).pipe(
      tap(()=>{
        this.RefreshRequired.next()
      })
    )
  }
}
