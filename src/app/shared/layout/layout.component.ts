import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { CommonService } from '../../_services/common.service';
import { Menu } from '../../models/menu';
import { ToastrService } from 'ngx-toastr';
import { IonicModule } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../_services/storage.service';
import { FooterComponent } from '../footer/footer/footer.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
@Component( {
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgHttpLoaderModule,
    CommonModule,
    RouterOutlet,
    RouterModule,
    IonicModule,
    FooterComponent,
    NgbModule,
    NgbDropdownModule,
    PanelMenuModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [ToastrService, CommonService]
} )
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  items!: MenuItem[];
  menuDTO: Menu[] = [];
  toggleClass: string = "collapsed";
  token: string = "";
  hotelName: string = "";
  collapsed: any;
  constructor(
    private commonService: CommonService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private toastrService: ToastrService,
    private router: Router,
    private jwtHelperService: JwtHelperService,
    private storageService: StorageService
  ) {
  }
  ngOnDestroy (): void {
    this.commonService.getMenus().subscribe().unsubscribe();
  }
  ngAfterViewInit () {

    const sidebarCollapse = this.elRef.nativeElement.querySelector( '#sidebarCollapse' );
    const sidemenu = this.elRef.nativeElement.querySelector( '.sidemenu' );
    if ( sidebarCollapse ) {
      if ( sidemenu ) {
        sidemenu.classList.addClass( 'collapsed' );
        sidemenu.classList.removeClass( 'show' );
      }
      this.renderer.listen( sidebarCollapse, 'click', () => {
        this.toggleSidebar();
      } );
    }
    else {
      if ( sidemenu ) {
        sidemenu.classList.addClass( 'show' );
        sidemenu.classList.removeClass( 'collapsed' );
      }
    }

  }
  action () {

  }
  toggleSidebar (): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    const sidebar = this.elRef.nativeElement.querySelector( '#sidebar' );
    const content = this.elRef.nativeElement.querySelector( '#content' );
    const bodyOverlay = this.elRef.nativeElement.querySelector( '.body-overlay' );
    //#sidebar > ul > li.nav-item.dropdown > ul
    const menuContainer = this.elRef.nativeElement.querySelector( '#sidebar > ul > li.nav-item.dropdown > ul' );
    console.log( menuContainer );
    if ( this.isMenuCollapsed ) {
      this.renderer.addClass( sidebar, 'active' );
      this.renderer.addClass( content, 'active' );
      this.renderer.removeClass( menuContainer, 'show' );
      this.renderer.addClass( menuContainer, 'collapse' );
      // this.renderer.addClass(bodyOverlay, 'show-nav');
    } else {
      this.renderer.removeClass( sidebar, 'active' );
      this.renderer.removeClass( content, 'active' );
      // this.renderer.removeClass(bodyOverlay, 'show-nav');
    }
  }
  ngOnInit (): void {
    this.commonService.getMenus().subscribe( {
      next: ( menu ) => {
        console.log( menu.Data );
        this.items = menu.Data as MenuItem[];
        console.log( this.isMenuCollapsed );
      },
      error: ( error ) => {
        this.toastrService.error( error.message ).onHidden.subscribe( () => {
          this.router.navigate( ['login'] );
        } );
      }
    } );
    this.token = this.storageService.getUser()?.Data.Token;
    this.hotelName = this.jwtHelperService.decodeToken( this.token )?.hotelName;
  }
  isMenuCollapsed = false;

  toggleCollapse () {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    if ( !this.isMenuCollapsed ) {
      this.toggleClass = 'collapse sidemenu';
    }
    else {
      this.toggleClass = 'show sidemenu';
    }
    const menu = this.elRef.nativeElement.querySelector( '.menu' );
    if ( menu ) {
      menu.classList.toggle( 'collapse' );
    }
  }

}
