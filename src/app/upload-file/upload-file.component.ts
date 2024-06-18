import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { WorkGroupService } from '../services/work-group.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <section>
      <div class="input-btn">
        <input type="file" (change)="selectFile($event)" #input />
        <button
          mat-stroked-button
          [disabled]="!currentFile"
          (click)="upload(input)"
        >
          Wyślij
        </button>
      </div>
    </section>
  `,
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {
  workGroupService: WorkGroupService = inject(WorkGroupService);

  currentFile?: File;
  message = '';

  onFileUpload = output<void>();

  selectFile(event: any): void {
    this.message = '';
    this.currentFile = event.target.files.item(0);
  }

  upload(input: any): void {
    if (this.currentFile) {
      this.workGroupService.addWorkGroup(this.currentFile).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            console.log('Upload complete.');
            this.message = 'File uploaded successfuly!';
            this.onFileUpload.emit();
          }
        },
        error: (err: any) => {
          console.log('Error: ', err);
          this.message = 'Could not upload the file!';
          this.currentFile = undefined;
        },
        complete: () => {
          this.currentFile = undefined;
          input.value = null; // clear input
        },
      });
    }
  }
}
