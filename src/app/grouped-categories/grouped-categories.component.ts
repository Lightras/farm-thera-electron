import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-grouped-categories',
   templateUrl: './grouped-categories.component.html',
   styleUrls: ['./grouped-categories.component.sass']
})
export class GroupedCategoriesComponent implements OnInit {
   categories1: [
      {
         name: 'Стать',
         categories: [
            {
               name: 'Чоловіча'
            },
            {
               name: 'Жіноча'
            }
         ]
      },
      {
         name: 'Вік',
         categories: [
            {
               name: '<1 року'
            },
            {
               name: '1-2 роки'
            },
            {
               name: '2-3 роки'
            },
            {
               name: '>3 років'
            }
         ]
      },
      {
         name: 'Вага',
         categories: [
            {
               name: '<10 кг'
            },
            {
               name: '>10 кг'
            }
         ]
      },
      {
         name: 'Зріст',
         categories: [
            {
               name: '<75 см'
            },
            {
               name: '>75 см'
            }
         ]
      },
      {
         name: 'Блювота',
         categories: [
            {
               name: 'Так'
            },
            {
               name: 'Ні'
            }
         ]
      },
      {
         name: 'Випорожнення(с/к)',
         categories: [
            {
               name: 'Так/Так'
            },
            {
               name: 'Так/Ні'
            },
            {
               name: 'Ні/Так'
            },
            {
               name: 'Ні/Ні'
            }
         ]
      },
      {
         name: 't',
         categories: [
            {
               name: 'Понижена'
            },
            {
               name: 'Нормальна'
            },
            {
               name: 'Підвищена'
            }
         ]
      },
      {
         name: 'Зневоднення',
         categories: [
            {
               name: 'Так'
            },
            {
               name: 'Ні'
            }
         ]
      },
      {
         name: 'Ротавірус',
         categories: [
            {
               name: 'Так'
            },
            {
               name: 'Ні'
            }
         ]
      }
   ];
   data1: any;

   constructor() { }

   ngOnInit() {
   }

}
