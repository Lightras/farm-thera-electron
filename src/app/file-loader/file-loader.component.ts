import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  constructor() { }

  file: any;

  ngOnInit() {
  }

  inputFile(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
  }
}
