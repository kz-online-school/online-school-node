import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit, AfterViewInit {

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  _navigator = <any> navigator;
  startTime = null;

  localPeerConnection;
  remotePeerConnection;

  localStream;
  remoteStream;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    // this._navigator = <any>navigator;
    // this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
    //   || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );
  }

  startAction() {
    const mediaStreamConstraints = {
      video: true,
    };
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then((stream) => {
        this.gotLocalMediaStream(stream);
      }).catch(this.handleLocalMediaStreamError);
  }

  callAction() {
    const offerOptions = {
      offerToReceiveVideo: 1,
    };
    this.startTime = window.performance.now();

    // Get local media stream tracks.
    const videoTracks = this.localStream.getVideoTracks();
    const audioTracks = this.localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}.`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}.`);
    }

    const servers = null;  // Allows for RTC server configuration.

    // Create peer connections and add behavior.
    this.localPeerConnection = new RTCPeerConnection(servers);
    console.log('Created local peer connection object localPeerConnection.');

    this.localPeerConnection.addEventListener('icecandidate', (e) => {
      this.handleConnection(e);
    });
    this.localPeerConnection.addEventListener(
      'iceconnectionstatechange', (e) => {
        this.handleConnectionChange(e);
      });

    this.remotePeerConnection = new RTCPeerConnection(servers);
    console.log('Created remote peer connection object remotePeerConnection.');

    this.remotePeerConnection.addEventListener('icecandidate', (e) => {
      this.handleConnection(e);
    });
    this.remotePeerConnection.addEventListener(
      'iceconnectionstatechange', (e) => {
        this.handleConnectionChange(e);
      });
    this.remotePeerConnection.addEventListener('addstream', (e) => {
      this.gotRemoteMediaStream(e);
    });

    // Add local stream to connection and create offer to connect.
    this.localPeerConnection.addStream(this.localStream);
    console.log('Added local stream to localPeerConnection.');

    console.log('localPeerConnection createOffer start.');
    this.localPeerConnection.createOffer(offerOptions)
      .then((v) => {
        this.createdOffer(v);
      }).catch(console.log('localPeerConnection.createOffer error'));
  }

  hangupAction() {
    this.localPeerConnection.close();
    this.remotePeerConnection.close();
    this.localPeerConnection = null;
    this.remotePeerConnection = null;
    this.trace('Ending call.');
  }

  // Handles success by adding the MediaStream to the video element.
  gotLocalMediaStream(mediaStream) {
    console.log(mediaStream);
    this.localStream = mediaStream;
    this.localVideo.nativeElement.srcObject = mediaStream;
  }

  // Handles error by logging a message to the console with the error message.
  handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  gotRemoteMediaStream(event) {
    const mediaStream = event.stream;
    console.log(mediaStream);
    this.remoteStream = mediaStream;
    this.remoteVideo.nativeElement.srcObject = mediaStream;
  }

  handleConnection(event) {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      const otherPeer = this.getOtherPeer(peerConnection);

      otherPeer.addIceCandidate(newIceCandidate)
        .then(() => {
          console.log('handleConnectionSuccess');
        }).catch((error) => {
          console.log('handleConnectionFailure');
      });
    }
  }

  createdOffer(description) {
    this.localPeerConnection.setLocalDescription(description)
      .then(() => {
        console.log('localPeerConnection.setLocalDescription success');
      }).catch(console.log('localPeerConnection.setLocalDescription error'));

    this.remotePeerConnection.setRemoteDescription(description)
      .then(() => {
        console.log('remotePeerConnection.setRemoteDescription success');
      }).catch(console.log('remotePeerConnection.setRemoteDescription error'));

    this.remotePeerConnection.createAnswer()
      .then((v) => {
        this.createdAnswer(v);
      })
      .catch(console.log('remotePeerConnection.createAnswer error'));
  }

  createdAnswer(description) {
    this.remotePeerConnection.setLocalDescription(description)
      .then(() => {
        console.log('remotePeerConnection.setLocalDescription success');
      }).catch(console.log('remotePeerConnection.setLocalDescription error'));

    this.localPeerConnection.setRemoteDescription(description)
      .then(() => {
        console.log('localPeerConnection.setRemoteDescription success');
      }).catch(console.log('localPeerConnection.setRemoteDescription error'));
  }

  handleConnectionChange(event) {
    const peerConnection = event.target;
    console.log('ICE state change event: ', event);
    console.log(` ICE state: ` +
      `${peerConnection.iceConnectionState}.`);
  }
  getOtherPeer(peerConnection) {
    return (peerConnection === this.localPeerConnection) ?
      this.remotePeerConnection : this.localPeerConnection;
  }

  // Gets the name of a certain peer connection.
  getPeerName(peerConnection) {
    return (peerConnection === this.localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
  }

  // Logs an action (text) and the time when it happened on the console.
  trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);

    console.log(now, text);
  }

}
