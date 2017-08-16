import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { User } from './../../users/user';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  public searchTerm: string;
  public focused: boolean = false;
  public helperFocused: boolean = false;
  private oldSearchTerm: string;
  private user$: Observable<User>;

  @Output('onSearch') onSearch: EventEmitter<string>;
  @Output('onClear') onClear: EventEmitter<void>;

  constructor(private router: Router,
    private authService: AuthService) {
    this.user$ = this.authService.currentUser$.map((user: User) => {
      // console.log(user);;
      user.routeGroups.general = user.routeGroups.general.filter(route => {
        return route.searchable;
      });

      return user;
    });

    this.onSearch = new EventEmitter<string>();
    this.onClear = new EventEmitter<void>();
  }

  enterPressed() {
    if (this.searchTerm && this.searchTerm !== this.oldSearchTerm) {
      this.oldSearchTerm = this.searchTerm;
      this.helperFocused = false;
      this.onSearch.emit(this.searchTerm);
      this.router.navigateByUrl('/requests/all/' + this.searchTerm);
    }
  }

  keyup() {
    this.helperFocused = true;
  }

  search() {
    this.oldSearchTerm = this.searchTerm
    this.helperFocused = false;
    this.onSearch.emit(this.searchTerm);
  }

  clearSearchTerm() {
    this.searchTerm = '';
    this.onClear.emit();
    let url = this.router.url.match(/(\/requests\/(my|all|pending))|\/users|\/organizations/)[0];
    if (url) {
      this.router.navigateByUrl(url);
    }
  }

}
