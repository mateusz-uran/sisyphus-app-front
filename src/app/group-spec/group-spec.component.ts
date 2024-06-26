import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { WorkApplicationsService } from '../services/work-applications.service';
import { WorkApplication } from '../interfaces/work-application';
import { WorkAppFormComponent } from '../work-app-form/work-app-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-group-spec',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WorkAppFormComponent,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: ` <app-work-app-form
      (updateWorkAppList)="handleUpdateWorkAppList($event)"
    ></app-work-app-form>
    <mat-divider></mat-divider>
    <ng-container *ngFor="let app of workApplications">
      <div class="app">
        <div class="link-wrapper">
          <p class="h-font-small">{{ app.workUrl }}</p>
          <a mat-stroked-button [href]="app.workUrl">Otwórz</a>
        </div>
        <div class="application-date">
          <p class="h-font-small">Data aplikowania</p>
          <p>{{ app.appliedDate }}</p>
        </div>
        <div class="status-wrapper">
          <p class="h-font-small">Status</p>
          <mat-chip-listbox class="mat-mdc-chip-set">
            <mat-chip-option
              *ngFor="let status of workStatus"
              [selected]="status === app.status"
              (click)="changeStatusValue(status, app.status, app.id)"
            >
              {{ status }}
            </mat-chip-option>
          </mat-chip-listbox>
        </div>
        <div class="btns-wrapper">
          <button
            mat-flat-button
            [disabled]="selectedAppId !== app.id || !allowSaveButton"
            (click)="updateWorkStatus(selectedAppId, selectedNewStatus)"
          >
            Zapisz
          </button>
          <button mat-mini-fab (click)="deleteWork(app.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
      <mat-divider></mat-divider>
    </ng-container>`,
  styleUrl: './group-spec.component.scss',
})
export class GroupSpecComponent {
  workApplicationService: WorkApplicationsService = inject(
    WorkApplicationsService
  );

  private activatedRoute = inject(ActivatedRoute);
  workGroupId$ = this.activatedRoute.params.pipe(map((p) => p['workGroupId']));

  workApplications: WorkApplication[] = [];
  workStatus: string[] = ['IN_PROGRESS', 'SEND', 'DENIED'];
  selectedAppId: string = '';
  allowSaveButton: boolean = false;
  selectedNewStatus: string = '';

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => this.workApplicationService.getWorkApplications(id))
      )
      .subscribe((appList: WorkApplication[]) => {
        this.workApplications = appList;
      });
  }

  changeStatusValue(newStatus: string, oldStatus: string, appId: string) {
    let primaryStatus: string = oldStatus;

    if (newStatus !== oldStatus) {
      this.allowSaveButton = true;
      this.selectedNewStatus = newStatus;
    } else if (newStatus === primaryStatus) {
      this.allowSaveButton = false;
    }
    this.selectedAppId = appId;
  }

  updateWorkStatus(appId: string, status: string) {
    this.workApplicationService
      .updateWorkApplicationStatus(appId, status)
      .subscribe((newWorkApp: WorkApplication) => {
        const index = this.workApplications.findIndex(
          (app) => app.id === newWorkApp.id
        );

        if (index !== -1) {
          this.workApplications[index] = newWorkApp;
        } else {
          this.workApplications.push(newWorkApp);
        }

        this.allowSaveButton = false;

        if (newWorkApp.status === 'HIRED') {
          // TODO: run logic for HIRED animation
        }
      });
  }

  deleteWork(appId: string) {
    this.workApplicationService.deleteWorkApplication(appId).subscribe(
      () => {
        this.workApplications = this.workApplications.filter(
          (app) => app.id !== appId
        );
      },
      (error) => {
        console.error('Failed to delete application:', error);
        // TODO: handle error
      }
    );
  }

  handleUpdateWorkAppList(event: WorkApplication[]): void {
    this.workApplications = [
      ...this.workApplications,
      ...event.filter(
        (app) =>
          !this.workApplications.some(
            (existingApp) => existingApp.id === app.id
          )
      ),
    ];
  }
}
