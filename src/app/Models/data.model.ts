import { Seat } from "./Seats.model";

export interface formData {
    BookingID?:string,
    date:string,
    name:string,
    mobile:string,
    from:string,
    to:string,
    sheatsAllocated:string,
}

export interface bookingData {
    bookings:formData[],
    sheets:Seat[][]
}