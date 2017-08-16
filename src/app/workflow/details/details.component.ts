import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from 'angular2-i18n';
import { MdSnackBar } from '@angular/material';
import { WorkflowService } from './../workflow.service';
import { DisplayTask } from './../displayTask';

import { OrganizationsService } from './../../organizations/organizations.service';

import { Organization } from './../../organizations/organization';
import { Task, TaskType } from './../task';


@Component({
  selector: 'app-workflow-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class WorkflowDetailsComponent implements OnInit {

  private typeKeys: string[];
  private displayTasks: DisplayTask[];
  private selectedOrganization: Organization;
  private selectedType: TaskType = TaskType.CAR;
  private disablePointerEvents: boolean = false;
  private selectedTask: Task;
  private organization: Organization;
  private organizations: Organization[];

  constructor(private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private workflowService: WorkflowService,
    private mdSnackBar: MdSnackBar,
    private i18n: I18nService) {

    let organizations$ = this.organizationsService.getOrganizations().map(collection => collection.set);

    this.typeKeys = Object.keys(TaskType);
    this.displayTasks = [];

    this.route.params.subscribe(params => {
      let organizationId = params['organizationId'];
      organizations$.subscribe(organizations => {
        this.organizations = organizations;
        this.organization = organizations.find(org => {
          return org._id === organizationId;
        });
      })

      this.workflowService.getWorkflow(organizationId).subscribe((tasks: Task[]) => {
        this.displayTasks = this.workflowToDisplayTasks(tasks);
      });
    });
  }

  ngOnInit() {
  }

  addTask() {
    if (this.selectedOrganization) {

      let index = this.displayTasks.findIndex(task => {
        return this.selectedOrganization._id === task.organization._id;
      });

      if (index !== -1) {
        this.mdSnackBar.open(this.i18n.translate('TASK_EXISTS_FOR_THIS_ORGANIZATION'), null, { duration: 3000 });
        return;
      }

      if (this.selectedType === TaskType.CAR) {
        this.displayTasks.push({ organization: this.selectedOrganization, includeCar: true });
      } else {
        this.displayTasks.push({ organization: this.selectedOrganization, includeCar: false });
      }

      this.selectedOrganization = null;
      this.selectedType = TaskType.CAR;
    }
  }

  deleteTask(task: DisplayTask) {
    let index = this.displayTasks.findIndex(dt => dt.organization._id === task.organization._id);
    if (index >= 0) {
      this.displayTasks.splice(index, 1);
    }
  }

  onDrop(src: DisplayTask, trg: DisplayTask) {
    this.disablePointerEvents = false;
    this.selectedTask = null;

    let srcIndex = this.displayTasks.findIndex(task => task.organization._id === src.organization._id);
    let trgIndex = this.displayTasks.findIndex(task => task.organization._id === trg.organization._id);

    this.displayTasks.splice(srcIndex, 1);
    this.displayTasks.splice(trgIndex, 0, { organization: src.organization, includeCar: src.includeCar });
  }

  onMouseDown(task: Task) {
    this.disablePointerEvents = true;
    this.selectedTask = task;
  }

  onMouseUp() {
    this.disablePointerEvents = false;
    this.selectedTask = null;
  }

  saveWorkflow() {
    let tasks: Task[] = this.generateWorkflow();

    this.workflowService.setWorkflow(this.organization._id, tasks).subscribe(() => {
      this.mdSnackBar.open(this.i18n.translate('WORKFLOW_SUCCESSFULLY_UPDATED'), null, { duration: 3000 });
    }, () => {
      this.mdSnackBar.open(this.i18n.translate('FAILED_TO_UPDATE_WORKFLOW'), null, { duration: 3000 });
    });
  }

  generateWorkflow(): Task[] {
    let tasks: Task[] = [];
    this.displayTasks.forEach((displayTask: DisplayTask, index: number) => {
      let humanTask = new Task();
      humanTask.organization = displayTask.organization;
      humanTask.order = index;
      humanTask.type = TaskType.HUMAN;
      tasks.push(humanTask);

      if (displayTask.includeCar) {
        let carTask = new Task();
        carTask.organization = displayTask.organization;
        carTask.order = index;
        carTask.type = TaskType.CAR;
        tasks.push(carTask);
      }
    });

    return tasks;
  }

  private workflowToDisplayTasks(tasks: Task[]): DisplayTask[] {
    let displayTasks: DisplayTask[] = [];

    tasks.forEach((task, index) => {
      if (task.type === TaskType.HUMAN) {
        let dTask = new DisplayTask();
        dTask.organization = task.organization;
        displayTasks.push(dTask);
      } else {
        let index = displayTasks.findIndex(dtask => {
          return dtask.organization._id === task.organization._id;
        });

        if (index !== -1) {
          displayTasks[index].includeCar = true;
        }
      }
    });

    return displayTasks;
  }
}
