import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Dir } from './dir';
import { Observable } from 'rxjs';
import { FileNode } from '../tree/tree.component';
const TOKEN_KEY = 'AuthToken';

@Injectable({
    providedIn: 'root'
  })
  export class FileExplorerService {
    private headers : HttpClient;
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { 
    }

  
    public getDirs() : Observable<Dir[]>{
      return this.http.get<Dir[]>(`${this.apiServerUrl}/allFiles`);
    }
    public getDirsTree() : Observable<FileNode[]>{
      return this.http.get<FileNode[]>(`${this.apiServerUrl}/allFiles`);
    }

    public addDir(dir: Dir) : Observable<Dir>{
      return this.http.post<Dir>(`${this.apiServerUrl}/dir/add`, dir);
    }
    public deleteDir(idDir: string) : Observable<void>{
      return this.http.get<void>(`${this.apiServerUrl}/dir/delete/${idDir}`);
    }

    public getHistory() : Observable<History[]>{
      return this.http.get<History[]>(`${this.apiServerUrl}/fullHistory`);
    }
    
  }