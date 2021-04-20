import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { Observable,ReplaySubject } from 'rxjs';
import { AppUnitsGetDto } from '../models/app-units-get-dto';
import { AppProductsGetDto } from '../models/app-products-get-dto';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    basePath: string;
    accionPath: string;
    controller: string;

    allProducts$ = new ReplaySubject<any>();
    product$ = new ReplaySubject<AppProductsGetDto>();

    constructor(private http: HttpClient, private gensvc: GeneralService) {
        this.basePath = gensvc.basePath;
    }

    // ------ Modulo de productos---------- //

    GetAllAppProducts(data): void{

        this.controller = 'AppProducts/';
        this.accionPath = "GetAllAppProducts";
    
        this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data))
            .subscribe(result =>{
               this.allProducts$.next(result);
          });
      }


      InsertProduct(data):Observable<any> {

        this.controller = 'AppProducts/';
        this.accionPath = "InsertAppProducts";
    
        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
      
      }

      UpdateProduct(data) : Observable<any> {

        this.controller = 'AppProducts/';
        this.accionPath = "UpdateAppProducts";
    
        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    
      }
     
      DeleteProduct(data):Observable<any>{

        this.controller = 'AppProducts/';
        this.accionPath = "DeleteProduct";
    
        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    
      } 


      SubCategoryGetAll(data){

        this.controller = 'AppSubCategory/';
        this.accionPath = "GetAll";
    
        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    

      } 





    //----------------------------------------//


    GetAllAppVariableSearch(data): Observable<any> {

        this.controller = 'AppVariableSearch/';

        this.accionPath = "GetAllAppVariableSearch";

        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    }

    GetAllProductusByCriteria(data): Observable<any> {

        this.controller = 'AppProducts/';

        this.accionPath = "GetAllAppProductsByVariable";

        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    }

    //------ CALCULO DE PRECIO PRODUCTO --------//
    
    GetTemplateConversionUnit(data): Observable<any> {

        this.controller = 'AppTemplateConversionUnit/';

        this.accionPath = "GetTemplateConversionUnit";

        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    }

    //api/AppDetailQuotesConversionUnit/CreateAppDetailQuotesConversionUnit
    //REEMPLAZADO AL IMPLEMENTAR CALCULO DE PRECIOS SIN CREAR DETALLE
    CreateAppDetailQuotesConversionUnit(data): Observable<any> {

        this.controller = 'AppDetailQuotesConversionUnit/';

        this.accionPath = "CreateAppDetailQuotesConversionUnit";

        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    }

    //Llamada para subir IMAGEN y actualizar maestro de productos.
    UpdateProductImage(data): Observable<any> {

        this.controller = 'CobAdjuntosCobranza/';
        this.accionPath = "UpdateImageAppProduct";

        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();

    }

    //Llamado desde la calculadora para calcular precio lista
    ConversionUnitGeneric(data): Observable<any> {

        this.controller = 'AppDetailQuotesConversionUnit/';

        this.accionPath = "ConversionUnitGeneric";

        return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe();
    }

}
