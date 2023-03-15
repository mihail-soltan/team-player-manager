import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  API_URL: string = 'https://team-manager-backend-production.up.railway.app';
  teamsUrl: string = `${this.API_URL}/teams`;
  activeTeamsUrl: string = `${this.teamsUrl}/active`;
  playersUrl: string = `${this.API_URL}/players`;
  activePlayersUrl: string = `${this.playersUrl}/active`;

  constructor(private http: HttpClient) {}
  public currentUser: BehaviorSubject<any> = new BehaviorSubject<any>("");

  private _refreshrequired = new Subject<void>();

  get RefreshRequired() {
    return this._refreshrequired;
  }

  getCurrentUser(){
    return this.currentUser.value;
  }
  setCurrentUser(currentUser:any) {
    this.currentUser.next(currentUser); 
    localStorage.setItem('currentUser', currentUser);
  }
// ========================================== TEAM METHODS ==========================================
  getTeams(active: boolean = false): Observable<object> {
    return this.http.get(active ? this.activeTeamsUrl : this.teamsUrl);
  }

  editTeam(body: any) {
    const url = `${this.teamsUrl}/${body._id}`;
    return this.http.put(url, body).pipe(
      tap(() => {
        this.RefreshRequired.next();
      })
    );
  }

  addTeam(body: any) {
    return this.http.post(this.teamsUrl, body).pipe(
      tap(() => {
        this.RefreshRequired.next();
      })
    );
  }

  toggleTeamActiveState(teamId: any, updatedBy: string) {
    const url = `${this.teamsUrl}/${teamId}/active`;
    return this.http.put(url, { updatedBy: updatedBy }).pipe(
      tap(() => {
        this.RefreshRequired.next();
      })
    );
  }

// ========================================== PLAYER METHODS ==========================================
getPlayers(active: boolean = false):Observable<object>{
  return this.http.get(active? this.activePlayersUrl : this.playersUrl)
}

editPlayer(body: any){
  const url = `${this.playersUrl}/${body._id}`
  return this.http.put(url, body).pipe(
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


togglePlayerActiveState(playerId: string, updatedBy: string){
  const url = `${this.playersUrl}/${playerId}/active`
  return this.http.put(url, {updatedBy: updatedBy}).pipe(
    tap(()=>{
      this.RefreshRequired.next()
    })
  )
}
}
