import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { AppVariableSearchQueryFilter } from 'src/app/interfaces/app-variable-search-query-filter';
import { AppVariableSearchCompareQueryFilter } from 'src/app/interfaces/app-variable-search-compare-queryfilter';
import { ProductoService } from '../../../../services/producto.service';
import { AppVariableSearchGetDto } from '../../../../models/app-variable-search-get-dto';
import { AppProductsGetDto } from '../../../../models/app-products-get-dto';

@Component({
    selector: 'app-buscador-productos',
    templateUrl: './buscador-productos.page.html',
    styleUrls: ['./buscador-productos.page.scss'],
})
export class BuscadorProductosPage implements OnInit {

    variablesSeleccionadasArray: any

    private qryFilter = new AppVariableSearchQueryFilter();

    public listaVariables: AppVariableSearchGetDto[] = []

    public listaProductos: AppProductsGetDto[];

    public arrayVariables: any[] = [];

    constructor(private modalCtrl: ModalController, private productoService: ProductoService) {
    }

    ngOnInit() {
        this.qryFilter.appSubCategoryId = 1;

        //Solicito unidades al servicio
        this.productoService.GetAllAppVariableSearch(this.qryFilter).subscribe(res => {

            this.listaVariables = res.data

            this.arrayVariables = []

            this.listaVariables.forEach((o, index) => {

                let _variable: AppVariableSearchGetDto = o

                let objeto = { id: index, objeto: o, marcado: false }

                this.arrayVariables.push(objeto)
            })


        })
    }

    //------ Para manejo de la lista de variables seleccionadas
    marcado() {

        return { "background-color": "green", "color": "white", "padding": "10px" }

    }

    desmarcado(): any {

        return { "background-color": "white", "color": "black", "padding": "10px" }

    }

    onSelectListItem(ndx, variable: AppVariableSearchGetDto) {

        //el item seleccionado lo monto en un objeto

        let objeto = { id: ndx, objeto: variable }

        if (this.arrayVariables[ndx].marcado == true) {

            //Lo desmarco
            this.arrayVariables[ndx].marcado = false

        } else {

            //Lo marco
            this.arrayVariables[ndx].marcado = true

        }

        this.buscarProductos()

    }

    buscarProductos() {

        this.listaProductos = []

        //filtro variables seleccionadas
        const result = this.arrayVariables.filter(item => {
            return item.marcado == true;
        })


        //armo un arreglo con el que voy a llamar a la API para buscar productos
        let requestArray: any[] = []

        result.forEach(item => {
            requestArray.push({
                AppVariableId: item.objeto.appVariableId,
                SearchText: item.objeto.searchText
            })
        })

        //Hago peticion a la api  para q me entregue la lista de productos resultante 
        //asociados a los criterios indicados
        this.productoService.GetAllProductusByCriteria(requestArray).subscribe(res => {

            if (res.data.length > 0) {
                this.listaProductos = res.data
            }
            else {
                this.listaProductos = []
            }

        })


    }

    //al seleccionar producto...
    onSelect(producto: AppProductsGetDto) {
        console.log("Al seleccionar producto", producto);
        this.modalCtrl.dismiss({
            id: producto.id,
            descripcion: producto.description1,
            link: producto.link,
            idUnidadMedida: producto.productionUnitId,
            isValid: true,
            decripcionProductionUnit: producto.productionUnitGetDto.description1,
            code: producto.code,
            requiereDatosEntrada: producto.requiereDatosEntrada,
        });
    }

    goDetalle() {
        //this.router.navigate(['/edit-detalle-cotizacion'], {})
    }

    closeModal() {
        this.modalCtrl.dismiss({
            isValid: false
        })
    }

}
