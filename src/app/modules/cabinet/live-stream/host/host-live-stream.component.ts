import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LiveStreamSocketService } from "../../../../services/live-stream-socket.service";

@Component({
  selector: 'app-host-live-stream',
  templateUrl: './host-live-stream.component.html',
  styleUrls: ['./host-live-stream.component.scss']
})
export class HostLiveStreamComponent implements OnInit, AfterViewInit {

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(
    private lsss: LiveStreamSocketService
  ) {
  }

  ngOnInit() {
    this.lsss.connect('default');
  }

  ngAfterViewInit() {

    // this._navigator = <any>navigator;
    // this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
    //   || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );

    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    })
      .then((v) => {
        this.gotStream(v);
      })
      .catch(function (e) {
        alert('getUserMedia() error: ' + e.name);
      });

    var constraints = {
      video: true
    };

    console.log('Getting user media with constraints', constraints);

    if (location.hostname !== 'localhost') {
      this.lsss.requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
      );
    }

  }

  gotStream(stream) {
    console.log('Adding local stream.');
    this.lsss.localStream = stream;
    console.log(this.lsss);
    this.localVideo.nativeElement.srcObject = stream;
    this.lsss.saveStream(stream);
    // if (this.isInitiator) {
    //   this.maybeStart();
    // }
    //this.lsss.handleRemoteStream.subscribe((stream) => this.remoteVideo.nativeElement.srcObject = stream);
  }

  hangup() {
    console.log('Hanging up.');
    this.lsss.hangup();
  }

}
