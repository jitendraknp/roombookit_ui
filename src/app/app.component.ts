import {NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgHttpLoaderComponent} from 'ng-http-loader';
import {ToastrModule} from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import {FooterComponent} from './shared/footer/footer/footer.component';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgHttpLoaderComponent,
    ToastrModule,
    NgOptimizedImage,
    NgxPaginationModule,
    FooterComponent,
    ToastModule
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Book Room';
}
