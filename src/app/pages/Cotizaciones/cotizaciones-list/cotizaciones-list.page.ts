import { Component, OnInit } from '@angular/core';
import { IonInfiniteScroll, Platform, ActionSheetController, IonItemSliding, ToastController, LoadingController, ModalController, NavController, AlertController } from '@ionic/angular';

import { CotizacionesListService } from '../../../services/cotizaciones/cotizaciones-list.service';
// import { cotizacionesListDto } from '../../../models/cotizaciones-list-dto';
import { Router } from '@angular/router';
import { AppGeneralQuotesQueryFilter } from 'src/app/interfaces/App-General-Quotes-Query-Filter';
import { AppGeneralQuotesGetDto } from 'src/app/models/app-general-quotes-get-dto';
import { CondicionPagoQueryFilter } from 'src/app/interfaces/condicion-pago-query-filter';
import { IUsuario } from 'src/app/interfaces/iusuario';
import { GeneralService } from 'src/app/services/general.service';

import { Observable } from 'rxjs';
import { AppStatusQuoteGetDto } from 'src/app/models/app-status-quote-get-dto';
import { AppGeneralQuotesChangeStatusDto } from 'src/app/models/app-general-quotes-change-status-dto'
import { AppGeneralQuotesActionSheetDto } from 'src/app/models/app-general-quotes-action-sheet-dto';
import { TasaPreferencialQueryFilter } from '../../../interfaces/tasa-preferencial-query-filter';
import { getLocaleDateTimeFormat } from '@angular/common';
import { TasaPreferencialService } from '../../../services/tasa-preferencial.service';
import { TPaTasaReferencialGetDto } from '../../../models/t-pa-tasa-referencial-get-dto';

@Component({
    selector: 'app-cotizaciones-list',
    templateUrl: './cotizaciones-list.page.html',
    styleUrls: ['./cotizaciones-list.page.scss'],
})
export class CotizacionesListPage implements OnInit {

    //observable
    //cotizacion$: Observable<AppGeneralQuotesGetDto>;
    cotizacion$: Observable<any>;

    tasaPreferencialQueryFilter: TasaPreferencialQueryFilter;
    tPaTasaReferencialGetDto: TPaTasaReferencialGetDto;

    appGeneralQuotesQueryFilter: AppGeneralQuotesQueryFilter;
    appGeneralQuotesGetDtoArray: AppGeneralQuotesGetDto[] = [];
    condicionPagoQueryFilter: CondicionPagoQueryFilter;
    appStatusQuoteGetDto: AppStatusQuoteGetDto;
    appGeneralQuotesChangeStatusDto: AppGeneralQuotesChangeStatusDto = new AppGeneralQuotesChangeStatusDto();
    appGeneralQuotesActionSheetDto: AppGeneralQuotesActionSheetDto;
    cotizacion: AppGeneralQuotesGetDto;

    searchText: string = "";
    usuario: IUsuario;
    pageSize = 5;
    page = 0;
    botones = [];
    public _cargando: boolean = false;
    constructor(
        private router: Router,
        private actionSheetCtrl: ActionSheetController,
        private navctrl: NavController,
        private gs: GeneralService,
        private CotizacionesService: CotizacionesListService,
        private tasaPreferencialService: TasaPreferencialService,
        public alertController: AlertController,
    ) { }

    ngOnInit() {

        this.CotizacionesService.allCotizaciones$.subscribe(allData => {
            this.appGeneralQuotesGetDtoArray = allData;

            console.log(allData)
        });


        this.refresh();

    }

    refresh(filtro: any = "?") {
        this._cargando = true;
        this.cotizacion$ = this.CotizacionesService.getCotizacion$();
        this.cotizacion$.subscribe(cotizacion => this.cotizacion = cotizacion);

        if (filtro == "?") {
            filtro = this.searchText
        }

        this.usuario = this.gs.GetUsuario();

        this.appGeneralQuotesQueryFilter = {
            pageSize: this.pageSize,
            pageNumber: this.page,
            usuarioConectado: this.usuario.user,
            cotizacion: "",
            searchText: filtro  //this.searchText
        };

        this.CotizacionesService.GetAllGeneralCotizacion(this.appGeneralQuotesQueryFilter)
            .subscribe(listCotizacionesResult => {
                this.CotizacionesService.allCotizaciones$.next(listCotizacionesResult.data);
                this._cargando = false;
                //event.target.complete();
            });



    }

    // Añadir o Agregar cotizacion
    onClickAdd() {
        this.router.navigate(['/menu/cotizacion-edit'], { state: { operacion: 0 } });
    }

    // actualizar cotizacion llamando a cotizacion-edit
    actualizarCotizacion(cotizacion: AppGeneralQuotesGetDto) {
        this.CotizacionesService.cotizacion$.next(cotizacion);
        this.router.navigate(['/menu/cotizacion-edit'], { state: { flag: true } })
    }

    GanarPerderCotiza(cotizacion) {
        this.CotizacionesService.cotizacion$.next(cotizacion);
        this.router.navigate(['/cotizacion-ganar-perder'], { state: { cotizacion } })
    }

    eliminarCotiza(cotizacion) {
        this.CotizacionesService.cotizacion$.next(cotizacion);
        this.router.navigate(['/cotizacion-delete'], { state: { cotizacion } })
    }

