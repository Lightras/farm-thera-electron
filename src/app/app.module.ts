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

@NgModule({
   declarations: [
      AppComponent,
      FileLoaderComponent,
      DataViewerComponent,
      BasicChartsComponent,
      PieChartComponent,
      BarChartComponent,
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
