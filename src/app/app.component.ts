import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkGroupComponent } from './work-group/work-group.component';
import { TransformedWorkGroup } from './interfaces/work-group';
import { WorkGroupService } from './services/work-group.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    WorkGroupComponent,
    MatButtonModule,
    UploadFileComponent,
    MatDividerModule,
  ],
  template: `
    <header>
      <div class="h-content">
        <p>Syzyf</p>
        <img src="./sisyphus.svg" alt="" />
      </div>
      <div class="add-btn">
        <button
          mat-stroked-button
          (click)="toggleUploadFile(showUploadFileForm)"
        >
          Dodaj grupe
        </button>
      </div>
    </header>
    <div class="upload-wrapper" *ngIf="showUploadFileForm">
      <app-upload-file></app-upload-file>
    </div>
    <ng-container *ngFor="let workGroup of transformedGroupList">
      <app-work-group [workGroup]="workGroup"></app-work-group>
      <mat-divider></mat-divider>
    </ng-container>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  transformedGroupList: TransformedWorkGroup[] = [];
  workGroupService: WorkGroupService = inject(WorkGroupService);
  showUploadFileForm: boolean = false;

  ngOnInit(): void {
    this.workGroupService.workGroups$.subscribe(
      (groupList: TransformedWorkGroup[]) => {
        this.transformedGroupList = groupList;
      }
    );

    this.workGroupService.loadInitialWorkGroups();
  }

  toggleUploadFile(state: boolean) {
    this.showUploadFileForm = !state;
  }
}
