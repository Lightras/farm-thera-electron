import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FileLoaderComponent} from './file-loader/file-loader.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PieChartComponent} from './charts/pie-chart/pie-chart.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {YesNoTranslatePipe} from './yes-no-translate.pipe';
import {ColumnAdderComponent} from './data-view-markup/column-adder/column-adder.component';
import {WorkTableComponent} from './calc-analysis/work-table/work-table.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FormsModule} from '@angular/forms';
import {NormConfigComponent} from './calc-analysis/norm-config/norm-config.component';
import {LineChartComponent} from './charts/line-chart/line-chart.component';
import {StackedPercentageChartComponent} from './charts/stacked-percentage-chart/stacked-percentage-chart.component';
import {RouterModule, Routes} from '@angular/router';
import {CalcAnalysisComponent} from './calc-analysis/calc-analysis.component';
import {PreviewComponent} from './file-loader/preview/preview.component';
import {DataService} from './services/data.service';
import {DataViewMarkupComponent} from './data-view-markup/data-view-markup.component';
import {NormDayPipe} from './shared/norm-day.pipe';
import {ChartForemotherComponent} from './charts/chart-foremother/chart-foremother.component';
import {SimpleAnalysisComponent} from './calc-analysis/simple-analysis/simple-analysis.component';
import {BarChartComponent} from './charts/bar-chart/bar-chart.component';
import {SimpleAnalysisNormComponent} from './calc-analysis/simple-analysis-norm/simple-analysis-norm.component';
import {AbAnalysisComponent} from './calc-analysis/ab-analysis/ab-analysis.component';
import {ContinuousBarChartComponent} from './charts/continuous-bar-chart/continuous-bar-chart-component.component';
import {AbdbAnalysisComponent} from './calc-analysis/abdb-analysis/abdb-analysis.component';
import { SeSpConfigComponent } from './calc-analysis/abdb-analysis/se-sp-config/se-sp-config.component';

export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http);
}

const routes: Routes = [
   {
      path: 'load-file',
      component: FileLoaderComponent
   },
   {
      path: 'view-and-markup',
      component: DataViewMarkupComponent
   },
   {
      path: 'calc-and-analysis',
      component: CalcAnalysisComponent
   },
   {
      path: '',
      redirectTo: 'load-file',
      pathMatch: 'full'
   }
];

@NgModule({
   declarations: [
      AppComponent,
      FileLoaderComponent,
      PieChartComponent,
      YesNoTranslatePipe,
      ColumnAdderComponent,
      WorkTableComponent,
      NormConfigComponent,
      LineChartComponent,
      StackedPercentageChartComponent,
      CalcAnalysisComponent,
      PreviewComponent,
      DataViewMarkupComponent,
      NormDayPipe,
      ChartForemotherComponent,
      SimpleAnalysisComponent,
      BarChartComponent,
      SimpleAnalysisNormComponent,
      AbAnalysisComponent,
      ContinuousBarChartComponent,
      AbdbAnalysisComponent,
      SeSpConfigComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      HighchartsChartModule,
      TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
         }
      }),
      FormsModule,
      RouterModule.forRoot(routes)
   ],
   providers: [
      DataService
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
