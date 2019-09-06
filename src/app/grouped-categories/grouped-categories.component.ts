import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-grouped-categories',
   templateUrl: './grouped-categories.component.html',
   styleUrls: ['./grouped-categories.component.sass']
})
export class GroupedCategoriesComponent implements OnInit {

   categories1 = [
      {
         name: 'Стать',
         categories: ['Чоловіча', 'Жіноча']
      },
      {
         name: 'Вік',
         categories: ['<1 року', '1-2 роки', '2-3 роки', '>3 років']
      },
      {
         name: 'Вага',
         categories: ['<10 кг', '>10 кг']
      },
      {
         name: 'Зріст',
         categories: ['<75 см', '>75 см']
      },
      {
         name: 'Блювота',
         categories: ['Так', 'Ні']
      },
      {
         name: 'Випорожнення(с/к)',
         categories: ['Так/Так', 'Так/Ні', 'Ні/Так', 'Ні/Ні']
      },
      {
         name: 't',
         categories: ['Понижена', 'Нормальна', 'Підвищена']
      },
      {
         name: 'Зневоднення',
         categories: ['Так', 'Ні']
      },
      {
         name: 'Ротавірус',
         categories: ['Так', 'Ні']
      }
   ];

   categories2 = [
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


   categories3 = [
      {
         name: 'Термін госпіталізації (вибірка №1)',
         categories: [
            {
               name: '<7 днів'
            },
            {
               name: '7-12 днів'
            },
            {
               name: '13-18 днів'
            },
            {
               name: '19-24 днів'
            },
            {
               name: '>24 днів'
            },
         ]
      },
      {
         name: 'Термін госпіталізації (вибірка №2)',
         categories: [
            {
               name: '<7 днів'
            },
            {
               name: '7-12 днів'
            },
            {
               name: '13-18 днів'
            },
            {
               name: '19-24 днів'
            },
            {
               name: '>24 днів'
            },
         ]
      },
   ];

   data1 = [568, 396, 495, 310, 96, 63, 705, 259, 574, 390, 687, 277, 36, 254, 9, 664, 5, 614, 345, 757, 207, 459, 505];
   data2 = [558, 395, 508, 340, 80, 55, 742, 241, 570, 413, 716, 267, 2, 591, 388, 789, 194, 519, 464];
   data3 = [878, 67, 13, 4, 2, 892, 78, 10, 1, 2];

   constructor() { }

   ngOnInit() {
   }
}
