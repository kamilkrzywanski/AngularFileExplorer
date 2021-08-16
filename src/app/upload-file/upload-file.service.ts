import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {


  //Api URL
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  //Upload file to server without parrent // function disabled
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.apiBaseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  //uplad file to selected dir
  uploadToDir(file: File, parrent : any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('parrent', parrent);

    const req = new HttpRequest('POST', `${this.apiBaseUrl}/upload/${parrent}`, formData, {
      reportProgress: true,
      responseType: 'json'
      
    });

    return this.http.request(req);
  }

  //change parrent when file moved
  changeParrent(dir: string, parent : string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('dir', dir);
    formData.append('parent', parent);

    const req = new HttpRequest('POST', `${this.apiBaseUrl}/change`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }


}