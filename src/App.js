import React, { Component } from 'react'
import Sound from 'react-sound'
import 'react-circular-progressbar/dist/styles.css'
import './App.css'

// import logo from './logo.svg';
import SoundComponent from './playSound'
import {
  StyledProgressBar,
  StyledSlider,
  StyledButton,
  BackgroundImage,
  StyledIcon,
} from './components'

import {
  playButton,
  pauseButton,
  rainAudio,
  forestAudio,
  parkAudio,
  streamAudio,
  wavesAudio,
  loudVolumeIcon,
  quietVolumeIcon,
  noVolumeIcon,
  rainImg,
  forestImg,
  parkImg,
  wavesImg,
  streamImg,
  resetButton,
} from './constants'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pbuttonUrl: playButton,
      audioStatus: Sound.status.STOPPED,
      timeValues: [120, 300, 600, 900],
      audioNames: ['Rain', 'Forest', 'Park', 'Stream', 'Waves'],
      seekCurrentPosition: 0,
      audioUrl: rainAudio, // Default
      bgImg: rainImg,
      desiredTime: 120, // Default
      timeHovered: false,
      audioHovered: false,
      volume: 100, // Default
      mute: false, // Default
      volumeIcon: loudVolumeIcon,
      opacity: 1, 
      transition: '',
      center_opacity: 1,

    }
    this.soundCompoRef = React.createRef()
  }

  timeSelect(x) {
    this.setState({
      desiredTime: x.duration,
    })
  }

  playPause() {
    if (
      [Sound.status.STOPPED, Sound.status.PAUSED].includes(
        this.state.audioStatus
      )
    ) {
      this.setState({
        pbuttonUrl: pauseButton,
        audioStatus: Sound.status.PLAYING,
      })
    } else if (this.state.audioStatus === Sound.status.PLAYING) {
      this.setState({
        pbuttonUrl: playButton,
        audioStatus: Sound.status.PAUSED,
      })
    }

    if ( this.state.pbuttonUrl === playButton ){
      this.setState({ 
        opacity: 0 ,
        center_opacity: 0.6,
        transition:'opacity 10s ease-out',
      }) 
    }else{
      this.setState({ 
        opacity: 1 ,
        center_opacity: 1,
        transition:'opacity 0s',
      })
    }
    
  }

  reset() {
    this.soundCompoRef.current && this.soundCompoRef.current.reset()

    this.setState({
      seekCurrentPosition: 0,
      pbuttonUrl: playButton,
      audioStatus: Sound.status.STOPPED,
    })
  }

  _onMouseMove = (e) => {
    this.setState({ 
      opacity: 1 ,
      transition:'opacity 0s',
      center_opacity: 1,
    })
    setTimeout( () => {
      if (this.state.seekCurrentPosition < 100 && this.state.pbuttonUrl === pauseButton) {
        this.setState({ 
          opacity: 0 ,
          transition:'opacity 10s ease-out',
          center_opacity: 0.6 ,
        })
      }
    },3000)
  }

  audioSelect(name) {
    var x = JSON.stringify(name.audioName).replace(/["]+/g, '')

    if (x === this.state.audioNames[1]) {
      this.setState({
        audioUrl: forestAudio,
        bgImg: forestImg,
      })
    } else if (x === this.state.audioNames[2]) {
      this.setState({
        audioUrl: parkAudio,
        bgImg: parkImg,
      })
    } else if (x === this.state.audioNames[3]) {
      this.setState({
        audioUrl: streamAudio,
        bgImg: streamImg,
      })
    } else if (x === this.state.audioNames[4]) {
      this.setState({
        audioUrl: wavesAudio,
        bgImg: wavesImg,
      })
    } else {
      this.setState({
        audioUrl: rainAudio,
        bgImg: rainImg,
      })
    }
  }

  moveSeek(pos) {
    this.setState({
      seekCurrentPosition: (pos / this.state.desiredTime) * 100,
    })

    if (Math.floor(pos) === this.state.desiredTime) {
      this.setState({
        pbuttonUrl: playButton,
        audioStatus: Sound.status.STOPPED,
      })
    }
  }

  handleTimeHover() {
    this.setState({
      timeHovered: !this.state.timeHovered,
    })
  }

  handleAudioHover() {
    this.setState({
      audioHovered: !this.state.audioHovered,
    })
  }

  volumeChange = (event) => {
    const value = Number(event.target.value)
    this.setState({
      volume: this.state.mute ? this.state.volume : value,
      volumeIcon:
        this.state.mute || value === 0
          ? noVolumeIcon
          : value <= 50
          ? quietVolumeIcon
          : loudVolumeIcon,
    })
  }

  toggleMute() {
    this.setState({
      volumeIcon: !this.state.mute
        ? noVolumeIcon
        : this.state.volume <= 50
        ? quietVolumeIcon
        : loudVolumeIcon,
      mute: !this.state.mute,
    })
  }

  render() {
    const timeOptions = this.state.timeValues.map((duration) => (
      <StyledButton
        key={duration}
        onMouseEnter={this.handleTimeHover.bind(this)}
        onMouseLeave={this.handleTimeHover.bind(this)}
        onClick={() => {
          this.timeSelect({ duration })
        }}
        isActive={duration === this.state.desiredTime}
        buttonLabel={`${duration / 60} Minutes`}
      />
    ))

    const audioOptions = this.state.audioNames.map((audioName) => (
      <StyledButton
        key={audioName}
        onMouseEnter={this.handleAudioHover.bind(this)}
        onMouseLeave={this.handleAudioHover.bind(this)}
        onClick={() => {
          this.audioSelect({ audioName })
        }}
        isActive={
          this.state.audioUrl === 'audio/' + audioName.toLowerCase() + '.mp3'
        }
        buttonLabel={audioName}
      />
    ))

    return (
      <div className="App" onMouseMove={this._onMouseMove}>
        <div className="bg-overlay"></div>
        <BackgroundImage currentImage={this.state.bgImg} />
        <div className="time-menu" style={{ opacity: this.state.opacity, transition: this.state.transition}}>{timeOptions}</div>
        <div className="player-container">
          <div className="reset" style={{ opacity: this.state.opacity, transition: this.state.transition}}>
          {[Sound.status.PLAYING, Sound.status.PAUSED].includes(
            this.state.audioStatus
          ) && (
            <StyledIcon
              className="resetIcon"
              url={resetButton}
              alt="reset"
              handleOnClick={this.reset.bind(this)}
            />
          )}
          </div>

          <div className="audioSeek" style={{ opacity: this.state.center_opacity, transition: this.state.transition}}>
            <StyledProgressBar
              id="seek"
              percentage={this.state.seekCurrentPosition}
            />
          </div>
          <div
            style={{ opacity: this.state.center_opacity, transition: this.state.transition}}
            className={
              this.state.pbuttonUrl === playButton
                ? 'playPauseBtn pauseMode'
                : 'playPauseBtn playMode'
            }
            alt="Play"
            onClick={this.playPause.bind(this)}
          >
            <img className="pauseIcon" src={pauseButton} alt="" />
            <img className="playIcon" src={playButton} alt="" />
          </div>

          <SoundComponent
            ref={this.soundCompoRef}
            playStatus={this.state.audioStatus}
            url={this.state.audioUrl}
            funcPerc={this.moveSeek.bind(this)}
            desiredT={this.state.desiredTime}
            volume={this.state.mute ? 0 : this.state.volume}
          />
          <div className="timer">
            <span className="min">00</span> : <span className="sec">00</span>
          </div>

          <div className="volume-control" style={{ opacity: this.state.opacity, transition: this.state.transition}}>
            <StyledIcon
              className="volume-icon"
              url={this.state.volumeIcon}
              handleOnClick={this.toggleMute.bind(this)}
            />
            &nbsp;
            <div className="volume-slider" style={{ opacity: this.state.opacity, transition: this.state.transition}}>
              <StyledSlider
                id="slider"
                onChange={this.volumeChange}
                step={1}
                min={0}
                max={100}
                value={this.state.mute ? 0 : this.state.volume}
              />
            </div>
          </div>
        </div>
        <div className="audio-menu" style={{ opacity: this.state.opacity, transition: this.state.transition}}>{audioOptions}</div>
      </div>
    )
  }
}

export default App
