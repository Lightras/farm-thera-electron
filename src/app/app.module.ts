import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { DataViewerComponent } from './data-viewer/data-viewer.component';
import { BasicChartsComponent } from './basic-charts/basic-charts.component';
import {HttpClientModule} from '@angular/common/http';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import {HighchartsChartModule} from 'highcharts-angular';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { GroupedCategoriesChartComponent } from './charts/grouped-categories-chart/grouped-categories-chart.component';
import { GroupedCategoriesComponent } from './grouped-categories/grouped-categories.component';
import { YesNoTranslatePipe } from './yes-no-translate.pipe';

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
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      HighchartsChartModule,
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
