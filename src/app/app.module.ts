import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

import { httpInterceptorProviders } from './auth/auth-interceptor';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import {MatTreeModule} from '@angular/material/tree';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { TreeComponent } from './tree/tree.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FileExplorerComponent,
    UploadFileComponent,
    TreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    DataTablesModule
  ],
  providers: [httpInterceptorProviders, UploadFileComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
