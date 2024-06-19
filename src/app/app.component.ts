import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { WorkGroupComponent } from './work-group/work-group.component';
import { TransformedWorkGroup } from './interfaces/work-group';
import { WorkGroupService } from './services/work-group.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UploadFileComponent } from './upload-file/upload-file.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatDividerModule,
    WorkGroupComponent,
    MatButtonModule,
    UploadFileComponent,
  ],
  template: `
    <header>
      <div class="h-content">
        <p>Syzyf</p>
        <img src="./sisyphus.svg" alt="" />
      </div>
      <div class="add-btn">
        <button mat-stroked-button>Dodaj grupe</button>
      </div>
    </header>
    <div class="upload-wrapper">
      <app-upload-file></app-upload-file>
    </div>
    <app-work-group
      *ngFor="let workGroup of transformedGroupList"
      [workGroup]="workGroup"
    ></app-work-group>
    <mat-divider></mat-divider>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  transformedGroupList: TransformedWorkGroup[] = [];
  workGroupService: WorkGroupService = inject(WorkGroupService);

  ngOnInit(): void {
    this.workGroupService.workGroups$.subscribe(
      (groupList: TransformedWorkGroup[]) => {
        this.transformedGroupList = groupList;
      }
    );

    this.workGroupService.loadInitialWorkGroups();
  }
}
