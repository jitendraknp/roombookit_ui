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

  constructor( private config: PrimeNGConfig ) {

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
      modal: 1000,    // Default z-index for modals (e.g., dialogs)
      overlay: 1000,  // Default z-index for overlays (e.g., dropdowns, tooltips)
      menu: 1000,     // Default z-index for menus
      tooltip: 1000,  // Default z-index for tooltips
      toast: 1000,    // Default z-index for toasts
      panel: 1000,    // z-index for panels

    };
  }

}
