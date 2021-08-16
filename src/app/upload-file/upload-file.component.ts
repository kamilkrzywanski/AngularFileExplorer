import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFileService } from './upload-file.service';
import { FileExplorerComponent } from '../file-explorer/file-explorer.component';
import { FileExplorerService } from '../file-explorer/file-explorer.service';
import { TreeComponent } from '../tree/tree.component';
import { TreeViewComponent } from '@syncfusion/ej2-ng-navigations';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos: Observable<any>;

  constructor(private uploadService: UploadFileService,private fileExplorer : FileExplorerComponent) { }

  ngOnInit(): void {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }


  //update parrent info when moved file
  public changeParrent(file: string, parent : string): void {
    this.uploadService.changeParrent(file, parent ).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.ngOnInit();

  }

  ///Upload File
  upload() {
    this.progress = 0;
  
    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
        this.ngOnInit();

      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
  
    this.selectedFiles = undefined;
  
  }


  //upload file to parrent dir
  uploadToDir(parrent: number) {
    this.progress = 0;
  
    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.uploadToDir(this.currentFile, parrent).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;

        }
       

      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
  
    this.selectedFiles = undefined;
  }

}
