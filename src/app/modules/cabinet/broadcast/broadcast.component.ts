import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit, AfterViewInit {

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  isChannelReady = false;
  isInitiator = false;
  isStarted = false;
  localStream;
  pc;
  remoteStream;
  turnReady;

  pcConfig = {
    'iceServers': [{
      'urls': 'stun:stun.l.google.com:19302'
    }]
  };

// Set up audio and video regardless of what devices are present.
  sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };

  /////////////////////////////////////////////

  room = 'foo';
// Could prompt for room name:
// room = prompt('Enter room name:');

  socket = io.connect();

  constructor() { }

  ngOnInit() {
    if (this.room !== '') {
      this.socket.emit('create or join', this.room);
      console.log('Attempted to create or  join room', this.room);
    }

    this.socket.on('created', (room) => {
      console.log('Created room ' + room);
      this.isInitiator = true;
    });

    this.socket.on('full', (room) => {
      console.log('Room ' + room + ' is full');
    });

    this.socket.on('join', (room) =>{
      console.log('Another peer made a request to join room ' + room);
      console.log('This peer is the initiator of room ' + room + '!');
      this.isChannelReady = true;
    });

    this.socket.on('joined', (room) => {
      console.log('joined: ' + room);
      this.isChannelReady = true;
    });

    this.socket.on('log', (array) => {
      console.log.apply(console, array);
    });

    // This client receives a message
    this.socket.on('message', (message) => {
      console.log('Client received message:', message);
      if (message === 'got user media') {
        this.maybeStart();
      } else if (message.type === 'offer') {
        if (!this.isInitiator && !this.isStarted) {
          this.maybeStart();
        }
        this.pc.setRemoteDescription(new RTCSessionDescription(message));
        this.doAnswer();
      } else if (message.type === 'answer' && this.isStarted) {
        this.pc.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === 'candidate' && this.isStarted) {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate
        });
        this.pc.addIceCandidate(candidate);
      } else if (message === 'bye' && this.isStarted) {
        this.handleRemoteHangup();
      }
    });
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
      .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
      });

    var constraints = {
      video: true
    };

    console.log('Getting user media with constraints', constraints);

    if (location.hostname !== 'localhost') {
      this.requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
      );
    }

  }

  sendMessage(message) {
    console.log('Client sending message: ', message);
    this.socket.emit('message', message);
  }

  gotStream(stream) {
    console.log('Adding local stream.');
    this.localStream = stream;
    this.localVideo.nativeElement.srcObject = stream;
    this.sendMessage('got user media');
    if (this.isInitiator) {
      this.maybeStart();
    }
  }

  maybeStart() {
    console.log('>>>>>>> maybeStart() ', this.isStarted, this.localStream, this.isChannelReady);
    if (!this.isStarted && typeof this.localStream !== 'undefined' && this.isChannelReady) {
      console.log('>>>>>> creating peer connection');
      this.createPeerConnection();
      this.pc.addStream(this.localStream);
      this.isStarted = true;
      console.log('isInitiator', this.isInitiator);
      if (this.isInitiator) {
        this.doCall();
      }
    }
  }

  createPeerConnection() {
    try {
      this.pc = new RTCPeerConnection(null);
      this.pc.onicecandidate = this.handleIceCandidate.bind(this);
      this.pc.onaddstream = this.handleRemoteStreamAdded.bind(this);
      this.pc.onremovestream = this.handleRemoteStreamRemoved.bind(this);
      console.log('Created RTCPeerConnnection');
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  }

  handleIceCandidate(event) {
    console.log('icecandidate event: ', event);
    if (event.candidate) {
      this.sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log('End of candidates.');
    }
  }

  handleCreateOfferError(event) {
    console.log('createOffer() error: ', event);
  }

  doCall() {
    console.log('Sending offer to peer');
    this.pc.createOffer((sd) => this.setLocalAndSendMessage(sd), (e) => this.handleCreateOfferError(e));
  }

  doAnswer() {
    console.log('Sending answer to peer.');
    this.pc.createAnswer().then(
      (sd) => this.setLocalAndSendMessage(sd),
      (er) => this.onCreateSessionDescriptionError(er)
    );
  }

  setLocalAndSendMessage(sessionDescription) {
    this.pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    this.sendMessage(sessionDescription);
  }

  onCreateSessionDescriptionError(error) {
    console.log('Failed to create session description: ' + error.toString());
  }

  requestTurn(turnURL) {
    var turnExists = false;
    for (var i in this.pcConfig.iceServers) {
      if (this.pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
        turnExists = true;
        this.turnReady = true;
        break;
      }
    }
    if (!turnExists) {
      console.log('Getting TURN server from ', turnURL);
      // No TURN server. Get one from computeengineondemand.appspot.com:
      var xhr = new XMLHttpRequest();
      var pcConfig = this.pcConfig;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var turnServer = JSON.parse(xhr.responseText);
          console.log('Got TURN server: ', turnServer);
          pcConfig.iceServers.push({
            'urls': 'turn:' + turnServer.username + '@' + turnServer.turn
          });
          // turnReady = true;
        }
      };
      this.turnReady = true;
      xhr.open('GET', turnURL, true);
      xhr.send();
    }
  }

  handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    this.remoteStream = event.stream;
    this.remoteVideo.nativeElement.srcObject = this.remoteStream;
  }

  handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
  }

  hangup() {
    console.log('Hanging up.');
    this.stop();
    this.sendMessage('bye');
  }

  handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
    this.isInitiator = false;
  }

  stop() {
    this.isStarted = false;
    this.pc.close();
    this.pc = null;
  }

}