    postergarCotiza(cotizacion) {
        this.CotizacionesService.cotizacion$.next(cotizacion);
        this.router.navigate(['/cotizacion-postergar'], { state: {} })
        //this.router.navigate(['/cotizacion-postergar'], { state: { cotizacion } })
    }

    imprimirCotiza(cotizacion) {
        this.CotizacionesService.cotizacion$.next(cotizacion);
        this.router.navigate(['/menu/imprimir-cotizacion'], { state: {} })
        //this.router.navigate(['/cotizacion-postergar'], { state: { cotizacion } })
    }


    async enviarAlCliente(cotizacion: AppGeneralQuotesGetDto) {
        const alert = await this.alertController.create({
            message: 'Enviar al cliente',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Si',
                    handler: () => {
                        this.appGeneralQuotesChangeStatusDto.id = cotizacion.id
                        this.CotizacionesService.EnviarAlCliente(this.appGeneralQuotesChangeStatusDto).subscribe(result => {

                            if (result.meta.isValid === true) {
                                this.refresh(event);
                                this.gs.presentToast(result.meta.message, 'success')
                            } else {
                                this.gs.presentToast(result.meta.message, 'danger')
                            }

                        });
                    }
                }
            ]
        })

        await alert.present()
    }
    async enviarAprobacionPrecio(cotizacion: AppGeneralQuotesGetDto) {
        const alert = await this.alertController.create({
            message: 'Enviar Aprobacion Precio',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Si',
                    handler: () => {
                        console.log("envial aprobacion precios>>>", cotizacion);
                    }
                }
            ]
        })

        await alert.present()
    }
    //TODO este metodo no va
    goDetalleCotiza(cotizacion) {
        this.CotizacionesService.cotizacion$.next(cotizacion);
        this.router.navigate(['/list-detalle-cotizacion'], { state: { cotizacion } })
    }

    //buscar cotizaciones (filtrar)
    onChangeSearchText(event) {

        this.refresh(event.target.value)

    }

    public async presentActionSheet(item: AppGeneralQuotesGetDto) {

        this.appStatusQuoteGetDto = item.appStatusQuoteGetDto;

        let numeroItemsCotizacion = item.appDetailQuotesGetDto.length;

        let opcionesMenu = []

        this.appGeneralQuotesActionSheetDto = item.appGeneralQuotesActionSheetDto;

        const dict = {
            'actualizar': {
                text: ' Actualizar',
                icon: 'create-outline',
                handler: () => {
                    this.actualizarCotizacion(item);
                }
            },
            'enviarAprobacionPrecio': {
                text: ' Enviar Aprobacion Precio',
                icon: 'send',
                handler: () => {
                    this.enviarAprobacionPrecio(item);
                }
            },
            'enviarAlCliente': {
                text: ' Enviar al Cliente',
                icon: 'send',
                handler: () => {
                    this.enviarAlCliente(item);
                }
            },
            'ganarPerder': {
                text: ' Ganar-Perder',
                icon: 'git-compare',
                handler: () => {
                    this.GanarPerderCotiza(item);
                }
            },
            'postergar': {
                text: ' Postergar',
                icon: 'send-outline',
                handler: () => {
                    this.postergarCotiza(item);
                }
            },
            'imprimir': {
                text: 'Imprimir',
                icon: 'print-outline',
                handler: () => {
                    this.imprimirCotiza(item);
                }
            },
            'eliminar': {
                text: ' Eliminar',
                icon: 'trash',
                handler: () => {
                    this.eliminarCotiza(item);
                }
            },
            'cancel': {
                text: 'Cancel',
                role: 'cancel'
            }
        }


        //Condicionales para el menu del ActionSheet//

        //Si no puede actualizar
        if (!this.appGeneralQuotesActionSheetDto.actualizar) {
            delete dict['actualizar']
        }

        //Si no puede enviar al cliente
        if (!this.appGeneralQuotesActionSheetDto.enviarAlCliente) {
            delete dict['enviarAlCliente']
        }
        //Si no puede enviar Aprobacion Precio
        if (!this.appGeneralQuotesActionSheetDto.enviarAprobacionPrecio) {
            delete dict['enviarAprobacionPrecio']
        }
        //Si no puede ganar-perder
        if (!this.appGeneralQuotesActionSheetDto.ganarPerder) {
            delete dict['ganarPerder']
        }

        //Si no puede postergar
        if (!this.appGeneralQuotesActionSheetDto.postergar) {
            delete dict['postergar']
        }

        //Si no puede eliminar
        if (!this.appGeneralQuotesActionSheetDto.eliminar) {
            delete dict['eliminar']
        }

        //Si no puede cancel
        if (!this.appGeneralQuotesActionSheetDto.cancel) {
            delete dict['cancel']
        }

        //Si no puede imprimir
        if (!this.appGeneralQuotesActionSheetDto.imprimir) {
            delete dict['imprimir']
        }

        //

        //opcionesMenu = opciones del actionsheet

        console.log("DICT VALE:", dict)

        for (var key in dict) {

            var value = dict[key];

            opcionesMenu.push(value)
        }

        //Presento el ActionSheet Menu solo con las opciones permitidas

        let actionSheet = this.actionSheetCtrl.create({
            header: 'Acciones',
            buttons: opcionesMenu
        });

        (await actionSheet).present()

    }
}