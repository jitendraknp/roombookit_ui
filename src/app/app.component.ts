import { NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgHttpLoaderComponent } from 'ng-http-loader';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from './shared/footer/footer/footer.component';
import { ToastModule } from 'primeng/toast';
import { PrimeNGConfig } from "primeng/api";
import { Aura } from 'primeng/themes/aura';
import { Lara } from 'primeng/themes/lara';
import { Stepper } from 'primeng/stepper';
import { SignalRService } from './_services/common/signal-r.service';
@Component( {
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
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
} )
export class AppComponent {
  title = 'RD Residency';

  constructor( private config: PrimeNGConfig, private signalRService: SignalRService ) {

  }

  ngOnInit () {
    // this.config.csp.set( { nonce: '...' } );
    this.config.theme.set( {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: 'light',
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities'
        }
      }
    } );
    this.config.ripple.set( true );
    this.config.zIndex = {
      modal: 2000,    // Default z-index for modals (e.g., dialogs)
      overlay: 2000,  // Default z-index for overlays (e.g., dropdowns, tooltips)
      menu: 2000,     // Default z-index for menus
      tooltip: 2000,  // Default z-index for tooltips
      toast: 2000,    // Default z-index for toasts
      panel: 2000,    // z-index for panels

    };
  }

}
