import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SocketIoService } from '../../../services/socket.io';

@Component({
  selector: 'app-broadcast2',
  templateUrl: './broadcast2.component.html',
  styleUrls: ['./broadcast2.component.scss']
})
export class Broadcast2Component implements OnInit, AfterViewInit {

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(
    private sis: SocketIoService
  ) {
  }

  ngOnInit() {
    this.sis.connect('default');
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
      this.sis.requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
      );
    }

  }

  gotStream(stream) {
    console.log('Adding local stream.');
    this.sis.localStream = stream;
    this.localVideo.nativeElement.srcObject = stream;
    this.sis.sendMessage('got user media');
    // if (this.isInitiator) {
    //   this.maybeStart();
    // }
    this.sis.handleRemoteStream.subscribe((stream) => this.remoteVideo.nativeElement.srcObject = stream);
  }

  hangup() {
    console.log('Hanging up.');
    this.sis.hangup();
  }

}
