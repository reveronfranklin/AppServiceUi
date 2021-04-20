import { AppUnitsGetDto } from './app-units-get-dto';
import { AppSubcategoryGetDto } from './app-subcategory-get-dto';

export class AppProductsGetDto {

    id: number;
    code: string;
    description1: string;
    description2: string;
    appUnitsId: number;
    productionUnitId: number;
    unitPrice: number;
    urlImage: string;
    externalCode: string;
    appUnitsGetDto: AppUnitsGetDto;
    productionUnitGetDto: AppUnitsGetDto;
    prymaryMtrMonedaId: number;
    secundaryMtrMonedaId: number;
    appSubCategoryId: number;
    link: string;
    appSubCategoryGetDto: AppSubcategoryGetDto;
    quantityPerPackage: number;
    requiereDatosEntrada: boolean;
    /*creo mas bien falta agregar la unidad de produccion*/

}