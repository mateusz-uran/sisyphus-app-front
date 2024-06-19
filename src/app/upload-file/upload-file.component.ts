import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { WorkGroupService } from '../services/work-group.service';
import { HttpResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { DragAndDropDirective } from '../directives/drag-and-drop.directive';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    DragAndDropDirective,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `<div
    class="container"
    appDragAndDrop
    (fileDropped)="onFileDropped($event)"
  >
    <div class="input-body">
      <input
        type="file"
        #fileDropRef
        id="fileDropRef"
        (change)="fileBrowseHandler($event)"
        style="display: none;"
        #input
      />
      <p>Przeciągnij plik albo wybierz z urządzenia.</p>
      <button mat-raised-button (click)="openFileSelector()">Wybierz</button>
    </div>

    <mat-expansion-panel hideToggle disabled expanded="{{ !!currentFile }}">
      <div class="panel-body">
        <p>{{ currentFile?.name }}</p>
        <button
          mat-icon-button
          [disabled]="!currentFile"
          (click)="upload(input)"
        >
          <mat-icon>upload</mat-icon>
        </button>
      </div>
      <mat-progress-bar
        mode="indeterminate"
        *ngIf="isUploading"
      ></mat-progress-bar>
    </mat-expansion-panel>
  </div>`,
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {
  @ViewChild('fileDropRef') fileDropRef!: ElementRef<HTMLInputElement>;

  workGroupService: WorkGroupService = inject(WorkGroupService);
  currentFile?: File | null;
  message = '';

  isUploading: boolean = false;

  onFileDropped(file: File) {
    this.currentFile = file;
  }

  fileBrowseHandler(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.currentFile = file;
    }
  }

  openFileSelector() {
    this.fileDropRef.nativeElement.click();
  }

  upload(input: any): void {
    this.isUploading = true;
    if (this.currentFile) {
      this.workGroupService.addWorkGroup(this.currentFile).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.message = 'File uploaded successfuly!';
            this.isUploading = false;
          }
        },
        error: (err: any) => {
          console.log('Error: ', err);
          this.message = 'Could not upload the file!';
          this.currentFile = undefined;
          this.isUploading = false;
        },
        complete: () => {
          this.currentFile = undefined;
          input.value = null;
          this.isUploading = false;
        },
      });
    }
  }
}
