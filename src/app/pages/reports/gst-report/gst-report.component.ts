import {Component} from '@angular/core';
import {CardModule} from 'primeng/card';
import {MonthYearDropdownComponent} from "../../../shared/month-year-dropdown/month-year-dropdown.component";
import {GstReportService} from "../../../_services/gst-report.service";
import {ToastrService} from "ngx-toastr";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-gst-report',
  standalone: true,
  imports: [
    CardModule,
    MonthYearDropdownComponent
  ],
  templateUrl: './gst-report.component.html',
  styleUrl: './gst-report.component.css'
})
export class GstReportComponent {
  parentSelectedMonth: number = new Date().getMonth();
  parentSelectedYear: number = 2024;
  months = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Apr', value: 3 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 5 },
    { label: 'Jul', value: 6},
    { label: 'Aug', value: 7 },
    { label: 'Sep', value: 8 },
    { label: 'Oct', value: 9 },
    { label: 'Nov', value: 10 },
    { label: 'Dec', value: 11 },
  ];
  constructor(private gstReportService: GstReportService,
              private toastrService: ToastrService) {
  }
  handleButtonClick() {
    this.gstReportService.getGstReport(this.parentSelectedMonth, this.parentSelectedYear).subscribe({
      next: (result: Blob) => {
        saveAs(result, `${this.months[this.parentSelectedMonth].label} G.S.T BILLS.pdf`);
      },
      error: (error) => {
        this.toastrService.error("An error occurred while retrieving GST Report", "error");
      },
      complete: () => {

      }
    })
  }

  monthChange($event: number) {
    this.parentSelectedMonth = $event;
  }

  onYearSelect($event: number) {
    this.parentSelectedYear = $event;
  }
}
