export interface Order {
id:string;
customerName:string;
phone:string;
productName:string;
quantity:number;
unitPrice:number;
total:number;
status: "Pending" | "Preparing" | "Delivered";
}