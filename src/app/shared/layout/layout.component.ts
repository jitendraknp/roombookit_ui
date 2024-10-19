import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { NgHttpLoaderComponent } from 'ng-http-loader';
import { CommonService } from '../../_services/common.service';
import { Menu } from '../../models/menu';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../_services/storage.service';
import { FooterComponent } from '../footer/footer/footer.component';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from "primeng/overlaypanel";
import { AuthService } from '../../authentication/services/auth.service';

@Component( {
  selector: 'app-layout',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    NgHttpLoaderComponent,
    CommonModule,
    RouterOutlet,
    RouterModule,
    FooterComponent,
    PanelMenuModule,
    BreadcrumbComponent,
    MenuModule,
    AvatarModule,
    OverlayPanelModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [ToastrService, CommonService],

} )
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  username: string = 'John Doe'; // Replace with your username
  userImage: string = 'assets/user.png'; // Path to your user image
  profile_items: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.goToProfile() },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.goToSettings() },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];
  items!: MenuItem[];
  menuDTO: Menu[] = [];
  toggleClass: string = "collapsed";
  token: string = "";
  hotelName: string = "";
  collapsed: any;
  isMenuCollapsed = false;

  constructor(
    private commonService: CommonService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private toastrService: ToastrService,
    private router: Router,
    private jwtHelperService: JwtHelperService,
    private storageService: StorageService,
    private authService: AuthService
  ) {
  }
  isCompressed = false;
  ngOnDestroy (): void {
    this.commonService.getMenus().subscribe().unsubscribe();
  }
  toggleSidebar1 () {
    this.isCompressed = !this.isCompressed;
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
    } else {
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
    let storedMenuData = this.storageService.getData( "USER_MENU" );
    if ( storedMenuData != undefined || storedMenuData != null ) {
      this.items = JSON.parse( storedMenuData ) as MenuItem[];
    } else {
      this.commonService.getMenus().subscribe( {
        next: ( menu ) => {
          this.items = menu.Data as MenuItem[];
          this.storageService.saveData( JSON.stringify( this.items ), "USER_MENU" );
        },
        error: ( error ) => {
          this.toastrService.error( error.message ).onHidden.subscribe( () => {
            this.router.navigate( ['login'] );
          } );
        }
      } );
    }
    this.token = this.storageService.getUser()?.Data.Token;
    this.hotelName = this.jwtHelperService.decodeToken( this.token )?.hotelName;
  }

  toggleCollapse () {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    if ( !this.isMenuCollapsed ) {
      this.toggleClass = 'collapse sidemenu';
    } else {
      this.toggleClass = 'show sidemenu';
    }
    const menu = this.elRef.nativeElement.querySelector( '.menu' );
    if ( menu ) {
      menu.classList.toggle( 'collapse' );
    }
  }

  goToProfile () {
    console.log( 'Navigating to Profile' );
  }

  goToSettings () {
    console.log( 'Navigating to Settings' );
  }

  logout () {
    this.authService.logoutUser().subscribe( ( resp ) => {
      if ( resp ) {
        this.storageService.clean();
        this.router.navigate( ['/login'] );
      }
    } );

  }
}
