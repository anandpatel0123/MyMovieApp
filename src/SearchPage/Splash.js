import { Lightning, Router, Utils, VideoPlayer } from "@lightningjs/sdk";

export default class Splash extends Lightning.Component {
  static _template() {
    return {};
  }

  _active() {
    VideoPlayer.playPause();

    VideoPlayer.open(Utils.asset("images/tmdb.mp4"));
    this._setState("Play");
    setTimeout(() => {
      Router.navigate("search", false);
    }, 3500);
  }

  _inactive() {
    VideoPlayer.close();
  }

  _handleEnter() {
    VideoPlayer.playPause();
  }

  _init() {
    VideoPlayer.consumer(this);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.position(0, 0);
    VideoPlayer.mute();
  }
  static _states() {
    return [
      class Play extends this {
        $videoPlayerCanPlay() {
          this._duration = VideoPlayer.duration;
          this._duration = (this._duration / 60).toFixed(2);
          console.log("duration...", this._duration);
          this.tag("PlayerDuration").patch({
            text: { text: `${this._duration} /` },
          });
        }
      },
    ];
  }
}
