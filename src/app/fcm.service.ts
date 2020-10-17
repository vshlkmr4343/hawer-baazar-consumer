import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor( private toast:ToastController,
    private http: HttpClient,
    private oneSignal: OneSignal,
    public loadingController: LoadingController,) { }

    public requestHttp(requestParameter: any, urlName: any, isLoaderVisible?: boolean): Observable<any> {
      console.log("URL and Request Parameter Is",urlName,requestParameter)
      return this.http.post(urlName, requestParameter)
      
     }
     public getId(){
       return this.oneSignal.getIds()
     }
   
   async presentToast(message) {
     const toast = await this.toast.create({
       message: message,
       duration: 4000
     });
     toast.present();
   }
     async  presentLoading(showorhide) {
       const loading = await this.loadingController.create({
         spinner: 'crescent',
         duration: 2000,
         message: 'Please wait...',
         cssClass: 'custom-class custom-loading',
         translucent: true,
       });
       switch (showorhide) {
         case 'show': {
           return await loading.present();
           break;
         }
         case 'dismiss': {
           return await loading.dismiss();
           break;
         }
         default: {
           break;
         }
       }
     }
}
