import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private toastCtrl:ToastController) { }

  async showToast(message:string,color:'primary'|'danger' = 'primary'){
    const toast = await this.toastCtrl.create({
      message:message,
      duration:2000,
      color:color
    });

    await toast.present();
  }
}
