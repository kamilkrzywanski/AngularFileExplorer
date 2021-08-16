import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileExplorerService } from '../file-explorer/file-explorer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Dir } from '../file-explorer/dir';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { UploadFileService } from '../upload-file/upload-file.service';
import { FileExplorerComponent } from '../file-explorer/file-explorer.component';

/** File node data with possible child nodes. */


export interface FileNode {
  name: string;
  type: string;
  id: string;
  children?: FileNode[];
  childrenFile? : FileNode[];
}


/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  type: string;
  level: number;
  id: string;
  expandable: boolean;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent  {

  public fileNodes: FileNode[];
  public editDir: string | undefined;
  public deleteDirName: string | undefined;
  public deleteDirId: string | undefined;
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  validateDrop = false;
  expansionModel = new SelectionModel<string>(true);
  public apiUrl = environment.apiBaseUrl;
 
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  constructor(private fileExplorerService : FileExplorerService,  public upload: UploadFileComponent) {
    
    this.fileNodes = [];
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
      this.apiUrl;
      this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
      this.fileExplorerService.getDirsTree().subscribe(
        (response: FileNode[]) => {
          this.dataSource.data = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  ngOnInit(): void {

    this.fileExplorerService.getDirsTree().subscribe(
      (response: FileNode[]) => {
        this.dataSource.data = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      id: node.id,
      level: level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }

  getChildrenFile(node: FileNode): FileNode[] | null | undefined {
    return node.childrenFile;
  }

  fileUpload(parrent : number){
    this.upload.uploadToDir(parrent);
  }


  //create modal
  public onOpenModal(idDir: FileNode | null , mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
    
        this.editDir =idDir.id ;
        console.log(this.editDir);

      button.setAttribute('data-target', '#addDirModal');
    }
    if (mode === 'addFirst') {
      this.editDir=null;

    button.setAttribute('data-target', '#addDirModal');
    }
    if (mode === 'edit') {
      button.setAttribute('data-target', '#updateDirModal');
    }
    if (mode === 'delete') {
      this.deleteDirName = idDir.name;
      this.deleteDirId = idDir.id;
      console.log(idDir);

      button.setAttribute('data-target', '#deleteDirModal');
    }
    
    container?.appendChild(button);
    button.click();
  }


  //add new dir
  public onAddDir(editDir : string, addForm : NgForm): void {
    document.getElementById('add-dir-form')?.click();

    const bar: Dir = {id_dir:null, name: addForm.value.name, parrentFile: editDir };
    this.fileExplorerService.addDir(bar).subscribe(
      (response: Dir) => {
        addForm.reset();

        //reload data to tree
        this.ngOnInit();
     
      },
      (error: HttpErrorResponse) => {
        addForm.reset();
        alert(error.message);
        addForm.reset();
        
      }
    );
  }


  //delete selected dir and refresh data 
  public onDeleteDir(idDir: string): void {
    this.fileExplorerService.deleteDir(idDir).subscribe(
      (response: void) => {
        console.log(response);
       
        this.ngOnInit();
    
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  dragStart() {
    this.dragging = true;
  }
  dragEnd() {
    this.dragging = false;
  }
  dragHover(node: FlatTreeNode) {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }
  dragHoverEnd() {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }



  drop(event: CdkDragDrop<string[]>) {
    // console.log('origin/destination', event.previousIndex, event.currentIndex);
  
    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) return;

    // construct a list of visible nodes, this will match the DOM.
    // the cdkDragDrop event.currentIndex jives with visible nodes.
    // it calls rememberExpandedTreeNodes to persist expand state
    const visibleNodes = this.visibleNodes();

    // deep clone the data source so we can mutate it
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
    // recursive find function to find siblings of node
    function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
      let result, subResult;
      arr.forEach((item, i) => {
        if (item.id === id) {
          result = arr;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, id);
          if (subResult) result = subResult;
        }
      });
      return result;

    }

    // determine where to insert the node
    const nodeAtDest = visibleNodes[event.currentIndex];
    const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
    if (!newSiblings) return;
    const insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id);

 

    // remove the node from its old place
    const node = event.item.data; // current moved node
    const siblings = findNodeSiblings(changedData, node.id);
    const siblingIndex = siblings.findIndex(n => n.id === node.id);
    const nodeToInsert: FileNode = siblings.splice(siblingIndex, 1)[0];

    

    if (nodeAtDest.id === nodeToInsert.id) return;

    // ensure validity of drop - must be same level
    const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id);
    if (this.validateDrop && nodeAtDestFlatNode.level !== node.level) {
      alert('Items can only be moved within the same level.');
      return;
    }
    
    // insert node 
    newSiblings.splice(insertIndex, 0, nodeToInsert);
    
    // rebuild tree with mutated data
    this.rebuildTreeForData(changedData);

    this.upload.changeParrent(node.id, nodeAtDestFlatNode.id);
  }


  visibleNodes(): FileNode[] {
    const result = [];

    function addExpandedChildren(node: FileNode, expanded: string[]) {
      result.push(node);
      if (expanded.includes(node.id)) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach((node) => {
      addExpandedChildren(node, this.expansionModel.selected);
    });
    return result;
  }

  rebuildTreeForData(data: any) {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
        const node = this.treeControl.dataNodes.find((n) => n.id === id);
        this.treeControl.expand(node);
      });
  }
}
