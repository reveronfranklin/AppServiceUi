import { Component, OnInit } from '@angular/core';
import { AppGeneralQuotesGetDto } from '../../../models/app-general-quotes-get-dto';
import { Router } from '@angular/router';
import { GeneralService } from '../../../services/general.service';
import { CotizacionesListService } from '../../../services/cotizaciones/cotizaciones-list.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-imprimir-cotizacion',
  templateUrl: './imprimir-cotizacion.page.html',
  styleUrls: ['./imprimir-cotizacion.page.scss'],
})
export class ImprimirCotizacionPage implements OnInit {
  public cotizacion: AppGeneralQuotesGetDto

  titulo: string;
  link: string;
  form: FormGroup;
  constructor(private router: Router,
    private generalService: GeneralService,
    private cotizacionesListService: CotizacionesListService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.buildForm();
    //subscripcion al observable de cotizaciones
    this.cotizacionesListService.cotizacion$.subscribe(resp => {
      this.cotizacion = resp
      this.titulo = "Imprimir Cotizacion "
      this.link = 'https://mooreapps.com.ve/AppServiceBack/api/AppReport/GetCotizacion/' + this.cotizacion.cotizacion + '/true/true/true/true/true';
      console.log(this.cotizacion)

    })

  }
  buildForm() {

    this.form = this.formBuilder.group({

      flagTotal: [true, [Validators.required]],
      flagFormasCaja: [true, [Validators.required]],
      flagIva: [true, [Validators.required]],
      observaciones: [true, [Validators.required]],
      imprimirUsd: [true, [Validators.required]],
    })


  }


  imprimirUsdChanged(event) {
    this.form.get('imprimirUsd').setValue(event);
    if (event) {
      this.form.get('flagIva').setValue(false);
    }
    this.armaLink();
  }

  imprimirIvaChanged(event) {
    this.form.get('flagIva').setValue(event);
    this.armaLink();
  }
  openLink() {
    if (this.form.get('imprimirUsd')) {
      this.form.get('flagIva').setValue(false);
    }

    this.link = 'https://mooreapps.com.ve/AppServiceBack/api/AppReport/GetCotizacion/' +
      this.cotizacion.cotizacion + '/' + this.form.get('flagIva').value + '/' + this.form.get('flagIva').value + '/' + this.form.get('flagIva').value + '/' + this.form.get('observaciones').value + '/' + this.form.get('imprimirUsd').value;
    window.open(this.link, '_blank');
  }
  armaLink() {

    this.link = 'https://mooreapps.com.ve/AppServiceBack/api/AppReport/GetCotizacion/' +
      this.cotizacion.cotizacion + '/' + this.form.get('flagIva').value + '/' + this.form.get('flagIva').value + '/' + this.form.get('flagIva').value + '/' + this.form.get('observaciones').value + '/' + this.form.get('imprimirUsd').value;
  }
}