import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public data: any;

  private hubConnection: signalR.HubConnection | undefined
    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('./api/chat')
                              .build();
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))
    }
    
    public addTransferChartDataListener = () => {
      this.hubConnection!.on('receive-feature', (data) => {
        this.data = data;
        console.log(data);
      });
      this.hubConnection!.on('delete-feature', (data) => {
        this.data = data;
        console.log(data);
      });
    }
}
