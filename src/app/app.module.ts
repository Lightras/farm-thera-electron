import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { DataViewerComponent } from './data-viewer/data-viewer.component';
import { BasicChartsComponent } from './basic-charts/basic-charts.component';

@NgModule({
  declarations: [
    AppComponent,
    FileLoaderComponent,
    DataViewerComponent,
    BasicChartsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
