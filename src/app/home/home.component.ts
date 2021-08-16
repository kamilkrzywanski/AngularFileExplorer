import { Component, OnInit } from '@angular/core';

import { TokenStorageService } from '../auth/token-storage.service';
import { FileExplorerService } from '../file-explorer/file-explorer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  info: any;
  public history: History[];
  public temp: Object=false;
  dtOptions: DataTables.Settings = {};




  constructor(private token: TokenStorageService, private fileService : FileExplorerService) { }

  ngOnInit() {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: JSON.stringify(this.token.getAuthorities())
    };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      order: [1, "desc"]
    };

    this.getHistory();
    this.temp = true;

  }

  logout() {
    this.token.signOut();
    window.location.reload();
  }


  public getHistory(): void {
    this.fileService.getHistory().subscribe(
      (response: History[]) => {
        this.history = response;
        console.log(this.history);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }



  
}
