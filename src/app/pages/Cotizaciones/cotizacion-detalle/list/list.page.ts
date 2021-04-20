import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonInfiniteScroll, Platform, ActionSheetController, IonItemSliding, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';

import { CotizacionesListService } from '../../../../services/cotizaciones/cotizaciones-list.service';

import { cotizacionesListDto } from '../../../../models/cotizaciones-list-dto';
import { AppGeneralQuotesGetDto } from '../../../../models/app-general-quotes-get-dto';

import { AppDetailQuotesGetDto } from '../../../../models/app-detail-quotes-get-dto';
import { AppDetailQuotesDeleteDto } from '../../../../models/app-detail-quotes-delete-dto';

import { EditPage } from '../edit/edit.page'
import { Observable } from 'rxjs';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

    listCotizaciones: cotizacionesListDto[] = [];
    cotizacion = new AppGeneralQuotesGetDto();

    detalleItem: AppDetailQuotesGetDto = new AppDetailQuotesGetDto();

    detalleItems: AppDetailQuotesGetDto[] = [];

    appDetailQuotesDeleteDto: AppDetailQuotesDeleteDto = new AppDetailQuotesDeleteDto();

    data: any;
    public showLoading: boolean = false;
    constructor(
        private ar: ActivatedRoute,
        private router: Router,
        private ac: AlertController,
        public gs: GeneralService,
        private navCtrl: NavController,
        private toastController: ToastController,
        public cotizacionesService: CotizacionesListService,
        private actionSheetCtrl: ActionSheetController,
    ) { }

    ngOnInit() {
    }


    ionViewDidEnter() {

        this.showLoading = true;
        this.cotizacionesService.cotizacion$.subscribe(dat => {

            console.log("entro en ionViewDidEnter de list.page.ts")
            console.log("cotizacion")
            console.log(dat)

            this.cotizacion = dat

            console.log("cotizacion******")
            console.log(this.cotizacion)

            console.log("Cotizacion Permite Adicionar detalle", this.cotizacion.permiteAdicionarDetalle)

            console.log("(el detalle de la cotizacion) cotizacion.appDetailQuotesGetDto")
            console.log(this.cotizacion.appDetailQuotesGetDto)
            if (!this.cotizacion.appDetailQuotesGetDto) {
                this.cotizacion.permiteAdicionarDetalle = true;
            }


            this.detalleItems = this.cotizacion.appDetailQuotesGetDto;
            this.showLoading = false;
        });



    }

    async openToast(message, color) {
        const toast = await this.toastController.create({
            message,
            duration: 5000,
            position: 'top',
            color

        });
        toast.present();
    }


    // AÃ±adir item a la cotizacion
    add() {

        //objeto item de detalle vacio
        let item: AppDetailQuotesGetDto = new AppDetailQuotesGetDto();

        //voy al formulario de edicion
        this.router.navigate(['edit-detalle-cotizacion'], { state: { cotizacion: this.cotizacion, item: item, operacion: 0 } })   //1 crear

    }


    // edita un item de la cotizacion
    edit(item: AppDetailQuotesGetDto) {
        console.log("LIST-EDIT(item: AppDetailQuotesGetDto):")
        console.log(item)

        //voy al formulario de edicion
        this.router.navigate(['edit-detalle-cotizacion'], { state: { item: item, operacion: 1 } })   //1 edit
    }

    //eliminar item
    async remove(item) {

        const alert = await this.ac.create({
            cssClass: 'my-custom-class',
            header: 'Eliminar producto',
            subHeader: '',
            message: 'Desea eliminar este producto?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Confirmar',
                    handler: () => {

                        this.appDetailQuotesDeleteDto.id = item.id;
                        this.appDetailQuotesDeleteDto.cotizacion = item.cotizacion;

                        this.cotizacionesService.DeleteDetalleCotizacion(this.appDetailQuotesDeleteDto)
                            .subscribe(result => {

                                console.log("al eliminar, la respuesta recibida es:")
                                console.log(result);

                                console.log("el mensaje es:")
                                console.log(result.meta.message);

                                console.log("data:")
                                console.log(result.data);

                                console.log("cotizacion")
                                this.cotizacion = result.data
                                console.log(this.cotizacion)

                                this.cotizacionesService.cotizacion$.next(this.cotizacion[0]);

                                if (result.meta.isValid === true) {
                                    this.openToast(result.meta.message, 'success');
                                } else {
                                    this.openToast(result.meta.message, 'danger');
                                }

                            });

                    }
                }
            ]
        });

        await alert.present();

    }


    //BACKTO general de cotizaciones
    goGeneral() {
        this.router.navigate(['/menu/cotizacion-edit'], { state: {} })
    }


    async presentActionSheet(item) {
        let actionSheet = this.actionSheetCtrl.create({
            header: 'Acciones...',
            buttons: [
                {
                    text: 'Actualizar',
                    icon: 'create-outline',
                    handler: () => {
                        this.edit(item);
                    }
                },
                {
                    text: 'Eliminar',
                    icon: 'trash',
                    handler: () => {
                        this.remove(item);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });

        (await actionSheet).present()
    }

}
