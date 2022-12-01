import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { bookingData, formData } from 'src/app/Models/data.model';
import { Seat } from 'src/app/Models/Seats.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  date = this.datePipe.transform(new Date(),'dd-MM-YYYY');
  listOfPassengers:formData[] | [];
  constructor(
    private storage:Storage,
    private datePipe:DatePipe
    ) { }

  ngOnInit() {
    this.listOfPassengers = [];
  }

  async getData() {
    try {
      let data = JSON.parse(await this.storage.get(this.date as string)) as bookingData;
      (data) ? this.listOfPassengers = data.bookings : this.listOfPassengers = [];
    } catch (error) {
      
    }
  }

}
