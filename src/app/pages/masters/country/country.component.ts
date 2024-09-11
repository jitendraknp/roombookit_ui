import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonCardComponent } from '../../../shared/common-card/common-card.component';
import { Country } from '../../../models/countries';
import { CardListComponent } from "../../../shared/card-list/card-list.component";
import { CommonService } from '../../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NoRecordsFoundComponent } from '../../no-records-found/no-records-found.component';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CardDetails } from '../../../models/card_details';
import { Observable } from 'rxjs';
import { SharedDataService } from '../../../_services/shared-data.service';
import { IonicModule } from '@ionic/angular';

@Component( {
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonCardComponent,
    CardListComponent,
    NoRecordsFoundComponent,
    RouterOutlet,
    IonicModule,
    RouterModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
  providers: [SharedDataService]
} )
export class CountryComponent implements OnInit, OnChanges {
  @Input() isRecordUpdated!: Observable<boolean>;
  @Input() countryList!: Country[];
  onActiveClicked ( $event: CardDetails ): void {
  }
  constructor(
    private commonServices: CommonService,
    private toastService: ToastrService,
    private cdr: ChangeDetectorRef,
    private sharedDataService: SharedDataService
  ) { }
  ngOnChanges ( changes: SimpleChanges ): void {
    this.commonServices.getCountries().subscribe( {
      next: ( data ) => {
        this.countries = data.Data;
        this.isRecordUpdated?.subscribe( data => {
          console.log( data );
          return true;
        } );
        this.cdr.detectChanges();
      },
      error: ( error ) => {
        this.toastService.error( 'Error fetching countries', 'Error' );
        console.error( 'Error getting countries', error );
      }
    } );
  }
  countries: Country[] = [];
  ngOnInit (): void {
    this.sharedDataService.currentData.subscribe( data => this.countries = data );
    this.commonServices.getCountries().subscribe( {
      next: ( data ) => {
        this.countries = data.Data;
        this.sharedDataService.changeData( this.countries );
        this.isRecordUpdated?.subscribe( data => {
          return true;
        } );
        this.cdr.detectChanges();
      },
      error: ( error ) => {
        this.toastService.error( 'Error fetching countries', 'Error' );
        console.error( 'Error getting countries', error );
      }
    } );
  }
}
