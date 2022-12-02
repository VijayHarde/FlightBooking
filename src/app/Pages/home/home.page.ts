import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IonModal, IonPopover } from '@ionic/angular';
import { bookingData, formData } from 'src/app/Models/data.model';
import { Seat } from 'src/app/Models/Seats.model';
import { UtilityService } from 'src/app/Services/utility.service';
import seatJson from "../../../assets/JSON/seats.json";
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  seats:Seat[][];
  @ViewChild("modal") modal:IonModal;
  @ViewChild("datePopover") datePopover:IonPopover;

  constructor(
    private utilityService:UtilityService,
    private formBuilder:FormBuilder,
    private storage:Storage,
    private datePipe:DatePipe
    ) {}

  coutry_list = [
    "India",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua &amp; Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda"
  ]

  ticketBookingForm = this.formBuilder.group({
    bookingID:new FormControl(''),
    name: new FormControl('',Validators.required),
    mobile: new FormControl('',[Validators.required,Validators.pattern(new RegExp("^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$"))]),
    date:new FormControl('',Validators.required),
    from:new FormControl('',Validators.required),
    to:new FormControl('',Validators.required),
    seat:new FormControl('',Validators.required)
  })

  async ngOnInit() {
    let date = this.datePipe.transform(new Date(),'dd-MM-yyyy') as string;
    let isDataAvailable = JSON.parse(await this.storage.get(date)) as bookingData;
    // checking the data is available in the database for the current date
    //  if it is the assigning it to the sears array otherwise assigning the empty array
    if(isDataAvailable){
      this.seats = isDataAvailable.sheets;
    }else {
      this.seats = seatJson
    }
  }

  allocateSeat(row:number,column:number) {
    if(!this.seats[row][column].isAllocated){
      this.seats[row][column].isAllocated = true;
      let value;
      // added this conditions becouse getting the extra comma at the starting of the string
      if(!this.ticketBookingForm.get('seat')?.value){
         value = this.seats[row][column].seatName;
      }else {
        value = this.ticketBookingForm.get('seat')?.value + ',' + this.seats[row][column].seatName;
      }
      this.ticketBookingForm.controls['seat'].setValue(value)
    }else{
      this.utilityService.showToast("This seat is already taken please select another",'danger');
    }
  }

  handleChange(event:any,fieldValue:'to'|'from') {
    if(fieldValue == 'from'){
      this.ticketBookingForm.controls['from'].setValue(event.target.value)
    }else {
      this.ticketBookingForm.controls['to'].setValue(event.target.value)
    }
    }

    generateID():string {
      return Math.floor(Math.random()*(999-100+1)+100).toString();
    }

    async closeModal() {
      await this.modal.dismiss();
      this.ticketBookingForm.reset();
    }

    async addDate(event:any){
      let date = this.datePipe.transform(event.target.value,"dd-MM-yyyy") as string;
      this.ticketBookingForm.controls['date'].setValue(date);
      let isDataAvailable =  JSON.parse(await this.storage.get(date)) as bookingData;
      (isDataAvailable) ? this.seats = isDataAvailable.sheets : this.seats = seatJson;
      await this.datePopover.dismiss();
    }

  async submit(){
    const date = this.ticketBookingForm.get('date')?.value as string;
    let isDataAvailable =  JSON.parse(await this.storage.get(date)) as bookingData;
    let formData:formData = {
      BookingID:this.generateID(),
      date:this.ticketBookingForm.get('date')?.value as string,
      name:this.ticketBookingForm.get('name')?.value as string,
      mobile:this.ticketBookingForm.get('mobile')?.value as string,
      to:this.ticketBookingForm.get('to')?.value as string,
      from:this.ticketBookingForm.get('from')?.value as string,
      sheatsAllocated:this.ticketBookingForm.get('seat')?.value as string,
    }
    this.ticketBookingForm.controls['bookingID'].setValue(formData.BookingID as string)

// If the Data is not available for the selected date it will add new data Otherwise it will update the existing one
    if(!isDataAvailable) {
      console.log("In if")
      let dataToBesaved:bookingData = {
        bookings:[formData],
        sheets:this.seats
      }
      await this.storage.set(date,JSON.stringify(dataToBesaved)).then(res => {console.log(res)}).catch(err => {console.error(err)})
    }else {
      console.log("In else")
      isDataAvailable.bookings.push(formData);
      isDataAvailable.sheets = this.seats;
     await this.storage.set(date,JSON.stringify(isDataAvailable));
    }
    await this.modal.present()      
  }


}
