import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { bookingData, formData } from 'src/app/Models/data.model';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  @ViewChild('modal') modal:IonModal;
  date = this.datePipe.transform(new Date(),'dd-MM-YYYY');
  listOfPassengers:formData[] | [];
  constructor(
    private storage:Storage,
    private datePipe:DatePipe,
    private callNumber:CallNumber
    ) { }

  ngOnInit() {
    this.listOfPassengers = [];
    this.getData(this.date as string);
  }

  async setDate(event:any){
    console.log(event.target.value);
    let date = this.datePipe.transform(event.target.value,'dd-MM-yyyy');
    await this.modal.dismiss();
    this.getData(date as string);

  }

  async getData(date:string) {
    try {
      let data = JSON.parse(await this.storage.get(date as string)) as bookingData;
      (data) ? this.listOfPassengers = data.bookings : this.listOfPassengers = [];
      console.log(this.listOfPassengers);
    } catch (error) {
      console.log(error);
    }
  }

  async CallNumber(number:string){
    try {
      console.log(number);
      await this.callNumber.callNumber(number,true);
    } catch (error) {
      console.log(error);
    }
  }

}
