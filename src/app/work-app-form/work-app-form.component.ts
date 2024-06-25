import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { WorkApplicationsService } from '../services/work-applications.service';
import {
  WorkApplication,
  WorkApplicationDTO,
} from '../interfaces/work-application';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-work-app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],

  template: `<form
    [formGroup]="workUrlForm"
    (ngSubmit)="submitForm()"
    class="work-form"
  >
    <ng-container formArrayName="workUrlsArray">
      <ng-container
        *ngFor="let workUrl of workUrlsArray.controls; let i = index"
      >
        <div [formGroupName]="i" class="url-input-container">
          <mat-form-field class="url-input">
            <input
              matInput
              placeholder="Enter url #{{ i + 1 }}"
              formControlName="workUrl"
              class="mat-input"
            />
          </mat-form-field>

          <div class="remove-btn">
            <button
              mat-mini-fab
              type="button"
              *ngIf="i > 0"
              (click)="removeUrl(i)"
            >
              <mat-icon>remove</mat-icon>
            </button>
          </div>
        </div>
      </ng-container>
    </ng-container>
    <button mat-mini-fab type="button" (click)="addUrl()">
      <mat-icon>add</mat-icon>
    </button>
    <button type="submit" mat-raised-button [disabled]="!workUrlForm.valid">
      Dodaj
    </button>
    <button type="button" mat-raised-button (click)="workUrlForm.reset()">
      Wyczyść
    </button>
  </form> `,

  styleUrl: './work-app-form.component.scss',
})
export class WorkAppFormComponent {
  updateWorkAppList = output<WorkApplication[]>();

  workApplicationService: WorkApplicationsService = inject(
    WorkApplicationsService
  );

  workUrlForm: FormGroup;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.workUrlForm = this.fb.group({
      workUrlsArray: this.fb.array([
        this.fb.group({
          workUrl: ['', [Validators.required]],
        }),
      ]),
    });
  }

  get workUrlsArray() {
    return this.workUrlForm.get('workUrlsArray') as FormArray;
  }

  addUrl() {
    const workUrl = this.fb.group({
      workUrl: ['', [Validators.required]],
    });
    this.workUrlsArray.push(workUrl);
  }

  removeUrl(index: number) {
    this.workUrlsArray.removeAt(index);
  }

  public submitForm() {
    const formValues = this.workUrlForm.getRawValue();
    const data: WorkApplicationDTO[] = formValues.workUrlsArray.map(
      (urlGroup: { workUrl: string }) => ({
        workUrl: urlGroup.workUrl,
      })
    );

    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((workGroupId: string) =>
          this.workApplicationService
            .saveNewWorkApplication(data, workGroupId)
            .pipe(
              switchMap(() =>
                this.workApplicationService.getWorkApplications(workGroupId)
              )
            )
        )
      )
      .subscribe((appList: WorkApplication[]) => {
        this.updateWorkAppList.emit(appList);
      });
  }
}
