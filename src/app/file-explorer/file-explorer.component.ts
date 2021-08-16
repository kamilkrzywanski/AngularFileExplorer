import { Component, OnInit } from '@angular/core';
import { Dir } from './dir';
import { FileExplorerService } from './file-explorer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
}

)
export class FileExplorerComponent implements OnInit {
  public editDir: string | undefined;
  public deleteDirName: string | undefined;
  public deleteDirId: string | undefined;
  public newDir: Dir | undefined;
  public history: History[];

  
  constructor(private fileExplorerService : FileExplorerService) { 
    this.history = [];
  }

  ngOnInit(): void {
  }


  public onOpenModal(idDir: Dir | null , mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
    
        this.editDir = idDir.id_dir;
        console.log(idDir.id_dir);

      button.setAttribute('data-target', '#addDirModal');
    }
    if (mode === 'addFirst') {
      this.editDir=null;

    button.setAttribute('data-target', '#addDirModal');
    }
    if (mode === 'edit') {
      button.setAttribute('data-target', '#updateDirModal');
    }
 
    
    container?.appendChild(button);
    button.click();
  }

  public onAddDir(editDir : string, addForm : NgForm): void {
    document.getElementById('add-dir-form')?.click();

    const bar: Dir = {id_dir:null, name: addForm.value.name, parrentFile: editDir };

    this.fileExplorerService.addDir(bar).subscribe(
      (response: Dir) => {
        addForm.reset();
        
      },
      (error: HttpErrorResponse) => {
        addForm.reset();
        alert(error.message);
        addForm.reset();
      }
    );
  }

 

}
