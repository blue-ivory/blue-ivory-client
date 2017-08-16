import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from './user';
import { Collection } from '../classes/collection';
import { IPageChangeEvent } from "@covalent/core";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  private usersCollection$: Observable<Collection<User>>;
  private searchTerm: string;
  private page: number = 1;
  private pageSize: number = 10;

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.searchTerm = params["searchTerm"];
      this.usersCollection$ = this.userService.getUsers(this.page, this.pageSize, this.searchTerm);
    });
  }

  changePage(event: IPageChangeEvent): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.usersCollection$ = this.userService.getUsers(event.page, event.pageSize, this.searchTerm);
  }

}
