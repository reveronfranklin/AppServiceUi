import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CotizacionesListService } from 'src/app/services/cotizaciones/cotizaciones-list.service';
import { AppGeneralQuotesGetDto } from '../../../models/app-general-quotes-get-dto';
import { AppDetailQuotesGetDto } from 'src/app/models/app-detail-quotes-get-dto';
import { ModalController } from '@ionic/angular';

import { CotizacionGanarPerderEditPage} from '../cotizacion-ganar-perder/cotizacion-ganar-perder-edit/cotizacion-ganar-perder-edit.page';
@Component({
  selector: 'app-cotizacion-ganar-perder',
  templateUrl: './cotizacion-ganar-perder.page.html',
  styleUrls: ['./cotizacion-ganar-perder.page.scss'],
})
export class CotizacionGanarPerderPage implements OnInit {

    public cotizacion: AppGeneralQuotesGetDto;
    public appDetailQuotesGetDto: AppDetailQuotesGetDto[] = [];

    constructor(private router: Router,
        private CotizacionesService: CotizacionesListService,
        private modalCtrl: ModalController,
    ) {}

    ngOnInit() {

        this.CotizacionesService.cotizacion$.subscribe(resp => {
            
            this.cotizacion = resp;        
            
            this.appDetailQuotesGetDto = this.cotizacion.appDetailQuotesGetDto; 

        });

    }
  
    async editItem(item: AppDetailQuotesGetDto) { 
        
        const modal = await this.modalCtrl.create({
            component: CotizacionGanarPerderEditPage,
            componentProps: {
                item: item
            }
        });

        await modal.present();
    }

    
}