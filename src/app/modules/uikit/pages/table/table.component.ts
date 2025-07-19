import { HttpClient } from '@angular/common/http';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { dummyData } from 'src/app/shared/dummy/user.dummy';
import { TableActionComponent } from './components/table-action/table-action.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { User } from './model/user.model';
import { TableFilterService } from './services/table-filter.service';

@Component({
  selector: 'app-table',
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() title: string = 'Team Members';
  @Input() subtitle: string = 'All Members:';
  @Input() totalCount: number = 0;
  @Input() useExternalData: boolean = false;

  private internalUsers = signal<User[]>([]);

  constructor(private http: HttpClient, private filterService: TableFilterService) {
    if (!this.useExternalData) {
      this.http.get<User[]>('https://freetestapi.com/api/v1/users?limit=8').subscribe({
        next: (data) => this.internalUsers.set(data),
        error: (error) => {
          this.internalUsers.set(dummyData);
          this.handleRequestError(error);
        },
      });
    }
  }

  public toggleUsers(checked: boolean) {
    if (this.useExternalData) {
      // External data için users array'ini güncelle
      this.users = this.users.map(user => ({ ...user, selected: checked }));
    } else {
      this.internalUsers.update((users) => {
        return users.map((user) => {
          return { ...user, selected: checked };
        });
      });
    }
  }

  private handleRequestError(error: any) {
    const msg = 'An error occurred while fetching users. Loading dummy data as fallback.';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message,
      action: {
        label: 'Undo',
        onClick: () => console.log('Action!'),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  filteredUsers = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const status = this.filterService.statusField();
    const order = this.filterService.orderField();

    const dataSource = this.useExternalData ? this.users : this.internalUsers();

    return dataSource
      .filter(
        (user: any) =>
          user.name.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          (user.email && user.email.toLowerCase().includes(search)) ||
          (user.phone && user.phone.includes(search)) ||
          (user.total && user.total.toString().includes(search)),
      )
      .filter((user: any) => {
        if (!status) return true;
        // Sipariş durumları için filtreleme
        if (this.useExternalData) {
          return user.occupation === status;
        } else {
          // Eski user filtreleme mantığı
          switch (status) {
            case '1':
              return user.status === 1;
            case '2':
              return user.status === 2;
            case '3':
              return user.status === 3;
            default:
              return true;
          }
        }
      })
      .sort((a, b) => {
        const defaultNewest = !order || order === '1';
        if (defaultNewest) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (order === '2') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return 0;
      });
  });

  ngOnInit() {}
}
