import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { DataViewerComponent } from './data-viewer/data-viewer.component';
import { BasicChartsComponent } from './basic-charts/basic-charts.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import {HighchartsChartModule} from 'highcharts-angular';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { GroupedCategoriesChartComponent } from './charts/grouped-categories-chart/grouped-categories-chart.component';
import { GroupedCategoriesComponent } from './grouped-categories/grouped-categories.component';
import { YesNoTranslatePipe } from './yes-no-translate.pipe';
import { ColumnAdderComponent } from './data-viewer/column-adder/column-adder.component';
import { WorkTableComponent } from './data-viewer/work-table/work-table.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FormsModule} from '@angular/forms';
import { CalculationComponent } from './calculation/calculation.component';
import { ContinuousBarChartComponent } from './charts/continuous-bar-chart/continuous-bar-chart.component';
import { NormConfigComponent } from './data-viewer/norm-config/norm-config.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { MultiBarChartComponent } from './charts/multi-bar-chart/multi-bar-chart.component';
import { CategoriesBarChartComponent } from './charts/categories-bar-chart/categories-bar-chart.component';
import { StackedPercentageChartComponent } from './charts/stacked-percentage-chart/stacked-percentage-chart.component';

export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http);
}

@NgModule({
   declarations: [
      AppComponent,
      FileLoaderComponent,
      DataViewerComponent,
      BasicChartsComponent,
      PieChartComponent,
      BarChartComponent,
      GroupedCategoriesChartComponent,
      GroupedCategoriesComponent,
      YesNoTranslatePipe,
      ColumnAdderComponent,
      WorkTableComponent,
      CalculationComponent,
      ContinuousBarChartComponent,
      NormConfigComponent,
      LineChartComponent,
      MultiBarChartComponent,
      CategoriesBarChartComponent,
      StackedPercentageChartComponent,
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
      FormsModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
