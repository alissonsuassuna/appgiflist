import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../pages/settings/settings';
import { Reddit } from '../providers/reddit';
import { Data } from '../providers/data';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, Data, Reddit]
})
export class AppModule {}

/*
Observe que também temos um provedor de armazenamento, bem como o provedor de 
dados que criamos. Armazenamento "é
Fornecido pelo Ionic e nos permite salvar e recuperar dados - nós estaremos 
fazendo uso disto mais tarde.

 */
