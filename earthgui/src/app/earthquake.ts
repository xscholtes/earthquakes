export interface Earthquake {
    id: number;
    source:string;
    date:Date;
    time:string;
    latitude:number;
    longitude:number;
    depth:number;
    magnitude:number;
    magnitude_type:string;
    status:string;
}
