import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../common/services/user.service';
import { PropertyService } from '../../../common/services/property.service';
import { concatMap, count, groupBy, mergeMap, of, zip } from 'rxjs';
import Chart from 'chart.js/auto';
import { PresenceService } from '../../../common/services/presence.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  totalBookmarked = 0;
  numOfProperty = 0;
  totalMessageUnread = 0;
  public chart: any;
  postLabel = Array<string>();
  postData = Array<number>();
  cityLabel = Array<string>();
  cityData = Array<number>();
  statusLabel = Array<string>();
  statusData = Array<number>();

  constructor(
    private datePipe: DatePipe,
    public userService: UserService,
    private propertyService: PropertyService,
    private presenceService: PresenceService,
  ) { }

  ngOnInit() {

    this.presenceService.friends$.subscribe(
      data => this.totalMessageUnread = data.reduce((sum, curr) => sum + curr.messageUnread, 0)
    )

    this.propertyService.getPropertiesForUser().subscribe(
      data => {
        this.numOfProperty = data.length;
        
        var today = new Date();
        var startDay = new Date(new Date().setDate(today.getDate() - 30));

        for (var d = startDay; d <= today; d.setDate(d.getDate() + 1)) {
          this.postLabel.push(d.getDate() + '/' + (d.getMonth() + 1));
          var properties = data.filter(x => this.datePipe.transform(new Date(x.createdAt), 'yyyy-MM-dd') === this.datePipe.transform(d, 'yyyy-MM-dd'));
          this.postData.push(properties.length);
          // this.postData.push(Math.floor(Math.random() * 100) + 1);
        }
        this.chart = new Chart('post', {
          type: 'line',
          data: {
            labels: this.postLabel,
            datasets: [
              {
                label: 'Bài đăng',
                data: this.postData,
              }
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Số bài đăng trong 30 ngày gần đây'
              }
            },
          },
        });

        of(data).pipe(
          concatMap(res => res),
          groupBy(item => item.city),
          mergeMap(group =>
            zip(
              of(group.key), group.pipe(count())
            )
          ))
          .subscribe((grouped: any) => {
            this.cityLabel.push(grouped[0]);
            this.cityData.push(grouped[1]);
          });
        this.chart = new Chart('city', {
          type: 'pie',
          data: {
            labels: this.cityLabel,
            datasets: [
              {
                label: 'Bài đăng',
                data: this.cityData,
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Số bài đăng theo thành phố'
              },
            }
          },
        });

        of(data).pipe(
          concatMap(res => res),
          groupBy(item => item.isActive ? 'Hiện' : 'Ẩn'),
          mergeMap(group =>
            zip(
              of(group.key), group.pipe(count())
            )
          ))
          .subscribe((grouped: any) => {
            this.statusLabel.push(grouped[0]);
            this.statusData.push(grouped[1]);
          });
        this.chart = new Chart('status', {
          type: 'pie',
          data: {
            labels: this.statusLabel,
            datasets: [
              {
                label: 'Bài đăng',
                data: this.statusData,
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Số bài đăng theo trạng thái'
              }
            }
          },
        });
      }
    )

    this.propertyService.bookmarks$.subscribe(
      data => this.totalBookmarked = data.length
    )
  }
}