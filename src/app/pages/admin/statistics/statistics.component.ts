import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../common/services/user.service';
import { PropertyService } from '../../../common/services/property.service';
import Chart from 'chart.js/auto';
import { concatMap, count, groupBy, mergeMap, of, zip } from 'rxjs';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent {

  public chart: any;
  postLabel = Array<string>();
  postData = Array<number>();
  cityLabel = Array<string>();
  cityData = Array<number>();
  statusPostLabel = Array<string>();
  statusPostData = Array<number>();
  userLabel = Array<string>();
  userData = Array<number>();
  statusUserLabel = Array<string>();
  statusUserData = Array<number>();

  constructor(
    private datePipe: DatePipe,
    public userService: UserService,
    private propertyService: PropertyService,
  ) { }

  ngOnInit() {

    
    this.userService.getUsers().subscribe(
      data => {
        
        var today = new Date();
        var startDay = new Date(new Date().setDate(today.getDate() - 30));

        for (var d = startDay; d <= today; d.setDate(d.getDate() + 1)) {
          this.userLabel.push(d.getDate() + '/' + (d.getMonth() + 1));
          var properties = data.filter(x => this.datePipe.transform(new Date(x.createdAt), 'yyyy-MM-dd') === this.datePipe.transform(d, 'yyyy-MM-dd'));
          this.userData.push(properties.length);
        }
        this.chart = new Chart('new-user', {
          type: 'line',
          data: {
            labels: this.userLabel,
            datasets: [
              {
                label: 'User',
                data: this.userData,
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
                text: 'User mới trong 30 ngày gần đây'
              }
            },
          },
        });
        
        of(data).pipe(
          concatMap(res => res),
          groupBy(item => item.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'),
          mergeMap(group =>
            zip(
              of(group.key), group.pipe(count())
            )
          ))
          .subscribe((grouped: any) => {
            this.statusUserLabel.push(grouped[0]);
            this.statusUserData.push(grouped[1]);
          });
        this.chart = new Chart('status-user', {
          type: 'pie',
          data: {
            labels: this.statusUserLabel,
            datasets: [
              {
                label: 'User',
                data: this.statusUserData,
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
                text: 'User theo trạng thái'
              }
            }
          },
        });
      }
    );

    this.propertyService.getAllProperties().subscribe(
      data => {

        var today = new Date();
        var startDay = new Date(new Date().setDate(today.getDate() - 30));

        for (var d = startDay; d <= today; d.setDate(d.getDate() + 1)) {
          this.postLabel.push(d.getDate() + '/' + (d.getMonth() + 1));
          var properties = data.filter(x => this.datePipe.transform(new Date(x.createdAt), 'yyyy-MM-dd') === this.datePipe.transform(d, 'yyyy-MM-dd'));
          this.postData.push(properties.length);
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
                text: 'Bài đăng trong 30 ngày gần đây'
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
                text: 'Bài đăng theo thành phố'
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
            this.statusPostLabel.push(grouped[0]);
            this.statusPostData.push(grouped[1]);
          });
        this.chart = new Chart('status-post', {
          type: 'pie',
          data: {
            labels: this.statusPostLabel,
            datasets: [
              {
                label: 'Bài đăng',
                data: this.statusPostData,
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
                text: 'Bài đăng theo trạng thái'
              }
            }
          },
        });
      }
    );
  }
}