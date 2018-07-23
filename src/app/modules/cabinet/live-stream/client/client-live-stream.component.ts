import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LiveStreamSocketService } from "../../../../services/live-stream-socket.service";

@Component({
  selector: 'app-client-live-stream',
  templateUrl: './client-live-stream.component.html',
  styleUrls: ['./client-live-stream.component.scss']
})
export class ClientLiveStreamComponent implements OnInit, AfterViewInit {

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(
    private lsss: LiveStreamSocketService
  ) { }

  ngOnInit() {
    this.lsss.connect('default');
  }

  ngAfterViewInit() {
    console.log(this.lsss);
    if (this.lsss.localStream) this.remoteVideo.nativeElement.srcObject = this.lsss.localStream;
    this.lsss.handleRemoteStream.subscribe((stream) => this.remoteVideo.nativeElement.srcObject = stream);
    //this.lsss.sendMessage('got user media');
    this.lsss.sendMessage('get user media');
  }

}
