import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemplateConversionUnitEditPage } from './template-conversion-unit-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TemplateConversionUnitEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateConversionUnitEditPageRoutingModule {}
