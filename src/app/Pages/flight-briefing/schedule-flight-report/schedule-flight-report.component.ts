import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-schedule-flight-report',
  templateUrl: './schedule-flight-report.component.html',
  styleUrls: ['./../flight-briefing.page.scss'],
})
export class ScheduleFlightReportComponent  implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Flight','departure', 
  'destination','etd','vfr','edit'];

  isLogged: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  ngOnInit() {}

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  NavigateToFlightBriefing() {
    this.router.navigate(['/flight-briefing']);
  }

}
