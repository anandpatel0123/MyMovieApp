/**
 * App version: 1.0.0
 * SDK version: 4.6.1
 * CLI version: 2.11.0
 * 
 * Generated: Sun, 09 Jul 2023 17:48:56 GMT
 */

var APP_MyMovieApp = (function (ui) {
  'use strict';

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const settings = {};
  const subscribers = {};
  const initSettings = (appSettings, platformSettings) => {
    settings['app'] = appSettings;
    settings['platform'] = platformSettings;
    settings['user'] = {};
  };
  const publish = (key, value) => {
    subscribers[key] && subscribers[key].forEach(subscriber => subscriber(value));
  };
  const dotGrab = function () {
    let obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let key = arguments.length > 1 ? arguments[1] : undefined;
    if (obj === null) return undefined;
    const keys = key.split('.');
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {};
    }
    return typeof obj === 'object' && obj !== null ? Object.keys(obj).length ? obj : undefined : obj;
  };
  var Settings$2 = {
    get(type, key) {
      let fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      const val = dotGrab(settings[type], key);
      return val !== undefined ? val : fallback;
    },
    has(type, key) {
      return !!this.get(type, key);
    },
    set(key, value) {
      settings['user'][key] = value;
      publish(key, value);
    },
    subscribe(key, callback) {
      subscribers[key] = subscribers[key] || [];
      subscribers[key].push(callback);
    },
    unsubscribe(key, callback) {
      if (callback) {
        const index = subscribers[key] && subscribers[key].findIndex(cb => cb === callback);
        index > -1 && subscribers[key].splice(index, 1);
      } else {
        if (key in subscribers) {
          subscribers[key] = [];
        }
      }
    },
    clearSubscribers() {
      for (const key of Object.getOwnPropertyNames(subscribers)) {
        delete subscribers[key];
      }
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const prepLog = (type, args) => {
    const colors = {
      Info: 'green',
      Debug: 'gray',
      Warn: 'orange',
      Error: 'red'
    };
    args = Array.from(args);
    return ['%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type), 'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px', args];
  };
  var Log = {
    info() {
      Settings$2.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments));
    },
    debug() {
      Settings$2.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments));
    },
    error() {
      Settings$2.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments));
    },
    warn() {
      Settings$2.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments));
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let sendMetric = (type, event, params) => {
    Log.info('Sending metric', type, event, params);
  };
  const initMetrics = config => {
    sendMetric = config.sendMetric;
  };

  // available metric per category
  const metrics$1 = {
    app: ['launch', 'loaded', 'ready', 'close'],
    page: ['view', 'leave'],
    user: ['click', 'input'],
    media: ['abort', 'canplay', 'ended', 'pause', 'play',
    // with some videos there occur almost constant suspend events ... should investigate
    // 'suspend',
    'volumechange', 'waiting', 'seeking', 'seeked']
  };

  // error metric function (added to each category)
  const errorMetric = function (type, message, code, visible) {
    let params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    params = {
      params,
      ...{
        message,
        code,
        visible
      }
    };
    sendMetric(type, 'error', params);
  };
  const Metric = function (type, events) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return events.reduce((obj, event) => {
      obj[event] = function (name) {
        let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        params = {
          ...options,
          ...(name ? {
            name
          } : {}),
          ...params
        };
        sendMetric(type, event, params);
      };
      return obj;
    }, {
      error(message, code, params) {
        errorMetric(type, message, code, params);
      },
      event(name, params) {
        sendMetric(type, name, params);
      }
    });
  };
  const Metrics = types => {
    return Object.keys(types).reduce((obj, type) => {
      // media metric works a bit different!
      // it's a function that accepts a url and returns an object with the available metrics
      // url is automatically passed as a param in every metric
      type === 'media' ? obj[type] = url => Metric(type, types[type], {
        url
      }) : obj[type] = Metric(type, types[type]);
      return obj;
    }, {
      error: errorMetric,
      event: sendMetric
    });
  };
  var Metrics$1 = Metrics(metrics$1);

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var events$1 = {
    abort: 'Abort',
    canplay: 'CanPlay',
    canplaythrough: 'CanPlayThrough',
    durationchange: 'DurationChange',
    emptied: 'Emptied',
    encrypted: 'Encrypted',
    ended: 'Ended',
    error: 'Error',
    interruptbegin: 'InterruptBegin',
    interruptend: 'InterruptEnd',
    loadeddata: 'LoadedData',
    loadedmetadata: 'LoadedMetadata',
    loadstart: 'LoadStart',
    pause: 'Pause',
    play: 'Play',
    playing: 'Playing',
    progress: 'Progress',
    ratechange: 'Ratechange',
    seeked: 'Seeked',
    seeking: 'Seeking',
    stalled: 'Stalled',
    // suspend: 'Suspend', // this one is called a looooot for some videos
    timeupdate: 'TimeUpdate',
    volumechange: 'VolumeChange',
    waiting: 'Waiting'
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var autoSetupMixin = (function (sourceObject) {
    let setup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => {};
    let ready = false;
    const doSetup = () => {
      if (ready === false) {
        setup();
        ready = true;
      }
    };
    return Object.keys(sourceObject).reduce((obj, key) => {
      if (typeof sourceObject[key] === 'function') {
        obj[key] = function () {
          doSetup();
          return sourceObject[key].apply(sourceObject, arguments);
        };
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === 'function') {
        obj.__defineGetter__(key, function () {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject);
        });
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === 'function') {
        obj.__defineSetter__(key, function () {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(sourceObject, arguments);
        });
      } else {
        obj[key] = sourceObject[key];
      }
      return obj;
    }, {});
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let timeout = null;
  var easeExecution = ((cb, delay) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb();
    }, delay);
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  let basePath;
  let proxyUrl;
  const initUtils = config => {
    basePath = ensureUrlWithProtocol(makeFullStaticPath(window.location.pathname, config.path || '/'));
    if (config.proxyUrl) {
      proxyUrl = ensureUrlWithProtocol(config.proxyUrl);
    }
  };
  var Utils = {
    asset(relPath) {
      return basePath + relPath;
    },
    proxyUrl(url) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return proxyUrl ? proxyUrl + '?' + makeQueryString(url, options) : url;
    },
    makeQueryString() {
      return makeQueryString(...arguments);
    },
    // since imageworkers don't work without protocol
    ensureUrlWithProtocol() {
      return ensureUrlWithProtocol(...arguments);
    }
  };
  const ensureUrlWithProtocol = url => {
    if (/^\/\//.test(url)) {
      return window.location.protocol + url;
    }
    if (!/^(?:https?:)/i.test(url)) {
      return window.location.origin + url;
    }
    return url;
  };
  const makeFullStaticPath = function () {
    let pathname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    let path = arguments.length > 1 ? arguments[1] : undefined;
    // ensure path has traling slash
    path = path.charAt(path.length - 1) !== '/' ? path + '/' : path;

    // if path is URL, we assume it's already the full static path, so we just return it
    if (/^(?:https?:)?(?:\/\/)/.test(path)) {
      return path;
    }
    if (path.charAt(0) === '/') {
      return path;
    } else {
      // cleanup the pathname (i.e. remove possible index.html)
      pathname = cleanUpPathName(pathname);

      // remove possible leading dot from path
      path = path.charAt(0) === '.' ? path.substr(1) : path;
      // ensure path has leading slash
      path = path.charAt(0) !== '/' ? '/' + path : path;
      return pathname + path;
    }
  };
  const cleanUpPathName = pathname => {
    if (pathname.slice(-1) === '/') return pathname.slice(0, -1);
    const parts = pathname.split('/');
    if (parts[parts.length - 1].indexOf('.') > -1) parts.pop();
    return parts.join('/');
  };
  const makeQueryString = function (url) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'url';
    // add operator as an option
    options.operator = 'metrological'; // Todo: make this configurable (via url?)
    // add type (= url or qr) as an option, with url as the value
    options[type] = url;
    return Object.keys(options).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent('' + options[key]);
    }).join('&');
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const initProfile = config => {
    config.getInfo;
    config.setInfo;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var Lightning = window.lng;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const events = ['timeupdate', 'error', 'ended', 'loadeddata', 'canplay', 'play', 'playing', 'pause', 'loadstart', 'seeking', 'seeked', 'encrypted'];
  let mediaUrl$1 = url => url;
  const initMediaPlayer = config => {
    if (config.mediaUrl) {
      mediaUrl$1 = config.mediaUrl;
    }
  };
  class Mediaplayer extends Lightning.Component {
    _construct() {
      this._skipRenderToTexture = false;
      this._metrics = null;
      this._textureMode = Settings$2.get('platform', 'textureMode') || false;
      Log.info('Texture mode: ' + this._textureMode);
      console.warn(["The 'MediaPlayer'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.", "Please consider using the new 'VideoPlayer'-plugin instead.", 'https://rdkcentral.github.io/Lightning-SDK/#/plugins/videoplayer'].join('\n\n'));
    }
    static _template() {
      return {
        Video: {
          VideoWrap: {
            VideoTexture: {
              visible: false,
              pivot: 0.5,
              texture: {
                type: Lightning.textures.StaticTexture,
                options: {}
              }
            }
          }
        }
      };
    }
    set skipRenderToTexture(v) {
      this._skipRenderToTexture = v;
    }
    get textureMode() {
      return this._textureMode;
    }
    get videoView() {
      return this.tag('Video');
    }
    _init() {
      //re-use videotag if already there
      const videoEls = document.getElementsByTagName('video');
      if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];else {
        this.videoEl = document.createElement('video');
        this.videoEl.setAttribute('id', 'video-player');
        this.videoEl.style.position = 'absolute';
        this.videoEl.style.zIndex = '1';
        this.videoEl.style.display = 'none';
        this.videoEl.setAttribute('width', '100%');
        this.videoEl.setAttribute('height', '100%');
        this.videoEl.style.visibility = this.textureMode ? 'hidden' : 'visible';
        document.body.appendChild(this.videoEl);
      }
      if (this.textureMode && !this._skipRenderToTexture) {
        this._createVideoTexture();
      }
      this.eventHandlers = [];
    }
    _registerListeners() {
      events.forEach(event => {
        const handler = e => {
          if (this._metrics && this._metrics[event] && typeof this._metrics[event] === 'function') {
            this._metrics[event]({
              currentTime: this.videoEl.currentTime
            });
          }
          this.fire(event, {
            videoElement: this.videoEl,
            event: e
          });
        };
        this.eventHandlers.push(handler);
        this.videoEl.addEventListener(event, handler);
      });
    }
    _deregisterListeners() {
      Log.info('Deregistering event listeners MediaPlayer');
      events.forEach((event, index) => {
        this.videoEl.removeEventListener(event, this.eventHandlers[index]);
      });
      this.eventHandlers = [];
    }
    _attach() {
      this._registerListeners();
    }
    _detach() {
      this._deregisterListeners();
      this.close();
    }
    _createVideoTexture() {
      const stage = this.stage;
      const gl = stage.gl;
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.videoTexture.options = {
        source: glTexture,
        w: this.videoEl.width,
        h: this.videoEl.height
      };
    }
    _startUpdatingVideoTexture() {
      if (this.textureMode && !this._skipRenderToTexture) {
        const stage = this.stage;
        if (!this._updateVideoTexture) {
          this._updateVideoTexture = () => {
            if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
              const gl = stage.gl;
              const currentTime = new Date().getTime();

              // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
              // We'll fallback to fixed 30fps in this case.
              const frameCount = this.videoEl.webkitDecodedFrameCount;
              const mustUpdate = frameCount ? this._lastFrame !== frameCount : this._lastTime < currentTime - 30;
              if (mustUpdate) {
                this._lastTime = currentTime;
                this._lastFrame = frameCount;
                try {
                  gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                  this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                  this.videoTextureView.visible = true;
                  this.videoTexture.options.w = this.videoEl.videoWidth;
                  this.videoTexture.options.h = this.videoEl.videoHeight;
                  const expectedAspectRatio = this.videoTextureView.w / this.videoTextureView.h;
                  const realAspectRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
                  if (expectedAspectRatio > realAspectRatio) {
                    this.videoTextureView.scaleX = realAspectRatio / expectedAspectRatio;
                    this.videoTextureView.scaleY = 1;
                  } else {
                    this.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
                    this.videoTextureView.scaleX = 1;
                  }
                } catch (e) {
                  Log.error('texImage2d video', e);
                  this._stopUpdatingVideoTexture();
                  this.videoTextureView.visible = false;
                }
                this.videoTexture.source.forceRenderUpdate();
              }
            }
          };
        }
        if (!this._updatingVideoTexture) {
          stage.on('frameStart', this._updateVideoTexture);
          this._updatingVideoTexture = true;
        }
      }
    }
    _stopUpdatingVideoTexture() {
      if (this.textureMode) {
        const stage = this.stage;
        stage.removeListener('frameStart', this._updateVideoTexture);
        this._updatingVideoTexture = false;
        this.videoTextureView.visible = false;
        if (this.videoTexture.options.source) {
          const gl = stage.gl;
          gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
    }
    updateSettings() {
      let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // The Component that 'consumes' the media player.
      this._consumer = settings.consumer;
      if (this._consumer && this._consumer.getMediaplayerSettings) {
        // Allow consumer to add settings.
        settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
      }
      if (!Lightning.Utils.equalValues(this._stream, settings.stream)) {
        if (settings.stream && settings.stream.keySystem) {
          navigator.requestMediaKeySystemAccess(settings.stream.keySystem.id, settings.stream.keySystem.config).then(keySystemAccess => {
            return keySystemAccess.createMediaKeys();
          }).then(createdMediaKeys => {
            return this.videoEl.setMediaKeys(createdMediaKeys);
          }).then(() => {
            if (settings.stream && settings.stream.src) this.open(settings.stream.src);
          }).catch(() => {
            console.error('Failed to set up MediaKeys');
          });
        } else if (settings.stream && settings.stream.src) {
          // This is here to be backwards compatible, will be removed
          // in future sdk release
          if (Settings$2.get('app', 'hls')) {
            if (!window.Hls) {
              window.Hls = class Hls {
                static isSupported() {
                  console.warn('hls-light not included');
                  return false;
                }
              };
            }
            if (window.Hls.isSupported()) {
              if (!this._hls) this._hls = new window.Hls({
                liveDurationInfinity: true
              });
              this._hls.loadSource(settings.stream.src);
              this._hls.attachMedia(this.videoEl);
              this.videoEl.style.display = 'block';
            }
          } else {
            this.open(settings.stream.src);
          }
        } else {
          this.close();
        }
        this._stream = settings.stream;
      }
      this._setHide(settings.hide);
      this._setVideoArea(settings.videoPos);
    }
    _setHide(hide) {
      if (this.textureMode) {
        this.tag('Video').setSmooth('alpha', hide ? 0 : 1);
      } else {
        this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
      }
    }
    open(url) {
      let settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        hide: false,
        videoPosition: null
      };
      // prep the media url to play depending on platform (mediaPlayerplugin)
      url = mediaUrl$1(url);
      this._metrics = Metrics$1.media(url);
      Log.info('Playing stream', url);
      if (this.application.noVideo) {
        Log.info('noVideo option set, so ignoring: ' + url);
        return;
      }
      // close the video when opening same url as current (effectively reloading)
      if (this.videoEl.getAttribute('src') === url) {
        this.close();
      }
      this.videoEl.setAttribute('src', url);

      // force hide, then force show (in next tick!)
      // (fixes comcast playback rollover issue)
      this.videoEl.style.visibility = 'hidden';
      this.videoEl.style.display = 'none';
      setTimeout(() => {
        this.videoEl.style.display = 'block';
        this.videoEl.style.visibility = 'visible';
      });
      this._setHide(settings.hide);
      this._setVideoArea(settings.videoPosition || [0, 0, 1920, 1080]);
    }
    close() {
      // We need to pause first in order to stop sound.
      this.videoEl.pause();
      this.videoEl.removeAttribute('src');

      // force load to reset everything without errors
      this.videoEl.load();
      this._clearSrc();
      this.videoEl.style.display = 'none';
    }
    playPause() {
      if (this.isPlaying()) {
        this.doPause();
      } else {
        this.doPlay();
      }
    }
    get muted() {
      return this.videoEl.muted;
    }
    set muted(v) {
      this.videoEl.muted = v;
    }
    get loop() {
      return this.videoEl.loop;
    }
    set loop(v) {
      this.videoEl.loop = v;
    }
    isPlaying() {
      return this._getState() === 'Playing';
    }
    doPlay() {
      this.videoEl.play();
    }
    doPause() {
      this.videoEl.pause();
    }
    reload() {
      var url = this.videoEl.getAttribute('src');
      this.close();
      this.videoEl.src = url;
    }
    getPosition() {
      return Promise.resolve(this.videoEl.currentTime);
    }
    setPosition(pos) {
      this.videoEl.currentTime = pos;
    }
    getDuration() {
      return Promise.resolve(this.videoEl.duration);
    }
    seek(time) {
      let absolute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (absolute) {
        this.videoEl.currentTime = time;
      } else {
        this.videoEl.currentTime += time;
      }
    }
    get videoTextureView() {
      return this.tag('Video').tag('VideoTexture');
    }
    get videoTexture() {
      return this.videoTextureView.texture;
    }
    _setVideoArea(videoPos) {
      if (Lightning.Utils.equalValues(this._videoPos, videoPos)) {
        return;
      }
      this._videoPos = videoPos;
      if (this.textureMode) {
        this.videoTextureView.patch({
          smooth: {
            x: videoPos[0],
            y: videoPos[1],
            w: videoPos[2] - videoPos[0],
            h: videoPos[3] - videoPos[1]
          }
        });
      } else {
        const precision = this.stage.getRenderPrecision();
        this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
        this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
        this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
        this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
      }
    }
    _fireConsumer(event, args) {
      if (this._consumer) {
        this._consumer.fire(event, args);
      }
    }
    _equalInitData(buf1, buf2) {
      if (!buf1 || !buf2) return false;
      if (buf1.byteLength != buf2.byteLength) return false;
      const dv1 = new Int8Array(buf1);
      const dv2 = new Int8Array(buf2);
      for (let i = 0; i != buf1.byteLength; i++) if (dv1[i] != dv2[i]) return false;
      return true;
    }
    error(args) {
      this._fireConsumer('$mediaplayerError', args);
      this._setState('');
      return '';
    }
    loadeddata(args) {
      this._fireConsumer('$mediaplayerLoadedData', args);
    }
    play(args) {
      this._fireConsumer('$mediaplayerPlay', args);
    }
    playing(args) {
      this._fireConsumer('$mediaplayerPlaying', args);
      this._setState('Playing');
    }
    canplay(args) {
      this.videoEl.play();
      this._fireConsumer('$mediaplayerStart', args);
    }
    loadstart(args) {
      this._fireConsumer('$mediaplayerLoad', args);
    }
    seeked() {
      this._fireConsumer('$mediaplayerSeeked', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1
      });
    }
    seeking() {
      this._fireConsumer('$mediaplayerSeeking', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1
      });
    }
    durationchange(args) {
      this._fireConsumer('$mediaplayerDurationChange', args);
    }
    encrypted(args) {
      const video = args.videoElement;
      const event = args.event;
      // FIXME: Double encrypted events need to be properly filtered by Gstreamer
      if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
        this._previousInitData = event.initData;
        this._fireConsumer('$mediaplayerEncrypted', args);
      }
    }
    static _states() {
      return [class Playing extends this {
        $enter() {
          this._startUpdatingVideoTexture();
        }
        $exit() {
          this._stopUpdatingVideoTexture();
        }
        timeupdate() {
          this._fireConsumer('$mediaplayerProgress', {
            currentTime: this.videoEl.currentTime,
            duration: this.videoEl.duration || 1
          });
        }
        ended(args) {
          this._fireConsumer('$mediaplayerEnded', args);
          this._setState('');
        }
        pause(args) {
          this._fireConsumer('$mediaplayerPause', args);
          this._setState('Playing.Paused');
        }
        _clearSrc() {
          this._fireConsumer('$mediaplayerStop', {});
          this._setState('');
        }
        static _states() {
          return [class Paused extends this {}];
        }
      }];
    }
  }

  class localCookie {
    constructor(e) {
      return e = e || {}, this.forceCookies = e.forceCookies || !1, !0 === this._checkIfLocalStorageWorks() && !0 !== e.forceCookies ? {
        getItem: this._getItemLocalStorage,
        setItem: this._setItemLocalStorage,
        removeItem: this._removeItemLocalStorage,
        clear: this._clearLocalStorage
      } : {
        getItem: this._getItemCookie,
        setItem: this._setItemCookie,
        removeItem: this._removeItemCookie,
        clear: this._clearCookies
      };
    }
    _checkIfLocalStorageWorks() {
      if ("undefined" == typeof localStorage) return !1;
      try {
        return localStorage.setItem("feature_test", "yes"), "yes" === localStorage.getItem("feature_test") && (localStorage.removeItem("feature_test"), !0);
      } catch (e) {
        return !1;
      }
    }
    _getItemLocalStorage(e) {
      return window.localStorage.getItem(e);
    }
    _setItemLocalStorage(e, t) {
      return window.localStorage.setItem(e, t);
    }
    _removeItemLocalStorage(e) {
      return window.localStorage.removeItem(e);
    }
    _clearLocalStorage() {
      return window.localStorage.clear();
    }
    _getItemCookie(e) {
      var t = document.cookie.match(RegExp("(?:^|;\\s*)" + function (e) {
        return e.replace(/([.*+?\^${}()|\[\]\/\\])/g, "\\$1");
      }(e) + "=([^;]*)"));
      return t && "" === t[1] && (t[1] = null), t ? t[1] : null;
    }
    _setItemCookie(e, t) {
      var o = new Date(),
        r = new Date(o.getTime() + 15768e7);
      document.cookie = "".concat(e, "=").concat(t, "; expires=").concat(r.toUTCString(), ";");
    }
    _removeItemCookie(e) {
      document.cookie = "".concat(e, "=;Max-Age=-99999999;");
    }
    _clearCookies() {
      document.cookie.split(";").forEach(e => {
        document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=Max-Age=-99999999");
      });
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const initStorage = () => {
    Settings$2.get('platform', 'id');
    // todo: pass options (for example to force the use of cookies)
    new localCookie();
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g;
  const isWildcard = /^[!*$]$/;
  const hasLookupId = /\/:\w+?@@([0-9]+?)@@/;
  const isNamedGroup = /^\/:/;

  /**
   * Test if a route is part regular expressed
   * and replace it for a simple character
   * @param route
   * @returns {*}
   */
  const stripRegex = function (route) {
    let char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'R';
    // if route is part regular expressed we replace
    // the regular expression for a character to
    // simplify floor calculation and backtracking
    if (hasRegex.test(route)) {
      route = route.replace(hasRegex, char);
    }
    return route;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Create a local request register
   * @param flags
   * @returns {Map<any, any>}
   */
  const createRegister = flags => {
    const reg = new Map()
    // store user defined and router
    // defined flags in register
    ;
    [...Object.keys(flags), ...Object.getOwnPropertySymbols(flags)].forEach(key => {
      reg.set(key, flags[key]);
    });
    return reg;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Request {
    constructor() {
      let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      let navArgs = arguments.length > 1 ? arguments[1] : undefined;
      let storeCaller = arguments.length > 2 ? arguments[2] : undefined;
      /**
       * Hash we navigate to
       * @type {string}
       * @private
       */
      this._hash = hash;

      /**
       * Do we store previous hash in history
       * @type {boolean}
       * @private
       */
      this._storeCaller = storeCaller;

      /**
       * Request and navigate data
       * @type {Map}
       * @private
       */
      this._register = new Map();

      /**
       * Flag if the instance is created due to
       * this request
       * @type {boolean}
       * @private
       */
      this._isCreated = false;

      /**
       * Flag if the instance is shared between
       * previous and current request
       * @type {boolean}
       * @private
       */
      this._isSharedInstance = false;

      /**
       * Flag if the request has been cancelled
       * @type {boolean}
       * @private
       */
      this._cancelled = false;

      /**
       * if instance is shared between requests we copy state object
       * from instance before the new request overrides state
       * @type {null}
       * @private
       */
      this._copiedHistoryState = null;

      // if there are arguments attached to navigate()
      // we store them in new request
      if (isObject(navArgs)) {
        this._register = createRegister(navArgs);
      } else if (isBoolean(navArgs)) {
        // if second navigate() argument is explicitly
        // set to false we prevent the calling page
        // from ending up in history
        this._storeCaller = navArgs;
      }
      // @todo: remove because we can simply check
      // ._storeCaller property
      this._register.set(symbols.store, this._storeCaller);
    }
    cancel() {
      Log.debug('[router]:', "cancelled ".concat(this._hash));
      this._cancelled = true;
    }
    get url() {
      return this._hash;
    }
    get register() {
      return this._register;
    }
    get hash() {
      return this._hash;
    }
    set hash(args) {
      this._hash = args;
    }
    get route() {
      return this._route;
    }
    set route(args) {
      this._route = args;
    }
    get provider() {
      return this._provider;
    }
    set provider(args) {
      this._provider = args;
    }
    get providerType() {
      return this._providerType;
    }
    set providerType(args) {
      this._providerType = args;
    }
    set page(args) {
      this._page = args;
    }
    get page() {
      return this._page;
    }
    set isCreated(args) {
      this._isCreated = args;
    }
    get isCreated() {
      return this._isCreated;
    }
    get isSharedInstance() {
      return this._isSharedInstance;
    }
    set isSharedInstance(args) {
      this._isSharedInstance = args;
    }
    get isCancelled() {
      return this._cancelled;
    }
    set copiedHistoryState(v) {
      this._copiedHistoryState = v;
    }
    get copiedHistoryState() {
      return this._copiedHistoryState;
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Route {
    constructor() {
      let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // keep backwards compatible
      let type = ['on', 'before', 'after'].reduce((acc, type) => {
        return isFunction(config[type]) ? type : acc;
      }, undefined);
      this._cfg = config;
      if (type) {
        this._provider = {
          type,
          request: config[type]
        };
      }
    }
    get path() {
      return this._cfg.path;
    }
    get component() {
      return this._cfg.component;
    }
    get options() {
      return this._cfg.options;
    }
    get widgets() {
      return this._cfg.widgets;
    }
    get cache() {
      return this._cfg.cache;
    }
    get hook() {
      return this._cfg.hook;
    }
    get beforeNavigate() {
      return this._cfg.beforeNavigate;
    }
    get provider() {
      return this._provider;
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Simple route length calculation
   * @param route {string}
   * @returns {number} - floor
   */
  const getFloor = route => {
    return stripRegex(route).split('/').length;
  };

  /**
   * return all stored routes that live on the same floor
   * @param floor
   * @returns {Array}
   */
  const getRoutesByFloor = floor => {
    const matches = [];
    // simple filter of level candidates
    for (let [route] of routes$1.entries()) {
      if (getFloor(route) === floor) {
        matches.push(route);
      }
    }
    return matches;
  };

  /**
   * return a matching route by provided hash
   * hash: home/browse/12 will match:
   * route: home/browse/:categoryId
   * @param hash {string}
   * @returns {boolean|{}} - route
   */
  const getRouteByHash = hash => {
    // @todo: clean up on handleHash
    hash = hash.replace(/^#/, '');
    const getUrlParts = /(\/?:?[@!*\w%\s:-]+)/g;
    // grab possible candidates from stored routes
    const candidates = getRoutesByFloor(getFloor(hash));
    // break hash down in chunks
    const hashParts = hash.match(getUrlParts) || [];

    // to simplify the route matching and prevent look around
    // in our getUrlParts regex we get the regex part from
    // route candidate and store them so that we can reference
    // them when we perform the actual regex against hash
    let regexStore = [];
    let matches = candidates.filter(route => {
      let isMatching = true;
      // replace regex in route with lookup id => @@{storeId}@@
      if (hasRegex.test(route)) {
        const regMatches = route.match(hasRegex);
        if (regMatches && regMatches.length) {
          route = regMatches.reduce((fullRoute, regex) => {
            const lookupId = regexStore.length;
            fullRoute = fullRoute.replace(regex, "@@".concat(lookupId, "@@"));
            regexStore.push(regex.substring(1, regex.length - 1));
            return fullRoute;
          }, route);
        }
      }
      const routeParts = route.match(getUrlParts) || [];
      for (let i = 0, j = routeParts.length; i < j; i++) {
        const routePart = routeParts[i];
        const hashPart = hashParts[i];

        // Since we support catch-all and regex driven name groups
        // we first test for regex lookup id and see if the regex
        // matches the value from the hash
        if (hasLookupId.test(routePart)) {
          const routeMatches = hasLookupId.exec(routePart);
          const storeId = routeMatches[1];
          const routeRegex = regexStore[storeId];

          // split regex and modifiers so we can use both
          // to create a new RegExp
          // eslint-disable-next-line
          const regMatches = /\/([^\/]+)\/([igm]{0,3})/.exec(routeRegex);
          if (regMatches && regMatches.length) {
            const expression = regMatches[1];
            const modifiers = regMatches[2];
            const regex = new RegExp("^/".concat(expression, "$"), modifiers);
            if (!regex.test(hashPart)) {
              isMatching = false;
            }
          }
        } else if (isNamedGroup.test(routePart)) {
          // we kindly skip namedGroups because this is dynamic
          // we only need to the static and regex drive parts
          continue;
        } else if (hashPart && routePart.toLowerCase() !== hashPart.toLowerCase()) {
          isMatching = false;
        }
      }
      return isMatching;
    });
    if (matches.length) {
      if (matches.indexOf(hash) !== -1) {
        const match = matches[matches.indexOf(hash)];
        return routes$1.get(match);
      } else {
        // we give prio to static routes over dynamic
        matches = matches.sort(a => {
          return isNamedGroup.test(a) ? -1 : 1;
        });
        // would be strange if this fails
        // but still we test
        if (routeExists(matches[0])) {
          return routes$1.get(matches[0]);
        }
      }
    }
    return false;
  };
  const getValuesFromHash = function () {
    let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let path = arguments.length > 1 ? arguments[1] : undefined;
    // replace the regex definition from the route because
    // we already did the matching part
    path = stripRegex(path, '');
    const getUrlParts = /(\/?:?[\w%\s:-]+)/g;
    const hashParts = hash.match(getUrlParts) || [];
    const routeParts = path.match(getUrlParts) || [];
    const getNamedGroup = /^\/:([\w-]+)\/?/;
    return routeParts.reduce((storage, value, index) => {
      const match = getNamedGroup.exec(value);
      if (match && match.length) {
        storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')));
      }
      return storage;
    }, new Map());
  };
  const getOption = (stack, prop) => {
    // eslint-disable-next-line
    if (stack && stack.hasOwnProperty(prop)) {
      return stack[prop];
    }
    // we explicitly return undefined since we're testing
    // for explicit test values
  };

  /**
   * create and return new Route instance
   * @param config
   */
  const createRoute = config => {
    // we need to provide a bit of additional logic
    // for the bootComponent
    if (config.path === '$') {
      let options = {
        preventStorage: true
      };
      if (isObject(config.options)) {
        options = {
          ...config.options,
          ...options
        };
      }
      config.options = options;
      // if configured add reference to bootRequest
      // as router after provider
      if (bootRequest) {
        config.after = bootRequest;
      }
    }
    return new Route(config);
  };

  /**
   * Create a new Router request object
   * @param url
   * @param args
   * @param store
   * @returns {*}
   */
  const createRequest = (url, args, store) => {
    return new Request(url, args, store);
  };
  const getHashByName = obj => {
    if (!obj.to && !obj.name) {
      return false;
    }
    const route = getRouteByName(obj.to || obj.name);
    const hasDynamicGroup = /\/:([\w-]+)\/?/;
    let hash = route;

    // if route contains dynamic group
    // we replace them with the provided params
    if (hasDynamicGroup.test(route)) {
      if (obj.params) {
        const keys = Object.keys(obj.params);
        hash = keys.reduce((acc, key) => {
          return acc.replace(":".concat(key), obj.params[key]);
        }, route);
      }
      if (obj.query) {
        return "".concat(hash).concat(objectToQueryString(obj.query));
      }
    }
    return hash;
  };
  const getRouteByName = name => {
    for (let [path, route] of routes$1.entries()) {
      if (route.name === name) {
        return path;
      }
    }
    return false;
  };
  const keepActivePageAlive = (route, request) => {
    if (isString(route)) {
      const routes = getRoutes();
      if (routes.has(route)) {
        route = routes.get(route);
      } else {
        return false;
      }
    }
    const register = request.register;
    const routeOptions = route.options;
    if (register.has('keepAlive')) {
      return register.get('keepAlive');
    } else if (routeOptions && routeOptions.keepAlive) {
      return routeOptions.keepAlive;
    }
    return false;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var emit$1 = (function (page) {
    let events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!isArray(events)) {
      events = [events];
    }
    events.forEach(e => {
      const event = "_on".concat(ucfirst(e));
      if (isFunction(page[event])) {
        page[event](params);
      }
    });
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let activeWidget = null;
  const getReferences = () => {
    if (!widgetsHost) {
      return;
    }
    return widgetsHost.get().reduce((storage, widget) => {
      const key = widget.ref.toLowerCase();
      storage[key] = widget;
      return storage;
    }, {});
  };

  /**
   * update the visibility of the available widgets
   * for the current page / route
   * @param page
   */
  const updateWidgets = (widgets, page) => {
    // force lowercase lookup
    const configured = (widgets || []).map(ref => ref.toLowerCase());
    widgetsHost.forEach(widget => {
      widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1;
      if (widget.visible) {
        emit$1(widget, ['activated'], page);
      }
    });
    if (app.state === 'Widgets' && activeWidget && !activeWidget.visible) {
      app._setState('');
    }
  };
  const getWidgetByName = name => {
    name = ucfirst(name);
    return widgetsHost.getByRef(name) || false;
  };

  /**
   * delegate app focus to a on-screen widget
   * @param name - {string}
   */
  const focusWidget = name => {
    const widget = getWidgetByName(name);
    if (widget) {
      setActiveWidget(widget);

      // if app is already in 'Widgets' state we can assume that
      // focus has been delegated from one widget to another so
      // we need to set the new widget reference and trigger a
      // new focus calculation of Lightning's focuspath
      if (app.state === 'Widgets') {
        app.reload(activeWidget);
      } else {
        app._setState('Widgets', [activeWidget]);
      }
    }
  };
  const restoreFocus = () => {
    activeWidget = null;
    app._setState('');
  };
  const getActiveWidget = () => {
    return activeWidget;
  };
  const setActiveWidget = instance => {
    activeWidget = instance;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const createComponent = (stage, type) => {
    return stage.c({
      type,
      visible: false,
      widgets: getReferences()
    });
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Simple flat array that holds the visited hashes + state Object
   * so the router can navigate back to them
   * @type {Array}
   */
  let history = [];
  const updateHistory = request => {
    const hash = getActiveHash();
    if (!hash) {
      return;
    }

    // navigate storage flag
    const register = request.register;
    const forceNavigateStore = register.get(symbols.store);

    // test preventStorage on route configuration
    const activeRoute = getRouteByHash(hash);
    const preventStorage = getOption(activeRoute.options, 'preventStorage');

    // we give prio to navigate storage flag
    let store = isBoolean(forceNavigateStore) ? forceNavigateStore : !preventStorage;
    if (store) {
      const toStore = hash.replace(/^\//, '');
      const location = locationInHistory(toStore);
      const stateObject = getStateObject(getActivePage(), request);
      const routerConfig = getRouterConfig();

      // store hash if it's not a part of history or flag for
      // storage of same hash is true
      if (location === -1 || routerConfig.get('storeSameHash')) {
        history.push({
          hash: toStore,
          state: stateObject
        });
      } else {
        // if we visit the same route we want to sync history
        const prev = history.splice(location, 1)[0];
        history.push({
          hash: prev.hash,
          state: stateObject
        });
      }
    }
  };
  const locationInHistory = hash => {
    for (let i = 0; i < history.length; i++) {
      if (history[i].hash === hash) {
        return i;
      }
    }
    return -1;
  };
  const getHistoryState = hash => {
    let state = null;
    if (history.length) {
      // if no hash is provided we get the last
      // pushed history record
      if (!hash) {
        const record = history[history.length - 1];
        // could be null
        state = record.state;
      } else {
        if (locationInHistory(hash) !== -1) {
          const record = history[locationInHistory(hash)];
          state = record.state;
        }
      }
    }
    return state;
  };
  const replaceHistoryState = function () {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let hash = arguments.length > 1 ? arguments[1] : undefined;
    if (!history.length) {
      return;
    }
    const location = hash ? locationInHistory(hash) : history.length - 1;
    if (location !== -1 && isObject(state)) {
      history[location].state = state;
    }
  };
  const getStateObject = (page, request) => {
    // if the new request shared instance with the
    // previous request we used the copied state object
    if (request.isSharedInstance) {
      if (request.copiedHistoryState) {
        return request.copiedHistoryState;
      }
    } else if (page && isFunction(page.historyState)) {
      return page.historyState();
    }
    return null;
  };
  const getHistory = () => {
    return history.slice(0);
  };
  const setHistory = function () {
    let arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (isArray(arr)) {
      history = arr;
    }
  };

  var isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };
  function isNonNullObject(value) {
    return !!value && typeof value === 'object';
  }
  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
  }

  // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
  var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;
  function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
  }
  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }
  function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
  }
  function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function (element) {
      return cloneUnlessOtherwiseSpecified(element, options);
    });
  }
  function getMergeFunction(key, options) {
    if (!options.customMerge) {
      return deepmerge;
    }
    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepmerge;
  }
  function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
      return target.propertyIsEnumerable(symbol);
    }) : [];
  }
  function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
  }
  function propertyIsOnObject(object, property) {
    try {
      return property in object;
    } catch (_) {
      return false;
    }
  }

  // Protects from prototype poisoning and unexpected merging up the prototype chain.
  function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    && Object.propertyIsEnumerable.call(target, key)); // and also unsafe if they're nonenumerable.
  }

  function mergeObject(target, source, options) {
    var destination = {};
    if (options.isMergeableObject(target)) {
      getKeys(target).forEach(function (key) {
        destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
      });
    }
    getKeys(source).forEach(function (key) {
      if (propertyIsUnsafe(target, key)) {
        return;
      }
      if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
        destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
      } else {
        destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
      }
    });
    return destination;
  }
  function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
      return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
      return options.arrayMerge(target, source, options);
    } else {
      return mergeObject(target, source, options);
    }
  }
  deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
      throw new Error('first argument should be an array');
    }
    return array.reduce(function (prev, next) {
      return deepmerge(prev, next, options);
    }, {});
  };
  var deepmerge_1 = deepmerge;
  var cjs = deepmerge_1;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let warned = false;
  const deprecated = function () {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (force === true || warned === false) {
      console.warn(["The 'Locale'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.", "Please consider using the new 'Language'-plugin instead.", 'https://rdkcentral.github.io/Lightning-SDK/#/plugins/language'].join('\n\n'));
    }
    warned = true;
  };
  class Locale {
    constructor() {
      this.__enabled = false;
    }

    /**
     * Loads translation object from external json file.
     *
     * @param {String} path Path to resource.
     * @return {Promise}
     */
    async load(path) {
      if (!this.__enabled) {
        return;
      }
      await fetch(path).then(resp => resp.json()).then(resp => {
        this.loadFromObject(resp);
      });
    }

    /**
     * Sets language used by module.
     *
     * @param {String} lang
     */
    setLanguage(lang) {
      deprecated();
      this.__enabled = true;
      this.language = lang;
    }

    /**
     * Returns reference to translation object for current language.
     *
     * @return {Object}
     */
    get tr() {
      deprecated(true);
      return this.__trObj[this.language];
    }

    /**
     * Loads translation object from existing object (binds existing object).
     *
     * @param {Object} trObj
     */
    loadFromObject(trObj) {
      deprecated();
      const fallbackLanguage = 'en';
      if (Object.keys(trObj).indexOf(this.language) === -1) {
        Log.warn('No translations found for: ' + this.language);
        if (Object.keys(trObj).indexOf(fallbackLanguage) > -1) {
          Log.warn('Using fallback language: ' + fallbackLanguage);
          this.language = fallbackLanguage;
        } else {
          const error = 'No translations found for fallback language: ' + fallbackLanguage;
          Log.error(error);
          throw Error(error);
        }
      }
      this.__trObj = trObj;
      for (const lang of Object.values(this.__trObj)) {
        for (const str of Object.keys(lang)) {
          lang[str] = new LocalizedString(lang[str]);
        }
      }
    }
  }

  /**
   * Extended string class used for localization.
   */
  class LocalizedString extends String {
    /**
     * Returns formatted LocalizedString.
     * Replaces each placeholder value (e.g. {0}, {1}) with corresponding argument.
     *
     * E.g.:
     * > new LocalizedString('{0} and {1} and {0}').format('A', 'B');
     * A and B and A
     *
     * @param  {...any} args List of arguments for placeholders.
     */
    format() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const sub = args.reduce((string, arg, index) => string.split("{".concat(index, "}")).join(arg), this);
      return new LocalizedString(sub);
    }
  }
  var Locale$1 = new Locale();

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class VersionLabel extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        color: 0xbb0078ac,
        h: 40,
        w: 100,
        x: w => w - 50,
        y: h => h - 50,
        mount: 1,
        Text: {
          w: w => w,
          h: h => h,
          y: 5,
          x: 20,
          text: {
            fontSize: 22,
            lineHeight: 26
          }
        }
      };
    }
    _firstActive() {
      this.tag('Text').text = "APP - v".concat(this.version, "\nSDK - v").concat(this.sdkVersion);
      this.tag('Text').loadTexture();
      this.w = this.tag('Text').renderWidth + 40;
      this.h = this.tag('Text').renderHeight + 5;
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class FpsIndicator extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        color: 0xffffffff,
        texture: Lightning.Tools.getRoundRect(80, 80, 40),
        h: 80,
        w: 80,
        x: 100,
        y: 100,
        mount: 1,
        Background: {
          x: 3,
          y: 3,
          texture: Lightning.Tools.getRoundRect(72, 72, 36),
          color: 0xff008000
        },
        Counter: {
          w: w => w,
          h: h => h,
          y: 10,
          text: {
            fontSize: 32,
            textAlign: 'center'
          }
        },
        Text: {
          w: w => w,
          h: h => h,
          y: 48,
          text: {
            fontSize: 15,
            textAlign: 'center',
            text: 'FPS'
          }
        }
      };
    }
    _setup() {
      this.config = {
        ...{
          log: false,
          interval: 500,
          threshold: 1
        },
        ...Settings$2.get('platform', 'showFps')
      };
      this.fps = 0;
      this.lastFps = this.fps - this.config.threshold;
      const fpsCalculator = () => {
        this.fps = ~~(1 / this.stage.dt);
      };
      this.stage.on('frameStart', fpsCalculator);
      this.stage.off('framestart', fpsCalculator);
      this.interval = setInterval(this.showFps.bind(this), this.config.interval);
    }
    _firstActive() {
      this.showFps();
    }
    _detach() {
      clearInterval(this.interval);
    }
    showFps() {
      if (Math.abs(this.lastFps - this.fps) <= this.config.threshold) return;
      this.lastFps = this.fps;
      // green
      let bgColor = 0xff008000;
      // orange
      if (this.fps <= 40 && this.fps > 20) bgColor = 0xffffa500;
      // red
      else if (this.fps <= 20) bgColor = 0xffff0000;
      this.tag('Background').setSmooth('color', bgColor);
      this.tag('Counter').text = "".concat(this.fps);
      this.config.log && Log.info('FPS', this.fps);
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let meta = {};
  let translations = {};
  let language = null;
  const initLanguage = function (file) {
    let language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return new Promise((resolve, reject) => {
      fetch(file).then(response => response.json()).then(json => {
        setTranslations(json);
        // set language (directly or in a promise)
        typeof language === 'object' && 'then' in language && typeof language.then === 'function' ? language.then(lang => setLanguage(lang).then(resolve).catch(reject)).catch(e => {
          Log.error(e);
          reject(e);
        }) : setLanguage(language).then(resolve).catch(reject);
      }).catch(() => {
        const error = 'Language file ' + file + ' not found';
        Log.error(error);
        reject(error);
      });
    });
  };
  const setTranslations = obj => {
    if ('meta' in obj) {
      meta = {
        ...obj.meta
      };
      delete obj.meta;
    }
    translations = obj;
  };
  const setLanguage = lng => {
    language = null;
    return new Promise((resolve, reject) => {
      if (lng in translations) {
        language = lng;
      } else {
        if ('map' in meta && lng in meta.map && meta.map[lng] in translations) {
          language = meta.map[lng];
        } else if ('default' in meta && meta.default in translations) {
          const error = 'Translations for Language ' + language + ' not found. Using default language ' + meta.default;
          Log.warn(error);
          language = meta.default;
        } else {
          const error = 'Translations for Language ' + language + ' not found.';
          Log.error(error);
          reject(error);
        }
      }
      if (language) {
        Log.info('Setting language to', language);
        const translationsObj = translations[language];
        if (typeof translationsObj === 'object') {
          resolve();
        } else if (typeof translationsObj === 'string') {
          const url = Utils.asset(translationsObj);
          fetch(url).then(response => response.json()).then(json => {
            // save the translations for this language (to prevent loading twice)
            translations[language] = json;
            resolve();
          }).catch(e => {
            const error = 'Error while fetching ' + url;
            Log.error(error, e);
            reject(error);
          });
        }
      }
    });
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const registry = {
    eventListeners: [],
    timeouts: [],
    intervals: [],
    targets: []
  };
  var Registry = {
    // Timeouts
    setTimeout(cb, timeout) {
      for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
      }
      const timeoutId = setTimeout(() => {
        registry.timeouts = registry.timeouts.filter(id => id !== timeoutId);
        cb.apply(null, params);
      }, timeout, params);
      Log.info('Set Timeout', 'ID: ' + timeoutId);
      registry.timeouts.push(timeoutId);
      return timeoutId;
    },
    clearTimeout(timeoutId) {
      if (registry.timeouts.indexOf(timeoutId) > -1) {
        registry.timeouts = registry.timeouts.filter(id => id !== timeoutId);
        Log.info('Clear Timeout', 'ID: ' + timeoutId);
        clearTimeout(timeoutId);
      } else {
        Log.error('Clear Timeout', 'ID ' + timeoutId + ' not found');
      }
    },
    clearTimeouts() {
      registry.timeouts.forEach(timeoutId => {
        this.clearTimeout(timeoutId);
      });
    },
    // Intervals
    setInterval(cb, interval) {
      for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        params[_key2 - 2] = arguments[_key2];
      }
      const intervalId = setInterval(() => {
        registry.intervals.filter(id => id !== intervalId);
        cb.apply(null, params);
      }, interval, params);
      Log.info('Set Interval', 'ID: ' + intervalId);
      registry.intervals.push(intervalId);
      return intervalId;
    },
    clearInterval(intervalId) {
      if (registry.intervals.indexOf(intervalId) > -1) {
        registry.intervals = registry.intervals.filter(id => id !== intervalId);
        Log.info('Clear Interval', 'ID: ' + intervalId);
        clearInterval(intervalId);
      } else {
        Log.error('Clear Interval', 'ID ' + intervalId + ' not found');
      }
    },
    clearIntervals() {
      registry.intervals.forEach(intervalId => {
        this.clearInterval(intervalId);
      });
    },
    // Event listeners
    addEventListener(target, event, handler) {
      target.addEventListener(event, handler);
      const targetIndex = registry.targets.indexOf(target) > -1 ? registry.targets.indexOf(target) : registry.targets.push(target) - 1;
      registry.eventListeners[targetIndex] = registry.eventListeners[targetIndex] || {};
      registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event] || [];
      registry.eventListeners[targetIndex][event].push(handler);
      Log.info('Add eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler.toString());
    },
    removeEventListener(target, event, handler) {
      const targetIndex = registry.targets.indexOf(target);
      if (targetIndex > -1 && registry.eventListeners[targetIndex] && registry.eventListeners[targetIndex][event] && registry.eventListeners[targetIndex][event].indexOf(handler) > -1) {
        registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event].filter(fn => fn !== handler);
        Log.info('Remove eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler.toString());
        target.removeEventListener(event, handler);
      } else {
        Log.error('Remove eventListener', 'Not found', 'Target', target, 'Event: ' + event, 'Handler', handler.toString());
      }
    },
    // if `event` is omitted, removes all registered event listeners for target
    // if `target` is also omitted, removes all registered event listeners
    removeEventListeners(target, event) {
      if (target && event) {
        const targetIndex = registry.targets.indexOf(target);
        if (targetIndex > -1) {
          registry.eventListeners[targetIndex][event].forEach(handler => {
            this.removeEventListener(target, event, handler);
          });
        }
      } else if (target) {
        const targetIndex = registry.targets.indexOf(target);
        if (targetIndex > -1) {
          Object.keys(registry.eventListeners[targetIndex]).forEach(_event => {
            this.removeEventListeners(target, _event);
          });
        }
      } else {
        Object.keys(registry.eventListeners).forEach(targetIndex => {
          this.removeEventListeners(registry.targets[targetIndex]);
        });
      }
    },
    // Clear everything (to be called upon app close for proper cleanup)
    clear() {
      this.clearTimeouts();
      this.clearIntervals();
      this.removeEventListeners();
      registry.eventListeners = [];
      registry.timeouts = [];
      registry.intervals = [];
      registry.targets = [];
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const isObject$1 = v => {
    return typeof v === 'object' && v !== null;
  };
  const isString$1 = v => {
    return typeof v === 'string';
  };
  const getRgbaComponents = argb => {
    return {
      r: (argb / 65536 | 0) % 256,
      g: (argb / 256 | 0) % 256,
      b: argb * 1 % 256,
      a: argb / 16777216 | 0
    };
  };
  const mergeColors = (c1, c2, p) => {
    let r1 = (c1 / 65536 | 0) % 256;
    let g1 = (c1 / 256 | 0) % 256;
    let b1 = c1 % 256;
    let a1 = c1 / 16777216 | 0;
    let r2 = (c2 / 65536 | 0) % 256;
    let g2 = (c2 / 256 | 0) % 256;
    let b2 = c2 % 256;
    let a2 = c2 / 16777216 | 0;
    let r = r1 * p + r2 * (1 - p);
    let g = g1 * p + g2 * (1 - p);
    let b = b1 * p + b2 * (1 - p);
    let a = a1 * p + a2 * (1 - p);
    return Math.round(a) * 16777216 + Math.round(r) * 65536 + Math.round(g) * 256 + Math.round(b);
  };
  const calculateAlpha = (argb, p) => {
    if (p > 1) {
      p /= 100;
    } else if (p < 0) {
      p = 0;
    }
    let r = (argb / 65536 | 0) % 256;
    let g = (argb / 256 | 0) % 256;
    let b = argb % 256;
    return (r << 16) + (g << 8) + b + (p * 255 | 0) * 16777216;
  };
  const getArgbNumber = rgba => {
    rgba[0] = Math.max(0, Math.min(255, rgba[0]));
    rgba[1] = Math.max(0, Math.min(255, rgba[1]));
    rgba[2] = Math.max(0, Math.min(255, rgba[2]));
    rgba[3] = Math.max(0, Math.min(255, rgba[3]));
    let v = ((rgba[3] | 0) << 24) + ((rgba[0] | 0) << 16) + ((rgba[1] | 0) << 8) + (rgba[2] | 0);
    if (v < 0) {
      v = 0xffffffff + v + 1;
    }
    return v;
  };
  const argbToHSLA = argb => {
    const col = getRgbaComponents(argb);
    const r = col.r / 255;
    const g = col.g / 255;
    const b = col.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (min + max) * 0.5;
    if (l > 0) {
      const maxMin = max - min;
      if (maxMin > 0) {
        const r2 = (max - r) / maxMin;
        const g2 = (max - g) / maxMin;
        const b2 = (max - b) / maxMin;
        if (l < 0.5) {
          s = max + min;
        } else {
          s = 2 - max - min;
        }
        if (r === max && g === min) {
          h = 5.0 + b2;
        } else if (r === max) {
          h = 1.0 - g2;
        } else if (g === max && b === min) {
          h = 1.0 + r2;
        } else if (g === max) {
          h = 3.0 - b2;
        } else if (b === max) {
          h = 3.0 + g2;
        } else {
          h = 5.0 - r2;
        }
        h = h / 6;
      }
    }
    return {
      h: h % 1,
      s,
      l,
      a: col.a
    };
  };
  const hslaToARGB = hsla => {
    let r = 1;
    let g = 1;
    let b = 1;
    let h = hsla.h;
    let s = hsla.s;
    let l = hsla.l;
    if (h < 0) {
      h += 1;
    }
    let max = 0;
    if (l <= 0.5) {
      max = l * (1.0 + s);
    } else {
      max = l + s - l * s;
    }
    if (max > 0) {
      h *= 6.0;
      const min = l + l - max;
      const minMax = (max - min) / max;
      const sextant = Math.floor(h);
      const fract = h - sextant;
      const minMaxFract = max * minMax * fract;
      const mid1 = min + minMaxFract;
      const mid2 = max - minMaxFract;
      if (sextant === 0) {
        r = max;
        g = mid1;
        b = min;
      }
      if (sextant === 1) {
        r = mid2;
        g = max;
        b = min;
      }
      if (sextant === 2) {
        r = min;
        g = max;
        b = mid1;
      }
      if (sextant === 3) {
        r = min;
        g = mid2;
        b = max;
      }
      if (sextant === 4) {
        r = mid1;
        g = min;
        b = max;
      }
      if (sextant === 5) {
        r = max;
        g = min;
        b = mid2;
      }
    }
    return getArgbNumber([Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255), hsla.a]);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let colors = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#feff00',
    cyan: '#00feff',
    magenta: '#ff00ff'
  };
  const normalizedColors = {
    //store for normalized colors
  };
  const addColors = (colorsToAdd, value) => {
    if (isObject$1(colorsToAdd)) {
      // clean up normalizedColors if they exist in the to be added colors
      Object.keys(colorsToAdd).forEach(color => cleanUpNormalizedColors(color));
      colors = Object.assign({}, colors, colorsToAdd);
    } else if (isString$1(colorsToAdd) && value) {
      cleanUpNormalizedColors(colorsToAdd);
      colors[colorsToAdd] = value;
    }
  };
  const cleanUpNormalizedColors = color => {
    for (let c in normalizedColors) {
      if (c.indexOf(color) > -1) {
        delete normalizedColors[c];
      }
    }
  };
  const initColors = file => {
    return new Promise((resolve, reject) => {
      if (typeof file === 'object') {
        addColors(file);
        resolve();
      }
      fetch(file).then(response => response.json()).then(json => {
        addColors(json);
        resolve();
      }).catch(() => {
        const error = 'Colors file ' + file + ' not found';
        Log.error(error);
        reject(error);
      });
    });
  };
  const normalizeColorToARGB = color => {
    let targetColor = normalizedColors[color] || colors[color] || color;
    if (!targetColor) {
      targetColor = color;
    }
    const check = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
    if (isString$1(targetColor) && check.test(targetColor)) {
      let hex = check.exec(targetColor)[1];
      if (hex.length === 3) {
        hex = hex.split('').map(value => {
          return value + value;
        }).join('');
      }
      targetColor = "0xff".concat(hex) * 1;
    }
    if (!normalizedColors[color]) {
      normalizedColors[color] = targetColor;
    }
    return targetColor || 0xffffffff;
  };
  var Colors = (color => {
    return Color.generate(color);
  });
  const Color = {
    color: null,
    generate: function () {
      let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.color;
      if (normalizedColors[value]) {
        this.color = normalizedColors[value];
      } else {
        this.color = normalizeColorToARGB(value);
      }
      return this;
    },
    get() {
      return this.color;
    },
    alpha: function (percentage) {
      this.color = calculateAlpha(this.color, Math.abs(percentage));
      return this;
    },
    darker(percentage) {
      const hsl = argbToHSLA(this.color);
      hsl.l = hsl.l * (1 - percentage);
      this.color = hslaToARGB(hsl);
      return this;
    },
    lighter(percentage) {
      const hsl = argbToHSLA(this.color);
      hsl.l = hsl.l + (1 - hsl.l) * percentage;
      this.color = hslaToARGB(hsl);
      return this;
    },
    saturation(percentage) {
      const hsl = argbToHSLA(this.color);
      hsl.s = percentage;
      this.color = hslaToARGB(hsl);
      return this;
    },
    lightness(percentage) {
      const hsl = argbToHSLA(this.color);
      hsl.l = percentage;
      this.color = hslaToARGB(hsl);
      return this;
    },
    hue(degrees) {
      const hsl = argbToHSLA(this.color);
      hsl.h = degrees;
      this.color = hslaToARGB(hsl);
      return this;
    },
    mix(argb, p) {
      this.color = mergeColors(this.color, argb, p);
      return this;
    }
  };

  var version = "4.6.1";

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let AppInstance;
  const defaultOptions = {
    stage: {
      w: 1920,
      h: 1080,
      clearColor: 0x00000000,
      canvas2d: false
    },
    debug: false,
    defaultFontFace: 'RobotoRegular',
    keys: {
      8: 'Back',
      13: 'Enter',
      27: 'Menu',
      37: 'Left',
      38: 'Up',
      39: 'Right',
      40: 'Down',
      174: 'ChannelDown',
      175: 'ChannelUp',
      178: 'Stop',
      250: 'PlayPause',
      191: 'Search',
      // Use "/" for keyboard
      409: 'Search'
    }
  };
  if (window.innerHeight === 720) {
    defaultOptions.stage['w'] = 1280;
    defaultOptions.stage['h'] = 720;
    defaultOptions.stage['precision'] = 0.6666666667;
  }
  const customFontFaces = [];
  const fontLoader = (fonts, store) => new Promise((resolve, reject) => {
    fonts.map(_ref => {
      let {
        family,
        url,
        urls,
        descriptors
      } = _ref;
      return () => {
        const src = urls ? urls.map(url => {
          return 'url(' + url + ')';
        }) : 'url(' + url + ')';
        const fontFace = new FontFace(family, src, descriptors || {});
        store.push(fontFace);
        Log.info('Loading font', family);
        document.fonts.add(fontFace);
        return fontFace.load();
      };
    }).reduce((promise, method) => {
      return promise.then(() => method());
    }, Promise.resolve(null)).then(resolve).catch(reject);
  });
  function Application (App, appData, platformSettings) {
    return class Application extends Lightning.Application {
      constructor(options) {
        const config = cjs(defaultOptions, options);
        super(config);
        this.config = config;
      }
      static _template() {
        return {
          w: 1920,
          h: 1080
        };
      }
      _setup() {
        Promise.all([this.loadFonts(App.config && App.config.fonts || App.getFonts && App.getFonts() || []),
        // to be deprecated
        Locale$1.load(App.config && App.config.locale || App.getLocale && App.getLocale()), App.language && this.loadLanguage(App.language()), App.colors && this.loadColors(App.colors())]).then(() => {
          Metrics$1.app.loaded();
          AppInstance = this.stage.c({
            ref: 'App',
            type: App,
            zIndex: 1,
            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps
          });
          this.childList.a(AppInstance);
          this._refocus();
          Log.info('App version', this.config.version);
          Log.info('SDK version', version);
          if (platformSettings.showVersion) {
            this.childList.a({
              ref: 'VersionLabel',
              type: VersionLabel,
              version: this.config.version,
              sdkVersion: version,
              zIndex: 1
            });
          }
          if (platformSettings.showFps) {
            this.childList.a({
              ref: 'FpsCounter',
              type: FpsIndicator,
              zIndex: 1
            });
          }
          super._setup();
        }).catch(console.error);
      }
      _handleBack() {
        this.closeApp();
      }
      _handleExit() {
        this.closeApp();
      }
      closeApp() {
        Log.info('Signaling App Close');
        if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
          platformSettings.onClose(...arguments);
        } else {
          this.close();
        }
      }
      close() {
        Log.info('Closing App');
        Settings$2.clearSubscribers();
        Registry.clear();
        this.childList.remove(this.tag('App'));
        this.cleanupFonts();
        // force texture garbage collect
        this.stage.gc();
        this.destroy();
      }
      loadFonts(fonts) {
        return platformSettings.fontLoader && typeof platformSettings.fontLoader === 'function' ? platformSettings.fontLoader(fonts, customFontFaces) : fontLoader(fonts, customFontFaces);
      }
      cleanupFonts() {
        if ('delete' in document.fonts) {
          customFontFaces.forEach(fontFace => {
            Log.info('Removing font', fontFace.family);
            document.fonts.delete(fontFace);
          });
        } else {
          Log.info('No support for removing manually-added fonts');
        }
      }
      loadLanguage(config) {
        let file = Utils.asset('translations.json');
        let language = config;
        if (typeof language === 'object') {
          language = config.language || null;
          file = config.file || file;
        }
        return initLanguage(file, language);
      }
      loadColors(config) {
        let file = Utils.asset('colors.json');
        if (config && (typeof config === 'string' || typeof config === 'object')) {
          file = config;
        }
        return initColors(file);
      }
      set focus(v) {
        this._focussed = v;
        this._refocus();
      }
      _getFocused() {
        return this._focussed || this.tag('App');
      }
    };
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * @type {Lightning.Application}
   */
  let application;

  /**
   * Actual instance of the app
   * @type {Lightning.Component}
   */
  let app;

  /**
   * Component that hosts all routed pages
   * @type {Lightning.Component}
   */
  let pagesHost;

  /**
   * @type {Lightning.Stage}
   */
  let stage$1;

  /**
   * Platform driven Router configuration
   * @type {Map<string>}
   */
  let routerConfig;

  /**
   * Component that hosts all attached widgets
   * @type {Lightning.Component}
   */
  let widgetsHost;

  /**
   * Hash we point the browser to when we boot the app
   * and there is no deep-link provided
   * @type {string|Function}
   */
  let rootHash;

  /**
   * Boot request will fire before app start
   * can be used to execute some global logic
   * and can be configured
   */
  let bootRequest;

  /**
   * Flag if we need to update the browser location hash.
   * Router can work without.
   * @type {boolean}
   */
  let updateHash = true;

  /**
   * Will be called before a route starts, can be overridden
   * via routes config
   * @param from - route we came from
   * @param to - route we navigate to
   * @returns {Promise<*>}
   */
  // eslint-disable-next-line
  let beforeEachRoute = async (from, to) => {
    return true;
  };

  /**
   *  * Will be called after a navigate successfully resolved,
   * can be overridden via routes config
   */
  let afterEachRoute = () => {};

  /**
   * All configured routes
   * @type {Map<string, object>}
   */
  let routes$1 = new Map();

  /**
   * Store all page components per route
   * @type {Map<string, object>}
   */
  let components = new Map();

  /**
   * Flag if router has been initialised
   * @type {boolean}
   */
  let initialised = false;

  /**
   * Current page being rendered on screen
   * @type {null}
   */
  let activePage = null;
  let activeHash;
  let activeRoute;

  /**
   *  During the process of a navigation request a new
   *  request can start, to prevent unwanted behaviour
   *  the navigate()-method stores the last accepted hash
   *  so we can invalidate any prior requests
   */
  let lastAcceptedHash;

  /**
   * With on()-data providing behaviour the Router forced the App
   * in a Loading state. When the data-provider resolves we want to
   * change the state back to where we came from
   */
  let previousState;
  const mixin = app => {
    // by default the Router Baseclass provides the component
    // reference in which we store our pages
    if (app.pages) {
      pagesHost = app.pages.childList;
    }
    // if the app is using widgets we grab refs
    // and hide all the widgets
    if (app.widgets && app.widgets.children) {
      widgetsHost = app.widgets.childList;
      // hide all widgets on boot
      widgetsHost.forEach(w => w.visible = false);
    }
    app._handleBack = e => {
      step(-1);
      e.preventDefault();
    };
  };
  const bootRouter = (config, instance) => {
    let {
      appInstance,
      routes
    } = config;

    // if instance is provided and it's and Lightning Component instance
    if (instance && isPage(instance)) {
      app = instance;
    }
    if (!app) {
      app = appInstance || AppInstance;
    }
    application = app.application;
    pagesHost = application.childList;
    stage$1 = app.stage;
    routerConfig = getConfigMap();
    mixin(app);
    if (isArray(routes)) {
      setup(config);
    } else if (isFunction(routes)) {
      console.warn('[Router]: Calling Router.route() directly is deprecated.');
      console.warn('Use object config: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    }
  };
  const setup = config => {
    if (!initialised) {
      init$1(config);
    }
    config.routes.forEach(r => {
      const path = cleanHash(r.path);
      if (!routeExists(path)) {
        const route = createRoute(r);
        routes$1.set(path, route);
        // if route has a configured component property
        // we store it in a different map to simplify
        // the creating and destroying per route
        if (route.component) {
          let type = route.component;
          if (isComponentConstructor(type)) {
            if (!routerConfig.get('lazyCreate')) {
              type = createComponent(stage$1, type);
              pagesHost.a(type);
            }
          }
          components.set(path, type);
        }
      } else {
        console.error("".concat(path, " already exists in routes configuration"));
      }
    });
  };
  const init$1 = config => {
    rootHash = config.root;
    if (isFunction(config.boot)) {
      bootRequest = config.boot;
    }
    if (isBoolean(config.updateHash)) {
      updateHash = config.updateHash;
    }
    if (isFunction(config.beforeEachRoute)) {
      beforeEachRoute = config.beforeEachRoute;
    }
    if (isFunction(config.afterEachRoute)) {
      afterEachRoute = config.afterEachRoute;
    }
    if (config.bootComponent) {
      console.warn('[Router]: Boot Component is now available as a special router: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration?id=special-routes');
      console.warn('[Router]: setting { bootComponent } property will be deprecated in a future release');
      if (isPage(config.bootComponent)) {
        config.routes.push({
          path: '$',
          component: config.bootComponent,
          // we try to assign the bootRequest as after data-provider
          // so it will behave as any other component
          after: bootRequest || null,
          options: {
            preventStorage: true
          }
        });
      } else {
        console.error("[Router]: ".concat(config.bootComponent, " is not a valid boot component"));
      }
    }
    initialised = true;
  };
  const storeComponent = (route, type) => {
    if (components.has(route)) {
      components.set(route, type);
    }
  };
  const getComponent = route => {
    if (components.has(route)) {
      return components.get(route);
    }
    return null;
  };
  /**
   * Test if router needs to update browser location hash
   * @returns {boolean}
   */
  const mustUpdateLocationHash = () => {
    if (!routerConfig || !routerConfig.size) {
      return false;
    }
    // we need support to either turn change hash off
    // per platform or per app
    const updateConfig = routerConfig.get('updateHash');
    return !(isBoolean(updateConfig) && !updateConfig || isBoolean(updateHash) && !updateHash);
  };

  /**
   * Will be called when a new navigate() request has completed
   * and has not been expired due to it's async nature
   * @param request
   */
  const onRequestResolved = request => {
    const hash = request.hash;
    const route = request.route;
    const register = request.register;
    const page = request.page;

    // clean up history if modifier is set
    if (getOption(route.options, 'clearHistory')) {
      setHistory([]);
    } else if (hash && !isWildcard.test(route.path)) {
      updateHistory(request);
    }

    // we only update the stackLocation if a route
    // is not expired before it resolves
    storeComponent(route.path, page);
    if (request.isSharedInstance || !request.isCreated) {
      emit$1(page, 'changed');
    } else if (request.isCreated) {
      emit$1(page, 'mounted');
    }

    // only update widgets if we have a host
    if (widgetsHost) {
      updateWidgets(route.widgets, page);
    }

    // we want to clean up if there is an
    // active page that is not being shared
    // between current and previous route
    if (getActivePage() && !request.isSharedInstance) {
      cleanUp(activePage, request);
    }

    // provide history object to active page
    if (register.get(symbols.historyState) && isFunction(page.historyState)) {
      page.historyState(register.get(symbols.historyState));
    }
    setActivePage(page);
    activeHash = request.hash;
    activeRoute = route.path;

    // cleanup all cancelled requests
    for (let request of navigateQueue.values()) {
      if (request.isCancelled && request.hash) {
        navigateQueue.delete(request.hash);
      }
    }
    afterEachRoute(request);
    Log.info('[route]:', route.path);
    Log.info('[hash]:', hash);
  };
  const cleanUp = (page, request) => {
    const route = activeRoute;
    const register = request.register;
    const lazyDestroy = routerConfig.get('lazyDestroy');
    const destroyOnBack = routerConfig.get('destroyOnHistoryBack');
    const keepAlive = register.get('keepAlive');
    const isFromHistory = register.get(symbols.backtrack);
    let doCleanup = false;

    // if this request is executed due to a step back in history
    // and we have configured to destroy active page when we go back
    // in history or lazyDestory is enabled
    if (isFromHistory && (destroyOnBack || lazyDestroy)) {
      doCleanup = true;
    }

    // clean up if lazyDestroy is enabled and the keepAlive flag
    // in navigation register is false
    if (lazyDestroy && !keepAlive) {
      doCleanup = true;
    }

    // if the current and new request share the same route blueprint
    if (activeRoute === request.route.path) {
      doCleanup = true;
    }
    if (doCleanup) {
      // grab original class constructor if
      // statemachine routed else store constructor
      storeComponent(route, page._routedType || page.constructor);

      // actual remove of page from memory
      pagesHost.remove(page);

      // force texture gc() if configured
      // so we can cleanup textures in the same tick
      if (routerConfig.get('gcOnUnload')) {
        stage$1.gc();
      }
    } else {
      // If we're not removing the page we need to
      // reset it's properties
      page.patch({
        x: 0,
        y: 0,
        scale: 1,
        alpha: 1,
        visible: false
      });
    }
  };
  const getActiveHash = () => {
    return activeHash;
  };
  const setActivePage = page => {
    activePage = page;
  };
  const getActivePage = () => {
    return activePage;
  };
  const getActiveRoute = () => {
    return activeRoute;
  };
  const getLastHash = () => {
    return lastAcceptedHash;
  };
  const setLastHash = hash => {
    lastAcceptedHash = hash;
  };
  const getPreviousState = () => {
    return previousState;
  };
  const routeExists = key => {
    return routes$1.has(key);
  };
  const getRootHash = () => {
    return rootHash;
  };
  const getBootRequest = () => {
    return bootRequest;
  };
  const getRouterConfig = () => {
    return routerConfig;
  };
  const getRoutes = () => {
    return routes$1;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const isFunction = v => {
    return typeof v === 'function';
  };
  const isObject = v => {
    return typeof v === 'object' && v !== null;
  };
  const isBoolean = v => {
    return typeof v === 'boolean';
  };
  const isPage = v => {
    if (v instanceof Lightning.Element || isComponentConstructor(v)) {
      return true;
    }
    return false;
  };
  const isComponentConstructor = type => {
    return type.prototype && 'isComponent' in type.prototype;
  };
  const isArray = v => {
    return Array.isArray(v);
  };
  const ucfirst = v => {
    return "".concat(v.charAt(0).toUpperCase()).concat(v.slice(1));
  };
  const isString = v => {
    return typeof v === 'string';
  };
  const isPromise = method => {
    let result;
    if (isFunction(method)) {
      try {
        result = method.apply(null);
      } catch (e) {
        result = e;
      }
    } else {
      result = method;
    }
    return isObject(result) && isFunction(result.then);
  };
  const cleanHash = function () {
    let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return hash.replace(/^#/, '').replace(/\/+$/, '');
  };
  const getConfigMap = () => {
    const routerSettings = Settings$2.get('platform', 'router');
    const isObj = isObject(routerSettings);
    return ['backtrack', 'gcOnUnload', 'destroyOnHistoryBack', 'lazyCreate', 'lazyDestroy', 'reuseInstance', 'autoRestoreRemote', 'numberNavigation', 'updateHash', 'storeSameHash'].reduce((config, key) => {
      config.set(key, isObj ? routerSettings[key] : Settings$2.get('platform', key));
      return config;
    }, new Map());
  };
  const getQueryStringParams = function () {
    let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getActiveHash();
    const resumeHash = getResumeHash();
    if (hash === '$' || resumeHash) {
      if (isString(resumeHash)) {
        hash = resumeHash;
      }
    }
    let parse = '';
    const getQuery = /([?&].*)/;
    const matches = getQuery.exec(hash);
    const params = {};
    if (document.location && document.location.search) {
      parse = document.location.search;
    }
    if (matches && matches.length) {
      let hashParams = matches[1];
      if (parse) {
        // if location.search is not empty we
        // remove the leading ? to create a
        // valid string
        hashParams = hashParams.replace(/^\?/, '');
        // we parse hash params last so they we can always
        // override search params with hash params
        parse = "".concat(parse, "&").concat(hashParams);
      } else {
        parse = hashParams;
      }
    }
    if (parse) {
      const urlParams = new URLSearchParams(parse);
      for (const [key, value] of urlParams.entries()) {
        params[key] = value;
      }
      return params;
    } else {
      return false;
    }
  };
  const objectToQueryString = obj => {
    if (!isObject(obj)) {
      return '';
    }
    return '?' + Object.keys(obj).map(key => {
      return "".concat(key, "=").concat(obj[key]);
    }).join('&');
  };
  const symbols = {
    route: Symbol('route'),
    hash: Symbol('hash'),
    store: Symbol('store'),
    fromHistory: Symbol('fromHistory'),
    expires: Symbol('expires'),
    resume: Symbol('resume'),
    backtrack: Symbol('backtrack'),
    historyState: Symbol('historyState'),
    queryParams: Symbol('queryParams')
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const dataHooks = {
    on: request => {
      app.state || '';
      app._setState('Loading');
      return execProvider(request);
    },
    before: request => {
      return execProvider(request);
    },
    after: request => {
      try {
        execProvider(request, true);
      } catch (e) {
        // for now we fail silently
      }
      return Promise.resolve();
    }
  };
  const execProvider = (request, emitProvided) => {
    const route = request.route;
    const provider = route.provider;
    const expires = route.cache ? route.cache * 1000 : 0;
    const params = addPersistData(request);
    return provider.request(request.page, {
      ...params
    }).then(() => {
      request.page[symbols.expires] = Date.now() + expires;
      if (emitProvided) {
        emit$1(request.page, 'dataProvided');
      }
    });
  };
  const addPersistData = _ref => {
    let {
      page,
      route,
      hash,
      register = new Map()
    } = _ref;
    const urlValues = getValuesFromHash(hash, route.path);
    const queryParams = getQueryStringParams(hash);
    const pageData = new Map([...urlValues, ...register]);
    const params = {};

    // make dynamic url data available to the page
    // as instance properties
    for (let [name, value] of pageData) {
      params[name] = value;
    }
    if (queryParams) {
      params[symbols.queryParams] = queryParams;
    }

    // check navigation register for persistent data
    if (register.size) {
      const obj = {};
      for (let [k, v] of register) {
        obj[k] = v;
      }
      page.persist = obj;
    }

    // make url data and persist data available
    // via params property
    page.params = params;
    emit$1(page, ['urlParams'], params);
    return params;
  };

  /**
   * Test if page passed cache-time
   * @param page
   * @returns {boolean}
   */
  const isPageExpired = page => {
    if (!page[symbols.expires]) {
      return false;
    }
    const expires = page[symbols.expires];
    const now = Date.now();
    return now >= expires;
  };
  const hasProvider = path => {
    if (routeExists(path)) {
      const record = routes$1.get(path);
      return !!record.provider;
    }
    return false;
  };
  const getProvider = route => {
    // @todo: fix, route already is passed in
    if (routeExists(route.path)) {
      const {
        provider
      } = routes$1.get(route.path);
      return {
        type: provider.type,
        provider: provider.request
      };
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  const fade = (i, o) => {
    return new Promise(resolve => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, {
            duration: 0.5,
            delay: 0.1
          }]
        }
      });
      // resolve on y finish
      i.transition('alpha').on('finish', () => {
        if (o) {
          o.visible = false;
        }
        resolve();
      });
    });
  };
  const crossFade = (i, o) => {
    return new Promise(resolve => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, {
            duration: 0.5,
            delay: 0.1
          }]
        }
      });
      if (o) {
        o.patch({
          smooth: {
            alpha: [0, {
              duration: 0.5,
              delay: 0.3
            }]
          }
        });
      }
      // resolve on y finish
      i.transition('alpha').on('finish', () => {
        resolve();
      });
    });
  };
  const moveOnAxes = (axis, direction, i, o) => {
    const bounds = axis === 'x' ? 1920 : 1080;
    return new Promise(resolve => {
      i.patch({
        ["".concat(axis)]: direction ? bounds * -1 : bounds,
        visible: true,
        smooth: {
          ["".concat(axis)]: [0, {
            duration: 0.4,
            delay: 0.2
          }]
        }
      });
      // out is optional
      if (o) {
        o.patch({
          ["".concat(axis)]: 0,
          smooth: {
            ["".concat(axis)]: [direction ? bounds : bounds * -1, {
              duration: 0.4,
              delay: 0.2
            }]
          }
        });
      }
      // resolve on y finish
      i.transition(axis).on('finish', () => {
        resolve();
      });
    });
  };
  const up = (i, o) => {
    return moveOnAxes('y', 0, i, o);
  };
  const down = (i, o) => {
    return moveOnAxes('y', 1, i, o);
  };
  const left = (i, o) => {
    return moveOnAxes('x', 0, i, o);
  };
  const right = (i, o) => {
    return moveOnAxes('x', 1, i, o);
  };
  var Transitions = {
    fade,
    crossFade,
    up,
    down,
    left,
    right
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * execute transition between new / old page and
   * toggle the defined widgets
   * @todo: platform override default transition
   * @param pageIn
   * @param pageOut
   */
  const executeTransition = function (pageIn) {
    let pageOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const transition = pageIn.pageTransition || pageIn.easing;
    const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition);
    const transitionsDisabled = getRouterConfig().get('disableTransitions');
    if (pageIn.easing) {
      console.warn('easing() method is deprecated and will be removed. Use pageTransition()');
    }

    // default behaviour is a visibility toggle
    if (!hasCustomTransitions || transitionsDisabled) {
      pageIn.visible = true;
      if (pageOut) {
        pageOut.visible = false;
      }
      return Promise.resolve();
    }
    if (transition) {
      let type;
      try {
        type = transition.call(pageIn, pageIn, pageOut);
      } catch (e) {
        type = 'crossFade';
      }
      if (isPromise(type)) {
        return type;
      }
      if (isString(type)) {
        const fn = Transitions[type];
        if (fn) {
          return fn(pageIn, pageOut);
        }
      }

      // keep backwards compatible for now
      if (pageIn.smoothIn) {
        // provide a smooth function that resolves itself
        // on transition finish
        const smooth = function (p, v) {
          let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          return new Promise(resolve => {
            pageIn.visible = true;
            pageIn.setSmooth(p, v, args);
            pageIn.transition(p).on('finish', () => {
              resolve();
            });
          });
        };
        return pageIn.smoothIn({
          pageIn,
          smooth
        });
      }
    }
    return Transitions.crossFade(pageIn, pageOut);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * The actual loading of the component
   * */
  const load = async request => {
    let expired = false;
    try {
      request = await loader$1(request);
      if (request && !request.isCancelled) {
        // in case of on() providing we need to reset
        // app state;
        if (app.state === 'Loading') {
          if (getPreviousState() === 'Widgets') ; else {
            app._setState('');
          }
        }
        // Do page transition if instance
        // is not shared between the routes
        if (!request.isSharedInstance && !request.isCancelled) {
          await executeTransition(request.page, getActivePage());
        }
      } else {
        expired = true;
      }
      // on expired we only cleanup
      if (expired || request.isCancelled) {
        Log.debug('[router]:', "Rejected ".concat(request.hash, " because route to ").concat(getLastHash(), " started"));
        if (request.isCreated && !request.isSharedInstance) {
          // remove from render-tree
          pagesHost.remove(request.page);
        }
      } else {
        onRequestResolved(request);
        // resolve promise
        return request.page;
      }
    } catch (request) {
      if (!request.route) {
        console.error(request);
      } else if (!expired) {
        // @todo: revisit
        const {
          route
        } = request;
        // clean up history if modifier is set
        if (getOption(route.options, 'clearHistory')) {
          setHistory([]);
        } else if (!isWildcard.test(route.path)) {
          updateHistory(request);
        }
        if (request.isCreated && !request.isSharedInstance) {
          // remove from render-tree
          pagesHost.remove(request.page);
        }
        handleError(request);
      }
    }
  };
  const loader$1 = async request => {
    const route = request.route;
    const hash = request.hash;
    const register = request.register;

    // todo: grab from Route instance
    let type = getComponent(route.path);
    let isConstruct = isComponentConstructor(type);
    let provide = false;

    // if it's an instance bt we're not coming back from
    // history we test if we can re-use this instance
    if (!isConstruct && !register.get(symbols.backtrack)) {
      if (!mustReuse(route)) {
        type = type.constructor;
        isConstruct = true;
      }
    }

    // If page is Lightning Component instance
    if (!isConstruct) {
      request.page = type;
      // if we have have a data route for current page
      if (hasProvider(route.path)) {
        if (isPageExpired(type) || type[symbols.hash] !== hash) {
          provide = true;
        }
      }
      let currentRoute = getActivePage() && getActivePage()[symbols.route];
      // if the new route is equal to the current route it means that both
      // route share the Component instance and stack location / since this case
      // is conflicting with the way before() and after() loading works we flag it,
      // and check platform settings in we want to re-use instance
      if (route.path === currentRoute) {
        request.isSharedInstance = true;
        // since we're re-using the instance we must attach
        // historyState to the request to prevent it from
        // being overridden.
        if (isFunction(request.page.historyState)) {
          request.copiedHistoryState = request.page.historyState();
        }
      }
    } else {
      request.page = createComponent(stage$1, type);
      pagesHost.a(request.page);
      // test if need to request data provider
      if (hasProvider(route.path)) {
        provide = true;
      }
      request.isCreated = true;
    }

    // we store hash and route as properties on the page instance
    // that way we can easily calculate new behaviour on page reload
    request.page[symbols.hash] = hash;
    request.page[symbols.route] = route.path;
    try {
      if (provide) {
        // extract attached data-provider for route
        // we're processing
        const {
          type: loadType,
          provider
        } = getProvider(route);

        // update running request
        request.provider = provider;
        request.providerType = loadType;
        await dataHooks[loadType](request);

        // we early exit if the current request is expired
        if (hash !== getLastHash()) {
          return false;
        } else {
          if (request.providerType !== 'after') {
            emit$1(request.page, 'dataProvided');
          }
          // resolve promise
          return request;
        }
      } else {
        addPersistData(request);
        return request;
      }
    } catch (e) {
      request.error = e;
      return Promise.reject(request);
    }
  };
  const handleError = request => {
    if (request && request.error) {
      console.error(request.error);
    } else if (request) {
      Log.error(request);
    }
    if (request.page && routeExists('!')) {
      navigate('!', {
        request
      }, false);
    }
  };
  const mustReuse = route => {
    const opt = getOption(route.options, 'reuseInstance');
    const config = routerConfig.get('reuseInstance');

    // route always has final decision
    if (isBoolean(opt)) {
      return opt;
    }
    return !(isBoolean(config) && config === false);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class RoutedApp extends Lightning.Component {
    static _template() {
      return {
        Pages: {
          forceZIndexContext: true
        },
        /**
         * This is a default Loading page that will be made visible
         * during data-provider on() you CAN override in child-class
         */
        Loading: {
          rect: true,
          w: 1920,
          h: 1080,
          color: 0xff000000,
          visible: false,
          zIndex: 99,
          Label: {
            mount: 0.5,
            x: 960,
            y: 540,
            text: {
              text: 'Loading..'
            }
          }
        }
      };
    }
    static _states() {
      return [class Loading extends this {
        $enter() {
          this.tag('Loading').visible = true;
        }
        $exit() {
          this.tag('Loading').visible = false;
        }
      }, class Widgets extends this {
        $enter(args, widget) {
          // store widget reference
          this._widget = widget;

          // since it's possible that this behaviour
          // is non-remote driven we force a recalculation
          // of the focuspath
          this._refocus();
        }
        _getFocused() {
          // we delegate focus to selected widget
          // so it can consume remotecontrol presses
          return this._widget;
        }

        // if we want to widget to widget focus delegation
        reload(widget) {
          this._widget = widget;
          this._refocus();
        }
        _handleKey() {
          const restoreFocus = routerConfig.get('autoRestoreRemote');
          /**
           * The Router used to delegate focus back to the page instance on
           * every unhandled key. This is barely usefull in any situation
           * so for now we offer the option to explicity turn that behaviour off
           * so we don't don't introduce a breaking change.
           */
          if (!isBoolean(restoreFocus) || restoreFocus === true) {
            Router.focusPage();
          }
        }
      }];
    }

    /**
     * Return location where pages need to be stored
     */
    get pages() {
      return this.tag('Pages');
    }

    /**
     * Tell router where widgets are stored
     */
    get widgets() {
      return this.tag('Widgets');
    }

    /**
     * we MUST register _handleBack method so the Router
     * can override it
     * @private
     */
    _handleBack() {}

    /**
     * We MUST return Router.activePage() so the new Page
     * can listen to the remote-control.
     */
    _getFocused() {
      return Router.getActivePage();
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /*
  rouThor ==[x]
   */
  let navigateQueue = new Map();
  let forcedHash = '';
  let resumeHash = '';

  /**
   * Start routing the app
   * @param config - route config object
   * @param instance - instance of the app
   */
  const startRouter = (config, instance) => {
    bootRouter(config, instance);
    registerListener();
    start();
  };

  // start translating url
  const start = () => {
    let hash = (getHash() || '').replace(/^#/, '');
    const bootKey = '$';
    const params = getQueryStringParams(hash);
    const bootRequest = getBootRequest();
    const rootHash = getRootHash();
    const isDirectLoad = hash.indexOf(bootKey) !== -1;

    // prevent direct reload of wildcard routes
    // expect bootComponent
    if (isWildcard.test(hash) && hash !== bootKey) {
      hash = '';
    }

    // store resume point for manual resume
    resumeHash = isDirectLoad ? rootHash : hash || rootHash;
    const ready = () => {
      if (!hash && rootHash) {
        if (isString(rootHash)) {
          navigate(rootHash);
        } else if (isFunction(rootHash)) {
          rootHash().then(res => {
            if (isObject(res)) {
              navigate(res.path, res.params);
            } else {
              navigate(res);
            }
          });
        }
      } else {
        queue(hash);
        handleHashChange().then(() => {
          app._refocus();
        }).catch(e => {
          console.error(e);
        });
      }
    };
    if (routeExists(bootKey)) {
      if (hash && !isDirectLoad) {
        if (!getRouteByHash(hash)) {
          navigate('*', {
            failedHash: hash
          });
          return;
        }
      }
      navigate(bootKey, {
        resume: resumeHash,
        reload: bootKey === hash
      }, false);
    } else if (isFunction(bootRequest)) {
      bootRequest(params).then(() => {
        ready();
      }).catch(e => {
        handleBootError(e);
      });
    } else {
      ready();
    }
  };
  const handleBootError = e => {
    if (routeExists('!')) {
      navigate('!', {
        request: {
          error: e
        }
      });
    } else {
      console.error(e);
    }
  };

  /**
   * start a new request
   * @param url
   * @param args
   * @param store
   */
  const navigate = function (url) {
    let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let store = arguments.length > 2 ? arguments[2] : undefined;
    if (isObject(url)) {
      url = getHashByName(url);
      if (!url) {
        return;
      }
    }
    let hash = getHash();
    if (!mustUpdateLocationHash() && forcedHash) {
      hash = forcedHash;
    }
    if (hash.replace(/^#/, '') !== url) {
      // push request in the queue
      queue(url, args, store);
      setHash(url);
      if (!mustUpdateLocationHash()) {
        forcedHash = url;
        handleHashChange(url).then(() => {
          app._refocus();
        }).catch(e => {
          console.error(e);
        });
      }
    } else if (args.reload) {
      // push request in the queue
      queue(url, args, store);
      handleHashChange(url).then(() => {
        app._refocus();
      }).catch(e => {
        console.error(e);
      });
    }
  };
  const queue = function (hash) {
    let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let store = arguments.length > 2 ? arguments[2] : undefined;
    hash = cleanHash(hash);
    if (!navigateQueue.has(hash)) {
      for (let request of navigateQueue.values()) {
        request.cancel();
      }
      const request = createRequest(hash, args, store);
      navigateQueue.set(decodeURIComponent(hash), request);
      return request;
    }
    return false;
  };

  /**
   * Handle change of hash
   * @param override
   * @returns {Promise<void>}
   */
  const handleHashChange = async override => {
    const hash = cleanHash(override || getHash());
    const queueId = decodeURIComponent(hash);
    let request = navigateQueue.get(queueId);

    // handle hash updated manually
    if (!request && !navigateQueue.size) {
      request = queue(hash);
    }
    const route = getRouteByHash(hash);
    if (!route) {
      if (routeExists('*')) {
        navigate('*', {
          failedHash: hash
        });
      } else {
        console.error("Unable to navigate to: ".concat(hash));
      }
      return;
    }

    // update current processed request
    request.hash = hash;
    request.route = route;
    let result = await beforeEachRoute(getActiveHash(), request);

    // test if a local hook is configured for the route
    if (route.beforeNavigate) {
      result = await route.beforeNavigate(getActiveHash(), request);
    }
    if (isBoolean(result)) {
      // only if resolve value is explicitly true
      // we continue the current route request
      if (result) {
        return resolveHashChange(request);
      }
    } else {
      // if navigation guard didn't return true
      // we cancel the current request
      request.cancel();
      navigateQueue.delete(queueId);
      if (isString(result)) {
        navigate(result);
      } else if (isObject(result)) {
        let store = true;
        if (isBoolean(result.store)) {
          store = result.store;
        }
        navigate(result.path, result.params, store);
      }
    }
  };

  /**
   * Continue processing the hash change if not blocked
   * by global or local hook
   * @param request - {}
   */
  const resolveHashChange = request => {
    const hash = request.hash;
    const route = request.route;
    const queueId = decodeURIComponent(hash);
    // store last requested hash so we can
    // prevent a route that resolved later
    // from displaying itself
    setLastHash(hash);
    if (route.path) {
      const component = getComponent(route.path);
      // if a hook is provided for the current route
      if (isFunction(route.hook)) {
        const urlParams = getValuesFromHash(hash, route.path);
        const params = {};
        for (const key of urlParams.keys()) {
          params[key] = urlParams.get(key);
        }
        route.hook(app, {
          ...params
        });
      }
      // if there is a component attached to the route
      if (component) {
        // force page to root state to prevent shared state issues
        const activePage = getActivePage();
        if (activePage) {
          const keepAlive = keepActivePageAlive(getActiveRoute(), request);
          if (activePage && route.path === getActiveRoute() && !keepAlive) {
            activePage._setState('');
          }
        }
        if (isPage(component)) {
          load(request).then(() => {
            app._refocus();
            navigateQueue.delete(queueId);
          });
        } else {
          // of the component is not a constructor
          // or a Component instance we can assume
          // that it's a dynamic import
          component().then(contents => {
            return contents.default;
          }).then(module => {
            storeComponent(route.path, module);
            return load(request);
          }).then(() => {
            app._refocus();
            navigateQueue.delete(queueId);
          });
        }
      } else {
        navigateQueue.delete(queueId);
      }
    }
  };

  /**
   * Directional step in history
   * @param direction
   */
  const step = function () {
    let level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (!level || isNaN(level)) {
      return false;
    }
    const history = getHistory();
    // for now we only support negative numbers
    level = Math.abs(level);

    // we can't step back past the amount
    // of history entries
    if (level > history.length) {
      if (isFunction(app._handleAppClose)) {
        return app._handleAppClose();
      }
      return false;
    } else if (history.length) {
      // for now we only support history back
      const route = history.splice(history.length - level, level)[0];
      // store changed history
      setHistory(history);
      return navigate(route.hash, {
        [symbols.backtrack]: true,
        [symbols.historyState]: route.state
      }, false);
    } else if (routerConfig.get('backtrack')) {
      const hashLastPart = /(\/:?[\w%\s-]+)$/;
      let hash = stripRegex(getHash());
      let floor = getFloor(hash);

      // test if we got deep-linked
      if (floor > 1) {
        while (floor--) {
          // strip of last part
          hash = hash.replace(hashLastPart, '');
          // if we have a configured route
          // we navigate to it
          if (getRouteByHash(hash)) {
            return navigate(hash, {
              [symbols.backtrack]: true
            }, false);
          }
        }
      }
    }
    return false;
  };

  /**
   * Resume Router's page loading process after
   * the BootComponent became visible;
   */
  const resume = () => {
    if (isString(resumeHash)) {
      navigate(resumeHash, false);
      resumeHash = '';
    } else if (isFunction(resumeHash)) {
      resumeHash().then(res => {
        resumeHash = '';
        if (isObject(res)) {
          navigate(res.path, res.params);
        } else {
          navigate(res);
        }
      });
    } else {
      console.warn('[Router]: resume() called but no hash found');
    }
  };

  /**
   * Query if the Router is still processing a Request
   * @returns {boolean}
   */
  const isNavigating = () => {
    if (navigateQueue.size) {
      let isProcessing = false;
      for (let request of navigateQueue.values()) {
        if (!request.isCancelled) {
          isProcessing = true;
        }
      }
      return isProcessing;
    }
    return false;
  };
  const getResumeHash = () => {
    return resumeHash;
  };

  /**
   * By default we return the location hash
   * @returns {string}
   */
  let getHash = () => {
    return document.location.hash;
  };

  /**
   * Update location hash
   * @param url
   */
  let setHash = url => {
    document.location.hash = url;
  };

  /**
   * This can be called from the platform / bootstrapper to override
   * the default getting and setting of the hash
   * @param config
   */
  const initRouter = config => {
    if (config.getHash) {
      getHash = config.getHash;
    }
    if (config.setHash) {
      setHash = config.setHash;
    }
  };

  /**
   * On hash change we start processing
   */
  const registerListener = () => {
    Registry.addEventListener(window, 'hashchange', async () => {
      if (mustUpdateLocationHash()) {
        try {
          await handleHashChange();
        } catch (e) {
          console.error(e);
        }
      }
    });
  };
  // export API
  var Router = {
    startRouter,
    navigate,
    resume,
    step,
    go: step,
    back: step.bind(null, -1),
    activePage: getActivePage,
    getActivePage() {
      // warning
      return getActivePage();
    },
    getActiveRoute,
    getActiveHash,
    focusWidget,
    getActiveWidget,
    restoreFocus,
    isNavigating,
    getHistory,
    setHistory,
    getHistoryState,
    replaceHistoryState,
    getQueryStringParams,
    symbols,
    App: RoutedApp,
    // keep backwards compatible
    focusPage: restoreFocus,
    /**
     * Deprecated api methods
     */
    setupRoutes() {
      console.warn('Router: setupRoutes is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
    on() {
      console.warn('Router.on() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
    before() {
      console.warn('Router.before() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },
    after() {
      console.warn('Router.after() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const defaultChannels = [{
    number: 1,
    name: 'Metro News 1',
    description: 'New York Cable News Channel',
    entitled: true,
    program: {
      title: 'The Morning Show',
      description: "New York's best morning show",
      startTime: new Date(new Date() - 60 * 5 * 1000).toUTCString(),
      // started 5 minutes ago
      duration: 60 * 30,
      // 30 minutes
      ageRating: 0
    }
  }, {
    number: 2,
    name: 'MTV',
    description: 'Music Television',
    entitled: true,
    program: {
      title: 'Beavis and Butthead',
      description: 'American adult animated sitcom created by Mike Judge',
      startTime: new Date(new Date() - 60 * 20 * 1000).toUTCString(),
      // started 20 minutes ago
      duration: 60 * 45,
      // 45 minutes
      ageRating: 18
    }
  }, {
    number: 3,
    name: 'NBC',
    description: 'NBC TV Network',
    entitled: false,
    program: {
      title: 'The Tonight Show Starring Jimmy Fallon',
      description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
      startTime: new Date(new Date() - 60 * 10 * 1000).toUTCString(),
      // started 10 minutes ago
      duration: 60 * 60,
      // 1 hour
      ageRating: 10
    }
  }];
  const channels = () => Settings$2.get('platform', 'tv', defaultChannels);
  const randomChannel = () => channels()[~~(channels.length * Math.random())];

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let currentChannel;
  const callbacks = {};
  const emit = function (event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    callbacks[event] && callbacks[event].forEach(cb => {
      cb.apply(null, args);
    });
  };

  // local mock methods
  let methods = {
    getChannel() {
      if (!currentChannel) currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        if (currentChannel) {
          const channel = {
            ...currentChannel
          };
          delete channel.program;
          resolve(channel);
        } else {
          reject('No channel found');
        }
      });
    },
    getProgram() {
      if (!currentChannel) currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        currentChannel.program ? resolve(currentChannel.program) : reject('No program found');
      });
    },
    setChannel(number) {
      return new Promise((resolve, reject) => {
        if (number) {
          const newChannel = channels().find(c => c.number === number);
          if (newChannel) {
            currentChannel = newChannel;
            const channel = {
              ...currentChannel
            };
            delete channel.program;
            emit('channelChange', channel);
            resolve(channel);
          } else {
            reject('Channel not found');
          }
        } else {
          reject('No channel number supplied');
        }
      });
    }
  };
  const initTV = config => {
    methods = {};
    if (config.getChannel && typeof config.getChannel === 'function') {
      methods.getChannel = config.getChannel;
    }
    if (config.getProgram && typeof config.getProgram === 'function') {
      methods.getProgram = config.getProgram;
    }
    if (config.setChannel && typeof config.setChannel === 'function') {
      methods.setChannel = config.setChannel;
    }
    if (config.emit && typeof config.emit === 'function') {
      config.emit(emit);
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const initPurchase = config => {
    if (config.billingUrl) config.billingUrl;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class PinInput extends Lightning.Component {
    static _template() {
      return {
        w: 120,
        h: 150,
        rect: true,
        color: 0xff949393,
        alpha: 0.5,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 10
        },
        Nr: {
          w: w => w,
          y: 24,
          text: {
            text: '',
            textColor: 0xff333333,
            fontSize: 80,
            textAlign: 'center',
            verticalAlign: 'middle'
          }
        }
      };
    }
    set index(v) {
      this.x = v * (120 + 24);
    }
    set nr(v) {
      this._timeout && clearTimeout(this._timeout);
      if (v) {
        this.setSmooth('alpha', 1);
      } else {
        this.setSmooth('alpha', 0.5);
      }
      this.tag('Nr').patch({
        text: {
          text: v && v.toString() || '',
          fontSize: v === '*' ? 120 : 80
        }
      });
      if (v && v !== '*') {
        this._timeout = setTimeout(() => {
          this._timeout = null;
          this.nr = '*';
        }, 750);
      }
    }
  }
  class PinDialog extends Lightning.Component {
    static _template() {
      return {
        zIndex: 1,
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xdd000000,
        alpha: 0.000001,
        Dialog: {
          w: 648,
          h: 320,
          y: h => (h - 320) / 2,
          x: w => (w - 648) / 2,
          rect: true,
          color: 0xdd333333,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10
          },
          Info: {
            y: 24,
            x: 48,
            text: {
              text: 'Please enter your PIN',
              fontSize: 32
            }
          },
          Msg: {
            y: 260,
            x: 48,
            text: {
              text: '',
              fontSize: 28,
              textColor: 0xffffffff
            }
          },
          Code: {
            x: 48,
            y: 96
          }
        }
      };
    }
    _init() {
      const children = [];
      for (let i = 0; i < 4; i++) {
        children.push({
          type: PinInput,
          index: i
        });
      }
      this.tag('Code').children = children;
    }
    get pin() {
      if (!this._pin) this._pin = '';
      return this._pin;
    }
    set pin(v) {
      if (v.length <= 4) {
        const maskedPin = new Array(Math.max(v.length - 1, 0)).fill('*', 0, v.length - 1);
        v.length && maskedPin.push(v.length > this._pin.length ? v.slice(-1) : '*');
        for (let i = 0; i < 4; i++) {
          this.tag('Code').children[i].nr = maskedPin[i] || '';
        }
        this._pin = v;
      }
    }
    get msg() {
      if (!this._msg) this._msg = '';
      return this._msg;
    }
    set msg(v) {
      this._timeout && clearTimeout(this._timeout);
      this._msg = v;
      if (this._msg) {
        this.tag('Msg').text = this._msg;
        this.tag('Info').setSmooth('alpha', 0.5);
        this.tag('Code').setSmooth('alpha', 0.5);
      } else {
        this.tag('Msg').text = '';
        this.tag('Info').setSmooth('alpha', 1);
        this.tag('Code').setSmooth('alpha', 1);
      }
      this._timeout = setTimeout(() => {
        this.msg = '';
      }, 2000);
    }
    _firstActive() {
      this.setSmooth('alpha', 1);
    }
    _handleKey(event) {
      if (this.msg) {
        this.msg = false;
      } else {
        const val = parseInt(event.key);
        if (val > -1) {
          this.pin += val;
        }
      }
    }
    _handleBack() {
      if (this.msg) {
        this.msg = false;
      } else {
        if (this.pin.length) {
          this.pin = this.pin.slice(0, this.pin.length - 1);
        } else {
          Pin$3.hide();
          this.resolve(false);
        }
      }
    }
    _handleEnter() {
      if (this.msg) {
        this.msg = false;
      } else {
        Pin$3.submit(this.pin).then(val => {
          this.msg = 'Unlocking ...';
          setTimeout(() => {
            Pin$3.hide();
          }, 1000);
          this.resolve(val);
        }).catch(e => {
          this.msg = e;
          this.reject(e);
        });
      }
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  // only used during local development
  let unlocked = false;
  const contextItems = ['purchase', 'parental'];
  let submit = (pin, context) => {
    return new Promise((resolve, reject) => {
      if (pin.toString() === Settings$2.get('platform', 'pin', '0000').toString()) {
        unlocked = true;
        resolve(unlocked);
      } else {
        reject('Incorrect pin');
      }
    });
  };
  let check = context => {
    return new Promise(resolve => {
      resolve(unlocked);
    });
  };
  const initPin = config => {
    if (config.submit && typeof config.submit === 'function') {
      submit = config.submit;
    }
    if (config.check && typeof config.check === 'function') {
      check = config.check;
    }
  };
  let pinDialog = null;
  const contextCheck = context => {
    if (context === undefined) {
      Log.info('Please provide context explicitly');
      return contextItems[0];
    } else if (!contextItems.includes(context)) {
      Log.warn('Incorrect context provided');
      return false;
    }
    return context;
  };

  // Public API
  var Pin$3 = {
    show() {
      return new Promise((resolve, reject) => {
        pinDialog = ApplicationInstance.stage.c({
          ref: 'PinDialog',
          type: PinDialog,
          resolve,
          reject
        });
        ApplicationInstance.childList.a(pinDialog);
        ApplicationInstance.focus = pinDialog;
      });
    },
    hide() {
      ApplicationInstance.focus = null;
      ApplicationInstance.children = ApplicationInstance.children.map(child => child !== pinDialog && child);
      pinDialog = null;
    },
    submit(pin, context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);
          if (context) {
            submit(pin, context).then(resolve).catch(reject);
          } else {
            reject('Incorrect Context provided');
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    unlocked(context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);
          if (context) {
            check(context).then(resolve).catch(reject);
          } else {
            reject('Incorrect Context provided');
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    locked(context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);
          if (context) {
            check(context).then(unlocked => resolve(!!!unlocked)).catch(reject);
          } else {
            reject('Incorrect Context provided');
          }
        } catch (e) {
          reject(e);
        }
      });
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let ApplicationInstance;
  var Launch = ((App, appSettings, platformSettings, appData) => {
    initSettings(appSettings, platformSettings);
    initUtils(platformSettings);
    initStorage();
    // Initialize plugins
    if (platformSettings.plugins) {
      platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile);
      platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics);
      platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer);
      platformSettings.plugins.mediaPlayer && initVideoPlayer(platformSettings.plugins.mediaPlayer);
      platformSettings.plugins.ads && initAds(platformSettings.plugins.ads);
      platformSettings.plugins.router && initRouter(platformSettings.plugins.router);
      platformSettings.plugins.tv && initTV(platformSettings.plugins.tv);
      platformSettings.plugins.purchase && initPurchase(platformSettings.plugins.purchase);
      platformSettings.plugins.pin && initPin(platformSettings.plugins.pin);
    }
    const app = Application(App, appData, platformSettings);
    ApplicationInstance = new app(appSettings);
    return ApplicationInstance;
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class VideoTexture extends Lightning.Component {
    static _template() {
      return {
        Video: {
          alpha: 1,
          visible: false,
          pivot: 0.5,
          texture: {
            type: Lightning.textures.StaticTexture,
            options: {}
          }
        }
      };
    }
    set videoEl(v) {
      this._videoEl = v;
    }
    get videoEl() {
      return this._videoEl;
    }
    get videoView() {
      return this.tag('Video');
    }
    get videoTexture() {
      return this.videoView.texture;
    }
    get isVisible() {
      return this.videoView.alpha === 1 && this.videoView.visible === true;
    }
    _init() {
      this._createVideoTexture();
    }
    _createVideoTexture() {
      const stage = this.stage;
      const gl = stage.gl;
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.videoTexture.options = {
        source: glTexture,
        w: this.videoEl.width,
        h: this.videoEl.height
      };
      this.videoView.w = this.videoEl.width / this.stage.getRenderPrecision();
      this.videoView.h = this.videoEl.height / this.stage.getRenderPrecision();
    }
    start() {
      const stage = this.stage;
      if (!this._updateVideoTexture) {
        this._updateVideoTexture = () => {
          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
            const gl = stage.gl;
            const currentTime = new Date().getTime();

            // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
            // We'll fallback to fixed 30fps in this case.
            const frameCount = this.videoEl.webkitDecodedFrameCount;
            const mustUpdate = frameCount ? this._lastFrame !== frameCount : this._lastTime < currentTime - 30;
            if (mustUpdate) {
              this._lastTime = currentTime;
              this._lastFrame = frameCount;
              try {
                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                this.videoView.visible = true;
                this.videoTexture.options.w = this.videoEl.width;
                this.videoTexture.options.h = this.videoEl.height;
                const expectedAspectRatio = this.videoView.w / this.videoView.h;
                const realAspectRatio = this.videoEl.width / this.videoEl.height;
                if (expectedAspectRatio > realAspectRatio) {
                  this.videoView.scaleX = realAspectRatio / expectedAspectRatio;
                  this.videoView.scaleY = 1;
                } else {
                  this.videoView.scaleY = expectedAspectRatio / realAspectRatio;
                  this.videoView.scaleX = 1;
                }
              } catch (e) {
                Log.error('texImage2d video', e);
                this.stop();
              }
              this.videoTexture.source.forceRenderUpdate();
            }
          }
        };
      }
      if (!this._updatingVideoTexture) {
        stage.on('frameStart', this._updateVideoTexture);
        this._updatingVideoTexture = true;
      }
    }
    stop() {
      const stage = this.stage;
      stage.removeListener('frameStart', this._updateVideoTexture);
      this._updatingVideoTexture = false;
      this.videoView.visible = false;
      if (this.videoTexture.options.source) {
        const gl = stage.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
    position(top, left) {
      this.videoView.patch({
        smooth: {
          x: left,
          y: top
        }
      });
    }
    size(width, height) {
      this.videoView.patch({
        smooth: {
          w: width,
          h: height
        }
      });
    }
    show() {
      this.videoView.setSmooth('alpha', 1);
    }
    hide() {
      this.videoView.setSmooth('alpha', 0);
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let mediaUrl = url => url;
  let videoEl;
  let videoTexture;
  let metrics;
  let consumer$1;
  let precision = 1;
  let textureMode = false;
  const initVideoPlayer = config => {
    if (config.mediaUrl) {
      mediaUrl = config.mediaUrl;
    }
  };

  // todo: add this in a 'Registry' plugin
  // to be able to always clean this up on app close
  let eventHandlers = {};
  const state$1 = {
    adsEnabled: false,
    playing: false,
    _playingAds: false,
    get playingAds() {
      return this._playingAds;
    },
    set playingAds(val) {
      if (this._playingAds !== val) {
        this._playingAds = val;
        fireOnConsumer$1(val === true ? 'AdStart' : 'AdEnd');
      }
    },
    skipTime: false,
    playAfterSeek: null
  };
  const hooks = {
    play() {
      state$1.playing = true;
    },
    pause() {
      state$1.playing = false;
    },
    seeked() {
      state$1.playAfterSeek === true && videoPlayerPlugin.play();
      state$1.playAfterSeek = null;
    },
    abort() {
      deregisterEventListeners();
    }
  };
  const withPrecision = val => Math.round(precision * val) + 'px';
  const fireOnConsumer$1 = (event, args) => {
    if (consumer$1) {
      consumer$1.fire('$videoPlayer' + event, args, videoEl.currentTime);
      consumer$1.fire('$videoPlayerEvent', event, args, videoEl.currentTime);
    }
  };
  const fireHook = (event, args) => {
    hooks[event] && typeof hooks[event] === 'function' && hooks[event].call(null, event, args);
  };
  let customLoader = null;
  let customUnloader = null;
  const loader = (url, videoEl, config) => {
    return customLoader && typeof customLoader === 'function' ? customLoader(url, videoEl, config) : new Promise(resolve => {
      url = mediaUrl(url);
      videoEl.setAttribute('src', url);
      videoEl.load();
      resolve();
    });
  };
  const unloader = videoEl => {
    return customUnloader && typeof customUnloader === 'function' ? customUnloader(videoEl) : new Promise(resolve => {
      videoEl.removeAttribute('src');
      videoEl.load();
      resolve();
    });
  };
  const setupVideoTag = () => {
    const videoEls = document.getElementsByTagName('video');
    if (videoEls && videoEls.length) {
      return videoEls[0];
    } else {
      const videoEl = document.createElement('video');
      videoEl.setAttribute('id', 'video-player');
      videoEl.setAttribute('width', withPrecision(1920));
      videoEl.setAttribute('height', withPrecision(1080));
      videoEl.style.position = 'absolute';
      videoEl.style.zIndex = '1';
      videoEl.style.display = 'none';
      videoEl.style.visibility = 'hidden';
      videoEl.style.top = withPrecision(0);
      videoEl.style.left = withPrecision(0);
      videoEl.style.width = withPrecision(1920);
      videoEl.style.height = withPrecision(1080);
      document.body.appendChild(videoEl);
      return videoEl;
    }
  };
  const setUpVideoTexture = () => {
    if (!ApplicationInstance.tag('VideoTexture')) {
      const el = ApplicationInstance.stage.c({
        type: VideoTexture,
        ref: 'VideoTexture',
        zIndex: 0,
        videoEl
      });
      ApplicationInstance.childList.addAt(el, 0);
    }
    return ApplicationInstance.tag('VideoTexture');
  };
  const registerEventListeners = () => {
    Log.info('VideoPlayer', 'Registering event listeners');
    Object.keys(events$1).forEach(event => {
      const handler = e => {
        // Fire a metric for each event (if it exists on the metrics object)
        if (metrics && metrics[event] && typeof metrics[event] === 'function') {
          metrics[event]({
            currentTime: videoEl.currentTime
          });
        }
        // fire an internal hook
        fireHook(event, {
          videoElement: videoEl,
          event: e
        });

        // fire the event (with human friendly event name) to the consumer of the VideoPlayer
        fireOnConsumer$1(events$1[event], {
          videoElement: videoEl,
          event: e
        });
      };
      eventHandlers[event] = handler;
      videoEl.addEventListener(event, handler);
    });
  };
  const deregisterEventListeners = () => {
    Log.info('VideoPlayer', 'Deregistering event listeners');
    Object.keys(eventHandlers).forEach(event => {
      videoEl.removeEventListener(event, eventHandlers[event]);
    });
    eventHandlers = {};
  };
  const videoPlayerPlugin = {
    consumer(component) {
      consumer$1 = component;
    },
    loader(loaderFn) {
      customLoader = loaderFn;
    },
    unloader(unloaderFn) {
      customUnloader = unloaderFn;
    },
    position() {
      let top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      let left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      videoEl.style.left = withPrecision(left);
      videoEl.style.top = withPrecision(top);
      if (textureMode === true) {
        videoTexture.position(top, left);
      }
    },
    size() {
      let width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1920;
      let height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1080;
      videoEl.style.width = withPrecision(width);
      videoEl.style.height = withPrecision(height);
      videoEl.width = parseFloat(videoEl.style.width);
      videoEl.height = parseFloat(videoEl.style.height);
      if (textureMode === true) {
        videoTexture.size(width, height);
      }
    },
    area() {
      let top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      let right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1920;
      let bottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1080;
      let left = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      this.position(top, left);
      this.size(right - left, bottom - top);
    },
    open(url) {
      let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!this.canInteract) return;
      metrics = Metrics$1.media(url);
      this.hide();
      deregisterEventListeners();
      if (this.src == url) {
        this.clear().then(this.open(url, config));
      } else {
        const adConfig = {
          enabled: state$1.adsEnabled,
          duration: 300
        };
        if (config.videoId) {
          adConfig.caid = config.videoId;
        }
        Ads.get(adConfig, consumer$1).then(ads => {
          state$1.playingAds = true;
          ads.prerolls().then(() => {
            state$1.playingAds = false;
            loader(url, videoEl, config).then(() => {
              registerEventListeners();
              this.show();
              this.play();
            });
          });
        });
      }
    },
    reload() {
      if (!this.canInteract) return;
      const url = videoEl.getAttribute('src');
      this.close();
      this.open(url);
    },
    close() {
      Ads.cancel();
      if (state$1.playingAds) {
        state$1.playingAds = false;
        Ads.stop();
        // call self in next tick
        setTimeout(() => {
          this.close();
        });
      }
      if (!this.canInteract) return;
      this.clear();
      this.hide();
      deregisterEventListeners();
    },
    clear() {
      if (!this.canInteract) return;
      // pause the video first to disable sound
      this.pause();
      if (textureMode === true) videoTexture.stop();
      return unloader(videoEl).then(() => {
        fireOnConsumer$1('Clear', {
          videoElement: videoEl
        });
      });
    },
    play() {
      if (!this.canInteract) return;
      if (textureMode === true) videoTexture.start();
      videoEl.play();
    },
    pause() {
      if (!this.canInteract) return;
      videoEl.pause();
    },
    playPause() {
      if (!this.canInteract) return;
      this.playing === true ? this.pause() : this.play();
    },
    mute() {
      let muted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this.canInteract) return;
      videoEl.muted = muted;
    },
    loop() {
      let looped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      videoEl.loop = looped;
    },
    seek(time) {
      if (!this.canInteract) return;
      if (!this.src) return;
      // define whether should continue to play after seek is complete (in seeked hook)
      if (state$1.playAfterSeek === null) {
        state$1.playAfterSeek = !!state$1.playing;
      }
      // pause before actually seeking
      this.pause();
      // currentTime always between 0 and the duration of the video (minus 0.1s to not set to the final frame and stall the video)
      videoEl.currentTime = Math.max(0, Math.min(time, this.duration - 0.1));
    },
    skip(seconds) {
      if (!this.canInteract) return;
      if (!this.src) return;
      state$1.skipTime = (state$1.skipTime || videoEl.currentTime) + seconds;
      easeExecution(() => {
        this.seek(state$1.skipTime);
        state$1.skipTime = false;
      }, 300);
    },
    show() {
      if (!this.canInteract) return;
      if (textureMode === true) {
        videoTexture.show();
      } else {
        videoEl.style.display = 'block';
        videoEl.style.visibility = 'visible';
      }
    },
    hide() {
      if (!this.canInteract) return;
      if (textureMode === true) {
        videoTexture.hide();
      } else {
        videoEl.style.display = 'none';
        videoEl.style.visibility = 'hidden';
      }
    },
    enableAds() {
      let enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      state$1.adsEnabled = enabled;
    },
    /* Public getters */
    get duration() {
      return videoEl && (isNaN(videoEl.duration) ? Infinity : videoEl.duration);
    },
    get currentTime() {
      return videoEl && videoEl.currentTime;
    },
    get muted() {
      return videoEl && videoEl.muted;
    },
    get looped() {
      return videoEl && videoEl.loop;
    },
    get src() {
      return videoEl && videoEl.getAttribute('src');
    },
    get playing() {
      return state$1.playing;
    },
    get playingAds() {
      return state$1.playingAds;
    },
    get canInteract() {
      // todo: perhaps add an extra flag wether we allow interactions (i.e. pauze, mute, etc.) during ad playback
      return state$1.playingAds === false;
    },
    get top() {
      return videoEl && parseFloat(videoEl.style.top);
    },
    get left() {
      return videoEl && parseFloat(videoEl.style.left);
    },
    get bottom() {
      return videoEl && parseFloat(videoEl.style.top - videoEl.style.height);
    },
    get right() {
      return videoEl && parseFloat(videoEl.style.left - videoEl.style.width);
    },
    get width() {
      return videoEl && parseFloat(videoEl.style.width);
    },
    get height() {
      return videoEl && parseFloat(videoEl.style.height);
    },
    get visible() {
      if (textureMode === true) {
        return videoTexture.isVisible;
      } else {
        return videoEl && videoEl.style.display === 'block';
      }
    },
    get adsEnabled() {
      return state$1.adsEnabled;
    },
    // prefixed with underscore to indicate 'semi-private'
    // because it's not recommended to interact directly with the video element
    get _videoEl() {
      return videoEl;
    }
  };
  var VideoPlayer = autoSetupMixin(videoPlayerPlugin, () => {
    precision = ApplicationInstance && ApplicationInstance.stage && ApplicationInstance.stage.getRenderPrecision() || precision;
    videoEl = setupVideoTag();
    textureMode = Settings$2.get('platform', 'textureMode', false);
    if (textureMode === true) {
      videoEl.setAttribute('crossorigin', 'anonymous');
      videoTexture = setUpVideoTexture();
    }
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let consumer;
  let getAds = () => {
    // todo: enable some default ads during development, maybe from the settings.json
    return Promise.resolve({
      prerolls: [],
      midrolls: [],
      postrolls: []
    });
  };
  const initAds = config => {
    if (config.getAds) {
      getAds = config.getAds;
    }
  };
  const state = {
    active: false
  };
  const playSlot = function () {
    let slot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return slot.reduce((promise, ad) => {
      return promise.then(() => {
        return playAd(ad);
      });
    }, Promise.resolve(null));
  };
  const playAd = ad => {
    return new Promise(resolve => {
      if (state.active === false) {
        Log.info('Ad', 'Skipping add due to inactive state');
        return resolve();
      }
      // is it safe to rely on videoplayer plugin already created the video tag?
      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.style.display = 'block';
      videoEl.style.visibility = 'visible';
      videoEl.src = mediaUrl(ad.url);
      videoEl.load();
      let timeEvents = null;
      let timeout;
      const cleanup = () => {
        // remove all listeners
        Object.keys(handlers).forEach(handler => videoEl.removeEventListener(handler, handlers[handler]));
        resolve();
      };
      const handlers = {
        play() {
          Log.info('Ad', 'Play ad', ad.url);
          fireOnConsumer('Play', ad);
          sendBeacon(ad.callbacks, 'defaultImpression');
        },
        ended() {
          fireOnConsumer('Ended', ad);
          sendBeacon(ad.callbacks, 'complete');
          cleanup();
        },
        timeupdate() {
          if (!timeEvents && videoEl.duration) {
            // calculate when to fire the time based events (now that duration is known)
            timeEvents = {
              firstQuartile: videoEl.duration / 4,
              midPoint: videoEl.duration / 2,
              thirdQuartile: videoEl.duration / 4 * 3
            };
            Log.info('Ad', 'Calculated quartiles times', {
              timeEvents
            });
          }
          if (timeEvents && timeEvents.firstQuartile && videoEl.currentTime >= timeEvents.firstQuartile) {
            fireOnConsumer('FirstQuartile', ad);
            delete timeEvents.firstQuartile;
            sendBeacon(ad.callbacks, 'firstQuartile');
          }
          if (timeEvents && timeEvents.midPoint && videoEl.currentTime >= timeEvents.midPoint) {
            fireOnConsumer('MidPoint', ad);
            delete timeEvents.midPoint;
            sendBeacon(ad.callbacks, 'midPoint');
          }
          if (timeEvents && timeEvents.thirdQuartile && videoEl.currentTime >= timeEvents.thirdQuartile) {
            fireOnConsumer('ThirdQuartile', ad);
            delete timeEvents.thirdQuartile;
            sendBeacon(ad.callbacks, 'thirdQuartile');
          }
        },
        stalled() {
          fireOnConsumer('Stalled', ad);
          timeout = setTimeout(() => {
            cleanup();
          }, 5000); // make timeout configurable
        },

        canplay() {
          timeout && clearTimeout(timeout);
        },
        error() {
          fireOnConsumer('Error', ad);
          cleanup();
        },
        // this doesn't work reliably on sky box, moved logic to timeUpdate event
        // loadedmetadata() {
        //   // calculate when to fire the time based events (now that duration is known)
        //   timeEvents = {
        //     firstQuartile: videoEl.duration / 4,
        //     midPoint: videoEl.duration / 2,
        //     thirdQuartile: (videoEl.duration / 4) * 3,
        //   }
        // },
        abort() {
          cleanup();
        }
        // todo: pause, resume, mute, unmute beacons
      };
      // add all listeners
      Object.keys(handlers).forEach(handler => videoEl.addEventListener(handler, handlers[handler]));
      videoEl.play();
    });
  };
  const sendBeacon = (callbacks, event) => {
    if (callbacks && callbacks[event]) {
      Log.info('Ad', 'Sending beacon', event, callbacks[event]);
      return callbacks[event].reduce((promise, url) => {
        return promise.then(() => fetch(url)
        // always resolve, also in case of a fetch error (so we don't block firing the rest of the beacons for this event)
        // note: for fetch failed http responses don't throw an Error :)
        .then(response => {
          if (response.status === 200) {
            fireOnConsumer('Beacon' + event + 'Sent');
          } else {
            fireOnConsumer('Beacon' + event + 'Failed' + response.status);
          }
          Promise.resolve(null);
        }).catch(() => {
          Promise.resolve(null);
        }));
      }, Promise.resolve(null));
    } else {
      Log.info('Ad', 'No callback found for ' + event);
    }
  };
  const fireOnConsumer = (event, args) => {
    if (consumer) {
      consumer.fire('$ad' + event, args);
      consumer.fire('$adEvent', event, args);
    }
  };
  var Ads = {
    get(config, videoPlayerConsumer) {
      if (config.enabled === false) {
        return Promise.resolve({
          prerolls() {
            return Promise.resolve();
          }
        });
      }
      consumer = videoPlayerConsumer;
      return new Promise(resolve => {
        Log.info('Ad', 'Starting session');
        getAds(config).then(ads => {
          Log.info('Ad', 'API result', ads);
          resolve({
            prerolls() {
              if (ads.preroll) {
                state.active = true;
                fireOnConsumer('PrerollSlotImpression', ads);
                sendBeacon(ads.preroll.callbacks, 'slotImpression');
                return playSlot(ads.preroll.ads).then(() => {
                  fireOnConsumer('PrerollSlotEnd', ads);
                  sendBeacon(ads.preroll.callbacks, 'slotEnd');
                  state.active = false;
                });
              }
              return Promise.resolve();
            },
            midrolls() {
              return Promise.resolve();
            },
            postrolls() {
              return Promise.resolve();
            }
          });
        });
      });
    },
    cancel() {
      Log.info('Ad', 'Cancel Ad');
      state.active = false;
    },
    stop() {
      Log.info('Ad', 'Stop Ad');
      state.active = false;
      // fixme: duplication
      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.pause();
      videoEl.removeAttribute('src');
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class ScaledImageTexture extends Lightning.textures.ImageTexture {
    constructor(stage) {
      super(stage);
      this._scalingOptions = undefined;
    }
    set options(options) {
      this.resizeMode = this._scalingOptions = options;
    }
    _getLookupId() {
      return "".concat(this._src, "-").concat(this._scalingOptions.type, "-").concat(this._scalingOptions.w, "-").concat(this._scalingOptions.h);
    }
    getNonDefaults() {
      const obj = super.getNonDefaults();
      if (this._src) {
        obj.src = this._src;
      }
      return obj;
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var Img = ((imageUrl, options) => {
    const imageServerUrl = Settings$2.get('platform', 'imageServerUrl');

    // make and return ScaledImageTexture
    const make = options => {
      // local asset, wrap it in Utils.asset()
      if (!/^(?:https?:)?\/\//i.test(imageUrl)) {
        imageUrl = Utils.asset(imageUrl);
      }

      // only pass to image server if imageServerUrl is configured
      // and if the asset isn't local to the app (i.e. has same origin)
      if (imageServerUrl && imageUrl.indexOf(window.location.origin) === -1) {
        imageUrl = Utils.ensureUrlWithProtocol(imageServerUrl + '?' + Utils.makeQueryString(imageUrl, options));
      } else {
        // Lightning will handle the resizing and has only 2 flavours (cover and contain)
        if (options.type === 'crop') options.type = 'cover';else options.type = 'contain';
      }
      return {
        type: ScaledImageTexture,
        src: imageUrl,
        options: options
      };
    };

    // merge options with default
    const setOptions = options => {
      options = {
        ...{
          type: 'contain',
          w: 0,
          h: 0
        },
        ...options
      };
      const imageQuality = Math.max(0.1, Math.min(1, (parseFloat(Settings$2.get('platform', 'image.quality')) || 100) / 100));
      options.w = options.w * imageQuality;
      options.h = options.h * imageQuality;
      return options;
    };

    // if options are passed, return scaled image right away
    if (options) {
      return make(setOptions(options));
    }

    // otherwise return 'chained' functions
    return {
      // official api
      exact: (w, h) => make(setOptions({
        type: 'exact',
        w,
        h
      })),
      landscape: w => make(setOptions({
        type: 'landscape',
        w
      })),
      portrait: h => make(setOptions({
        type: 'portrait',
        h
      })),
      cover: (w, h) => make(setOptions({
        type: 'cover',
        w,
        h
      })),
      contain: (w, h) => make(setOptions({
        type: 'contain',
        w,
        h
      })),
      original: () => make(setOptions({
        type: 'contain'
      }))

      // todo: add positioning - i.e. top, bottom, center, left etc.
    };
  });

  class Splash extends Lightning.Component {
    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          }
        },
        Logo: {
          texture: lng.Tools.getSvgTexture(Utils.asset("images/tmdb.svg"), 500, 500),
          mount: 0.5,
          x: 960,
          y: 640,
          w: 450,
          h: 300,
          alpha: 0.001,
          transitions: {
            alpha: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            },
            y: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          }
        },
        Spinner: {
          src: Utils.asset("images/spinner.png"),
          mountX: 0.5,
          x: 960,
          y: 750,
          w: 100,
          h: 100,
          alpha: 0.001,
          color: 0xaaffffff,
          transitions: {
            alpha: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          }
        }
      };
    }
    _init() {
      // console.log("Splash Screen");
      this.tag("Logo").on("txLoaded", () => {
        this.tag("Logo").setSmooth("alpha", 1);
        this.tag("Logo").setSmooth("y", 540);
        this.tag("Background").setSmooth("scale", 1);
      });
      this.tag("Spinner").on("txLoaded", () => {
        this.tag("Spinner").setSmooth("alpha", 1);
        this._spinnerAnimation.start();
      });
      this.application.on("booted", () => {
        Router.navigate("main", false);
      });
      this._spinnerAnimation = this.animation({
        duration: 1,
        repeat: -1,
        actions: [{
          t: "Spinner",
          p: "rotation",
          sm: 0,
          v: function (t) {
            if (t < 0.125) {
              return 45 * (Math.PI / 180);
            } else if (t < 0.25) {
              return 90 * (Math.PI / 180);
            } else if (t < 0.375) {
              return 135 * (Math.PI / 180);
            } else if (t < 0.5) {
              return 180 * (Math.PI / 180);
            } else if (t < 0.625) {
              return 225 * (Math.PI / 180);
            } else if (t < 0.75) {
              return 270 * (Math.PI / 180);
            } else if (t < 0.875) {
              return 315 * (Math.PI / 180);
            } else if (t < 1) {
              return 360 * (Math.PI / 180);
            }
          }
        }]
      });
      setTimeout(() => {
        Router.navigate("profile", false);
      }, 3000);
    }

    //   _active() {
    //     this.widgets.menu.visible = false;
    //   }

    _inactive() {
      this._spinnerAnimation.stop();
    }
  }

  class MenuItem$3 extends Lightning.Component {
    static _template() {
      return {
        w: 70,
        h: 70,
        //rect: true,
        //color: 0xff090909,
        flexItem: {
          marginBottom: 30
        },
        Icon: {
          x: 15,
          y: 15
        }
      };
    }
    set item(obj) {
      this._item = obj;
    }
    set label(str) {
      this._item.label = str;
      this._update();
    }
    set displayColor(argb) {
      this._item.displayColor = argb;
      this._update();
    }
    _update() {
      if (this.active && this._item) {
        const {
          path = "Void",
          displayColor = 0xff212121
        } = this._item;
        const color = this.hasFocus() ? 0xffffffff : displayColor;
        this.patch({
          // color: this.hasFocus() ? displayColor : 0xff212121,
          Icon: {
            color,
            src: Utils.asset("images/menu/".concat(path.toLowerCase(), ".png"))
          }
        });
      }
    }
    _firstActive() {
      this._update();
    }
    _focus() {
      this.patch({
        smooth: {
          color: this._item.displayColor
        },
        Icon: {
          smooth: {
            color: 0xffffff21
          }
        },
        Label: {
          smooth: {
            color: 0xff212121
          }
        }
      });
    }
    _unfocus() {
      const color = this._item.displayColor;
      this.patch({
        smooth: {
          color: 0xffffffff
        },
        Icon: {
          smooth: {
            color
          }
        },
        Label: {
          smooth: {
            color
          }
        }
      });
    }
    _handleEnter() {
      const {
        lbl
      } = this._item;
      Router.navigate("".concat(lbl), false);
    }
  }
  class MenuItemDIY$1 extends MenuItem$3 {
    static get width() {
      return 70;
    }
    static get height() {
      return 70;
    }
  }

  const getImgUrl = function (imgPath) {
    let width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 185;
    return "//image.tmdb.org/t/p/w".concat(width).concat(imgPath);
  };

  class Background extends Lightning.Component {
    static _template() {
      return {
        Backgrounds: {
          BackgroundA: {
            colorTop: 0xff717171,
            colorBottom: 0xff000000,
            scale: 1.2,
            alpha: 0
            // transitions: {
            //   zIndex: {
            //     duration: 2,
            //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //   },
            //   alpha: {
            //     duration: 2,
            //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //   },
            //   scale: {
            //     duration: 2,
            //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //   },
            // },
          },

          BackgroundB: {
            // colorTop: 0xff717171,
            colorBottom: 0xff000000
            // transitions: {
            //   zIndex: {
            //     duration: 2,
            //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //   },
            //   alpha: {
            //     duration: 2,
            //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //   },
            //   scale: {
            //     duration: 2,
            //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //   },
            // },
          }
        }
      };
    }

    _init() {
      this._backgroundIndex = 1;
      this.application.on("setItem", item => {
        if (item === this._item) {
          return;
        }
        this._item = item;
        const image = getImgUrl(item.background, 1280);
        this.tag("Backgrounds").children[this._backgroundIndex].patch({
          texture: Img(image).contain(1920, 1080)
          // smooth: { scale: 1, alpha: 0.8 },
        });

        this._backgroundIndex ^= 1;
        this.tag("Backgrounds").children[this._backgroundIndex].patch({
          texture: Img(image).contain(1920, 1080)
          // smooth: { scale: 1, alpha: 1 },
        });
      });
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Page extends Lightning.Component {
    static _template() {
      return {
        Content: {},
        Content1: {},
        FadeTop: {
          w: 1920,
          h: 230,
          rect: true,
          colorTop: Colors('white').alpha(0.7).get(),
          colorBottom: 0x00000000
        },
        Header: {
          x: 90,
          y: 100,
          color: Colors('white').get(),
          text: {
            text: this.header,
            fontFace: 'Londrina',
            fontSize: 50
          }
        }
      };
    }
    _active() {
      this.patch({
        FadeTop: {
          colorTop: Colors(this.fireAncestors('$getThemeColor')).alpha(0.7).get()
        }
      });
    }
    _focus() {
      this.setSmooth('alpha', 1);
    }
    _unfocus() {
      this.setSmooth('alpha', 0);
    }
    _handleDown() {
      Router.focusWidget('Menu');
    }
    static get header() {
      return 'Page';
    }
    static get icon() {
      return 'images/splash.png';
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class ImageCell extends Lightning.Component {
    static _template() {
      return {
        Shadow: {
          alpha: 0,
          mount: 0.5,
          x: w => w / 2,
          y: h => h / 2,
          w: w => w + 32,
          h: h => h + 32,
          color: Colors('shadow').get(),
          rect: true,
          shader: {
            type: Lightning.shaders.FadeOut,
            fade: 32
          }
        },
        ImageWrapper: {
          w: 700,
          h: 500,
          rtt: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 4
          },
          Fill: {
            w: w => w,
            h: h => h,
            color: Colors('White').get(),
            rect: false
          },
          Image: {
            alpha: 0.0001,
            mount: 0.5,
            y: w => w / 2,
            x: h => h / 2
          }
        },
        Focus: {
          alpha: 0,
          x: 4,
          y: 4,
          w: w => w - 8,
          h: h => h - 8,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 3,
            stroke: 5,
            strokeColor: 0xffffffff,
            blend: 1,
            fillColor: 0x00ffffff
          }
        },
        Label: {
          mountX: 1,
          mountY: 1,
          y: h => h - 5,
          x: w => w - 30,
          color: Colors('black').get(),
          text: {
            text: this.bindProp('number'),
            fontFace: 'Londrina',
            fontSize: 50
          }
        }
      };
    }
    _init() {
      const image = this.tag('Image');
      image.on('txLoaded', () => {
        image.setSmooth('alpha', 1);
      });
      this._focusAnimation = this.animation({
        duration: 0.2,
        actions: [{
          p: 'scale',
          v: {
            0: 1,
            1: 1.2
          }
        }, {
          t: "Shadow",
          p: 'alpha',
          v: {
            0: 0,
            1: 1
          }
        }, {
          t: "Label",
          p: 'scale',
          v: {
            0: 1,
            1: 1.1
          }
        }, {
          t: "Label",
          p: 'color',
          v: {
            0: Colors('black').alpha(0.7).get(),
            1: Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
          }
        }, {
          t: "Focus",
          p: 'alpha',
          v: {
            0: 0,
            1: 1
          }
        }]
      });
    }
    _update() {
      this.patch({
        ImageWrapper: {
          Image: {
            color: Colors("color".concat(Math.floor(Math.random() * 7) + 1)).get(),
            h: 500,
            w: 700
          }
        },
        Focus: {
          color: Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
        }
      });
    }
    _firstActive() {
      this._update();
    }
    _focus() {
      if (this._focusAnimation) {
        this._focusAnimation.start();
      }
    }
    _unfocus() {
      this._focusAnimation.stop();
    }
    static get width() {
      return 400;
    }
    static get height() {
      return 300;
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class ImageCell1 extends Lightning.Component {
    static _template() {
      return {
        Shadow: {
          alpha: 0,
          mount: 0.5,
          x: w => w / 2,
          y: h => h / 2,
          w: w => w + 32,
          h: h => h + 32,
          color: Colors('shadow').get(),
          rect: true,
          shader: {
            type: Lightning.shaders.FadeOut,
            fade: 32
          }
        },
        ImageWrapper: {
          w: 700,
          h: 500,
          rtt: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 4
          },
          Fill: {
            w: w => w,
            h: h => h,
            color: Colors('White').get(),
            rect: false
          },
          Image: {
            alpha: 0.0001,
            mount: 0.5,
            y: w => w / 2,
            x: h => h / 2
          }
        },
        Focus: {
          alpha: 0,
          x: 4,
          y: 4,
          w: w => w - 8,
          h: h => h - 8,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 3,
            stroke: 5,
            strokeColor: 0xffffffff,
            blend: 1,
            fillColor: 0x00ffffff
          }
        },
        Label: {
          mountX: 1,
          mountY: 1,
          y: h => h - 5,
          x: w => w - 30,
          color: Colors('black').get(),
          text: {
            text: this.bindProp('number'),
            fontFace: 'Londrina',
            fontSize: 50
          }
        }
      };
    }
    _init() {
      const image = this.tag('Image');
      image.on('txLoaded', () => {
        image.setSmooth('alpha', 1);
      });
      this._focusAnimation = this.animation({
        duration: 0.2,
        actions: [{
          p: 'scale',
          v: {
            0: 1,
            1: 1
          }
        }, {
          t: "Shadow",
          p: 'alpha',
          v: {
            0: 0,
            1: 1
          }
        }, {
          t: "Label",
          p: 'scale',
          v: {
            0: 1,
            1: 1.1
          }
        }, {
          t: "Label",
          p: 'color',
          v: {
            0: Colors('black').alpha(0.7).get(),
            1: Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
          }
        }, {
          t: "Focus",
          p: 'alpha',
          v: {
            0: 0,
            1: 1
          }
        }]
      });
    }
    _update() {
      this.patch({
        ImageWrapper: {
          Image: {
            color: Colors("color".concat(Math.floor(Math.random() * 7) + 1)).get(),
            h: 500,
            w: 700
          }
        },
        Focus: {
          color: Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
        }
      });
    }
    _firstActive() {
      this._update();
    }
    _focus() {
      if (this._focusAnimation) {
        this._focusAnimation.start();
      }
    }
    _unfocus() {
      this._focusAnimation.stop();
    }
    static get width() {
      return 400;
    }
    static get height() {
      return 300;
    }
  }

  class Main extends Page {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        // rect: true,

        w: 1920,
        h: 1080,
        // color: 0xff0b63f6,
        Background1: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        Background: {
          visible: true,
          type: Background
        },
        Blur: {
          rtt: true,
          w: 1920,
          h: 1080,
          type: Lightning.components.FastBlurComponent,
          amount: 0,
          transitions: {
            amount: {
              duration: 0.3
            },
            scale: {
              duration: 0.3
            }
          }
        },
        Home: {
          y: 0,
          Lists: {
            x: 150,
            y: 600,
            zIndex: 3
          },
          Lists1: {
            x: 150,
            y: 1800,
            zIndex: 3
          },
          Lists2: {
            x: 150,
            y: 2400,
            zIndex: 3
          },
          // IMG: {
          //   // color: 0xffc0392b,
          //   // mountX: 0.5,
          //   // mountY: 0.4,
          //   w: 1920,
          //   h: 670,
          //   src: Utils.asset("./images/content/home_img.png"),
          //   // Content: {
          //   //   x: 10,
          //   //   y: 90,
          //   //   w: 1600,
          //   //   h: 470,
          //   //   rect: true,
          //   // },
          // },

          Content: {
            Text123: {
              x: 150,
              y: 1200,
              text: {
                text: "Watch In Your Language",
                fontSize: 40
              }
            },
            visible: true,
            List: {
              x: 150,
              y: 1300,
              w: 1740,
              type: ui.List,
              direction: "row"
            }
          },
          List123: {
            x: 0,
            y: 0,
            w: 1900,
            type: ui.List,
            direction: "row"
          }
        },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        // Profile: {
        // 	x: 1830,
        // 	y: 30,
        // 	w: 60,
        // 	h: 60,
        // 	src: Utils.asset("./images/profile.png"),
        // },

        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ui.List,
          spacing: 30,
          direction: "column"
        }
      };
    }

    // _getFocused() {
    // 	return this.tag("Menu");
    // }

    _setup() {
      const items1 = [];
      for (let i = 0; i < 7; i++) {
        items1.push({
          w: 1950,
          h: 575,
          src: Utils.asset("images/banner_new/banner/".concat(i, ".png")),
          type: ImageCell1
        });
      }
      this.tag("List123").add(items1);
      const items = [];
      for (let i = 0; i < 4; i++) {
        items.push({
          margin: 15,
          src: Utils.asset("images/".concat(i, ".jpg")),
          type: ImageCell
        });
      }
      this.tag("List").add(items);
    }
    _init() {
      Registry.setInterval(() => {
        this.tag("List123").right();
      }, 5000), this._index = 0;
      this.tag("Home").y = 0;
      this._setState("Lists");
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "movies",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "settings",
          displayColor: 0xffffffff
        }
      }];
      this._setState("Lists");
    }
    set main(v) {
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    set popular(v) {
      this.tag("Lists1").children = v;
      let y = 0;
      this.tag("Lists1").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    set Popular1(v) {
      this.tag("Lists2").children = v;
      let y = 0;
      this.tag("Lists2").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }

    // $changeContent({ lbl }) {
    //   // this.tag("IMG").patch({
    //   //   IMG: {
    //   //     w: 1920,
    //   //     h: 670,
    //   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
    //   //   },
    //   // });
    //   Router.navigate(`${lbl}`, false);
    // }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Background1").visible = true;
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
        _handleDown() {
          this._setState("Lists");
        }
      }, class Lists extends this {
        $exit() {
          this.tag("Lists");
        }
        _getFocused() {
          this.tag("Background1").visible = true;
          this.tag("Background").visible = false;
          this.tag("Home").y = 0;
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("List123");
        }
        _handleLeft() {
          this._setState("Menu");
        }
        _handleDown() {
          this.tag("Home").y -= 600;
          this._setState("List");
        }
      }, class Lists1 extends this {
        _getFocused() {
          this.tag("Background1").visible = true;
          this.tag("Background").visible = false;
          this.tag("Content").visible = true;
          return this.tag("Lists1").children[this._index];
        }
        _handleUp() {
          this.tag("Home").y += 400;
          this._setState("List");
        }
        _handleDown() {
          this.tag("Home").y -= 800;
          this._setState("Lists2");
        }
        _handleLeft() {
          this._setState("Menu");
        }
      }, class Lists2 extends this {
        _getFocused() {
          this.tag("Background1").visible = true;
          this.tag("Background").visible = false;
          this.tag("Content").visible = false;
          return this.tag("Lists2").children[this._index];
        }
        _handleUp() {
          this.tag("Home").y += 800;
          this._setState("Lists1");
        }
        _handleLeft() {
          this._setState("Menu");
        }
        _handleDown() {}
      }, class List extends this {
        _getFocused() {
          this.tag("Content").visible = true;
          this.tag("Background1").visible = true;
          this.tag("Background").visible = false;
          return this.tag("List");
        }
        _handleLeft() {
          this._setState("Menu");
        }
        _handleEnter() {
          Router.navigate("tv", false);
        }
        _handleDown() {
          this.tag("Home").y -= 600;
          this._setState("Lists1");
        }
        _handleUp() {
          this.tag("Home").y += 800;
          this._setState("Lists");
        }
      }, class List123 extends this {
        _getFocused() {
          this.tag("Background1").visible = true;
          this.tag("Background").visible = false;
          return this.tag("List123");
        }
        // _handleLeft() {
        // 	``;
        // 	this._setState("Menu");
        // }
        // _handleEnter() {
        // 	Router.navigate("tv", false);
        // }
        _handleDown() {
          // this.tag("Home").y -= 600;
          this._setState("Lists");
        }
      }];
    }

    // _handleLeft() {
    //   Router.focusWidget("Menu");
    // }

    $firstItemCreated() {
      this._refocus();
    }
    _getFocused() {
      return this.tag("Lists").children[this._index];
    }
    static get icon() {
      return "images/list.png";
    }
    // _firstActive() {
    //     this.tag('Assets').items = [
    //         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
    //         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
    //         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
    //         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
    //         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
    //     ];
    // }
  }

  class List$2 extends Lightning.Component {
    static _template() {
      return {
        // Blur: {
        //   rtt: true,
        //   w: 1920,
        //   h: 1080,
        //   type: Lightning.components.FastBlurComponent,
        //   amount: 0,
        //   transitions: {
        //     amount: { duration: 0.3 },
        //     scale: { duration: 0.3 },
        //   },
        // },
        Items: {
          flex: {
            direction: "row",
            wrap: true
          }
        }
      };
    }

    // _init() {
    //   this.application.on("blurContent", ({ amount, scale }) => {
    //     this.tag("Blur").setSmooth("amount", amount);
    //     this.tag("Blur").setSmooth("scale", scale, {
    //       duration: 0.3,
    //       timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)",
    //     });
    //   });
    // }

    _construct() {
      this._index = 6;
      this._items = [];
      this._orientation = "vertical";
    }
    set orientation(str) {
      const flex = {
        direction: "column"
      };
      if (str === "vertical") {
        flex.direction = "row";
      } else {
        str = "horizontal";
      }
      this.patch({
        Items: {
          flex
        }
      });
      this._orientation = str;
    }
    set items(arr) {
      this._items = arr;
      if (this.active) {
        this._setup();
      }
    }
    get items() {
      return this.tag("Items").children;
    }
    get currentItem() {
      return this.items[this._index];
    }
    _handleUp() {
      return this.setIndex(this._index - 1, "vertical");
    }
    _handleDown() {
      return this.setIndex(this._index + 1, "vertical");
    }

    // _handleRight() {
    //   return this.setIndex(this._index + 1, "horizontal");
    // }

    setIndex(targetIdx) {
      let orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._orientation;
      if (orientation === this._orientation && targetIdx > -1 && targetIdx < this.items.length) {
        this._index = targetIdx;
        return true;
      }
      return false;
    }
    _update() {
      this._setState("");
      if (this.active && this._items.length > 0) {
        this.tag("Items").children = this._items;
        this._setState("Filled");
      } else {
        this.tag("Items").childList.clear();
      }
    }
    _firstActive() {
      this._update();
    }
    static _states() {
      return [class Filled extends this {
        _getFocused() {
          return this.currentItem;
        }
      }];
    }
  }
  class ListDIY$1 extends List$2 {
    static _template() {
      return {
        Items: {}
      };
    }
    set orientation(str) {
      this._orientation = str;
    }
    set spacing(num) {
      this._spacing = num;
    }
    get spacing() {
      return this._spacing || 10;
    }
    _update() {
      this._setState("");
      if (this.active && this._items.length > 0) {
        const isHorizontal = this._orientation === "horizontal";
        const surface = isHorizontal ? "x" : "y";
        const dimension = isHorizontal ? "width" : "height";
        let acc = 0;
        this.tag("Items").children = this._items.map(item => {
          const targetPos = acc;
          acc += item.type[dimension] + this.spacing;
          return {
            ...item,
            [surface]: targetPos
          };
        });
        this._setState("Filled");
      } else {
        this.tag("Items").childList.clear();
      }
    }
  }

  class Button$2 extends Lightning.Component {
    static _template() {
      return {
        flex: {},
        Background: {
          flex: {},
          rtt: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 14
          },
          rect: true,
          color: 0xff404249,
          transitions: {
            color: {
              duration: 0.6,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
            },
            scale: {
              duration: 0.6,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
            }
          },
          Label: {
            flexItem: {
              marginLeft: 80,
              marginRight: 80,
              marginTop: 15,
              marginBottom: 10
            },
            text: {
              fontFace: "SourceSansPro-Regular",
              fontSize: 32
            },
            transitions: {
              color: {
                duration: 0.6,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
              },
              scale: {
                duration: 0.6,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
              }
            }
          }
        }
      };
    }
    set label(v) {
      this._label = v;
      this.tag("Label").patch({
        text: {
          text: this._label
        }
      });
    }
    _focus() {
      this.patch({
        Background: {
          smooth: {
            color: 0xff03b3e4
          },
          Label: {
            smooth: {
              color: 0xffffffff
            }
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Background: {
          smooth: {
            color: 0xff404249
          },
          Label: {
            smooth: {
              color: 0xffffffff
            }
          }
        }
      });
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class ImageCellMovie extends Lightning.Component {
    static _template() {
      return {
        Shadow: {
          alpha: 0,
          mount: 0.5,
          x: w => w / 2,
          y: h => h / 2,
          w: w => w + 32,
          h: h => h + 32,
          color: Colors('shadow').get(),
          rect: true,
          shader: {
            type: Lightning.shaders.FadeOut,
            fade: 32
          }
        },
        ImageWrapper: {
          w: 700,
          h: 500,
          rtt: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 4
          },
          Fill: {
            w: w => w,
            h: h => h,
            color: Colors('White').get(),
            rect: false
          },
          Image: {
            alpha: 0.0001,
            mount: 0.5,
            y: w => w / 2,
            x: h => h / 2
          }
        },
        Focus: {
          alpha: 0,
          x: 4,
          y: 4,
          w: w => w - 8,
          h: h => h - 8,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 3,
            stroke: 5,
            strokeColor: 0xffffffff,
            blend: 1,
            fillColor: 0x00ffffff
          }
        },
        Label: {
          mountX: 1,
          mountY: 1,
          y: h => h - 5,
          x: w => w - 30,
          color: Colors('black').get(),
          text: {
            text: this.bindProp('number'),
            fontFace: 'Londrina',
            fontSize: 50
          }
        }
      };
    }
    _init() {
      const image = this.tag('Image');
      image.on('txLoaded', () => {
        image.setSmooth('alpha', 1);
      });
      this._focusAnimation = this.animation({
        duration: 0.2,
        actions: [{
          p: 'scale',
          v: {
            0: 1,
            1: 1.075
          }
        }, {
          t: "Shadow",
          p: 'alpha',
          v: {
            0: 0,
            1: 1
          }
        }, {
          t: "Label",
          p: 'scale',
          v: {
            0: 1,
            1: 1.1
          }
        }, {
          t: "Label",
          p: 'color',
          v: {
            0: Colors('black').alpha(0.7).get(),
            1: Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
          }
        }, {
          t: "Focus",
          p: 'alpha',
          v: {
            0: 0,
            1: 1
          }
        }]
      });
    }
    _update() {
      this.patch({
        ImageWrapper: {
          Image: {
            color: Colors("color".concat(Math.floor(Math.random() * 7) + 1)).get(),
            h: 500,
            w: 700
          }
        },
        Focus: {
          color: Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
        }
      });
    }
    _firstActive() {
      this._update();
    }
    _focus() {
      if (this._focusAnimation) {
        this._focusAnimation.start();
      }
    }
    _unfocus() {
      this._focusAnimation.stop();
    }
    static get width() {
      return 400;
    }
    static get height() {
      return 300;
    }
  }

  var MovieTitle;
  class Details$2 extends Page {
    static _template() {
      return {
        // x: 68,
        // y: 300,
        Background: {
          type: Background
        },
        flex: {
          direction: "column"
        },
        Header: {
          x: 68,
          y: 300,
          flex: {},
          // Poster: {
          //   flexItem: { marginRight: 40 },
          //   w: 300,
          //   h: 450,
          //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
          //   // Image: {
          //   //   w: (w) => w,
          //   //   h: (h) => h,
          //   // },
          // },
          Details: {
            flex: {
              direction: "column"
            },
            x: 90,
            y: -250,
            transitions: {
              x: {
                duration: 1,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
              }
            },
            Year: {
              text: {
                fontSize: 32,
                fontFace: "SourceSansPro-Regular"
              }
            },
            Title: {
              text: {
                fontSize: 64,
                fontFace: "SourceSansPro-Bold",
                wordWrapWidth: 600,
                maxLines: 2,
                lineHeight: 74
              }
            },
            SimilarContent: {
              y: 0,
              Text123: {
                x: 0,
                y: 230,
                text: {
                  text: "Similar Content",
                  fontSize: 45,
                  fontStyle: "bold"
                }
              },
              Lists: {
                x: 0,
                y: 300,
                zIndex: 3,
                visible: true,
                type: ui.List,
                direction: "row"
              }
            },
            Overview: {
              color: 0xff7b7b7b,
              text: {
                fontSize: 24,
                fontFace: "SourceSansPro-Regular",
                wordWrapWidth: 960,
                lineHeight: 38
              }
            },
            Button: {
              flexItem: {
                marginTop: 30
              },
              x: 1400,
              y: -100,
              type: Button$2,
              label: "Watch Now"
            }
            // Button1: {
            // 	flexItem: { marginTop: 50 },
            // 	type: Button,
            // 	label: "Add to wishlist",
            // },
          }
        }
      };
    }

    _setup() {
      const items = [];
      for (let i = 0; i < 7; i++) {
        items.push({
          margin: 15,
          src: Utils.asset("images/details/".concat(i, ".jpg")),
          type: ImageCellMovie
        });
      }
      this.tag("Lists").add(items);
    }
    _active() {
      this._setState("Button");
      // Router.focusPage();
      // this.widgets.menu.visible = true;
      this.application.emit("setItem", this._details);
      this.patch({
        Header: {
          Details: {
            smooth: {
              x: 40
            }
          }
        }
      });

      // this._refocus();
    }

    _init() {
      this._setState("Button");
      this.tag("SimilarContent").y += 700;
      this._index = 0;
    }

    // _inactive() {
    //   this.tag("Details").setSmooth("x", 90);
    // }

    set details(v) {
      this._details = v;
      // const image = getImgUrl(this._details.poster, 500);
      MovieTitle = this._details.title;
      this.patch({
        Header: {
          // Poster: {
          //   Image: {
          //     texture: Img(image).contain(300, 450),
          //   },
          // },
          Details: {
            Year: {
              text: {
                text: this._details.releaseDate.getFullYear()
              }
            },
            Title: {
              text: {
                text: this._details.title
              }
            },
            Overview: {
              text: {
                text: this._details.overview
              }
            }
          }
        }
      });
    }

    // set main1(v) {
    // 	this.tag("Lists").children = v;
    // 	let y = 0;
    // 	this.tag("Lists").children.forEach((child) => {
    // 		child.y = y;
    // 		y += child.constructor.height;
    // 	});
    // }
    _focus() {
      this.patch({
        Button: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Button: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    static _states() {
      return [class Button extends this {
        _getFocused() {
          return this.tag("Button");
        }
        _handleUp() {
          this._setState("Lists");
        }
        _handleEnter() {
          Router.navigate("simple", false);
        }
      }, class Lists extends this {
        _getFocused() {
          this.tag("SimilarContent").y = 0;
          return this.tag("Lists");
        }
        _handleUp() {
          this._setState("Button");
        }
        _handleEnter() {
          Router.navigate("simple", false);
        }
      }

      // class List extends this {
      // 	_getFocused() {
      // 		return this.tag("List");
      // 	}
      // 	_handleLeft() {
      // 		this._setState("Menu");
      // 	}
      // 	_handleEnter() {
      // 		Router.navigate("tv",false);
      // 	}
      // 	_handleDown() {
      // 		this._setState("Lists");
      // 	}
      // },
      ];
    }
    // $firstItemCreated() {
    // 	this._refocus();
    // }

    // _getFocused() {
    // 	return this.tag("Lists").children[this._index];
    // }

    // _handleUp() {
    // 	Router.navigate("main", false);
    // }

    // _handleEnter() {
    // 	Router.navigate("simple", false);
    // }

    // _getFocused() {
    // 	return this.tag("Button");
    // }
  }

  class DetailsMovie extends Lightning.Component {
    static _template() {
      return {
        // x: 68,
        // y: 300,
        Background: {
          type: Background
        },
        flex: {
          direction: "column"
        },
        Header: {
          x: 68,
          y: 300,
          flex: {},
          // Poster: {
          //   flexItem: { marginRight: 40 },
          //   w: 300,
          //   h: 450,
          //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
          //   // Image: {
          //   //   w: (w) => w,
          //   //   h: (h) => h,
          //   // },
          // },
          Details: {
            flex: {
              direction: "column"
            },
            x: 90,
            y: -250,
            transitions: {
              x: {
                duration: 1,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
              }
            },
            Year: {
              text: {
                fontSize: 32,
                fontFace: "SourceSansPro-Regular"
              }
            },
            Title: {
              text: {
                fontSize: 64,
                fontFace: "SourceSansPro-Bold",
                wordWrapWidth: 600,
                maxLines: 2,
                lineHeight: 74
              }
            },
            SimilarContent: {
              y: 0,
              Text123: {
                x: 1350,
                y: 350,
                text: {
                  text: "Similar Content",
                  fontSize: 45,
                  fontStyle: "bold"
                }
              },
              Lists: {
                x: 0,
                y: 230,
                zIndex: 3,
                visible: true
              }
            },
            Overview: {
              color: 0xff7b7b7b,
              text: {
                fontSize: 24,
                fontFace: "SourceSansPro-Regular",
                wordWrapWidth: 960,
                lineHeight: 38
              }
            },
            Button: {
              flexItem: {
                marginTop: 30
              },
              x: 1400,
              y: -100,
              type: Button$2,
              label: "Watch Now"
            }
            // Button1: {
            // 	flexItem: { marginTop: 50 },
            // 	type: Button,
            // 	label: "Add to wishlist",
            // },
          }
        }
      };
    }

    _active() {
      this._setState("Button");
      Router.focusPage();
      // this.widgets.menu.visible = true;
      this.application.emit("setItem", this._details);
      this.patch({
        Header: {
          Details: {
            smooth: {
              x: 40
            }
          }
        }
      });

      // this._refocus();
    }

    _init() {
      this._setState("Button");
      this.tag("SimilarContent").y += 700;
      this._index = 0;
    }

    // _inactive() {
    //   this.tag("Details").setSmooth("x", 90);
    // }

    set details(v) {
      this._details = v;
      // const image = getImgUrl(this._details.poster, 500);
      this._details.title;
      this.patch({
        Header: {
          // Poster: {
          //   Image: {
          //     texture: Img(image).contain(300, 450),
          //   },
          // },
          Details: {
            Year: {
              text: {
                text: this._details.releaseDate.getFullYear()
              }
            },
            Title: {
              text: {
                text: this._details.title
              }
            },
            Overview: {
              text: {
                text: this._details.overview
              }
            }
          }
        }
      });
    }
    set main1(v) {
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    static _states() {
      return [class Button extends this {
        _getFocused() {
          return this.tag("Button");
        }
        _handleUp() {
          this._setState("Lists");
        }
        _handleEnter() {
          Router.navigate("simple", false);
        }
      }, class Lists extends this {
        _getFocused() {
          this.tag("SimilarContent").y = 0;
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("Button");
        }
        _handleEnter() {
          Router.navigate("details/".concat(item.type, "/").concat(item.id), false);
        }
      }

      // class List extends this {
      // 	_getFocused() {
      // 		return this.tag("List");
      // 	}
      // 	_handleLeft() {
      // 		this._setState("Menu");
      // 	}
      // 	_handleEnter() {
      // 		Router.navigate("tv",false);
      // 	}
      // 	_handleDown() {
      // 		this._setState("Lists");
      // 	}
      // },
      ];
    }

    $firstItemCreated() {
      this._refocus();
    }

    // _getFocused() {
    // 	return this.tag("Lists").children[this._index];
    // }

    // _handleUp() {
    // 	Router.navigate("main", false);
    // }

    // _handleEnter() {
    // 	Router.navigate("simple", false);
    // }

    // _getFocused() {
    // 	return this.tag("Button");
    // }
  }

  class Details$1 extends Page {
    static _template() {
      return {
        // x: 68,
        // y: 300,
        Background: {
          type: Background
        },
        flex: {
          direction: "column"
        },
        Header: {
          x: 68,
          y: 300,
          flex: {},
          // Poster: {
          //   flexItem: { marginRight: 40 },
          //   w: 300,
          //   h: 450,
          //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
          //   // Image: {
          //   //   w: (w) => w,
          //   //   h: (h) => h,
          //   // },
          // },
          Details: {
            flex: {
              direction: "column"
            },
            x: 90,
            y: -200,
            transitions: {
              x: {
                duration: 1,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
              }
            },
            Year: {
              text: {
                fontSize: 32,
                fontFace: "SourceSansPro-Regular"
              }
            },
            Title: {
              text: {
                fontSize: 64,
                fontFace: "SourceSansPro-Bold",
                wordWrapWidth: 600,
                maxLines: 2,
                lineHeight: 74
              }
            },
            Overview: {
              color: 0xff7b7b7b,
              text: {
                fontSize: 24,
                fontFace: "SourceSansPro-Regular",
                wordWrapWidth: 960,
                lineHeight: 38
              }
            },
            Button: {
              flexItem: {
                marginTop: 30
              },
              type: Button$2,
              label: "Season1"
            },
            Button1: {
              flexItem: {
                marginTop: 50
              },
              x: 300,
              y: -122,
              type: Button$2,
              label: "Season2"
            },
            Content: {
              // Text123: {
              // 	x: 150,
              // 	y: 1200,
              // 	text: { text: "Watch In Your Language", fontSize: 40 },
              // },
              visible: false,
              Text: {
                x: 50,
                y: 0,
                text: {
                  text: "Episodes 1-8",
                  fontSize: 40
                }
              },
              List: {
                x: 0,
                y: 100,
                w: 1740,
                type: ui.List,
                direction: "row"
              }
            },
            Content1: {
              // Text123: {
              // 	x: 150,
              // 	y: 1200,
              // 	text: { text: "Watch In Your Language", fontSize: 40 },
              // },
              visible: false,
              Text1: {
                x: 50,
                y: 0,
                text: {
                  text: "Episodes 1-8",
                  fontSize: 40
                }
              },
              List1: {
                x: 0,
                y: 100,
                w: 1740,
                type: ui.List,
                direction: "row"
              }
            }
          }
        }
      };
    }
    _setup() {
      const items1 = [];
      for (let i = 0; i < 6; i++) {
        items1.push({
          margin: 15,
          src: Utils.asset("images/season/".concat(i, ".jpg")),
          type: ImageCell
        });
      }
      this.tag("List").add(items1);
      const items = [];
      for (let i = 0; i < 6; i++) {
        items.push({
          margin: 15,
          src: Utils.asset("images/season2/".concat(i, ".jpg")),
          type: ImageCell
        });
      }
      this.tag("List1").add(items);
    }
    _active() {
      // this.widgets.Menu1.visible = true;
      this.application.emit("setItem", this._details);
      this.patch({
        Header: {
          Details: {
            smooth: {
              x: 40
            }
          }
        }
      });
      this._refocus();
    }
    _init() {
      this._setState("Button");
    }

    // _inactive() {
    //   this.tag("Details").setSmooth("x", 90);
    // }

    set details(v) {
      this._details = v;
      // const image = getImgUrl(this._details.poster, 500);
      this._details.title;
      this.patch({
        Header: {
          // Poster: {
          //   Image: {
          //     texture: Img(image).contain(300, 450),
          //   },
          // },
          Details: {
            Year: {
              text: {
                text: this._details.releaseDate.getFullYear()
              }
            },
            Title: {
              text: {
                text: this._details.title
              }
            },
            Overview: {
              text: {
                text: this._details.overview
              }
            }
          }
        }
      });
    }
    // _getFocused() {
    // 	return this.tag("Button");
    // }
    _focus() {
      this.patch({
        Button: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Button: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    static _states() {
      return [class Button extends this {
        _getFocused() {
          return this.tag("Button");
        }
        _handleRight() {
          this._setState("Button1");
        }
        _handleEnter() {
          this.tag("Content").visible = true;
          this.tag("Content1").visible = false;
          this._setState("List");
        }
        // _handleRight() {
        // 	this._setState("List");
        // }
      }, class Button1 extends this {
        _getFocused() {
          return this.tag("Button1");
        }
        _handleLeft() {
          this._setState("Button");
        }
        _handleEnter() {
          this.tag("Content").visible = false;
          this.tag("Content1").visible = true;
          this._setState("List1");
        }
      }, class List extends this {
        _getFocused() {
          this.tag("Content").visible = true;
          return this.tag("List");
        }
        _handleEnter() {
          Router.navigate("simple", false);
        }
        _handleUp() {
          // this.tag("Content").visible = false;
          this._setState("Button");
        }
      }, class List1 extends this {
        _getFocused() {
          this.tag("Content").visible = true;
          return this.tag("List1");
        }
        _handleEnter() {
          Router.navigate("simple", false);
        }
        _handleUp() {
          // this.tag("Content").visible = false;
          this._setState("Button1");
        }
      }

      // class List extends this {
      // 	_getFocused() {
      // 		return this.tag("List");
      // 	}
      // 	_handleLeft() {
      // 		this._setState("Menu");
      // 	}
      // 	_handleEnter() {
      // 		Router.navigate("tv",false);
      // 	}
      // 	_handleDown() {
      // 		this._setState("Lists");
      // 	}
      // },
      ];
    }

    // _handleUp() {
    // 	this.tag("Button");
    // }
    // _handleDown() {
    // 	this.tag("Button1");
    // }

    // _handleEnter() {
    // 	Router.navigate("simple", false);
    // }
  }

  const formatTime = seconds => {
    if (seconds === Infinity) return "--";
    return ("0" + Math.floor(seconds / 60)).slice(-2) + ":" + ("0" + Math.floor(seconds % 60)).slice(-2);
  };
  const videos = ["http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"];

  class Button$1 extends Lightning.Component {
    static _template() {
      return {
        h: 50,
        w: 50,
        color: 0xffffffff,
        rect: true,
        Icon: {
          w: 40,
          h: 40,
          x: 5,
          y: 5
        },
        Label: {
          x: w => w / 2,
          y: h => h / 2,
          mount: 0.5,
          text: {
            text: "",
            textColor: 0xff000000
          }
        }
      };
    }
    set index(v) {
      this.x = v * 70;
    }
    set icon(v) {
      if (v) {
        this.tag("Icon").src = Utils.asset("images/player/" + v + ".png");
      }
    }
    set label(v) {
      if (v) {
        this.tag("Label").text.text = v;
      }
    }
    _handleEnter() {
      this.action && this.fireAncestors(this.action);
    }
    _focus() {
      this.setSmooth("color", 0xffffffff);
    }
    _unfocus() {
      this.setSmooth("color", 0x80cccccc);
    }
  }

  class ProgressBar extends Lightning.Component {
    static _template() {
      return {
        h: 50,
        w: w => w,
        Progress: {
          color: 0xffffffff,
          rect: true,
          w: w => w - 200,
          h: 5,
          InnerProgress: {
            rect: true,
            color: 0xbb0078ac,
            // x: 8,
            w: 0,
            // y: (h) => (h - 16) / 2,
            h: 5
          }
        },
        Timer: {
          color: 0xffffffff,
          x: w => w - 180,
          w: 180,
          // rect: true,
          h: 50,
          Text: {
            x: 15,
            y: -10,
            text: {
              textColor: 0xffffffff,
              fontSize: 26
            }
          }
        }
      };
    }
    set progress(v) {
      this.tag("Progress.InnerProgress").setSmooth("w", (this.renderWidth - 16) * v);
    }
    set duration(v) {
      this._duration = v;
    }
    get duration() {
      return this._duration || 0.0001;
    }
    set currentTime(v) {
      const ratio = Math.round(v / this.duration * 1000) / 1000;
      this.tag("Progress.InnerProgress").setSmooth("w", (this.tag("Progress").renderWidth - 16) * ratio);
      this.tag("Timer.Text").text = [formatTime(v || 0), formatTime(this.duration || 0)].join(" / ");
    }
  }

  class MenuItem$2 extends Lightning.Component {
    static _template() {
      return {
        h: 100,
        alpha: 0.5
        // Label: {
        //   mountY: 0.5,
        //   y: 50,
        //   text: { fontFace: "Regular", fontSize: 64 },
        // },
      };
    }

    // set label(v) {
    //   this.tag("Label").text = v;
    // }

    // set pageId(v) {
    //   this._pageId = v;
    // }

    // get pageId() {
    //   return this._pageId;
    // }

    _focus() {
      this.alpha = 1;
    }
    _unfocus() {
      this.alpha = 0.5;
    }
  }

  const bgColor = 0xff212121;
  const buttons = [{
    icon: "play",
    action: "$playPause",
    ref: "PlayPause"
  }];
  const interfaceTimeout = 5000;
  class Simple extends Lightning.Component {
    static _template() {
      return {
        w: 1920,
        h: 1080,
        color: bgColor,
        rect: true,
        // Text: {
        //   x: (w) => w / 2,
        //   y: (h) => h / 2,
        //   mount: 0.5,
        //   // text: {
        //   //   text: "Simple example",
        //   //   textColor: 0xffffffff,
        //   // },
        // },
        // ErrorScreen: {
        //   type: ErrorScreen,
        //   alpha: 0,
        // },

        Ui: {
          x: 100,
          //y: 950,
          w: w => w - 250,
          //mountY: 1,
          Items: {
            // mountY: 0.5,
            y: -1000,
            flex: {
              direction: "row"
            },
            Back: {
              y: 200,
              type: MenuItem$2,
              w: 50,
              h: 50,
              src: Utils.asset("./icons/back.png")
            },
            Replay: {
              x: 100,
              y: 200,
              type: MenuItem$2,
              w: 55,
              h: 55,
              src: Utils.asset("./icons/replay.png")
            },
            Subtitles: {
              x: 1350,
              y: 180,
              type: MenuItem$2,
              w: 80,
              h: 80,
              src: Utils.asset("./icons/subtitle.png")
            },
            Settings: {
              x: 1450,
              y: 195,
              type: MenuItem$2,
              w: 50,
              h: 50,
              src: Utils.asset("./icons/settings.png")
            }
          },
          BackText: {
            x: 130,
            y: -730,
            visible: false,
            text: {
              fontSize: 20,
              lineHeight: 30,
              text: "Play From\nBeginning"
            }
          },
          SubtitleText: {
            x: 1425,
            y: -730,
            visible: false,
            text: {
              fontSize: 20,
              lineHeight: 30,
              text: "Subtitle & Audio"
            }
          },
          SettingsText: {
            x: 1625,
            y: -730,
            visible: false,
            text: {
              fontSize: 20,
              lineHeight: 30,
              text: "Settings"
            }
          },
          Text: {
            x: 550,
            y: -800,
            text: {
              textAlign: "center",
              verticalAlign: "top",
              lineHeight: 70
            }
          },
          Buttons: {
            //w: (w) => w - 250,
            y: 45
          },
          ProgressBar: {
            w: w => w - 250,
            x: 100,
            y: 70,
            type: ProgressBar
          }
        }
      };
    }
    _init() {
      this._index = 0;
      this._index1 = 0;
      this._videoIndex = 0;
      // Initially video control interface is visible
      this._interfaceVisible = true;
      // This variable will store timeout id for the interface hide functionality
      this._timeout = null;
      // Fill Ui.Buttons tag with buttons from the buttons array
      this.tag("Ui.Buttons").children = buttons.map((button, index) => ({
        type: Button$1,
        icon: button.icon,
        action: button.action,
        ref: button.ref || "Button" + index,
        flexItem: {
          marginRight: 20
        }
      }));
    }
    _handleEnter() {
      // Router.restoreFocus();
      if (this._index1 == 0) {
        Router.navigate("main");
      } else if (this._index1 == 2) {
        Router.focusWidget("SubtitleMenu");
      } else if (this._index1 == 3) {
        Router.focusWidget("SettingsMenu");
      } else if (this._index1 == 1) {
        VideoPlayer.seek(0);
      }
    }
    get activeItem() {
      return this.tag("Items").children[this._index1];
    }
    _handleUp() {
      this._setState("MyItems");
    }
    _handleDown() {
      this._index1 = 0;
      this._setState("MyProgress");
    }
    static _states() {
      return [class MyItems extends this {
        _getFocused() {
          return this.activeItem;
        }
        _handleLeft() {
          if (this._index1 > 0) {
            this._index1--;
          }
          if (this._index1 === 0) {
            this.tag("Ui.BackText").visible = false;
            this.tag("Ui.SubtitleText").visible = false;
            this.tag("Ui.SettingsText").visible = false;
          } else if (this._index1 == 1) {
            this.tag("Ui.BackText").visible = true;
            this.tag("Ui.SubtitleText").visible = false;
            this.tag("Ui.SettingsText").visible = false;
          } else if (this._index1 == 2) {
            this.tag("Ui.BackText").visible = false;
            this.tag("Ui.SubtitleText").visible = true;
            this.tag("Ui.SettingsText").visible = false;
          } else if (this._index1 == 3) {
            this.tag("Ui.BackText").visible = false;
            this.tag("Ui.SubtitleText").visible = false;
            this.tag("Ui.SettingsText").visible = true;
          }
        }
        _handleRight() {
          if (this._index1 < this.tag("Items").children.length - 1) {
            this._index1++;
          }
          if (this._index1 === 0) {
            this.tag("Ui.BackText").visible = false;
            this.tag("Ui.SubtitleText").visible = false;
            this.tag("Ui.SettingsText").visible = false;
          } else if (this._index1 == 1) {
            this.tag("Ui.BackText").visible = true;
            this.tag("Ui.SubtitleText").visible = false;
            this.tag("Ui.SettingsText").visible = false;
          } else if (this._index1 == 2) {
            this.tag("Ui.BackText").visible = false;
            this.tag("Ui.SubtitleText").visible = true;
            this.tag("Ui.SettingsText").visible = false;
          } else if (this._index1 == 3) {
            this.tag("Ui.BackText").visible = false;
            this.tag("Ui.SubtitleText").visible = false;
            this.tag("Ui.SettingsText").visible = true;
          }
        }
      }, class MyProgress extends this {
        _getFocused() {
          this.tag("Ui.BackText").visible = false;
          this.tag("Ui.SubtitleText").visible = false;
          this.tag("Ui.SettingsText").visible = false;
          return this.tag("Ui.Buttons").children[this._index];
        }
        _handleRight() {
          VideoPlayer.skip(5);
        }
        _handleLeft() {
          VideoPlayer.skip(-5);
        }
      }];
    }
    _handleRight() {
      VideoPlayer.skip(5);
    }
    _handleLeft() {
      VideoPlayer.skip(-5);
    }
    _toggleInterface(visible) {
      this.patch({
        Ui: {
          smooth: {
            y: [visible ? 910 : 960],
            alpha: [visible ? 1 : 0]
          }
        }
      });
      this.tag("Ui").transition("y").on("finish", () => {
        this._interfaceVisible = visible;
      });
      if (visible) {
        this._setInterfaceTimeout();
      }
      // Router.focusWidget("PlayerMenu");
    }

    _setInterfaceTimeout() {
      // Clear timeout if it already exists
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      this._timeout = setTimeout(() => {
        this._toggleInterface(false);
        Router.focusPage();
      }, interfaceTimeout);
    }
    _active() {
      //this.tag("text").text = MovieTitle;
      // this.patch({
      // 	Text: { text: { text: MovieTitle } },
      // });
      if (MovieTitle != undefined) {
        this.tag("Text").text.text = MovieTitle;
      }
      // Show video interface
      //Router.focusWidget("PlayerMenu");
      this._toggleInterface(true);

      // Set this object to receive VideoPlayer events
      VideoPlayer.consumer(this);
    }
    _inactive() {
      // this.patch({
      // 	Text: { text: { text: MovieTitle } },
      // });
      // Cleanup player and ui

      VideoPlayer.clear();
      this.patch({
        color: bgColor,
        Text: {
          alpha: 1
        },
        ErrorScreen: {
          alpha: 0
        }
      });
      this.playing = false;
      this.tag("Ui.ProgressBar").duration = 0;
      this.tag("Ui.ProgressBar").currentTime = 0;
    }
    _focus() {
      // Show video interface

      this._toggleInterface(true);
    }

    // Capture every key and toggle interface. If it is visible, pass event to event handlers
    _captureKey() {
      this._toggleInterface(true);
      return !this._interfaceVisible;
    }

    // _handleLeft() {
    //   this._index = Math.max(0, this._index - 1);
    // }

    // _handleRight() {
    //   this._index = Math.min(
    //     this.tag("Ui.Buttons").children.length - 1,
    //     this._index + 1
    //   );
    // }

    // _handleUp() {
    // 	Router.focusWidget("PlayerMenu");
    // }

    _getFocused() {
      return this.tag("Ui.Buttons").children[this._index];
    }
    set playing(v) {
      this.tag("Ui.Buttons.PlayPause").icon = v === true ? "pause" : "play";
    }

    // Button actions
    $playPause() {
      let next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      // If next is true, clear VideoPlayer (which also sets src to null)
      next === true && VideoPlayer.clear();
      if (!VideoPlayer.src || VideoPlayer.src === "error-video-url") {
        // Player first or second video of the videos list, with a chance of 33% to show error screen
        this._videoIndex = (this._videoIndex + 1) % 2;
        const nextVideo = Math.random() > 0.66 ? "error-video-url" : videos[this._videoIndex];
        VideoPlayer.open(nextVideo);
      } else {
        VideoPlayer.playPause();
      }
    }
    $stop() {
      VideoPlayer.clear();
    }

    // Hooks for VideoPlayer events
    $videoPlayerPlaying() {
      this.patch({
        smooth: {
          color: [0x00000000]
        },
        Text: {
          smooth: {
            alpha: [0]
          }
        },
        ErrorScreen: {
          smooth: {
            alpha: [0]
          }
        }
      });
      this.playing = true;
    }
    $videoPlayerPause() {
      this.playing = false;
    }
    $videoPlayerAbort() {
      this.patch({
        smooth: {
          color: [bgColor]
        },
        Text: {
          smooth: {
            alpha: [1]
          }
        }
      });
      this.playing = false;
      this.tag("Ui.ProgressBar").duration = 0;
      this.tag("Ui.ProgressBar").currentTime = 0;
    }
    $videoPlayerEnded() {
      // When current video ends, open next video
      this.$playPause(true);
    }
    $videoPlayerTimeUpdate() {
      this.tag("Ui.ProgressBar").currentTime = VideoPlayer.currentTime;
    }
    $videoPlayerLoadedMetadata() {
      this.tag("Ui.ProgressBar").duration = VideoPlayer.duration;
    }
    $videoPlayerError() {
      this.patch({
        ErrorScreen: {
          smooth: {
            alpha: [1]
          }
        }
        // Text: {
        //   smooth: {
        //     alpha: [0],
        //   },
        // },
      });
    }
  }

  class Sports extends Page {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        // rect: true,
        w: 1920,
        h: 1080,
        // color: 0xff0b63f6,
        Blur: {
          rtt: true,
          w: 1920,
          h: 1080,
          type: Lightning.components.FastBlurComponent,
          amount: 0,
          transitions: {
            amount: {
              duration: 0.3
            },
            scale: {
              duration: 0.3
            }
          }
        },
        Lists: {
          x: 100,
          y: 600,
          zIndex: 3
        },
        // IMG: {
        //   // color: 0xffc0392b,
        //   // mountX: 0.5,
        //   // mountY: 0.4,
        //   w: 1920,
        //   h: 670,
        //   src: Utils.asset("./images/content/home_img.png"),
        //   // Content: {
        //   //   x: 10,
        //   //   y: 90,
        //   //   w: 1600,
        //   //   h: 470,
        //   //   rect: true,
        //   // },
        // },
        Background: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          }
        },
        Text123: {
          x: 150,
          y: 600,
          text: {
            text: "Sports List",
            fontSize: 40
          }
        },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        Content: {
          // visible:false,
          List: {
            x: 100,
            y: 700,
            w: 1740,
            type: ui.List,
            direction: "row"
          }
        },
        // Profile: {
        // 	x: 1830,
        // 	y: 30,
        // 	w: 60,
        // 	h: 60,
        // 	src: Utils.asset("./images/profile.png"),
        // },

        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ui.List,
          spacing: 30,
          direction: "column"
        }
      };
    }
    _getFocused() {
      return this.tag("Menu");
    }
    _setup() {
      const items = [];
      for (let i = 0; i < 10; i++) {
        items.push({
          margin: 15,
          src: Utils.asset("images/sports/".concat(i, ".jpg")),
          type: ImageCell,
          number: i + 1
        });
      }
      this.tag("List").add(items);
    }
    _init() {
      this._index = 0;
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Mylist",
          lbl: "mylist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }];
      this._setState("Lists");
    }
    set main(v) {
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }

    // $changeContent({ lbl }) {
    //   // this.tag("IMG").patch({
    //   //   IMG: {
    //   //     w: 1920,
    //   //     h: 670,
    //   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
    //   //   },
    //   // });
    //   Router.navigate(`${lbl}`, false);
    // }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
        _handleDown() {
          this._setState("Lists");
        }
        _handleRight() {
          this._setState("List");
        }
      }, class Lists extends this {
        $exit() {
          this.tag("Lists");
        }
        _getFocused() {
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("List");
        }
        _handleLeft() {
          this._setState("Menu");
        }
      }, class List extends this {
        _getFocused() {
          return this.tag("List");
        }
        _handleLeft() {
          this._setState("Menu");
        }
        _handleEnter() {
          Router.navigate("main", false);
        }
        _handleDown() {
          this._setState("Lists");
        }
      }];
    }

    // _handleLeft() {
    //   Router.focusWidget("Menu");
    // }

    $firstItemCreated() {
      this._refocus();
    }
    _getFocused() {
      return this.tag("Lists").children[this._index];
    }
    static get header() {
      return "List displayed as Row";
    }
    static get icon() {
      return "images/list.png";
    }
    // _firstActive() {
    //     this.tag('Assets').items = [
    //         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
    //         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
    //         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
    //         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
    //         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
    //     ];
    // }
  }

  class Movies extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        // rect: true,
        w: 1920,
        h: 1080,
        // color: 0xff0b63f6,
        Blur: {
          rtt: true,
          w: 1920,
          h: 1080,
          type: Lightning.components.FastBlurComponent,
          amount: 0,
          transitions: {
            amount: {
              duration: 0.3
            },
            scale: {
              duration: 0.3
            }
          }
        },
        Lists: {
          x: 100,
          y: 600,
          zIndex: 3
        },
        // IMG: {
        //   // color: 0xffc0392b,
        //   // mountX: 0.5,
        //   // mountY: 0.4,
        //   w: 1920,
        //   h: 670,
        //   src: Utils.asset("./images/content/home_img.png"),
        //   // Content: {
        //   //   x: 10,
        //   //   y: 90,
        //   //   w: 1600,
        //   //   h: 470,
        //   //   rect: true,
        //   // },
        // },
        Background: {
          type: Background
        },
        // Text123:{
        // 	x:150,
        // 	y:100,
        // 	text:{text:"Watch In Your Language",fontSize:40}
        // },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        // Content: {
        // 	// visible:false,
        //     List: {x: 100, y: 200, w: 1740, type: List, direction: 'row'},
        // },
        // Profile: {
        // 	x: 1830,
        // 	y: 30,
        // 	w: 60,
        // 	h: 60,
        // 	src: Utils.asset("./images/profile.png"),
        // },

        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ui.List,
          spacing: 30,
          direction: "column"
        }
      };
    }
    _getFocused() {
      return this.tag("Menu");
    }

    // _setup() {
    //     const items = [];
    //     for(let i = 0; i < 4; i++) {
    //         items.push({margin: 15,src: Utils.asset(`images/${i}.jpg`), type: ImageCell, number: i + 1});
    //     }
    //     this.tag('List').add(items);
    // }

    _init() {
      this._index = 0;
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "movies",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "settings",
          displayColor: 0xffffffff
        }
      }];
      this._setState("Lists");
    }
    set main(v) {
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }

    // $changeContent({ lbl }) {
    //   // this.tag("IMG").patch({
    //   //   IMG: {
    //   //     w: 1920,
    //   //     h: 670,
    //   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
    //   //   },
    //   // });
    //   Router.navigate(`${lbl}`, false);
    // }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
        _handleDown() {
          this._setState("Lists");
        }
        _handleRight() {
          this._setState("List");
        }
      }, class Lists extends this {
        $exit() {
          this.tag("Lists");
        }
        _getFocused() {
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("Menu");
        }
        _handleLeft() {
          this._setState("Menu");
        }
      }

      // class List extends this {
      // 	_getFocused() {
      // 		return this.tag("List");
      // 	}
      // 	_handleLeft() {
      // 		this._setState("Menu");
      // 	}
      // 	_handleEnter() {
      // 		Router.navigate("tv",false);
      // 	}
      // 	_handleDown() {
      // 		this._setState("Lists");
      // 	}
      // },
      ];
    }

    // _handleLeft() {
    //   Router.focusWidget("Menu");
    // }

    $firstItemCreated() {
      this._refocus();
    }
    _getFocused() {
      return this.tag("Lists").children[this._index];
    }
    // static get header() {
    //     return 'List displayed as Row';
    // }

    // static get icon() {
    //     return 'images/list.png';
    // }
    // _firstActive() {
    //     this.tag('Assets').items = [
    //         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
    //         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
    //         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
    //         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
    //         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
    //     ];
    // }
  }

  var isTV = false;
  class Tv$1 extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        // rect: true,
        w: 1920,
        h: 1080,
        // color: 0xff0b63f6,
        Blur: {
          rtt: true,
          w: 1920,
          h: 1080,
          type: Lightning.components.FastBlurComponent,
          amount: 0,
          transitions: {
            amount: {
              duration: 0.3
            },
            scale: {
              duration: 0.3
            }
          }
        },
        Lists: {
          x: 100,
          y: 600,
          zIndex: 3
        },
        // IMG: {
        //   // color: 0xffc0392b,
        //   // mountX: 0.5,
        //   // mountY: 0.4,
        //   w: 1920,
        //   h: 670,
        //   src: Utils.asset("./images/content/home_img.png"),
        //   // Content: {
        //   //   x: 10,
        //   //   y: 90,
        //   //   w: 1600,
        //   //   h: 470,
        //   //   rect: true,
        //   // },
        // },
        Background: {
          type: Background
        },
        // Text123:{
        // 	x:150,
        // 	y:100,
        // 	text:{text:"Watch In Your Language",fontSize:40}
        // },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        // Content: {
        // 	// visible:false,
        //     List: {x: 100, y: 200, w: 1740, type: List, direction: 'row'},
        // },
        // Profile: {
        // 	x: 1830,
        // 	y: 30,
        // 	w: 60,
        // 	h: 60,
        // 	src: Utils.asset("./images/profile.png"),
        // },

        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ui.List,
          spacing: 30,
          direction: "column"
        }
      };
    }
    _getFocused() {
      return this.tag("Menu");
    }

    // _setup() {
    //     const items = [];
    //     for(let i = 0; i < 4; i++) {
    //         items.push({margin: 15,src: Utils.asset(`images/${i}.jpg`), type: ImageCell, number: i + 1});
    //     }
    //     this.tag('List').add(items);
    // }
    _active() {
      isTV = true;
    }
    _init() {
      this._index = 0;
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "movies",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "settings",
          displayColor: 0xffffffff
        }
      }];
      this._setState("Lists");
    }
    set main(v) {
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }

    // $changeContent({ lbl }) {
    //   // this.tag("IMG").patch({
    //   //   IMG: {
    //   //     w: 1920,
    //   //     h: 670,
    //   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
    //   //   },
    //   // });
    //   Router.navigate(`${lbl}`, false);
    // }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
        _handleDown() {
          this._setState("Lists");
        }
        _handleRight() {
          this._setState("List");
        }
      }, class Lists extends this {
        $exit() {
          this.tag("Lists");
        }
        _getFocused() {
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("Menu");
        }
        _handleLeft() {
          this._setState("Menu");
        }
      }

      // class List extends this {
      // 	_getFocused() {
      // 		return this.tag("List");
      // 	}
      // 	_handleLeft() {
      // 		this._setState("Menu");
      // 	}
      // 	_handleEnter() {
      // 		Router.navigate("tv",false);
      // 	}
      // 	_handleDown() {
      // 		this._setState("Lists");
      // 	}
      // },
      ];
    }

    // _handleLeft() {
    //   Router.focusWidget("Menu");
    // }

    $firstItemCreated() {
      this._refocus();
    }
    _getFocused() {
      return this.tag("Lists").children[this._index];
    }
    // static get header() {
    //     return 'List displayed as Row';
    // }

    // static get icon() {
    //     return 'images/list.png';
    // }
    // _firstActive() {
    //     this.tag('Assets').items = [
    //         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
    //         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
    //         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
    //         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
    //         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
    //     ];
    // }
  }

  class Premium extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        // Content: {
        //   y: 500,
        //   type: ListAsRowWithScroll,
        // },

        // rect: true,
        w: 1920,
        h: 1080,
        // color: 0xff0b63f6,
        Blur: {
          rtt: true,
          w: 1920,
          h: 1080,
          type: Lightning.components.FastBlurComponent,
          amount: 0,
          transitions: {
            amount: {
              duration: 0.3
            },
            scale: {
              duration: 0.3
            }
          }
        },
        Lists: {
          x: 175,
          y: 600,
          zIndex: 3
        },
        // IMG: {
        //   // color: 0xffc0392b,
        //   // mountX: 0.5,
        //   // mountY: 0.4,
        //   w: 1920,
        //   h: 670,
        //   src: Utils.asset("./images/content/home_img.png"),
        //   // Content: {
        //   //   x: 10,
        //   //   y: 90,
        //   //   w: 1600,
        //   //   h: 470,
        //   //   rect: true,
        //   // },
        // },
        Background: {
          type: Background
        },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        Profile: {
          x: 1830,
          y: 30,
          w: 60,
          h: 60,
          src: Utils.asset("./images/menu/profile.png")
        },
        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ListDIY$1,
          spacing: 30
        }
      };
    }

    // _getFocused() {
    // 	return this.tag("Menu");
    // }

    _init() {
      this._index = 0;
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "movies",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "settings",
          displayColor: 0xffffffff
        }
      }];
      this._setState("Lists");
    }
    set main(v) {
      console.log("V ---> ", v);
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }

    // $changeContent({ lbl }) {
    //   // this.tag("IMG").patch({
    //   //   IMG: {
    //   //     w: 1920,
    //   //     h: 670,
    //   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
    //   //   },
    //   // });
    //   Router.navigate(`${lbl}`, false);
    // }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
        _handleDown() {
          this._setState("Lists");
        }
      }, class Lists extends this {
        $exit() {
          this.tag("Lists");
        }
        _getFocused() {
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("Menu");
        }
      }];
    }

    // _handleLeft() {
    //   Router.focusWidget("Menu");
    // }

    $firstItemCreated() {
      this._refocus();
    }
    _getFocused() {
      return this.tag("Lists").children[this._index];
    }

    // _firstActive() {
    //     this.tag('Assets').items = [
    //         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
    //         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
    //         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
    //         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
    //         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
    //     ];
    // }
  }

  class WishList extends Lightning.Component {
    static _template() {
      return {
        Background: {
          type: Background
        },
        Lists: {
          x: 150,
          y: 80,
          zIndex: 3
        },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        // Profile: {
        // 	x: 1830,
        // 	y: 30,
        // 	w: 60,
        // 	h: 60,
        // 	src: Utils.asset("./images/menu/profile.png"),
        // },
        // Text: {
        // 	x: 200,
        // 	y: 500,

        // 	text: { text: "My List", fontSize: 40 },
        // },
        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ListDIY$1,
          spacing: 30
        }
      };
    }
    _init() {
      this._setState("Lists");
      this._index = 0;
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "movies",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "settings",
          displayColor: 0xffffffff
        }
      }];
    }
    set main(v) {
      this.tag("Lists").children = v;
      let y = 0;
      this.tag("Lists").children.forEach(child => {
        child.y = y;
        y += child.constructor.height;
      });
    }
    _focus() {
      this.patch({
        Lists: {
          smooth: {
            y: [560, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Lists: {
          smooth: {
            y: [600, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
    }

    // $changeContent({ lbl }) {
    //   // this.tag("IMG").patch({
    //   //   IMG: {
    //   //     w: 1920,
    //   //     h: 670,
    //   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
    //   //   },
    //   // });
    //   Router.navigate(`${lbl}`, false);
    // }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
        _handleDown() {
          this._setState("Lists");
        }
      }, class Lists extends this {
        $exit() {
          this.tag("Lists");
        }
        _getFocused() {
          return this.tag("Lists").children[this._index];
        }
        _handleUp() {
          this._setState("Menu");
        }
      }];
    }

    // _handleLeft() {
    //   Router.focusWidget("Menu");
    // }

    $firstItemCreated() {
      this._refocus();
    }
    _getFocused() {
      return this.tag("Lists").children[this._index];
    }

    // _firstActive() {
    //     this.tag('Assets').items = [
    //         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
    //         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
    //         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
    //         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
    //         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
    //     ];
    // }
  }

  class UserProfile extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Profile: {
          texture: Lightning.Tools.getRoundRect(205, 205, 25, 6, 0xff212121, false, 0xff212121)
        }
      };
    }
    _focus() {
      this.tag("Profile").patch({
        texture: Lightning.Tools.getRoundRect(205, 205, 25, 6, 0xffffffff, true, 0xff212121)
      });
    }
    _unfocus() {
      this.tag("Profile").patch({
        texture: Lightning.Tools.getRoundRect(205, 205, 25, 6, 0xff212121, true, 0xff212121)
      });
    }
  }

  class Button extends Lightning.Component {
    static _template() {
      return {
        flex: {},
        Background: {
          w: 300,
          h: 100,
          flex: {},
          rtt: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 14
          },
          rect: true,
          color: 0xff404249,
          transitions: {
            color: {
              duration: 0.6,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
            },
            scale: {
              duration: 0.6,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
            }
          },
          Label: {
            // flexItem: {
            // 	//marginLeft: 80,
            // 	marginRight: 80,
            // 	marginTop: 15,
            // 	marginBottom: 10,
            // },
            w: 300,
            text: {
              text: "Edit",
              fontFace: "SourceSansPro-Regular",
              fontSize: 32,
              textAlign: "center"
              // textColor: 0xff151515,
            },

            transitions: {
              color: {
                duration: 0.6,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
              },
              scale: {
                duration: 0.6,
                timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
              }
            }
          }
        }
      };
    }
    _focus() {
      this.patch({
        Background: {
          smooth: {
            color: 0xffffffff
          },
          Label: {
            smooth: {
              color: 0xff151515
            }
          }
        }
      });
    }
    _unfocus() {
      this.patch({
        Background: {
          smooth: {
            color: 0xff404249
          },
          Label: {
            smooth: {
              color: 0xffffffff
            }
          }
        }
      });
    }
    _init() {
      this.tag("Label").text.text = this.someData;
      if (this.myLabel == "settings") {
        this.tag("Background").w = this.width;
        this.tag("Background").h = this.height;
        // this.tag("Background").color = 0xffffffff;
        // this.tag("Label").text.textColor = 0xff151515;
        this.tag("Label").w = this.width;
        this.tag("Label").text.fontSize = 37;
        this.tag("Label").flexItem.marginTop = 20;
      } else {
        this.tag("Background").w = this.width;
        this.tag("Background").h = this.height;
        // this.tag("Background").color = 0xffffffff;
        // this.tag("Label").text.textColor = 0xff151515;
        this.tag("Label").w = this.width;
        this.tag("Label").text.fontSize = 35;
        this.tag("Label").flexItem.marginTop = 10;
      }
    }
  }

  let Pin$2, Path, Name$1;
  class Profile extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        w: 1920,
        h: 1080,
        Background1: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        Text: {
          y: 100,
          w: 1920,
          text: {
            text: "Who's Watching?",
            textAlign: "center"
          }
        },
        Text1: {
          w: 1920,
          h: 1080,
          y: 225,
          text: {
            text: "You can setup up to 5 Profiles for your family or friends.",
            textAlign: "center",
            textColor: Colors("#9ea19c").get(),
            fontSize: 25
          }
        },
        Profiles: {
          y: 100,
          Profile1: {
            y: 225,
            x: 600,
            Inner1: {
              x: 9,
              y: 9,
              w: 195,
              h: 195,
              visible: true,
              src: Utils.asset("profile/profile1.png"),
              Text: {
                visible: true,
                w: 195,
                y: 225,
                text: {
                  text: "ANAND",
                  textAlign: "center",
                  fontSize: 35
                }
              }
            },
            Inner2: {
              w: 75,
              h: 75,
              x: 60,
              y: 40,
              visible: false,
              src: Utils.asset("profile/plus.png"),
              Text: {
                x: -5,
                y: 100,
                text: {
                  text: "Add Profile",
                  fontSize: 18,
                  textAlign: "center",
                  textColor: Colors("#696963").get()
                }
              }
            },
            type: UserProfile
          },
          Profile2: {
            y: 225,
            x: 850,
            Inner1: {
              x: 9,
              y: 9,
              w: 195,
              h: 195,
              visible: false,
              src: Utils.asset("profile/profile.png"),
              Text: {
                visible: true,
                w: 195,
                y: 225,
                text: {
                  text: "",
                  textAlign: "center",
                  fontSize: 35
                }
              }
            },
            Inner2: {
              w: 75,
              h: 75,
              x: 65,
              y: 40,
              visible: true,
              src: Utils.asset("profile/plus.png"),
              Text: {
                x: -5,
                y: 100,
                text: {
                  text: "Add Profile",
                  fontSize: 18,
                  textAlign: "center",
                  textColor: Colors("#696963").get()
                }
              }
            },
            type: UserProfile
          },
          Profile3: {
            y: 225,
            x: 1100,
            Inner1: {
              x: 9,
              y: 9,
              w: 195,
              h: 195,
              visible: false,
              src: Utils.asset("profile/profile.png"),
              Text: {
                visible: true,
                w: 195,
                y: 225,
                text: {
                  text: "",
                  textAlign: "center",
                  fontSize: 35
                }
              }
            },
            Inner2: {
              w: 75,
              h: 75,
              x: 65,
              y: 40,
              visible: true,
              src: Utils.asset("profile/plus.png"),
              Text: {
                x: -5,
                y: 100,
                text: {
                  text: "Add Profile",
                  fontSize: 18,
                  textAlign: "center",
                  textColor: Colors("#696963").get()
                }
              }
            },
            type: UserProfile
          },
          Profile4: {
            y: 525,
            x: 725,
            Inner1: {
              x: 9,
              y: 9,
              w: 195,
              h: 195,
              visible: false,
              src: Utils.asset("profile/profile.png"),
              Text: {
                visible: true,
                w: 195,
                y: 225,
                text: {
                  text: "",
                  textAlign: "center",
                  fontSize: 35
                }
              }
            },
            Inner2: {
              w: 75,
              h: 75,
              x: 65,
              y: 40,
              visible: true,
              src: Utils.asset("profile/plus.png"),
              Text: {
                x: -5,
                y: 100,
                text: {
                  text: "Add Profile",
                  fontSize: 18,
                  textAlign: "center",
                  textColor: Colors("#696963").get()
                }
              }
            },
            type: UserProfile
          },
          Profile5: {
            y: 525,
            x: 975,
            Inner1: {
              x: 9,
              y: 9,
              w: 195,
              h: 195,
              visible: false,
              src: Utils.asset("profile/profile.png"),
              Text: {
                visible: true,
                w: 195,
                y: 225,
                text: {
                  text: "",
                  textAlign: "center",
                  fontSize: 35
                }
              }
            },
            Inner2: {
              w: 75,
              h: 75,
              x: 65,
              y: 40,
              visible: true,
              src: Utils.asset("profile/plus.png"),
              Text: {
                x: -5,
                y: 100,
                text: {
                  text: "Add Profile",
                  fontSize: 18,
                  textAlign: "center",
                  textColor: Colors("#696963").get()
                }
              }
            },
            type: UserProfile
          }
        },
        Buttons: {
          x: 800,
          y: 900,
          someData: "Edit",
          type: Button
        }
      };
    }
    set params(args) {
      if (args.path != undefined) {
        this.tag("Profiles").children[this.profileIndex].children[1].patch({
          src: Utils.asset(args.path)
        });
      }
      if (args.Pin != undefined) {
        Pin$2 = args.Pin;
        Name$1 = args.Name;
        Path = args.path;
      }
      if (args.Name != undefined) {
        if (args.Name.length > 0) {
          this.tag("Profiles").children[this.profileIndex].children[1].visible = true;
          this.tag("Profiles").children[this.profileIndex].children[2].visible = false;
          this.tag("Profiles").children[this.profileIndex].children[1].children[0].text.text = args.Name;
        }
      }
    }
    _init() {
      this.profileIndex = 0;
      this.buttonIndex = 0;
      this._setState("Profiles");
    }
    _handleDown() {
      this._setState("Buttons");
    }
    _handleUp() {
      this._setState("Profiles");
    }
    static _states() {
      return [class Profiles extends this {
        _handleLeft() {
          if (this.profileIndex > 0) {
            this.profileIndex--;
          }
        }
        _handleRight() {
          if (this.profileIndex < 4) {
            this.profileIndex++;
          }
        }
        _handleEnter() {
          if (this.tag("Profiles").children[this.profileIndex].children[1].visible == false) {
            Router.navigate("editprofile");
          } else if (Pin$2 != undefined) {
            Router.navigate("varifypin", {
              Name: Name$1,
              Path,
              Pin: Pin$2
            });
          } else {
            Router.navigate("main");
          }
        }
        _getFocused() {
          return this.tag("Profiles").children[this.profileIndex];
        }
      }, class Buttons extends this {
        _getFocused() {
          return this.tag("Buttons");
        }
        _handleEnter() {
          Router.navigate("editprofile", {
            PIndex: "profile/profile" + (this.profileIndex + 1) + ".png",
            Name: this.tag("Profiles").children[this.profileIndex].children[1].children[0].text.text
          });
        }
      }];
    }
  }

  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var message$1 = [];
  class KeyItem$3 extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 70,
        h: 60,
        color: 0xff474747,
        alpha: 1,
        Label: {
          x: 15,
          y: 8
        }
      };
    }
    _init() {
      this.patch({
        Label: {
          text: {
            text: this.item.label,
            fontSize: 28,
            textColor: 0xffffffff
          }
        }
      });
    }
    _focus() {
      this.color = 0xffffffff;
      this.tag("Label").color = 0xff474747;
    }
    _unfocus() {
      this.color = 0xff474747;
      this.tag("Label").color = 0xffffffff;
    }
    _getFocused() {
      return this.tag("Keys");
    }
    _handleEnter() {
      switch (this.item.label) {
        case "⌫":
          var edited = message$1.slice(0, -1);
          message$1 = edited;
          this.fireAncestors("$changeText", message$1.join().replace(/,/g, ""));
          break;
        case "Space":
          if (message$1.length <= 12) {
            message$1.push(" ");
          }
          break;
        default:
          message$1.push(this.item.label);
      }
      if (message$1.length <= 12) {
        this.fireAncestors("$changeText", message$1.join().replace(/,/g, ""));
      }
    }
  }

  class KeyList$3 extends Lightning.Component {
    set items(items) {
      let keyWidth = 60;
      this.children = items.map(item => {
        if (item.label === "Space" || item.label === "⌫") {
          keyWidth = 190;
        } else {
          keyWidth = 60;
        }
        return {
          type: KeyItem$3,
          action: item.label,
          x: item.x * 65,
          y: item.y * 65,
          w: keyWidth,
          item
        };
      });
    }
    _init() {
      this.index = 0;
    }
    _handleDown() {
      if (this.index <= 1) {
        this.index = 2;
      } else if (this.index >= 2 && this.index < 32) {
        this.index += 6;
      }
    }
    _handleUp() {
      if (this.index >= 8) {
        this.index -= 6;
      } else if (this.index <= 1) {
        this.index = 0;
      } else if (this.index < 8) {
        this.index = 1;
      }
    }
    _handleRight() {
      if (this.index < 38) {
        if (this.index == 1 || this.index == 7 || this.index == 13 || this.index == 19 || this.index == 25 || this.index == 31 || this.index == 37) {
          this.fireAncestors("$changeMessage", 0);
        } else {
          this.index++;
        }
        //console.log("Right", this.index);
      }
    }

    _handleLeft() {
      if (this.index > 0) {
        this.index--;
      } else {
        this.index = 0;
      }
    }
    _getFocused() {
      return this.children[this.index];
    }
  }

  class KidsProfile extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        KidsProfile: {
          texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, Colors("#696963").get(), true, Colors("#696963").get())
        }
      };
    }
    _focus() {
      this.tag("KidsProfile").patch({
        texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, 0xffffffff, true, Colors("#696963").get())
      });
    }
    _unfocus() {
      this.tag("KidsProfile").patch({
        texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, Colors("#696963").get(), true, Colors("#696963").get())
      });
    }
  }

  class ParentalProfile$1 extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        ParentalProfile: {
          texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, Colors("#696963").get(), true, Colors("#696963").get())
        }
      };
    }
    _focus() {
      this.tag("ParentalProfile").patch({
        texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, 0xffffffff, true, Colors("#696963").get())
      });
    }
    _unfocus() {
      this.tag("ParentalProfile").patch({
        texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, Colors("#696963").get(), true, Colors("#696963").get())
      });
    }
  }

  class ChangeProfile extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        ChangeProfile: {
          y: 160,
          x: 1020,
          w: 51,
          h: 51,
          smooth: {
            alpha: 0.7
          },
          src: Utils.asset("profile/pen.png")
        }
      };
    }
    _focus() {
      this.tag("ChangeProfile").patch({
        smooth: {
          alpha: 1,
          scale: 1.2
        }
      });
    }
    _unfocus() {
      this.tag("ChangeProfile").patch({
        smooth: {
          alpha: 0.7,
          scale: 1
        }
      });
    }
  }

  let path$1 = "profile/profile1.png";
  let Name = "";
  let SelectKids = false;
  let SelectAdults = true;
  let SeletParentalYes = false;
  let SeletParentalNo = true;
  let Pin$1;
  class EditProfile extends Lightning.Component {
    constructor() {
      super(...arguments);
      _defineProperty(this, "focusKeyboard", true);
    }
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        w: 1920,
        h: 1080,
        Background1: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        TextProfile: {
          w: 1920,
          h: 1080,
          y: 50,
          text: {
            text: "Add Profile",
            textAlign: "center",
            fontSize: 45
          }
        },
        ProfileImg: {
          y: 175,
          w: 200,
          h: 200,
          x: 850,
          src: Utils.asset(path$1)
        },
        EditProfile: {
          type: ChangeProfile
        },
        Text2: {
          w: 1920,
          h: 1080,
          y: 475,
          text: {
            text: "Enter name",
            fontSize: 25,
            textAlign: "center",
            textColor: Colors("#919499").get()
          }
        },
        InputField: {
          w: 450,
          h: 2,
          x: 725,
          y: 600,
          color: Colors("#919499").get(),
          rect: true
        },
        SearchText: {
          w: 1920,
          h: 1080,
          y: 550,
          text: {
            text: "",
            fontSize: 30,
            FontFace: "Bold",
            textColor: 0xffffffff,
            textAlign: "center"
          }
        },
        AdultsText: {
          x: 775,
          y: 675,
          Adults: true,
          text: {
            text: "Adults",
            fontSize: 40,
            textColor: Colors("white").get()
          }
          // text1: { text: "Kids", fontSize: 40 },
        },

        KidsText: {
          x: 1025,
          y: 675,
          text: {
            text: "Kids",
            fontSize: 40,
            textColor: Colors("#696963").get()
          }
          // text1: { text: "Kids", fontSize: 40 },
        },

        SelectRoundRectKids: {
          x: 915,
          y: 685,
          type: KidsProfile
        },
        SelectAdultKids: {
          x: 915,
          y: 685,
          w: 40,
          h: 40,
          src: Utils.asset("profile/dot.png")
        },
        ParentalControl: {
          w: 1870,
          h: 1080,
          y: 775,
          text: {
            text: "Enable Parental Control?",
            textAlign: "center",
            fontSize: 30,
            textColor: Colors("#696963").get()
          }
        },
        NoPerentalText: {
          x: 800,
          y: 850,
          text: {
            text: "No",
            fontSize: 35,
            textColor: Colors("white").get()
          }
          // text1: { text: "Kids", fontSize: 40 },
        },

        YesPerentalText: {
          x: 1000,
          y: 850,
          text: {
            text: "Yes",
            fontSize: 35,
            textColor: Colors("#696963").get()
          }
        },
        SelectRoundRectPerental: {
          x: 880,
          y: 860,
          type: ParentalProfile$1
        },
        SelectAdultKidsPerental: {
          x: 880,
          y: 860,
          w: 40,
          h: 40,
          src: Utils.asset("profile/dot.png")
        },
        AddButton: {
          visible: true,
          x: 775,
          y: 950,
          someData: "Add",
          type: Button
        },
        NextButton: {
          visible: false,
          x: 775,
          y: 950,
          someData: "Next",
          type: Button
        },
        Keyboard: {
          rect: true,
          x: 200,
          y: 142,
          w: 625,
          h: 320,
          color: 0x00d2d2d2,
          Keys: {
            type: KeyList$3,
            y: 20,
            x: 20,
            mount: 0.5
          }
        }
      };
    }
    set params(args) {
      if (args.flag != undefined) {
        args.flag;
        this._setState("AddButton");
      }
      if (args.path != undefined) {
        path$1 = args.path;
        this.tag("ProfileImg").patch({
          src: Utils.asset(path$1)
        });
      } else {
        this.tag("ProfileImg").patch({
          src: Utils.asset(args.PIndex)
        });
        this.tag("SearchText").patch({
          text: {
            text: args.Name
          }
        });
        Name = args.Name;
      }
      if (args.PIN != undefined) {
        Pin$1 = args.PIN;
        Name = args.myname;
        path$1 = args.Path;
        this.tag("ProfileImg").patch({
          src: Utils.asset(args.mypath)
        });
        this.tag("SearchText").patch({
          text: {
            text: args.myname
          }
        });
      }
    }
    _init() {
      this.tag("ProfileImg").patch({
        src: Utils.asset(path$1)
      });
      this.tag("Keys").items = [{
        label: "Space",
        x: 0,
        y: 0
      }, {
        label: "⌫",
        x: 3,
        y: 0
      }, {
        label: "A",
        x: 0,
        y: 1
      }, {
        label: "B",
        x: 1,
        y: 1
      }, {
        label: "C",
        x: 2,
        y: 1
      }, {
        label: "D",
        x: 3,
        y: 1
      }, {
        label: "E",
        x: 4,
        y: 1
      }, {
        label: "F",
        x: 5,
        y: 1
      }, {
        label: "G",
        x: 0,
        y: 2
      }, {
        label: "H",
        x: 1,
        y: 2
      }, {
        label: "I",
        x: 2,
        y: 2
      }, {
        label: "J",
        x: 3,
        y: 2
      }, {
        label: "K",
        x: 4,
        y: 2
      }, {
        label: "L",
        x: 5,
        y: 2
      }, {
        label: "M",
        x: 0,
        y: 3
      }, {
        label: "N",
        x: 1,
        y: 3
      }, {
        label: "O",
        x: 2,
        y: 3
      }, {
        label: "P",
        x: 3,
        y: 3
      }, {
        label: "Q",
        x: 4,
        y: 3
      }, {
        label: "R",
        x: 5,
        y: 3
      }, {
        label: "S",
        x: 0,
        y: 4
      }, {
        label: "T",
        x: 1,
        y: 4
      }, {
        label: "U",
        x: 2,
        y: 4
      }, {
        label: "V",
        x: 3,
        y: 4
      }, {
        label: "W",
        x: 4,
        y: 4
      }, {
        label: "X",
        x: 5,
        y: 4
      }, {
        label: "Y",
        x: 0,
        y: 5
      }, {
        label: "Z",
        x: 1,
        y: 5
      }, {
        label: "0",
        x: 2,
        y: 5
      }, {
        label: "1",
        x: 3,
        y: 5
      }, {
        label: "2",
        x: 4,
        y: 5
      }, {
        label: "3",
        x: 5,
        y: 5
      }, {
        label: "4",
        x: 0,
        y: 6
      }, {
        label: "5",
        x: 1,
        y: 6
      }, {
        label: "6",
        x: 2,
        y: 6
      }, {
        label: "7",
        x: 3,
        y: 6
      }, {
        label: "8",
        x: 4,
        y: 6
      }, {
        label: "9",
        x: 5,
        y: 6
      }];
      this._setState("Keyboard");
    }
    $changeMessage(signal) {
      switch (signal) {
        case 0:
          this._setState("EditProfile");
          break;
        case 1:
          this.focusKeyboard = true;
          break;
        default:
          this.focusKeyboard = true;
      }
    }
    $changeText(message) {
      Name = message;
      this.searchText = message;
      this.tag("SearchText").patch({
        text: {
          text: message
        }
      });
    }
    static _states() {
      return [class Keyboard extends this {
        _getFocused() {
          if (this.focusKeyboard) {
            return this.tag("Keys");
          }
        }
      }, class EditProfile extends this {
        _getFocused() {
          return this.tag("EditProfile");
        }
        _handleDown() {
          this._setState("AdultKids");
        }
        _handleLeft() {
          this._setState("Keyboard");
        }
        _handleEnter() {
          Router.navigate("changeavatar", false);
        }
      }, class AdultKids extends this {
        _getFocused() {
          return this.tag("SelectRoundRectKids");
        }
        _handleUp() {
          this._setState("EditProfile");
        }
        _handleDown() {
          this._setState("ParentalControl");
        }
        _handleEnter() {
          if (SelectKids == false) {
            this.tag("SelectAdultKids").setSmooth("x", 960);
            this.tag("AdultsText").text.textColor = Colors("#696963").get();
            this.tag("KidsText").text.textColor = Colors("white").get();
            SelectKids = true;
            SelectAdults = false;
          } else if (SelectAdults == false) {
            this.tag("SelectAdultKids").setSmooth("x", 915);
            this.tag("AdultsText").text.textColor = Colors("white").get();
            this.tag("KidsText").text.textColor = Colors("#696963").get();
            SelectKids = false;
            SelectAdults = true;
          }
        }
      }, class ParentalControl extends this {
        _getFocused() {
          return this.tag("SelectRoundRectPerental");
        }
        _handleUp() {
          this._setState("AdultKids");
        }
        _handleDown() {
          if (SeletParentalNo == false) {
            this._setState("NextButton");
          } else {
            this._setState("AddButton");
          }
        }
        _handleEnter() {
          if (SeletParentalYes == false) {
            this.tag("SelectAdultKidsPerental").setSmooth("x", 930);
            this.tag("NoPerentalText").text.textColor = Colors("#696963").get();
            this.tag("YesPerentalText").text.textColor = Colors("white").get();
            SeletParentalYes = true;
            SeletParentalNo = false;
            this.tag("AddButton").visible = false;
            this.tag("NextButton").visible = true;
          } else if (SeletParentalNo == false) {
            this.tag("SelectAdultKidsPerental").setSmooth("x", 880);
            this.tag("NoPerentalText").text.textColor = Colors("white").get();
            this.tag("YesPerentalText").text.textColor = Colors("#696963").get();
            SeletParentalYes = false;
            SeletParentalNo = true;
            this.tag("AddButton").visible = true;
            this.tag("NextButton").visible = false;
          }
        }
      }, class AddButton extends this {
        _getFocused() {
          this.tag("AddButton").visible = true;
          this.tag("NextButton").visible = false;
          return this.tag("AddButton");
        }
        _handleUp() {
          this.tag("InputField").color = Colors("#919499").get();
          this._setState("ParentalControl");
        }
        _handleEnter() {
          if (Name.length == 0) {
            this.tag("InputField").color = Colors("red").get();
          } else {
            console.log("PIN = ", Pin$1);
            Router.navigate("profile", {
              Name,
              path: path$1,
              Pin: Pin$1
            });
          }
        }
      }, class NextButton extends this {
        _getFocused() {
          this.tag("AddButton").visible = false;
          this.tag("NextButton").visible = true;
          return this.tag("NextButton");
        }
        _handleUp() {
          this.tag("InputField").color = Colors("#919499").get();
          this._setState("ParentalControl");
        }
        _handleEnter() {
          if (Name.length == 0) {
            this.tag("InputField").color = Colors("red").get();
          } else {
            console.log("Name = ", Name.length);
            Router.navigate("parentalControl", {
              Name,
              path: path$1
            });
          }
        }
      }];
    }
  }

  class MenuItem$1 extends Lightning.Component {
    static _template() {
      return {
        w: 70,
        h: 70,
        //rect: true,
        //color: 0xff090909,
        flexItem: {
          marginBottom: 30
        },
        Icon: {
          x: 15,
          y: 15
        }
      };
    }
    set item(obj) {
      this._item = obj;
    }
    set label(str) {
      this._item.label = str;
      this._update();
    }
    set displayColor(argb) {
      this._item.displayColor = argb;
      this._update();
    }
    _update() {
      if (this.active && this._item) {
        const {
          path = "Void",
          displayColor = 0xff212121
        } = this._item;
        const color = this.hasFocus() ? 0xffffffff : displayColor;
        this.patch({
          // color: this.hasFocus() ? displayColor : 0xff212121,
          Icon: {
            color,
            src: Utils.asset("images/menu/".concat(path.toLowerCase(), ".png"))
          }
        });
      }
    }
    _firstActive() {
      this._update();
    }
    _focus() {
      this.patch({
        smooth: {
          color: this._item.displayColor
        },
        Icon: {
          smooth: {
            color: 0xffffff21
          }
        },
        Label: {
          smooth: {
            color: 0xff212121
          }
        }
      });
    }
    _unfocus() {
      const color = this._item.displayColor;
      this.patch({
        smooth: {
          color: 0xffffffff
        },
        Icon: {
          smooth: {
            color
          }
        },
        Label: {
          smooth: {
            color
          }
        }
      });
    }
    _handleEnter() {
      const {
        lbl
      } = this._item;
      Router.navigate("".concat(lbl), false);
    }
  }
  class MenuItemDIY extends MenuItem$1 {
    static get width() {
      return 70;
    }
    static get height() {
      return 70;
    }
  }

  class List$1 extends Lightning.Component {
    static _template() {
      return {
        // Blur: {
        //   rtt: true,
        //   w: 1920,
        //   h: 1080,
        //   type: Lightning.components.FastBlurComponent,
        //   amount: 0,
        //   transitions: {
        //     amount: { duration: 0.3 },
        //     scale: { duration: 0.3 },
        //   },
        // },
        Items: {
          flex: {
            direction: "row",
            wrap: true
          }
        }
      };
    }

    // _init() {
    //   this.application.on("blurContent", ({ amount, scale }) => {
    //     this.tag("Blur").setSmooth("amount", amount);
    //     this.tag("Blur").setSmooth("scale", scale, {
    //       duration: 0.3,
    //       timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)",
    //     });
    //   });
    // }

    _construct() {
      this._index = 5;
      this._items = [];
      this._orientation = "vertical";
    }
    set orientation(str) {
      const flex = {
        direction: "column"
      };
      if (str === "vertical") {
        flex.direction = "row";
      } else {
        str = "horizontal";
      }
      this.patch({
        Items: {
          flex
        }
      });
      this._orientation = str;
    }
    set items(arr) {
      this._items = arr;
      if (this.active) {
        this._setup();
      }
    }
    get items() {
      return this.tag("Items").children;
    }
    get currentItem() {
      return this.items[this._index];
    }
    _handleUp() {
      return this.setIndex(this._index - 1, "vertical");
    }
    _handleDown() {
      return this.setIndex(this._index + 1, "vertical");
    }

    // _handleRight() {
    //   return this.setIndex(this._index + 1, "horizontal");
    // }

    setIndex(targetIdx) {
      let orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._orientation;
      if (orientation === this._orientation && targetIdx > -1 && targetIdx < this.items.length) {
        this._index = targetIdx;
        return true;
      }
      return false;
    }
    _update() {
      this._setState("");
      if (this.active && this._items.length > 0) {
        this.tag("Items").children = this._items;
        this._setState("Filled");
      } else {
        this.tag("Items").childList.clear();
      }
    }
    _firstActive() {
      this._update();
    }
    static _states() {
      return [class Filled extends this {
        _getFocused() {
          return this.currentItem;
        }
      }];
    }
  }
  class ListDIY extends List$1 {
    static _template() {
      return {
        Items: {}
      };
    }
    set orientation(str) {
      this._orientation = str;
    }
    set spacing(num) {
      this._spacing = num;
    }
    get spacing() {
      return this._spacing || 10;
    }
    _update() {
      this._setState("");
      if (this.active && this._items.length > 0) {
        const isHorizontal = this._orientation === "horizontal";
        const surface = isHorizontal ? "x" : "y";
        const dimension = isHorizontal ? "width" : "height";
        let acc = 0;
        this.tag("Items").children = this._items.map(item => {
          const targetPos = acc;
          acc += item.type[dimension] + this.spacing;
          return {
            ...item,
            [surface]: targetPos
          };
        });
        this._setState("Filled");
      } else {
        this.tag("Items").childList.clear();
      }
    }
  }

  const privacy = ["PRIVACY POLICY", "\xA9 2021 tmdb Pictures Networks India Private Limited. All rights reserved.", "1. Application", "This Privacy Policy is applicable to personally identifiable information collected, processed, stored and used in connection with http://www.tmdbliv.com or via an dedicated application of the said URL accessible on Users\u2019 mobile phones / tablets / other devices connected to the internet (\"Site\") operated by tmdb Pictures Networks India Private Limited (\"SPN\"/ \"we\"/ \"us\"/ \"our\") having its office at Interface Building 7, 4th Floor, Off Malad Link Road, Malad (West), Mumbai \u2013 400064, India. This policy is in addition to the Privacy Policy incorporated otherwise on the URL.", "2. Services", "To facilitate your viewership and access of the content on the Site, the content may have been packaged by SPN differently, wherein the Content or Services may be accessible free of charge which may include advertisements or commercials or via a subscription model or a pay-per-view model with or without advertisements / commercials or with a combination of the foregoing.", "3. Types of Information collected", "3.1 Information You Provide", "In order to use the Site and the services offered, Users (\"User\" / \"You\") must create an account with SPN (\"SPN Account\"). Creating the SPN Account may require the User to provide inter alia the following personal information associated with the User, including but not limited to his / her name; gender; residential address, including city / state / province (if applicable), postal code, country, and region; phone and mobile number, e-mail address; preferred language; and login name and password (\"Personal Information\").", "3.2 Automatic Information Collection", "3.2.1 SPN may use a variety of technologies that automatically or passively collect information about how the Site is accessed and used (\"Usage Information\"). Usage Information may consist inter alia of the following data about your visit to the Site: content viewed, date and time of view, content listed on watch-later-list; followed content; favoured content; access type depending on the model of services described hereinabove, number of website hits, type of computer operating system including the type of internet browser and internet service provider. Usage Information is generally non-identifying in nature, but SPN may associate the same with other information collected and hence treats it as Personal Information.\n    3.2.2 SPN also may automatically collect your IP address or other unique identifier for the computer, mobile device, technology or other device (collectively, \"Device\") which you use to access the Site. A unique identifier is a number that is automatically assigned to your Device when you access a web site or its servers, and our computers identify your Device by this number (\"Device Identifier\"). Some mobile service providers may also provide us with the physical location of the Device used to access the Site.", "3.3 Cookies and Web Beacons", "\n\t\n\t3.3.1 By using the Site, you consent to our cookies, which are basically files that web servers place on your Device. The use of cookies on the Site allows you to enjoy more seamless visits to the Site and more accurately measures your behavior on it. There are two types of cookies that we may use: session and persistent. Session cookies exist only during an online session and are removed from your Device when you close the browser software. Persistent cookies remain on your Device after the browser has been closed. While the cookies used on the Site do not identify you personally, they recognize your browser, unless you choose to identify yourself voluntarily. You may choose to identify yourself for any one of the following reasons: by asking the browser to remember your username and password, or by requesting more information on any content or service available on the Site. You may prevent the installation of cookies through your browser settings; in which case not all functionalities of the Site may be available to you depending on the browser settings. You may also configure your browser to accept all cookies, reject all cookies, or notify you when a cookie is set. SPN requests you to check your browser and/or contact the administrators to learn how to change your cookie preferences.", "\n\t\n\t3.3.2 SPN may also use Web Beacons in combination with cookies to understand how you interact with Site. Web Beacons are typically transparent graphic images that are placed on the Site or in an email and allows the Site to measure your actions in opening the page that contains the Web Beacon.", "\n\t\n\t3.3.3 SPN may also use other asynchronous methods and / or technology in combination with / without other tracking technologies to understand a User\u2019s interaction with Site and content residing therein. ", "\n\t\n\t3.3.4 This Site may also use a web analytics service provider who may use an Analytics Tool. Analytics Tools use cookies, text files, SDKs, APIs that are stored on your Device and allow an analysis of your use of the Site. The information generated by the cookie about your use of the Site, including the IP address, may be transferred to and stored on a server of analytics service provider, ", "which may not be located within India and who may use such information, to analyze your use of the Site, to create reports about the web site activities and to provide further services associated with the use of the Site. Furthermore, it may transfer such information to third parties, to the extent legally required or if such third parties process the data on behalf of the service provider. By using the Site, you consent to such transfer of Personal Information including storage on servers not located within India.", "4. Purpose of collection and usage of personal information", "\n\t\n\t4.1 SPN may use the Personal Information collected for the following purposes, amongst others: ", "\n\t\n\t(1) process your registration;", "\n\t\n\t(2) enable you to visit the Site and enjoy more seamless visits to the Site;", "\n\t(3) enable you to use and receive the services offered on the Site, including e-mail communications informing you about the services and content provided by SPN through the Site; ", "\n\t\n\t(4) contact you with regard to your SPN Account and in connection with any services or content subscribed through the Site;", "\n\t\n\t(5) tailor content and offers to you according to your preferences relating to business interests;", "\n\t\n\t(6) improve and enhance the Site according to your preferences relating to business interests and relating to website usage; and ", "\n\t\n\t(7) other purposes specifically disclosed to you prior to the collection of your Personal Information or otherwise with your consent. Subject to your consent, we may provide you with marketing materials about other services and content offered by SPN on the Site and may share your Personal Information with our affiliated companies only for marketing purposes.", "\n\n\t4.2 In particular, SPN may use tracking methods, mentioned hereinabove, for a number of purposes, including but not limited to:", "\n\t\n\t4.2.1 provide general internal and customer analytics;", "\n\t\n\t4.2.2 study traffic patterns in order to improve website performance, to customize the user experience, and to better match the users' interests and preferences;", "\n\t\n\t4.2.3 keep track of preferences you specify while you are using SPN\u2019s content or services;", "\n\t\n\t4.2.4 recommendations of content to the user, based on usage;", "\n\t\n\t4.2.5 support security measures, such as requiring re-login into the Site after a certain amount of time has elapsed;", "\n\t\n\t4.2.6 when you login to the Site, cookies can also be used to save the username so that we can process the saved login information and quickly log you into the Site;", "\n\t\n\t4.2.7 assist in identifying possible fraudulent activities;", "\n\t\n\t4.2.8 ensure if an email has been opened and acted upon."];
  class PrivacyPolicy extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Background: {
          x: 560,
          w: 1300,
          h: 1100,
          rect: false,
          color: 0xff404249
        },
        PrivacyPolicy: {
          y: 35,
          x: 560,
          PolicyTitle: {
            w: 1250,
            text: {
              text: privacy[0],
              textAlign: "center",
              fontStyle: "bold",
              fontSize: 40
            }
          },
          text: {
            text: "\n\n\n" + privacy[1] + "\n\n" + privacy[2] + "\n\n" + privacy[3] + "\n\n" + privacy[4] + "\n\n" + privacy[5] + "\n\n" + privacy[6] + "\n\n    " + privacy[7] + "\n\n" + privacy[8] + "\n\n" + privacy[9] + "\n\n" + privacy[10] + "\n\n" + privacy[11] + +"\n\n\n" + privacy[12] + privacy[13] + privacy[14] + privacy[15] + privacy[16] + privacy[17] + privacy[18] + privacy[19] + privacy[20] + privacy[21] + privacy[22] + privacy[23] + privacy[24] + privacy[25] + privacy[26] + privacy[27] + privacy[28] + privacy[29] + privacy[30] + privacy[31] + privacy[32] + privacy[33] + privacy[34],
            wordWrapWidth: 1250,
            fontSize: 32
          }
        }
      };
    }
    _focus() {
      this.tag("Background").rect = true;
      this.tag("Background").patch({
        smooth: {
          scale: 1.1
        }
      });
    }
    _unfocus() {
      this.tag("Background").rect = false;
      this.tag("Background").patch({
        smooth: {
          scale: 1
        }
      });
    }
    _handleDown() {
      console.log(this.tag("PrivacyPolicy").y);
      if (this.tag("PrivacyPolicy").y > -3535) {
        this.tag("PrivacyPolicy").y -= 35;
      }
    }
    _handleUp() {
      if (this.tag("PrivacyPolicy").y < 35) {
        this.tag("PrivacyPolicy").y += 35;
      }
    }
  }

  const Terms = ["TERMS OF USE", "\n\n\xA9 2021 tmdb Pictures Networks India Private Limited. All rights reserved.", "\n\n\ntmdbLiv Offers", "\n\nMyntra Offer:", "\n\nFlat 10% up to Rs.999/- off on min spend of Rs. 999/- on select styles on Myntra on purchasing tmdbLIV Annual subscription.", "\n\n\nTerms and Conditions:", "\n\n1.  Get Flat 10% up to Rs.999/- off on min spend of Rs 999- on the Myntra app or website on purchasing tmdbLIV annual subscription", "\n\n2.  The Offer is valid from 31st May 2021 to 31st Dec 2021", "\n\n1.  On viewing the Offer as promoted by Mytra, any customer wanting to avail the Offer is required to visit the tmdbLIV app", "\n\n2.  Customer should then subscribe to the tmdbLIV annual package and maky payments towards the same ", "\n\n3.  While subscribing to tmdbLIV annual subscription the customer is required to enter the code \"MYNTRA\", which will  enable the customer to receive a Myntra digital coupon code (\"Code\")", "\n\n4.  The customer can then redeem the Code on minimum spend of Rs. 999/- on selected style on Myntra", "\n\nOther Terms", "\n\n1.\tThe Code can be used once per customer and multiple codes cannot be clubbed in a single order", "\n\n2.\tThis Offer is not valid at any of the alliance partner retail outlets/stores", "\n\n3.\tThe balance amount, after the discount is availed, will have to be paid by the customer at the time of purchase on Myntra", "\n\n4.\tIn no case, whatsoever, can the Code amount be refunded, encashed or partly encashed", "\n\n5.\tMyntra's Return and Exchange Policy offers you the option to return or exchange items purchased on Myntra's application within 30 days of the receipt. In case of return of the purchased item, please refer to the \"Return Policy\" on the website/ app or call Myntra Customer care", "\n\n6.\tAll orders would be subject to availability at the time of purchase and will be governed by the standard terms and conditions listed on the Myntra App", "\n\n7.\tAll disputes arising out of or in connection to this Offer are subject to exclusive jurisdiction of the courts in Bangalore only", "\n\n8.\tDisclaimers: tmdb Pictures Networks India Pvt. Ltd. (\"SPNI\") is not responsible for any dispute and/or claims by any customer in relation to this Offer", "\n\n9.\tMyntra and/or SPNI is not responsible for any typographical error leading to the code being invalid", "\n\n10.\tPlease contact Myntra's customer care - 08061561999 for any queries in relation to this Offer"];
  class TermsOfUse extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Background: {
          x: 560,
          w: 1300,
          h: 1100,
          rect: false,
          color: 0xff404249
        },
        TermsOfUSe: {
          y: 35,
          x: 560,
          TermsTitle: {
            w: 1250,
            text: {
              text: Terms[0],
              textAlign: "center",
              fontStyle: "bold",
              fontSize: 40
            }
          },
          text: {
            text: Terms[1] + Terms[2] + Terms[3] + Terms[4] + Terms[5] + Terms[6] + Terms[7] + Terms[8] + Terms[9] + Terms[10] + Terms[11] + Terms[12] + Terms[13] + Terms[14] + Terms[15] + Terms[16] + Terms[17] + Terms[18] + Terms[19] + Terms[20] + Terms[21] + Terms[22],
            wordWrapWidth: 1250,
            fontSize: 32
          }
        }
      };
    }
    _focus() {
      this.tag("Background").rect = true;
      this.tag("Background").patch({
        smooth: {
          scale: 1.1
        }
      });
    }
    _unfocus() {
      this.tag("Background").rect = false;
      this.tag("Background").patch({
        smooth: {
          scale: 1
        }
      });
    }
    _handleDown() {
      console.log(this.tag("TermsOfUSe").y);
      if (this.tag("TermsOfUSe").y > -1050) {
        this.tag("TermsOfUSe").y -= 35;
      }
    }
    _handleUp() {
      if (this.tag("TermsOfUSe").y < 35) {
        this.tag("TermsOfUSe").y += 35;
      }
    }
  }

  class Settings$1 extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        PrivacyButton: {
          x: 120,
          y: 150,
          someData: "Privacy Policy",
          height: 100,
          width: 350,
          txtColor: 0xff151515,
          myLabel: "settings",
          type: Button
        },
        TermsButton: {
          x: 120,
          y: 300,
          someData: "Terms and Conditions",
          height: 100,
          width: 350,
          txtColor: 0xff151515,
          myLabel: "terms",
          type: Button
        },
        PrivacyPolicy: {
          visible: true,
          type: PrivacyPolicy
        },
        TermsOfUse: {
          visible: false,
          type: TermsOfUse
        },
        Menu: {
          x: 20,
          y: 80,
          type: ListDIY,
          spacing: 30
        }
      };
    }
    _init() {
      this._setState("privacy");
      this.tag("Menu").items = [{
        type: MenuItemDIY,
        item: {
          path: "Home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "Movies",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "Search",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "Premium",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY,
        item: {
          path: "Settings",
          lbl: "main",
          displayColor: 0xffffffff
        }
      }];
    }
    static _states() {
      return [class Menu extends this {
        _getFocused() {
          return this.tag("Menu");
        }
        _handleRight() {
          this._setState("privacy");
        }
      }, class privacy extends this {
        _getFocused() {
          this.tag("PrivacyPolicy").visible = true;
          this.tag("TermsOfUse").visible = false;
          return this.tag("PrivacyButton");
        }
        _handleRight() {
          this._setState("PrivacyPolicy");
        }
        _handleDown() {
          this._setState("TermsButton");
        }
        _handleLeft() {
          this._setState("Menu");
        }
      }, class TermsButton extends this {
        _getFocused() {
          this.tag("PrivacyPolicy").visible = false;
          this.tag("TermsOfUse").visible = true;
          return this.tag("TermsButton");
        }
        _handleRight() {
          this._setState("TermsOfUse");
        }
        _handleUp() {
          this._setState("privacy");
        }
        _handleLeft() {
          this._setState("Menu");
        }
      }, class PrivacyPolicy extends this {
        _getFocused() {
          return this.tag("PrivacyPolicy");
        }
        _handleLeft() {
          this._setState("privacy");
        }
      }, class TermsOfUse extends this {
        _getFocused() {
          return this.tag("TermsOfUse");
        }
        _handleLeft() {
          this._setState("TermsButton");
        }
      }];
    }
  }

  class SelectAvatar extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        smooth: {
          alpha: 0.5
        }
      };
    }
    _focus() {
      this.patch({
        smooth: {
          alpha: 1,
          scale: 1.2
        }
      });
    }
    _unfocus() {
      this.patch({
        smooth: {
          alpha: 0.5,
          scale: 1
        }
      });
    }
  }

  let path = "profile/profile1.png";
  class ChangeAvatar extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Choose: {
          w: 1920,
          y: 100,
          text: {
            text: "Choose Your Avatar",
            textAlign: "center",
            fontSize: 40,
            fontStyle: "bold"
          }
        },
        Background1: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        ChangeAvatar: {
          x: 250,
          Profile1: {
            x: 200,
            y: 250,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile1.png")
          },
          Profile2: {
            x: 400,
            y: 250,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile2.png")
          },
          Profile3: {
            x: 600,
            y: 250,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile3.png")
          },
          Profile4: {
            x: 800,
            y: 250,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile4.png")
          },
          Profile5: {
            x: 1000,
            y: 250,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile5.png")
          },
          Profile6: {
            x: 200,
            y: 450,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile6.png")
          },
          Profile7: {
            x: 400,
            y: 450,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile7.png")
          },
          Profile8: {
            x: 600,
            y: 450,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile8.png")
          },
          Profile9: {
            x: 800,
            y: 450,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile9.png")
          },
          Profile10: {
            x: 1000,
            y: 450,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile10.png")
          },
          Profile11: {
            x: 200,
            y: 650,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile11.png")
          },
          Profile12: {
            x: 400,
            y: 650,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile12.png")
          },
          Profile13: {
            x: 600,
            y: 650,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile13.png")
          },
          Profile14: {
            x: 800,
            y: 650,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile14.png")
          },
          Profile15: {
            x: 1000,
            y: 650,
            w: 150,
            h: 150,
            type: SelectAvatar,
            src: Utils.asset("profile/profile15.png")
          }
        },
        AddButton: {
          x: 775,
          y: 900,
          someData: "Add",
          type: Button
        }
      };
    }
    _init() {
      this._index = 0;
      this._setState("ChangeAvatar");
      //console.log(this.tag("ChangeAvatar").children[this._index]);
    }

    static _states() {
      return [class ChangeAvatar extends this {
        _getFocused() {
          return this.tag("ChangeAvatar").children[this._index];
        }
        _handleLeft() {
          if (this._index != 0) {
            this._index -= 1;
            return this.tag("ChangeAvatar").children[this._index];
          }
        }
        _handleRight() {
          if (this._index != 14) {
            this._index += 1;
            return this.tag("ChangeAvatar").children[this._index];
          }
        }
        _handleDown() {
          this._setState("AddButton");
        }
      }, class AddButton extends this {
        _getFocused() {
          this.PIndex = "Profile" + (this._index + 1);
          this.tag(this.PIndex).patch({
            smooth: {
              alpha: 1
            }
          });
          return this.tag("AddButton");
        }
        _handleUp() {
          this._setState("ChangeAvatar");
        }
        _handleEnter() {
          path = "profile/profile";
          path = path + (this._index + 1 + ".png");
          console.log(path);
          Router.navigate("editprofile", {
            path
          });
        }
      }];
    }
  }

  class ParentalProfile extends Lightning.Component {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        ParentalProfile: {
          texture: Lightning.Tools.getRoundRect(80, 40, 18, 4, Colors("#696963").get(), true, Colors("#696963").get())
        }
      };
    }
    _focus() {
      this.tag("ParentalProfile").patch({
        texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, 0xffffffff, true, Colors("#696963").get())
      });
    }
    _unfocus() {
      this.tag("ParentalProfile").patch({
        texture: Lightning.Tools.getRoundRect(80, 35, 18, 4, Colors("#696963").get(), true, Colors("#696963").get())
      });
    }
  }

  var message1$1 = [];
  var message2 = [];
  var myText1$1 = "";
  var myText2 = "";
  class KeyItem$2 extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 70,
        h: 60,
        color: 0xff474747,
        alpha: 1,
        Label: {
          x: 15,
          y: 15
        }
      };
    }
    _init() {
      this.patch({
        Label: {
          text: {
            text: this.item.label,
            fontSize: 28,
            textColor: 0xffffffff
          }
        }
      });
    }
    _focus() {
      this.color = 0xffffffff;
      this.tag("Label").color = 0xff474747;
    }
    _unfocus() {
      this.color = 0xff474747;
      this.tag("Label").color = 0xffffffff;
    }
    _getFocused() {
      return this.tag("Keys");
    }
    _handleEnter() {
      switch (this.item.label) {
        case "⌫":
          message1$1 = [];
          message2 = [];
          myText1$1 = "";
          myText2 = "";
          this.fireAncestors("$changeText", message1$1.join().replace(/,/g, ""));
          break;
        case "Space":
          if (message1$1.length <= 12) {
            message1$1.push(" ");
          }
          break;
        default:
          if (message1$1.length <= 3) {
            message1$1.push(this.item.label);
            myText1$1 += this.item.label + "         ";
            this.fireAncestors("$changeText", message1$1.join().replace(/,/g, ""), myText1$1, false);
          } else if (message2.length <= 3) {
            message2.push(this.item.label);
            myText2 += this.item.label + "         ";
            this.fireAncestors("$changeText", message2.join().replace(/,/g, ""), myText2, true);
          }
      }
    }
  }

  class KeyList$2 extends Lightning.Component {
    set items(items) {
      let keyWidth = 60;
      this.children = items.map(item => {
        if (item.label === "⌫") {
          keyWidth = 260;
        } else {
          keyWidth = 60;
        }
        return {
          type: KeyItem$2,
          action: item.label,
          x: item.x * 50,
          y: item.y * 50,
          w: keyWidth,
          item
        };
      });
    }
    _init() {
      this.index = 0;
    }
    _handleDown() {
      if (this.index <= 0) {
        this.index = 1;
      } else if (this.index >= 1) {
        this.index = 6;
      }
    }
    _handleUp() {
      if (this.index == 6) {
        this.index = 1;
      } else if (this.index == 1) {
        this.index = 0;
      }
    }
    _handleRight() {
      if (this.index >= 0) {
        if (this.index == 5 || this.index == 10 || this.index == 0) {
          this.fireAncestors("$changeMessage", 0);
        } else {
          this.index++;
        }
        //console.log("Right", this.index);
      }
    }

    _handleLeft() {
      if (this.index > 0) {
        this.index--;
      } else {
        this.index = 0;
      }
    }
    _getFocused() {
      return this.children[this.index];
    }
  }

  let Pin1$1,
    Pin2 = "";
  let myname = "";
  let mypath = "";
  class Parental extends Lightning.Component {
    constructor() {
      super(...arguments);
      _defineProperty(this, "focusKeyboard", true);
    }
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Background1: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        ParentalProfile: {
          Text: {
            w: 1920,
            y: 125,
            text: {
              text: "Parental Control",
              fontSize: 45,
              fontStyle: "bold",
              textAlign: "center"
            }
          },
          NoPerentalText: {
            x: 820,
            y: 275,
            text: {
              text: "No",
              fontSize: 42,
              textColor: Colors("#696963").get()
            }
            // text1: { text: "Kids", fontSize: 40 },
          },

          YesPerentalText: {
            x: 1020,
            y: 275,
            text: {
              text: "Yes",
              fontSize: 42,
              textColor: Colors("white").get()
            }
          },
          SelectRoundRectPerental: {
            x: 900,
            y: 280,
            type: ParentalProfile
          },
          SelectPerental: {
            x: 940,
            y: 273,
            w: 60,
            h: 60,
            src: Utils.asset("profile/dot.png")
          },
          SetupPin: {
            w: 1920,
            y: 425,
            text: {
              text: "Set up a 4 digit PIN that will be asked while using any non Kids profile.",
              fontSize: 32,
              fontStyle: "normal",
              textAlign: "center",
              textColor: Colors("#696963").get()
            }
          },
          PinLines: {
            x: 20,
            y: -100,
            Pin1: {
              x: 650,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin2: {
              x: 800,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin3: {
              x: 950,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin4: {
              x: 1100,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            }
          },
          ConfirmPin: {
            w: 1875,
            y: 660,
            text: {
              text: "Confirm 4 digit PIN",
              fontSize: 32,
              fontStyle: "normal",
              textAlign: "center",
              textColor: Colors("#696963").get()
            }
          },
          PinLinesConfirm: {
            x: 20,
            y: 120,
            Pin1: {
              x: 650,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin2: {
              x: 800,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin3: {
              x: 950,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin4: {
              x: 1100,
              y: 700,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            }
          },
          Button: {
            x: 800,
            y: 930,
            someData: "Submit",
            type: Button
          },
          Pin1: {
            w: 1920,
            h: 1080,
            y: 550,
            text: {
              text: "",
              fontSize: 30,
              FontFace: "Bold",
              textColor: 0xffffffff,
              textAlign: "center"
            }
          },
          Keyboard: {
            rect: true,
            x: 30,
            y: 600,
            w: 625,
            h: 320,
            color: 0x00d2d2d2,
            Keys: {
              type: KeyList$2,
              y: 30,
              x: 50,
              mount: 0.5
            }
          },
          Pin1Text: {
            y: 525,
            x: 708,
            text: {
              text: "",
              fontSize: 50,
              FontFace: "Bold",
              textColor: 0xffffffff,
              textAlign: "center"
            }
          },
          Pin2Text: {
            y: 745,
            x: 708,
            text: {
              text: "",
              fontSize: 50,
              FontFace: "Bold",
              textColor: 0xffffffff,
              textAlign: "center"
            }
          }
        }
      };
    }
    set params(args) {
      myname = args.Name;
      mypath = args.path;
    }
    _init() {
      this.MyPin1Text = "";
      this.tag("Keys").items = [{
        label: "⌫",
        x: 1,
        y: 0
      }, {
        label: "0",
        x: 1,
        y: 1
      }, {
        label: "1",
        x: 2,
        y: 1
      }, {
        label: "2",
        x: 3,
        y: 1
      }, {
        label: "3",
        x: 4,
        y: 1
      }, {
        label: "4",
        x: 5,
        y: 1
      }, {
        label: "5",
        x: 1,
        y: 2
      }, {
        label: "6",
        x: 2,
        y: 2
      }, {
        label: "7",
        x: 3,
        y: 2
      }, {
        label: "8",
        x: 4,
        y: 2
      }, {
        label: "9",
        x: 5,
        y: 2
      }];
      this._setState("Pin1");
    }
    $changeMessage(signal) {
      switch (signal) {
        case 0:
          this._setState("Pin1");
          break;
        case 1:
          this.focusKeyboard = true;
          break;
        default:
          this.focusKeyboard = true;
      }
    }
    $changeText(message, myText, flag) {
      this.MyPin1Text = myText;
      if (flag == false) {
        Pin1$1 = message;
        this.tag("Pin1Text").patch({
          text: {
            text: this.MyPin1Text
          }
        });
      } else if (flag == true) {
        Pin2 = message;
        this.tag("Pin2Text").patch({
          text: {
            text: this.MyPin1Text
          }
        });
      } else {
        this.tag("Pin2Text").patch({
          text: {
            text: ""
          }
        });
        this.tag("Pin1Text").patch({
          text: {
            text: ""
          }
        });
      }
    }
    static _states() {
      return [class Keyboard extends this {
        _getFocused() {
          if (this.focusKeyboard) {
            return this.tag("Keys");
          }
        }
      }, class SubmitButton extends this {
        _getFocused() {
          return this.tag("Button");
        }
        _handleUp() {
          this._setState("Pin2");
        }
        _handleEnter() {
          console.log("Pin1 --> ", Pin1$1);
          console.log("Pin2 --> ", Pin2);
          if (Pin1$1 == Pin2 && Pin1$1.length != 0 && Pin2.length != 0) {
            Router.navigate("editprofile", {
              PIN: Pin1$1,
              myname,
              mypath,
              flag: true
            });
          } else {
            this.tag("PinLines").children[0].color = Colors("yellow").get();
            this.tag("PinLines").children[1].color = Colors("yellow").get();
            this.tag("PinLines").children[2].color = Colors("yellow").get();
            this.tag("PinLines").children[3].color = Colors("yellow").get();
            this.tag("PinLinesConfirm").children[0].color = Colors("yellow").get();
            this.tag("PinLinesConfirm").children[1].color = Colors("yellow").get();
            this.tag("PinLinesConfirm").children[2].color = Colors("yellow").get();
            this.tag("PinLinesConfirm").children[3].color = Colors("yellow").get();
          }
        }
      }, class Pin1 extends this {
        _getFocused() {
          this.tag("PinLines").children[0].color = Colors("white").get();
          this.tag("PinLines").children[1].color = Colors("white").get();
          this.tag("PinLines").children[2].color = Colors("white").get();
          this.tag("PinLines").children[3].color = Colors("white").get();
        }
        _handleEnter() {
          this._setState("Keyboard");
        }
        _handleDown() {
          this.tag("PinLines").children[0].color = Colors("#919499").get();
          this.tag("PinLines").children[1].color = Colors("#919499").get();
          this.tag("PinLines").children[2].color = Colors("#919499").get();
          this.tag("PinLines").children[3].color = Colors("#919499").get();
          this._setState("Pin2");
        }
      }, class Pin2 extends this {
        _getFocused() {
          this.tag("PinLinesConfirm").children[0].color = Colors("white").get();
          this.tag("PinLinesConfirm").children[1].color = Colors("white").get();
          this.tag("PinLinesConfirm").children[2].color = Colors("white").get();
          this.tag("PinLinesConfirm").children[3].color = Colors("white").get();
        }
        _handleEnter() {
          this._setState("Keyboard");
        }
        _handleUp() {
          this.tag("PinLinesConfirm").children[0].color = Colors("#919499").get();
          this.tag("PinLinesConfirm").children[1].color = Colors("#919499").get();
          this.tag("PinLinesConfirm").children[2].color = Colors("#919499").get();
          this.tag("PinLinesConfirm").children[3].color = Colors("#919499").get();
          this._setState("Pin1");
        }
        _handleDown() {
          this.tag("PinLinesConfirm").children[0].color = Colors("#919499").get();
          this.tag("PinLinesConfirm").children[1].color = Colors("#919499").get();
          this.tag("PinLinesConfirm").children[2].color = Colors("#919499").get();
          this.tag("PinLinesConfirm").children[3].color = Colors("#919499").get();
          this._setState("SubmitButton");
        }
      }];
    }
  }

  var message1 = [];
  var myText1 = "";
  class KeyItem$1 extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 70,
        h: 60,
        color: 0xff474747,
        alpha: 1,
        Label: {
          x: 15,
          y: 15
        }
      };
    }
    _init() {
      this.patch({
        Label: {
          text: {
            text: this.item.label,
            fontSize: 28,
            textColor: 0xffffffff
          }
        }
      });
    }
    _focus() {
      this.color = 0xffffffff;
      this.tag("Label").color = 0xff474747;
    }
    _unfocus() {
      this.color = 0xff474747;
      this.tag("Label").color = 0xffffffff;
    }
    _getFocused() {
      return this.tag("Keys");
    }
    _handleEnter() {
      switch (this.item.label) {
        case "⌫":
          message1 = [];
          myText1 = "";
          this.fireAncestors("$changeText", message1.join().replace(/,/g, ""));
          break;
        case "Space":
          if (message1.length <= 12) {
            message1.push(" ");
          }
          break;
        default:
          if (message1.length <= 3) {
            message1.push(this.item.label);
            myText1 += "*" + "     ";
            this.fireAncestors("$changeText", message1.join().replace(/,/g, ""), myText1, false);
          }
      }
    }
  }

  class KeyList$1 extends Lightning.Component {
    set items(items) {
      let keyWidth = 60;
      this.children = items.map(item => {
        if (item.label === "⌫") {
          keyWidth = 260;
        } else {
          keyWidth = 60;
        }
        return {
          type: KeyItem$1,
          action: item.label,
          x: item.x * 50,
          y: item.y * 50,
          w: keyWidth,
          item
        };
      });
    }
    _init() {
      this.index = 0;
    }
    _handleDown() {
      if (this.index <= 0) {
        this.index = 1;
      } else if (this.index >= 1) {
        this.index = 6;
      }
    }
    _handleUp() {
      if (this.index == 6) {
        this.index = 1;
      } else if (this.index == 1) {
        this.index = 0;
      }
    }
    _handleRight() {
      if (this.index >= 0) {
        if (this.index == 5 || this.index == 10 || this.index == 0) {
          this.fireAncestors("$changeMessage", 0);
        } else {
          this.index++;
        }
        //console.log("Right", this.index);
      }
    }

    _handleLeft() {
      if (this.index > 0) {
        this.index--;
      } else {
        this.index = 0;
      }
    }
    _getFocused() {
      return this.children[this.index];
    }
  }

  let Pin, Pin1;
  class VarifyPin extends Lightning.Component {
    constructor() {
      super(...arguments);
      _defineProperty(this, "focusKeyboard", true);
    }
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }];
    }
    static _template() {
      return {
        Background1: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }
          },
          visible: true
        },
        Text: {
          w: 1920,
          y: 100,
          text: {
            text: "Enter PIN to proceed",
            fontSize: 45,
            fontStyle: "bold",
            textAlign: "center"
          }
        },
        Profile: {
          x: 20,
          ProfileIMG: {
            x: 835,
            y: 250,
            w: 200,
            h: 200,
            src: Utils.asset("profile/profile1.png")
          },
          NameText: {
            x: 870,
            y: 500,
            text: {
              text: "ANAND",
              fontSize: 37
            }
          },
          PinText: {
            w: 1850,
            y: 600,
            text: {
              text: "Enter 4 Digit Parental Control PIN",
              fontSize: 30,
              textAlign: "center"
            }
          },
          PinLines: {
            x: -10,
            y: -100,
            Pin1: {
              x: 650,
              y: 900,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin2: {
              x: 800,
              y: 900,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin3: {
              x: 950,
              y: 900,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            },
            Pin4: {
              x: 1100,
              y: 900,
              w: 100,
              h: 5,
              rect: true,
              color: Colors("#919499").get()
            }
          },
          Button: {
            x: 775,
            y: 930,
            someData: "Get In",
            type: Button
          },
          Keyboard: {
            rect: true,
            x: 30,
            y: 600,
            w: 625,
            h: 320,
            color: 0x00d2d2d2,
            Keys: {
              type: KeyList$1,
              y: 30,
              x: 50,
              mount: 0.5
            }
          },
          Pin1Text: {
            y: 730,
            x: 680,
            text: {
              text: "",
              fontSize: 80,
              FontFace: "Bold",
              textColor: 0xffffffff,
              textAlign: "center"
            }
          }
        }
      };
    }
    set params(args) {
      args.Name;
      args.Path;
      Pin = args.Pin;
      console.log("MYPIN", args);
    }
    _init() {
      Pin1 = "";
      this.tag("Keys").items = [{
        label: "⌫",
        x: 1,
        y: 0
      }, {
        label: "0",
        x: 1,
        y: 1
      }, {
        label: "1",
        x: 2,
        y: 1
      }, {
        label: "2",
        x: 3,
        y: 1
      }, {
        label: "3",
        x: 4,
        y: 1
      }, {
        label: "4",
        x: 5,
        y: 1
      }, {
        label: "5",
        x: 1,
        y: 2
      }, {
        label: "6",
        x: 2,
        y: 2
      }, {
        label: "7",
        x: 3,
        y: 2
      }, {
        label: "8",
        x: 4,
        y: 2
      }, {
        label: "9",
        x: 5,
        y: 2
      }];
      this._setState("Pin1");
    }
    $changeMessage(signal) {
      switch (signal) {
        case 0:
          this._setState("Pin1");
          break;
        case 1:
          this.focusKeyboard = true;
          break;
        default:
          this.focusKeyboard = true;
      }
    }
    $changeText(message, myText) {
      this.MyPin1Text = myText;
      Pin1 = message;
      if (myText == undefined) {
        this.tag("Pin1Text").patch({
          text: {
            text: ""
          }
        });
      } else {
        this.tag("Pin1Text").patch({
          text: {
            text: this.MyPin1Text + "   "
          }
        });
      }
    }
    static _states() {
      return [class Keyboard extends this {
        _getFocused() {
          if (this.focusKeyboard) {
            return this.tag("Keys");
          }
        }
      }, class Pin1 extends this {
        _getFocused() {
          this.tag("PinLines").children[0].color = Colors("white").get();
          this.tag("PinLines").children[1].color = Colors("white").get();
          this.tag("PinLines").children[2].color = Colors("white").get();
          this.tag("PinLines").children[3].color = Colors("white").get();
        }
        _handleEnter() {
          this._setState("Keyboard");
        }
        _handleDown() {
          this.tag("PinLines").children[0].color = Colors("#919499").get();
          this.tag("PinLines").children[1].color = Colors("#919499").get();
          this.tag("PinLines").children[2].color = Colors("#919499").get();
          this.tag("PinLines").children[3].color = Colors("#919499").get();
          this._setState("SubmitButton");
        }
      }, class SubmitButton extends this {
        _getFocused() {
          return this.tag("Button");
        }
        _handleUp() {
          this._setState("Pin1");
        }
        _handleEnter() {
          console.log("Pin1 --> ", Pin1);
          console.log("Pin --> ", Pin);
          if (Pin1 == Pin) {
            Router.navigate("main", {});
          } else {
            this.tag("PinLines").children[0].color = Colors("yellow").get();
            this.tag("PinLines").children[1].color = Colors("yellow").get();
            this.tag("PinLines").children[2].color = Colors("yellow").get();
            this.tag("PinLines").children[3].color = Colors("yellow").get();
          }
        }
      }];
    }
  }

  class Container {
    constructor(obj, type, genres) {
      this._page = obj.page;
      this._total_results = obj.total_results;
      this._type = type;
      this._items = obj.results.map(item => {
        switch (type) {
          case "movie":
            return new Movie(item, genres);
          case "tv":
            return new Tv(item, genres);
        }
      });
    }
    get page() {
      return this._page;
    }
    get total() {
      return this._total_results;
    }
    get type() {
      return this._type;
    }
    get items() {
      return this._items;
    }
  }

  class Movie {
    constructor(obj, genres) {
      this._adult = obj.adult;
      this._backdrop_path = obj.backdrop_path;
      this._genres = obj.genre_ids.map(id => {
        return genres.find(genre => {
          return genre.id === id;
        });
      }).filter(item => item);
      this._id = obj.id;
      this._original_language = obj.original_language;
      this._overview = obj.overview;
      this._popularity = obj.popularity;
      this._poster_path = obj.poster_path;
      this._release_date = obj.release_date;
      this._title = obj.title;
      this._type = "movie";
      this._video = obj.video;
      this._vote_average = obj.vote_average;
      this._vote_count = obj.vote_count;
    }
    get adult() {
      return this._adult;
    }
    get background() {
      return this._backdrop_path;
    }
    get genres() {
      return this._genres;
    }
    get id() {
      return this._id;
    }
    get originalLanguage() {
      return this._original_language;
    }
    get overview() {
      return this._overview;
    }
    get popularity() {
      return this._popularity;
    }
    get poster() {
      return this._poster_path;
    }
    get releaseDate() {
      return this._release_date;
    }
    get title() {
      return this._title;
    }
    get type() {
      return this._type;
    }
    get video() {
      return this._video;
    }
    get voteAverage() {
      return this._vote_average;
    }
    get voteCount() {
      return this._vote_count;
    }
  }

  class Tv {
    constructor(obj, genres) {
      this._backdrop_path = obj.backdrop_path;
      this._first_air_date = obj.first_air_date;
      this._genres = obj.genre_ids.map(id => {
        return genres.find(genre => {
          return genre.id === id;
        });
      }).filter(item => item);
      this._id = obj.id;
      this._name = obj.name;
      this._origin_country = obj.origin_country;
      this._original_language = obj.original_language;
      this._original_name = obj.original_name;
      this._overview = obj.overview;
      this._popularity = obj.popularity;
      this._poster_path = obj.poster_path;
      this._title = obj.name;
      this._type = "tv";
      this._vote_average = obj.vote_average;
      this._vote_count = obj.vote_count;
    }
    get background() {
      return this._backdrop_path;
    }
    get firstAirDate() {
      return this._first_air_date;
    }
    get genres() {
      return this._genres;
    }
    get id() {
      return this._id;
    }
    get name() {
      return this._name;
    }
    get originalCountry() {
      return this._origin_country;
    }
    get originalLanguage() {
      return this._original_language;
    }
    get originalName() {
      return this._original_name;
    }
    get overview() {
      return this._overview;
    }
    get title() {
      return this._title;
    }
    get type() {
      return this._type;
    }
    get popularity() {
      return this._popularity;
    }
    get poster() {
      return this._poster_path;
    }
    get voteAverage() {
      return this._vote_average;
    }
    get voteCount() {
      return this._vote_count;
    }
  }

  class Details {
    constructor(obj) {
      this._adult = obj.adult;
      this._backdrop_path = obj.backdrop_path;
      this._belong_to_collection = obj.belongs_to_collection;
      this._budget = obj.budget;
      this._genres = obj.genres;
      this._homepage = obj.homepage;
      this._id = obj.id;
      this._imdb_id = obj.imdb_id;
      this._original_language = obj.original_language;
      this._original_title = obj.original_title;
      this._overview = obj.overview;
      this._popularity = obj.popularity;
      this._poster_path = obj.poster_path;
      this._production_companies = obj.production_companies;
      this._production_countries = obj.production_countries;
      this._release_date = new Date(obj.release_date || obj.first_air_date);
      this._revenue = obj.revenue;
      this._runtime = obj.runtime;
      this._spoken_languages = obj.spoken_languages;
      this._status = obj.status;
      this._tagline = obj.tagline;
      this._title = obj.title || obj.name;
      this._video = obj._video;
      this._vote_average = obj.vote_average;
      this._vote_count = obj.vote_count;
    }
    get adult() {
      return this._adult;
    }
    get background() {
      return this._backdrop_path;
    }
    get belongToCollection() {
      return this._belong_to_collection;
    }
    get budget() {
      return this._budget;
    }
    get genres() {
      return this._genres;
    }
    get homepage() {
      return this._homepage;
    }
    get id() {
      return this._id;
    }
    get imdbId() {
      return this._imdb_id;
    }
    get originalLanguage() {
      return this._original_language;
    }
    get originalTitle() {
      return this._original_title;
    }
    get overview() {
      return this._overview;
    }
    get popularity() {
      return this._popularity;
    }
    get poster() {
      return this._poster_path;
    }
    get productionCompanies() {
      return this._production_companies;
    }
    get productionCountries() {
      return this._production_countries;
    }
    get releaseDate() {
      return this._release_date;
    }
    get revenue() {
      return this._revenue;
    }
    get runtime() {
      return this._runtime;
    }
    get spokenLanguages() {
      return this._spoken_languages;
    }
    get status() {
      return this._status;
    }
    get tagline() {
      return this._tagline;
    }
    get title() {
      return this._title;
    }
    get video() {
      return this._video;
    }
    get voteAverage() {
      return this._vote_average;
    }
    get voteCount() {
      return this._vote_count;
    }
  }

  class Item$1 extends Lightning.Component {
    static _template() {
      return {
        w: Item$1.width,
        h: Item$1.height,
        Poster: {
          w: w => w,
          h: h => h,
          pivotY: 0.7,
          rtt: true,
          // shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
          // transitions: {
          //   w: {
          //     duration: 0.6,
          //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
          //   },
          //   h: {
          //     duration: 0.6,
          //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
          //   },
          // },
          Image: {
            w: w => w,
            h: h => h,
            scale: 1.2,
            color: 0xff2f2f2f
            //   transitions: {
            //     w: {
            //       duration: 0.6,
            //       timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //     },
            //     h: {
            //       duration: 0.6,
            //       timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
            //     },
            //   },
          }
          // BorderLeft: {
          //   w: 2,
          //   h: (h) => h,
          //   rect: true,
          //   color: 0x40ffffff,
          // },
          // Rating: {
          //     mountX: .5, mountY: 1, x: w=>w / 2, y: 360,
          //     transitions: {
          //         y: {duration: .6, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
          //     },
          //     texture: Lightning.Tools.getRoundRect(70, 70, 35, 0, 0x00ffffff, true, 0xff081C22),
          //     RatingNumber: {
          //         mount: .5, x: w=>w / 2 + 4, y: h=>h / 2 + 2,
          //         flex: {},
          //         Number: {
          //             text: {text: '0', fontSize: 26, fontFace: "SourceSansPro-Bold"}
          //         },
          //         Percentage: {
          //             flexItem: {marginTop: 6},
          //             text: {text: '%', fontSize: 12, fontFace: "SourceSansPro-Regular"}
          //         }
          //     },
          //     RatingCircle: {
          //         rect:true, color: 0x00ffffff, rtt:true, mount: .5, x: 36, y: 36, w: 60, h: 60, rotation: Math.PI * .5,
          //         shader: {
          //             type: CircleProgressShader, radius: 30, width: 3, angle: 0.0001, smooth: 0.005, color: 0xffd1215c, backgroundColor: 0xff204529
          //         }
          //     }
          // }
        }
      };
    }

    //   _init() {
    //     this._angle = 0.001;
    //     this._ratingNumber = 0;

    //     // this._focusAnimation = this.tag("Rating").animation({
    //     //   duration: 1.2,
    //     //   stopDuration: 0.2,
    //     //   stopMethod: "immediate",
    //     //   actions: [
    //     //     {
    //     //       t: "RatingCircle",
    //     //       p: "shader.angle",
    //     //       rv: 0.0001,
    //     //       v: () => {
    //     //         if (this._angle < this._item.voteAverage / 10) {
    //     //           this._angle += 0.01;
    //     //         }

    //     //         if (this._angle < 0.4) {
    //     //           this.tag("RatingCircle").shader.color = 0xffd1215c;
    //     //         } else if (this._angle > 0.4 && this._angle < 0.6) {
    //     //           this.tag("RatingCircle").shader.color = 0xffd2d531;
    //     //         } else if (this._angle > 0.6) {
    //     //           this.tag("RatingCircle").shader.color = 0xff21d07a;
    //     //         }

    //     //         return this._angle;
    //     //       },
    //     //     },
    //     //     {
    //     //       t: "Number",
    //     //       p: "text.text",
    //     //       rv: 0,
    //     //       v: () => {
    //     //         if (this._ratingNumber < this._item.voteAverage * 10) {
    //     //           this._ratingNumber += 1;
    //     //         }
    //     //         return `${Math.floor(this._ratingNumber)}`;
    //     //       },
    //     //     },
    //     //   ],
    //     // });
    //   }

    set item(v) {
      this._item = v;
      const image = getImgUrl(this._item.poster, 500);
      this.patch({
        Poster: {
          Image: {
            texture: Img(image).contain(180 * 1.2, 270 * 1.2)
          }
        }
      });
    }
    set index(v) {
      this._index = v;
      if (this._index < 8) {
        this.tag("Image").color = 0xffffffff;
      }
    }
    _focus() {
      this._angle = 0.001;
      this._ratingNumber = 0;
      this.patch({
        Poster: {
          smooth: {
            scale: 1.2
          },
          Image: {
            smooth: {
              scale: 1
            }
          },
          Rating: {
            smooth: {
              y: 250
            }
          }
        }
      });

      // this._focusAnimation.start();
      this.application.emit("setItem", this._item);
    }
    _unfocus() {
      this.patch({
        Poster: {
          smooth: {
            scale: 1
          },
          Image: {
            smooth: {
              scale: 1.2
            }
          },
          Rating: {
            smooth: {
              y: 360
            }
          }
        }
      });

      // this._focusAnimation.stop();
    }

    static get width() {
      return 180;
    }
    static get height() {
      return 270;
    }
    static get offset() {
      return 40;
    }
  }

  class ItemWrapper extends Lightning.Component {
    static _template() {
      return {
        clipbox: true
      };
    }
    set index(v) {
      this._index = v;
    }
    get index() {
      return this._index;
    }
    set construct(v) {
      this._construct = v;
    }
    get construct() {
      return this._construct;
    }
    set item(obj) {
      this._item = obj;
    }
    get item() {
      return this._item;
    }
    set lngItem(v) {
      this._realItem = v;
    }
    get lngItem() {
      return this._realItem;
    }
    get child() {
      return this.children[0];
    }
    create() {
      const item = this._item;
      this.children = [{
        type: this._construct,
        item,
        index: this._index
      }];

      // if item is flagged and has focus, notify parent
      // that focuspath can be recalculated
      if (this._notifyOnItemCreation && this.hasFocus()) {
        this._refocus();
      }
    }
    _firstActive() {
      this.create();
      if (!ItemWrapper.FIRST_CREATED) {
        this.fireAncestors("$firstItemCreated");
        ItemWrapper.FIRST_CREATED = true;
      }
    }
    _getFocused() {
      // due to lazy creation there is the possibility that
      // an component receives focus before the actual item
      // is created, therefore we set a flag
      if (!this.child) {
        this._notifyOnItemCreation = true;
      } else {
        return this.child;
      }
    }
  }
  ItemWrapper.FIRST_CREATED = false;

  class List extends Lightning.Component {
    static _template() {
      return {
        Items: {
          y: 180,
          forceZIndexContext: true,
          boundsMargin: [500, 100, 500, 100]
          // transitions: {
          //   x: {
          //     duration: 0.3,
          //     timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
          //   },
          // },
        },

        Focus: {
          x: -32,
          y: 102,
          colorLeft: 0xff8ecea2,
          colorRight: 0xff03b3e4
          // texture: Lightning.Tools.getRoundRect(
          //   236,
          //   344,
          //   16,
          //   6,
          //   0xffffffff,
          //   true,
          //   0x00ffffff
          // ),
        },

        About: {
          x: -32,
          y: 60,
          mountY: 1,
          flex: {
            direction: "column"
          },
          Title: {
            x: 50,
            text: {
              fontSize: 50,
              fontFace: "SourceSansPro-Bold",
              wordWrapWidth: 900,
              maxLines: 1
            }
          },
          Genres: {
            x: 50,
            flexItem: {
              marginTop: -24
            },
            colorLeft: 0xff8ecea2,
            colorRight: 0xff03b3e4,
            text: {
              fontSize: 32,
              fontFace: "SourceSansPro-Regular",
              wordWrapWidth: 960,
              maxLines: 1
            }
          }
        }
      };
    }
    _construct() {
      this._index = 0;
    }
    _init() {
      this.tag("Title").on("txLoaded", () => {
        this.tag("About").setSmooth("y", 90, {
          duration: 1,
          timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
        });
      });
      this.application.on("setItem", item => {
        if (item === this._item) {
          return;
        }
        this._item = item;
        const genres = item.genres.map((genre, index) => {
          if (index < 2) {
            return genre.name;
          }
        }).filter(item => item).join(" | ");
        this.tag("About").setSmooth("y", 60, {
          duration: 0
        });
        this.patch({
          About: {
            Title: {
              text: {
                text: item.title
              }
            },
            Genres: {
              text: {
                text: genres
              }
            }
          }
        });
      });
    }
    get activeItem() {
      return this.tag("Items").children[this._index];
    }
    set container(v) {
      this._container = v;
    }
    get container() {
      return this._container;
    }
    set itemConstruct(v) {
      this._itemConstruct = v;
    }
    get itemConstruct() {
      return this._itemConstruct;
    }
    get getRealComponent() {
      return this.activeItem.child;
    }
    get realWidth() {
      let construct = this._itemConstruct;
      return this._items.length * (construct.width + construct.offset);
    }
    set items(v) {
      let construct = this._itemConstruct;
      this._items = v;

      //@warn: since we lazy create all the items
      // we need to set the itemWrapper flag to false
      // so it can notify that the first item is created
      ItemWrapper.FIRST_CREATED = false;
      this.tag("Items").patch({
        children: this._createItems({
          items: this._items,
          construct
        })
      });
    }
    get items() {
      return this._items;
    }
    _createItems(_ref) {
      let {
        items,
        construct
      } = _ref;
      return items.map((item, index) => {
        return {
          type: ItemWrapper,
          construct,
          index: index,
          item: item,
          x: index * (construct.width + construct.offset),
          w: construct.width,
          h: construct.height
        };
      });
    }
    _animateToSelected() {
      let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._index;
      this.tag("Items").children.forEach((item, idx) => {
        const child = item.child;
        if (child) {
          if (idx > index - 1 && idx < index + 8) {
            child.tag("Image").setSmooth("color", 0xffffffff);
          } else if (idx === index - 1 || idx === index + 8) {
            child.tag("Image").setSmooth("color", 0xff2f2f2f);
          }
        }
      });
      this.tag("Items").setSmooth("x", -this.activeItem.finalX);
    }
    _focus() {
      this.patch({
        smooth: {
          x: [0, {
            duration: 0.2,
            timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
          }]
        },
        Focus: {
          smooth: {
            alpha: [1, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        },
        About: {
          smooth: {
            x: [-32, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }],
            y: [90, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
      this._animateToSelected();
    }
    _unfocus() {
      this.patch({
        smooth: {
          x: [-32, {
            duration: 0.4,
            timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
          }]
        },
        Focus: {
          smooth: {
            alpha: [0, {
              duration: 0.2,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        },
        About: {
          smooth: {
            y: [130, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }],
            x: [0, {
              duration: 0.4,
              timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)"
            }]
          }
        }
      });
      this.stage.gc();
    }
    _handleLeft() {
      if (this._index > 0) {
        this.select({
          direction: -1
        });
      } else {
        return false;
      }
    }
    _handleRight() {
      if (this._index < this.tag("Items").children.length - 1) {
        this.select({
          direction: 1
        });
      } else {
        return false;
      }
    }
    _handleEnter() {
      const item = this.activeItem.item;
      if (isTV == true) {
        Router.navigate("tvdetails/".concat(item.type, "/").concat(item.id), true);
      } else {
        Router.navigate("details/".concat(item.type, "/").concat(item.id), true);
      }
    }
    setIndex(index) {
      this._index = index;
      this._animateToSelected();
      this._refocus();
    }
    select(_ref2) {
      let {
        direction
      } = _ref2;
      this._index += direction;
      this._animateToSelected();
    }
    $itemCreatedForFocus() {
      this.application.updateFocusPath();
    }
    _getFocused() {
      return this.activeItem;
    }
    static get height() {
      return 560;
    }
  }

  const apiKey = "7aae88a20d41b4f84ff26c4c22f60738";
  const listComponents = new Map();
  const itemComponents = new Map();
  let stage;
  let genres;
  listComponents.set("movie", List);
  listComponents.set("tv", List);
  itemComponents.set("movie", Item$1);
  itemComponents.set("tv", Item$1);
  const init = stageInstance => {
    stage = stageInstance;
  };
  const getMovies = async () => {
    const movies = await _getLatest("movie");
    const models = [movies];
    console.log("list of movies", models);
    return _lists(models);
  };
  const getTv = async () => {
    const tv = await _getLatest("tv");
    const models = [tv];
    return _lists(models);
  };
  const getPremium = async () => {
    const movies = await _getPremium("movie");
    const models = [movies];
    // console.log("list of movies",models);
    return _lists(models);
  };
  const getPremium1 = async () => {
    const movies = await _getPremium1("movie");
    const models = [movies];
    return _lists(models);
  };
  const getDetails = (type, id) => {
    return _get("/".concat(type, "/").concat(id)).then(response => {
      return new Details(response);
    });
  };
  const _getGenres = async () => {
    const movie = await _get("/genre/movie/list").then(response => {
      return response.genres;
    });
    const tv = await _get("/genre/tv/list").then(response => {
      return response.genres;
    });
    return [...movie, ...tv];
  };
  const _getLatest = async type => {
    if (!genres) {
      genres = await _getGenres();
    }
    return _get("/".concat(type, "/top_rated")).then(response => {
      return new Container(response, type, genres);
    });
  };
  const _getPremium = async type => {
    if (!genres) {
      genres = await _getGenres();
    }
    return _get("/".concat(type, "/upcoming")).then(response => {
      return new Container(response, type, genres);
    });
  };
  const _getPremium1 = async type => {
    if (!genres) {
      genres = await _getGenres();
    }
    return _get("/".concat(type, "/now_playing")).then(response => {
      return new Container(response, type, genres);
    });
  };
  const _get = (url, params) => {
    let params_str = "?api_key=".concat(apiKey);
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        params_str += "&" + key + "=" + encodeURIComponent(params[key]);
      }
    }
    return fetch("https://api.themoviedb.org/3".concat(url).concat(params_str), {
      Accept: "application/json"
    }).then(response => {
      if (!response.ok) throw "Response not ok";
      return response.json();
    }).catch(error => {
      console.error("Error loading " + url, error);
      throw error;
    });
  };
  const _lists = function () {
    let models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (!Array.isArray(models)) {
      models = [models];
    }
    return models.map(list => {
      return stage.c({
        type: listComponents.get(list.type),
        itemConstruct: itemComponents.get(list.type),
        items: list.items
      });
    });
  };

  var message = [];
  class KeyItem extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 70,
        h: 60,
        color: 0xff474747,
        alpha: 1,
        Label: {
          x: 15,
          y: 8
        }
      };
    }
    _init() {
      this.patch({
        Label: {
          text: {
            text: this.item.label,
            fontSize: 28
            // textColor: 0xffffffff,
          }
        }
      });
    }

    _focus() {
      this.color = 0xffffffff;
      this.tag("Label").color = 0xff474747;
      // this.tag("Label").children[0].textColor = 0xffffffff;
    }

    _unfocus() {
      this.color = 0xff474747;
      this.tag("Label").color = 0xffffffff;
      // this.tag("Label").children[0].textColor = 0xff000000;
    }

    _getFocused() {
      return this.tag("Keys");
    }
    _handleEnter() {
      switch (this.item.label) {
        case "⌫":
          var edited = message.slice(0, -1);
          message = edited;
          break;
        case "↲":
          // TODO store entered data here
          console.log("Saved");
          break;
        default:
          message.push(this.item.label);
      }
      this.fireAncestors("$changeText", message.join().replace(/,/g, ""));
    }
  }

  class KeyList extends Lightning.Component {
    set items(items) {
      let keyWidth = 60;
      this.children = items.map(item => {
        if (item.label === "Space" || item.label === "⌫") {
          keyWidth = 190;
        } else {
          keyWidth = 60;
        }
        return {
          type: KeyItem,
          action: item.label,
          x: item.x * 65,
          y: item.y * 65,
          w: keyWidth,
          item
        };
      });
    }
    _init() {
      this.index = 0;
    }
    _handleDown() {
      if (this.index <= 1) {
        this.index = 2;
        console.log("Down", this.index, this.index < 20);
      } else if (this.index >= 32) {
        this.fireAncestors("$changeMessage", 3);
      } else if (this.index >= 2 && this.index < 32) {
        this.index += 6;
        console.log("Down1", this.index, this.index >= 20 && this.index < 29);
      }
    }
    _handleUp() {
      if (this.index >= 8) {
        this.index -= 6;
        console.log("Up", this.index);
      } else if (this.index <= 1) {
        this.index = 0;
        console.log("Up1", this.index);
      } else if (this.index < 8) {
        this.index = 1;
      }
    }
    _handleRight() {
      if (this.index < 38) {
        if (this.index == 1 || this.index == 7 || this.index == 13 || this.index == 19 || this.index == 25 || this.index == 31 || this.index == 37) {
          this.fireAncestors("$changeMessage", 0);
        } else {
          this.index++;
        }
        console.log("Right", this.index);
      }
    }
    _handleLeft() {
      if (this.index > 0) {
        this.index--;
        console.log("Left", this.index);
      } else {
        this.index = 0;
        Router.focusPage();
      }
    }
    _getFocused() {
      return this.children[this.index];
    }
  }

  class MoviesListItem extends Lightning.Component {
    static _template() {
      return {
        flexItem: {
          margin: 14
        },
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 10
        },
        rect: true,
        w: 150,
        h: 200,
        alpha: 0.8
      };
    }
    _init() {
      this.patch({
        src: this.item.src
      });
      this.item.average * 10;
    }
    _active() {
      this.application.on("setBackground", val => {
        if (val) {
          this.patch({
            colorTop: 0xff717171,
            colorBottom: 0xff000000
          });
        } else {
          this.patch({
            colorTop: 0xffffffff,
            colorBottom: 0xffffffff
          });
        }
      });
    }
    _handleEnter() {
      console.log(this.item.label);
      Router.navigate("simple", false);

      // console.log(this.current[2].title);
      this.fireAncestors("$addSearch", this.item.label);
    }
    _focus() {
      this.patch({
        smooth: {
          scale: 1.2,
          alpha: 1
        }
      });
    }
    _unfocus() {
      this.patch({
        smooth: {
          scale: 1,
          alpha: 0.8
        }
      });
    }

    // _handleEnter() {
    //   const itemId = this.item.itemId;
    //   const itemType = this.item.itemType;
    //   Router.navigate(`detail/${itemType}/${itemId}`, true);
    // }

    pageTransition() {
      return "up";
    }
  }

  class MovieList extends Lightning.Component {
    static _template() {
      return {};
    }
    set items(items) {
      this.children = items.map((item, index) => {
        return {
          type: MoviesListItem,
          item: item
        };
      });
    }
    _construct() {
      this._changeX = 0;
    }
    _init() {
      this.index = 0;
    }
    _active() {}
    _handleLeft() {
      if (this.index > 0) {
        this.index--;
      } else {
        this.fireAncestors("$changeMessage", 1);
      }
    }
    _handleUp() {
      this.fireAncestors("$changeMessage", 2);
    }
    _handleDown() {
      this.fireAncestors("$changeMessage", 0);
    }
    // _handleEnter() {
    //   console.log(this.current);
    //   // console.log(this.current[2].title);
    //   // this.fireAncestors("$changeMessage", "");
    // }

    _handleRight() {
      if (this.index < this.children.length - 1) {
        this.index++;
      }
    }
    _getActiveItem() {
      return this.children[this.index];
    }
    _changeLeftDirection() {
      this._changeX += 220;
    }
    _changeRightDirection() {
      this._changeX -= 220;
    }
    _getFocused() {
      // this._focusedLabel = this.childList.getAt(
      //   this.index
      // ).item.label;
      // this._focusedGenres = this.childList.getAt(this.index)
      //   .item.genres.join(" | ");
      // let backdrop = this.childList.getAt(this.index).item.backdrop;
      // let arrList = [this._focusedLabel, this._focusedGenres, backdrop];
      // console.log('arrlist....',arrList);
      // this.application.emit("whenFocused", arrList);
      return this.children[this.index];
    }
  }

  var series = [
  	{
  		title: "Breaking Bad",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  		background: "https://www.themoviedb.org/t/p/original/84XPpjGvxNyExjSuLQe0SzioErt.jpg",
  		overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future."
  	},
  	{
  		title: "Peaky Blinders",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/bGZn5RVzMMXju4ev7xbl1aLdXqq.jpg",
  		background: "https://www.themoviedb.org/t/p/original/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg",
  		overview: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby."
  	},
  	{
  		title: "Vikings",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/xxl0YHkYHHCetgnG2fgezUaQiHc.jpg",
  		background: "https://www.themoviedb.org/t/p/original/oa2gIzDwZ5weyZea5iXPLrQ7leN.jpg",
  		overview: "Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore - and raid - the distant shores across the ocean."
  	},
  	{
  		title: "Prison Break",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg",
  		background: "https://www.themoviedb.org/t/p/original/7w165QdHmJuTHSQwEyJDBDpuDT7.jpg",
  		overview: "Due to a political conspiracy, an innocent man is sent to death row and his only hope is his brother, who makes it his mission to deliberately get himself sent to the same prison in order to break the both of them out, from the inside."
  	},
  	{
  		title: "Chernobyl",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
  		background: "https://www.themoviedb.org/t/p/original/900tHlUYUkp7Ol04XFSoAaEIXcT.jpg",
  		overview: "https://www.themoviedb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg"
  	},
  	{
  		title: "Money Heist",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
  		background: "https://www.themoviedb.org/t/p/original/j6hw352dBwBEYFzUi00X2p2FoHS.jpg",
  		overview: "To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose. Five months of seclusion - memorizing every step, every detail, every probability - culminate in eleven days locked up in the National Coinage and Stamp Factory of Spain, surrounded by police forces and with dozens of hostages in their power, to find out whether their suicide wager will lead to everything or nothing."
  	},
  	{
  		title: "Game of Thrones",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
  		background: "https://www.themoviedb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
  		overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond."
  	},
  	{
  		title: "Riverdale",
  		poster_path: "https://www.themoviedb.org/t/p/w500/wRbjVBdDo5qHAEOVYoMWpM58FSA.jpg",
  		background: "https://www.themoviedb.org/t/p/original/89gS6MtkrNdCnguz9ATjp4fMsu4.jpg",
  		overview: "Set in the present, the series offers a bold, subversive take on Archie, Betty, Veronica and their friends, exploring the surreality of small-town life, the darkness and weirdness bubbling beneath Riverdale’s wholesome facade."
  	},
  	{
  		title: "Elite",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
  		background: "https://www.themoviedb.org/t/p/original/hobvvYTd45epIEBpTIT1WCIyPMB.jpg",
  		overview: "When three working class kids enroll in the most exclusive school in Spain, the clash between the wealthy and the poor students leads to tragedy."
  	},
  	{
  		title: "Chernobyl",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/aL53oMdZKZRJRH8txH07DLuleF9.jpg",
  		background: "https://www.themoviedb.org/t/p/original/900tHlUYUkp7Ol04XFSoAaEIXcT.jpg",
  		overview: "https://www.themoviedb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg"
  	}
  ];

  var fallbackCachedFilms = [
  	{
  		title: "Captain America: Civil War",
  		background: "https://www.themoviedb.org/t/p/original/kvRT3GwcnqGHzPjXIVrVPhUix7Z.jpg",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/kvRT3GwcnqGHzPjXIVrVPhUix7Z.jpg",
  		overview: "Following the events of Age of Ultron, the collective governments of the world pass an act designed to regulate all superhuman activity. This polarizes opinion amongst the Avengers, causing two factions to side with Iron Man or Captain America, which causes an epic battle between former allies."
  	},
  	{
  		title: "Thor: Ragnarok",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
  		overview: "Thor is imprisoned on the other side of the universe and finds himself in a race against time to get back to Asgard to stop Ragnarok, the destruction of his home-world and the end of Asgardian civilization, at the hands of a powerful new threat, the ruthless Hela.",
  		background: "https://www.themoviedb.org/t/p/original/5wNUJs23rT5rTBacNyf5h83AynM.jpg"
  	},
  	{
  		title: "Spider-Man: Homecoming",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
  		background: "https://www.themoviedb.org/t/p/original/8DgO1Vztm6xHEhYs0hKIwHKGWEH.jpg",
  		overview: "Following the events of Captain America: Civil War, Peter Parker, with the help of his mentor Tony Stark, tries to balance his life as an ordinary high school student in Queens, New York City, with fighting crime as his superhero alter ego Spider-Man as a new threat, the Vulture, emerges."
  	},
  	{
  		title: "Guardians of the Galaxy Vol. 2",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/tM894AtE7UQTJEoQG6qF6mdfSUT.jpg",
  		background: "https://www.themoviedb.org/t/p/original/lq7ElVcxFIFswModpvcLDgH9M8x.jpg",
  		overview: "The Guardians must fight to keep their newfound family together as they unravel the mysteries of Peter Quill's true parentage."
  	},
  	{
  		title: "Logan",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
  		background: "https://www.themoviedb.org/t/p/original/4x4BLaX5WgKVf7VLuNEOIkEKCIR.jpg",
  		overview: "In the near future, a weary Logan cares for an ailing Professor X in a hideout on the Mexican border. But Logan's attempts to hide from the world and his legacy are upended when a young mutant arrives, pursued by dark forces."
  	},
  	{
  		title: "Doctor Strange",
  		background: "https://www.themoviedb.org/t/p/original/5ZuctJh5uX5L2dz1CjA7WsTJwZk.jpg",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/aL53oMdZKZRJRH8txH07DLuleF9.jpg",
  		overview: "After his career is destroyed, a brilliant but arrogant surgeon gets a new lease on life when a sorcerer takes him under her wing and trains him to defend the world against evil."
  	},
  	{
  		title: "X-Men: Apocalypse",
  		background: "https://www.themoviedb.org/t/p/original/A9fpAjZLqsODM96aI6kx147LPM9.jpg",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/2ex2beZ4ssMeOduLD0ILzXKCiep.jpg",
  		overview: "After the re-emergence of the world's first mutant, world-destroyer Apocalypse, the X-Men must unite to defeat his extinction level plan."
  	},
  	{
  		title: "Deadpool",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/en971MEXui9diirXlogOrPKmsEn.jpg",
  		background: "https://www.themoviedb.org/t/p/original/jNUYL4RroNF1KRGilpVqCSujWSf.jpg",
  		overview: "Deadpool tells the origin story of former Special Forces operative turned mercenary Wade Wilson, who after being subjected to a rogue experiment that leaves him with accelerated healing powers, adopts the alter ego Deadpool. Armed with his new abilities and a dark, twisted sense of humor, Deadpool hunts down the man who nearly destroyed his life."
  	},
  	{
  		title: "Fantastic Four",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/gzhVcfC5j0sTnS4WJzBrCS0Vkr0.jpg",
  		background: "https://www.themoviedb.org/t/p/original/3JFe9AWoKuQWox7HO8HKgYRMOF7.jpg",
  		overview: "Four young outsiders teleport to a dangerous universe, which alters their physical form in shocking ways. Their lives irrevocably upended, the team must learn to harness their daunting new abilities and work together to save Earth from a former friend turned enemy."
  	},
  	{
  		title: "Ant-Man",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/7AyEEZVtFjNMCOEoz88pBqiAI8n.jpg",
  		background: "https://www.themoviedb.org/t/p/original/7AyEEZVtFjNMCOEoz88pBqiAI8n.jpg",
  		overview: "Armed with the astonishing ability to shrink in scale but increase in strength, master thief Scott Lang must embrace his inner-hero and help his mentor, Doctor Hank Pym, protect the secret behind his spectacular Ant-Man suit from a new generation of towering threats. Against seemingly insurmountable obstacles, Pym and Lang must plan and pull off a heist that will save the world."
  	},
  	{
  		title: "Thor: Ragnarok",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
  		overview: "Thor is imprisoned on the other side of the universe and finds himself in a race against time to get back to Asgard to stop Ragnarok, the destruction of his home-world and the end of Asgardian civilization, at the hands of a powerful new threat, the ruthless Hela.",
  		background: "https://www.themoviedb.org/t/p/original/5wNUJs23rT5rTBacNyf5h83AynM.jpg"
  	},
  	{
  		title: "Spider-Man: Homecoming",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
  		background: "https://www.themoviedb.org/t/p/original/8DgO1Vztm6xHEhYs0hKIwHKGWEH.jpg",
  		overview: "Following the events of Captain America: Civil War, Peter Parker, with the help of his mentor Tony Stark, tries to balance his life as an ordinary high school student in Queens, New York City, with fighting crime as his superhero alter ego Spider-Man as a new threat, the Vulture, emerges."
  	},
  	{
  		title: "Guardians of the Galaxy Vol. 2",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/tM894AtE7UQTJEoQG6qF6mdfSUT.jpg",
  		background: "https://www.themoviedb.org/t/p/original/lq7ElVcxFIFswModpvcLDgH9M8x.jpg",
  		overview: "The Guardians must fight to keep their newfound family together as they unravel the mysteries of Peter Quill's true parentage."
  	},
  	{
  		title: "Logan",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
  		background: "https://www.themoviedb.org/t/p/original/4x4BLaX5WgKVf7VLuNEOIkEKCIR.jpg",
  		overview: "In the near future, a weary Logan cares for an ailing Professor X in a hideout on the Mexican border. But Logan's attempts to hide from the world and his legacy are upended when a young mutant arrives, pursued by dark forces."
  	},
  	{
  		title: "Doctor Strange",
  		background: "https://www.themoviedb.org/t/p/original/5ZuctJh5uX5L2dz1CjA7WsTJwZk.jpg",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/aL53oMdZKZRJRH8txH07DLuleF9.jpg",
  		overview: "After his career is destroyed, a brilliant but arrogant surgeon gets a new lease on life when a sorcerer takes him under her wing and trains him to defend the world against evil."
  	},
  	{
  		title: "X-Men: Apocalypse",
  		background: "https://www.themoviedb.org/t/p/original/A9fpAjZLqsODM96aI6kx147LPM9.jpg",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/2ex2beZ4ssMeOduLD0ILzXKCiep.jpg",
  		overview: "After the re-emergence of the world's first mutant, world-destroyer Apocalypse, the X-Men must unite to defeat his extinction level plan."
  	},
  	{
  		title: "Captain America: Civil War",
  		background: "https://www.themoviedb.org/t/p/original/kvRT3GwcnqGHzPjXIVrVPhUix7Z.jpg",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/kvRT3GwcnqGHzPjXIVrVPhUix7Z.jpg",
  		overview: "Following the events of Age of Ultron, the collective governments of the world pass an act designed to regulate all superhuman activity. This polarizes opinion amongst the Avengers, causing two factions to side with Iron Man or Captain America, which causes an epic battle between former allies."
  	},
  	{
  		title: "Deadpool",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/en971MEXui9diirXlogOrPKmsEn.jpg",
  		background: "https://www.themoviedb.org/t/p/original/jNUYL4RroNF1KRGilpVqCSujWSf.jpg",
  		overview: "Deadpool tells the origin story of former Special Forces operative turned mercenary Wade Wilson, who after being subjected to a rogue experiment that leaves him with accelerated healing powers, adopts the alter ego Deadpool. Armed with his new abilities and a dark, twisted sense of humor, Deadpool hunts down the man who nearly destroyed his life."
  	},
  	{
  		title: "Fantastic Four",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/gzhVcfC5j0sTnS4WJzBrCS0Vkr0.jpg",
  		background: "https://www.themoviedb.org/t/p/original/3JFe9AWoKuQWox7HO8HKgYRMOF7.jpg",
  		overview: "Four young outsiders teleport to a dangerous universe, which alters their physical form in shocking ways. Their lives irrevocably upended, the team must learn to harness their daunting new abilities and work together to save Earth from a former friend turned enemy."
  	},
  	{
  		title: "Ant-Man",
  		poster_path: "https://www.themoviedb.org/t/p/w220_and_h330_face/7AyEEZVtFjNMCOEoz88pBqiAI8n.jpg",
  		background: "https://www.themoviedb.org/t/p/original/7AyEEZVtFjNMCOEoz88pBqiAI8n.jpg",
  		overview: "Armed with the astonishing ability to shrink in scale but increase in strength, master thief Scott Lang must embrace his inner-hero and help his mentor, Doctor Hank Pym, protect the secret behind his spectacular Ant-Man suit from a new generation of towering threats. Against seemingly insurmountable obstacles, Pym and Lang must plan and pull off a heist that will save the world."
  	}
  ];

  class Item extends Lightning.Component {
    static _template() {
      return {
        alpha: 0.7,
        text: {
          text: "",
          fontFace: "pixel",
          fontSize: 30
        }
      };
    }
    set label(v) {
      this.text.text = v;
    }
    _focus() {
      this.alpha = 1;
      // this.tag("Label").children[0].textColor = 0xffffffff;
    }

    _unfocus() {
      this.alpha = 0.7;
      // this.tag("Label").children[0].textColor = 0xff000000;
    }
    // set action(v) {
    //   this._action = v;
    // }

    // get action() {
    //   return this._action;
    // }
  }

  class RecentList extends Lightning.Component {
    static _template() {
      return {
        Items: {
          x: 0
        }
      };
    }
    _init() {
      // create animation

      // start the animation

      // current focused menu index
      this._index = 0;
    }
    set items(v) {
      // create children by handing over an array of
      // object to the objectList
      this.tag("Items").children = v.map((el, idx) => {
        return {
          type: Item,
          label: el.label,
          y: idx * 45
        };
      });
    }
    get items() {
      return this.tag("Items").children;
    }
    get activeItem() {
      return this.items[this._index];
    }
    _getFocused() {
      return this.items[this._index];
    }
    _handleUp() {
      if (this._index == 0) {
        this.fireAncestors("$changeMessage", 1);
      } else {
        this._setIndex(Math.max(0, --this._index));
      }
    }
    _handleDown() {
      console.log("fbsehbvksebvesbjvjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
      this._setIndex(Math.min(++this._index, this.items.length - 1));
    }
    _setIndex(idx) {
      console.log(idx);
      // since it's a one time transition we use smooth
      // store new index
      this._index = idx;
    }
  }

  class Search extends Lightning.Component {
    constructor() {
      super(...arguments);
      _defineProperty(this, "getFilmsFromAPI", callback => {
        this.films = series;
        callback(series);
      });
      _defineProperty(this, "getSearch", callback => {
        this.searchResult = fallbackCachedFilms;
        callback(fallbackCachedFilms);
      });
      _defineProperty(this, "films", []);
      _defineProperty(this, "searchResult", []);
      _defineProperty(this, "focusKeyboard", true);
      _defineProperty(this, "focusList", false);
      _defineProperty(this, "focusSearchList", false);
      _defineProperty(this, "focusSearchHistory", false);
      _defineProperty(this, "searchText", "");
    }
    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          colorBottom: 0xff000000,
          scale: 1.2,
          src: Utils.asset("images/background.png"),
          transitions: {
            scale: {
              duration: 1,
              timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'
            }
          },
          visible: true
        },
        Logo: {
          x: 20,
          y: 10,
          w: 70,
          h: 70,
          src: Utils.asset("./images/logo.png")
        },
        Keyboard: {
          rect: true,
          x: 250,
          y: 142,
          w: 625,
          h: 320,
          color: 0x00d2d2d2,
          Keys: {
            type: KeyList,
            y: 20,
            x: 20,
            mount: 0.5
          }
        },
        RecentLists: {
          x: 280,
          y: 740,
          type: RecentList,
          items: []
        },
        HistoryText: {
          x: 280,
          y: 690,
          text: {
            text: "Recent searches",
            fontSize: 40,
            FontFace: "Bold",
            textColor: 0xffffffff
          }
        },
        Text: {
          x: 740,
          y: 125,
          text: {
            text: "Today's top searches",
            fontSize: 40,
            FontFace: "Bold",
            textColor: 0xffffffff
          }
        },
        SearchText: {
          x: 740,
          y: 75,
          text: {
            text: "",
            fontSize: 30,
            FontFace: "Bold",
            textColor: 0xffffffff
          }
        },
        List: {
          type: MovieList,
          x: 750,
          y: 200,
          flex: {
            direction: "row",
            padding: 0,
            wrap: true
          },
          w: 1200
        },
        SearchList: {
          type: MovieList,
          x: 750,
          y: 150,
          flex: {
            direction: "row",
            padding: 0,
            wrap: true
          },
          w: 1200,
          alpha: 0
        },
        Menu: {
          x: 20,
          y: 80,
          visible: true,
          type: ui.List,
          spacing: 30,
          direction: "column"
        }
        // InputField: {
        //   rect: true,
        //   x: 400,
        //   y: 380,
        //   w: 1130,
        //   h: 75,
        //   color: 0xffd2d2d2,
        // },
        // Text: {
        //   mount: 0.5,
        //   x: 960,
        //   y: 420,
        //   text: {
        //     text: "Enter your text please",
        //     fontFace: "Regular",
        //     fontSize: 44,
        //     textColor: 0xffffffff,
        //   },
        // },
      };
    }

    _active() {}
    _init() {
      this.recent = [{
        label: "Champions Leauge"
      }];
      this.tag("RecentLists").patch({
        items: this.recent.slice(Math.max(this.recent.length - 5, 0))
      });
      this.tag("Keys").items = [{
        label: "Space",
        x: 0,
        y: 0
      }, {
        label: "⌫",
        x: 3,
        y: 0
      }, {
        label: "A",
        x: 0,
        y: 1
      }, {
        label: "B",
        x: 1,
        y: 1
      }, {
        label: "C",
        x: 2,
        y: 1
      }, {
        label: "D",
        x: 3,
        y: 1
      }, {
        label: "E",
        x: 4,
        y: 1
      }, {
        label: "F",
        x: 5,
        y: 1
      }, {
        label: "G",
        x: 0,
        y: 2
      }, {
        label: "H",
        x: 1,
        y: 2
      }, {
        label: "I",
        x: 2,
        y: 2
      }, {
        label: "J",
        x: 3,
        y: 2
      }, {
        label: "K",
        x: 4,
        y: 2
      }, {
        label: "L",
        x: 5,
        y: 2
      }, {
        label: "M",
        x: 0,
        y: 3
      }, {
        label: "N",
        x: 1,
        y: 3
      }, {
        label: "O",
        x: 2,
        y: 3
      }, {
        label: "P",
        x: 3,
        y: 3
      }, {
        label: "Q",
        x: 4,
        y: 3
      }, {
        label: "R",
        x: 5,
        y: 3
      }, {
        label: "S",
        x: 0,
        y: 4
      }, {
        label: "T",
        x: 1,
        y: 4
      }, {
        label: "U",
        x: 2,
        y: 4
      }, {
        label: "V",
        x: 3,
        y: 4
      }, {
        label: "W",
        x: 4,
        y: 4
      }, {
        label: "X",
        x: 5,
        y: 4
      }, {
        label: "Y",
        x: 0,
        y: 5
      }, {
        label: "Z",
        x: 1,
        y: 5
      }, {
        label: "0",
        x: 2,
        y: 5
      },
      // { label: "↲", x: 5, y: 4 },
      {
        label: "1",
        x: 3,
        y: 5
      }, {
        label: "2",
        x: 4,
        y: 5
      }, {
        label: "3",
        x: 5,
        y: 5
      }, {
        label: "4",
        x: 0,
        y: 6
      }, {
        label: "5",
        x: 1,
        y: 6
      }, {
        label: "6",
        x: 2,
        y: 6
      }, {
        label: "7",
        x: 3,
        y: 6
      }, {
        label: "8",
        x: 4,
        y: 6
      }, {
        label: "9",
        x: 5,
        y: 6
      }];
      this.tag("Menu").items = [
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 		displayColor: 0xffffffff,
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "home",
          lbl: "main",
          displayColor: 0xffffffff
        }
      },
      // {
      // 	type: MenuItem,
      // 	item: {
      // 		path: "profile",
      // 	},
      // },
      {
        type: MenuItemDIY$1,
        item: {
          path: "Movies",
          lbl: "movies",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "TV",
          lbl: "tv",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Search",
          lbl: "search",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "MyList",
          lbl: "wishlist",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Sports",
          lbl: "sports",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Premium",
          lbl: "premium",
          displayColor: 0xffffffff
        }
      }, {
        type: MenuItemDIY$1,
        item: {
          path: "Settings",
          lbl: "settings",
          displayColor: 0xffffffff
        }
      }];
      // console.log(this.getFilmsFromAPI);
      // this.getFilmsFromAPI();
      this.getFilmsFromAPI(data => {
        this.tag("List").items = data.map(result => {
          let label = result.title;
          return {
            label: label,
            // genres: result.genres,
            src: result.poster_path,
            // itemType: result.type,
            // itemId: result.id,
            backdrop: result.background
            // average: result.vote_average,
          };
        });
      });

      this.getSearch(data => {
        this.tag("SearchList").items = data.slice(0, 12).map(result => {
          let label = result.title;
          return {
            label: label,
            // genres: result.genres,
            src: result.poster_path
            // itemType: result.type,
            // itemId: result.id,
            //   backdrop: result.background,
            // average: result.vote_average,
          };
        });
      });
    }

    $changeMessage(signal) {
      console.log("signal == " + signal);
      switch (signal) {
        case 0:
          this.focusList = true;
          this.focusKeyboard = false;
          this.focusSearchList = false;
          this.focusSearchHistory = false;
          break;
        case 1:
          this.focusKeyboard = true;
          this.focusList = false;
          this.focusSearchList = false;
          this.focusSearchHistory = false;
          break;
        case 2:
          // if (this.searchText.length >= 3) {
          this.focusList = false;
          this.focusKeyboard = false;
          this.focusSearchList = true;
          this.focusSearchHistory = false;
          break;
        case 3:
          // if (this.searchText.length >= 3) {
          this.focusList = false;
          this.focusKeyboard = false;
          this.focusSearchList = false;
          this.focusSearchHistory = true;

          // }
          break;
        default:
          this.focusKeyboard = true;
        // code block
      }
    }

    $changeText(message) {
      this.searchText = message;
      if (message.length >= 3) {
        this.tag("List").y = 680;
        this.tag("Text").y = 620;
        this.tag("SearchList").alpha = 1;
      } else {
        this.tag("List").y = 200;
        this.tag("Text").y = 125;
        this.tag("SearchList").alpha = 0;
      }
      this.tag("SearchText").patch({
        text: {
          text: message
        }
      });
    }
    $addSearch(message) {
      const checkUsername = obj => obj.label == message;
      if (this.recent.some(checkUsername)) {
        console.log("dubbb");
      } else {
        this.recent.unshift({
          label: message
        });
      }
      this.recent.forEach(function (entry) {
        console.log(entry);
      });
      this.tag("RecentLists").patch({
        items: this.recent.slice(0, 5)
      });
    }
    _getFocused() {
      this._setState("Menu");
      // console.log("focuskey" + this.focusKeyboard);
      // console.log("focuslist" + this.focusList);
      // console.log("focussearch" + this.focusSearchList);
      // console.log("focussearchhistory" + this.focusSearchHistory);
      // if (this.focusKeyboard) {
      //   console.log("lofeufbasjbf");
      //   return this.tag("Keys");
      // }
      // if (this.focusList) {
      //   return this.tag("List");
      // }
      // if (this.focusSearchList) {
      //   return this.tag("SearchList");
      // }
      // if (this.focusSearchHistory) {
      //   console.log("holllladdddddddddddddaaa");
      //   return this.tag("RecentLists");
      // }
    }

    static _states() {
      return [class Menu extends this {
        _getFocused() {
          this.tag("Menu").visible = true;
          return this.tag("Menu");
        }
        _handleRight() {
          this._setState("Keyboard");
        }
        _handleLeft() {
          this.tag("Menu").visible = false;
          Router.focusWidget("Menu");
        }
      }, class Keyboard extends this {
        _getFocused() {
          if (this.focusKeyboard) {
            console.log("lofeufbasjbf");
            return this.tag("Keys");
          }
          if (this.focusList) {
            return this.tag("List");
          }
          if (this.focusSearchList) {
            return this.tag("SearchList");
          }
          if (this.focusSearchHistory) {
            console.log("holllladdddddddddddddaaa");
            return this.tag("RecentLists");
          }
          // return this.tag("Keys");
        }

        _handleBack() {
          this._setState("Menu");
        }
      }];
    }
  }

  // import { Tv } from "./models";

  var routes = {
    root: "splash",
    routes: [{
      path: "splash",
      component: Splash
    }, {
      path: "profile",
      component: Profile
    }, {
      path: "editprofile",
      component: EditProfile
    }, {
      path: "settings",
      component: Settings$1
    }, {
      path: "changeavatar",
      component: ChangeAvatar
    }, {
      path: "parentalControl",
      component: Parental
    }, {
      path: "varifypin",
      component: VarifyPin
    }, {
      path: "wishlist",
      component: WishList,
      before: async page => {
        const main = await getPremium();
        page.main = main;
      },
      widgets: ["Menu"]
    }, {
      path: "main",
      component: Main,
      before: async page => {
        const main = await getMovies();
        const Popular = await getPremium1();
        const Popular1 = await getPremium();
        page.main = main;
        page.popular = Popular;
        page.Popular1 = Popular1;
      },
      widgets: ["Menu"]
    }, {
      path: "movies",
      component: Movies,
      before: async page => {
        const main = await getPremium1();
        page.main = main;
      },
      widgets: ["Menu"]
    }, {
      path: "sports",
      component: Sports,
      // before: async (page) => {
      //   const main = await getMovies();
      //   page.main = main;
      // },
      widgets: ["Menu"]
    }, {
      path: "tv",
      component: Tv$1,
      before: async page => {
        const main = await getTv();
        page.main = main;
      },
      widgets: ["Menu"]
    }, {
      path: "details/:itemType/:itemId",
      component: Details$2,
      before: async (page, _ref) => {
        let {
          itemType,
          itemId
        } = _ref;
        const details = await getDetails(itemType, itemId);
        // const main1 = await getPremium1();
        // page.main1 = main1;
        page.details = details;
      }
    }, {
      path: "detailsmovie/:itemType/:itemId",
      component: DetailsMovie,
      before: async (page, _ref2) => {
        let {
          itemType,
          itemId
        } = _ref2;
        const details = await getDetails(itemType, itemId);
        const main1 = await getPremium1();
        page.main1 = main1;
        page.details = details;
      }
    }, {
      path: "tvdetails/:itemType/:itemId",
      component: Details$1,
      before: async (page, _ref3) => {
        let {
          itemType,
          itemId
        } = _ref3;
        const details = await getDetails(itemType, itemId);
        page.details = details;
      }
    }, {
      path: "premium",
      component: Premium,
      before: async page => {
        const main = await getPremium();
        page.main = main;
      },
      widgets: ["Menu"]
    }, {
      path: "search",
      component: Search,
      widgets: ["Menu"]
    }, {
      path: "simple",
      component: Simple,
      widgets: ["Menu", "PlayerMenu", "SubtitleMenu", "SettingsMenu"]
    }]
  };

  class MenuItem extends Lightning.Component {
    static _template() {
      return {
        h: 100,
        alpha: 0.5,
        // Profile: {
        // 	x: 1830,
        // 	y: 30,
        // 	w: 60,
        // 	h: 60,
        // 	src: Utils.asset("./images/profile.png"),
        // },
        Label: {
          mountY: 0.5,
          y: 50,
          text: {
            fontFace: "Regular",
            fontSize: 35
          }
        }
      };
    }
    set label(v) {
      this.tag("Label").text = v;
    }
    set pageId(v) {
      this._pageId = v;
    }
    get pageId() {
      return this._pageId;
    }
    _focus() {
      this.alpha = 1;
    }
    _unfocus() {
      this.alpha = 0.5;
    }
  }

  class Menu extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 500,
        h: 1920,
        color: 0xff212121,
        x: -550,
        alpha: 0.9,
        transitions: {
          x: {
            duration: 0.3,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)"
          },
          w: {
            duration: 0.3,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)"
          }
        },
        Logo: {
          x: 113,
          y: 23,
          w: 100,
          h: 100,
          src: Utils.asset("./images/logo.png")
        },
        Items: {
          y: 550,
          mountY: 0.5,
          flex: {
            direction: "column"
          },
          Home: {
            x: 200,
            type: MenuItem,
            label: "Home",
            pageId: "main",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/home.png")
            }
          },
          Movies: {
            x: 200,
            type: MenuItem,
            label: "Movies",
            pageId: "movies",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/movies.png")
            }
          },
          TV_Shows: {
            x: 200,
            type: MenuItem,
            label: "TV Shows",
            pageId: "tv",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/tv.png")
            }
          },
          Search: {
            x: 200,
            type: MenuItem,
            label: "Search",
            pageId: "search",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/search.png")
            }
          },
          Sports: {
            x: 200,
            type: MenuItem,
            label: "Sports",
            pageId: "sports",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/sports.png")
            }
          },
          Mylist: {
            x: 200,
            type: MenuItem,
            label: "My List",
            pageId: "wishlist",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/mylist.png")
            }
          },
          Membership: {
            x: 200,
            type: MenuItem,
            label: "Premium",
            pageId: "premium",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/premium.png")
            }
          },
          Settings: {
            x: 200,
            type: MenuItem,
            label: "Settings",
            pageId: "settings",
            SRC: {
              x: -80,
              y: 15,
              w: 50,
              h: 50,
              src: Utils.asset("./images/menu/settings.png")
            }
          }
        }
      };
    }
    _init() {
      this._index = 0;
    }
    _focus() {
      this.patch({
        smooth: {
          x: -100
        }
      });
      this.application.emit("blurContent", {
        amount: 3,
        scale: 1.2
      });
    }
    _unfocus() {
      this.patch({
        smooth: {
          x: -550
        }
      });
      this.application.emit("blurContent", {
        amount: 0,
        scale: 1
      });
    }
    _handleUp() {
      if (this._index > 0) {
        this._index--;
      }
    }
    _handleDown() {
      if (this._index < this.tag("Items").children.length - 1) {
        this._index++;
      }
    }
    _handleRight() {
      Router.focusPage();
    }
    _handleEnter() {
      Router.restoreFocus();
      Router.navigate(this.activeItem.pageId);
    }
    get activeItem() {
      return this.tag("Items").children[this._index];
    }
    _getFocused() {
      return this.activeItem;
    }
  }

  class SubtitleItems extends Lightning.Component {
    static _template() {
      return {
        h: 100,
        alpha: 0.5
        // Label: {
        //   mountY: 0.5,
        //   y: 50,
        //   text: { fontFace: "Regular", fontSize: 64 },
        // },
      };
    }

    // set label(v) {
    //   this.tag("Label").text = v;
    // }

    // set pageId(v) {
    //   this._pageId = v;
    // }

    // get pageId() {
    //   return this._pageId;
    // }

    _focus() {
      this.alpha = 1;
    }
    _unfocus() {
      this.alpha = 0.5;
    }
  }

  class SubtitleMenu extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 500,
        h: 1920,
        color: 0xff212121,
        alpha: 0.8,
        x: 1920,
        transitions: {
          x: {
            duration: 0.3,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)"
          },
          w: {
            duration: 0.3,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)"
          }
        },
        SubItems: {
          color: 0xffffffff,
          y: 300,
          flex: {
            direction: "column"
          },
          On: {
            x: 125,
            type: SubtitleItems,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              textColor: 0xffffffff,
              text: "On"
            },
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          },
          Off: {
            x: 125,
            type: SubtitleItems,
            // mountY: 0.5,
            //y: 50,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              text: "Off"
            },
            pageId: "Off",
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          },
          English: {
            x: 125,
            y: 150,
            type: SubtitleItems,
            // mountY: 0.5,
            //y: 50,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              text: "English"
            },
            pageId: "Off",
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          },
          Hindi: {
            x: 125,
            y: 150,
            type: SubtitleItems,
            // mountY: 0.5,
            //y: 50,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              text: "Hindi"
            },
            pageId: "Off",
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          }
        },
        Subtitles: {
          x: 100,
          y: 180,
          text: {
            fontFace: "Regular",
            fontSize: 50,
            text: "Subtitles"
          }
        },
        Audio: {
          x: 100,
          y: 550,
          text: {
            fontFace: "Regular",
            fontSize: 50,
            text: "Audio"
          }
        }
      };
    }
    _init() {
      this._indexS = 0;
    }
    _focus() {
      this.patch({
        smooth: {
          x: 1420
        }
      });

      //this.application.emit("blurContent", { amount: 3, scale: 1.2 });
    }

    _unfocus() {
      this.patch({
        smooth: {
          x: 1920
        }
      });

      //this.application.emit("blurContent", { amount: 0, scale: 1 });
    }

    _handleUp() {
      if (this._indexS > 0) {
        this._indexS--;
      }
      //console.log("Acive ", this.activeSubItem);
    }

    _handleDown() {
      if (this._indexS < this.tag("SubItems").children.length - 1) {
        this._indexS++;
      }
    }
    _handleRight() {
      Router.focusPage();
    }
    _handleEnter() {
      if (this._indexS == 0) {
        this.tag("SubItems").children[0].children[0].visible = true;
        this.tag("SubItems").children[1].children[0].visible = false;
        // this.tag("SubItems").children[2].children[0].visible = false;
        // this.tag("SubItems").children[3].children[0].visible = false;
      } else if (this._indexS == 1) {
        this.tag("SubItems").children[0].children[0].visible = false;
        this.tag("SubItems").children[1].children[0].visible = true;
        this.tag("SubItems").children[2].children[0].visible = false;
        this.tag("SubItems").children[3].children[0].visible = false;
      } else if (this._indexS == 2 && this.tag("SubItems").children[0].children[0].visible == true) {
        // this.tag("SubItems").children[0].children[0].visible = false;
        // this.tag("SubItems").children[1].children[0].visible = false;
        this.tag("SubItems").children[2].children[0].visible = true;
        this.tag("SubItems").children[3].children[0].visible = false;
      } else if (this._indexS == 3 && this.tag("SubItems").children[0].children[0].visible == true) {
        // this.tag("SubItems").children[0].children[0].visible = false;
        // this.tag("SubItems").children[1].children[0].visible = false;
        this.tag("SubItems").children[2].children[0].visible = false;
        this.tag("SubItems").children[3].children[0].visible = true;
      }
      Router.focusPage();
      // Router.navigate(this.activeSubItem.pageId);
    }

    get activeSubItem() {
      return this.tag("SubItems").children[this._indexS];
    }
    _getFocused() {
      return this.activeSubItem;
    }
  }

  class PlayerMenu extends Lightning.Component {
    static _template() {
      return {
        // rect: true,
        // w: 1920,
        // h: 500,
        // color: 0xff212121,
        // alpha: 1,
        y: -500,
        transitions: {
          y: {
            duration: 0.7,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)"
          },
          h: {
            duration: 0.7,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)"
          }
        },
        Items: {
          // mountY: 0.5,

          flex: {
            direction: "row"
          },
          Back: {
            x: 100,
            y: 200,
            type: MenuItem$2,
            w: 50,
            h: 50,
            src: Utils.asset("./icons/back.png")
          },
          Replay: {
            x: 200,
            y: 200,
            type: MenuItem$2,
            w: 55,
            h: 55,
            src: Utils.asset("./icons/replay.png")
          },
          Subtitles: {
            x: 1450,
            y: 180,
            type: MenuItem$2,
            w: 80,
            h: 80,
            src: Utils.asset("./icons/subtitle.png")
          },
          Settings: {
            x: 1550,
            y: 195,
            type: MenuItem$2,
            w: 50,
            h: 50,
            src: Utils.asset("./icons/settings.png")
          }
        },
        BackText: {
          x: 233,
          y: 260,
          visible: false,
          text: {
            fontSize: 20,
            lineHeight: 30,
            text: "Play From\nBeginning"
          }
        },
        SubtitleText: {
          x: 1525,
          y: 260,
          visible: false,
          text: {
            fontSize: 20,
            lineHeight: 30,
            text: "Subtitle & Audio"
          }
        },
        SettingsText: {
          x: 1725,
          y: 260,
          visible: false,
          text: {
            fontSize: 20,
            lineHeight: 30,
            text: "Settings"
          }
        },
        Text: {
          x: 550,
          y: 150,
          visible: true,
          text: {
            textAlign: "center",
            text: "Money Hiest\nS5 E2 Do You Believe in Reincarnation?",
            lineHeight: 70
          }
        }
      };
    }
    _init() {
      this._index = 0;
    }
    _focus() {
      this.patch({
        smooth: {
          y: -100
        }
      });
    }
    _unfocus() {
      this.patch({
        smooth: {
          y: -500
        }
      });
    }
    _handleLeft() {
      if (this._index > 0) {
        this._index--;
      }
      if (this._index === 0) {
        this.tag("BackText").visible = false;
        this.tag("SubtitleText").visible = false;
        this.tag("SettingsText").visible = false;
      } else if (this._index == 1) {
        this.tag("BackText").visible = true;
        this.tag("SubtitleText").visible = false;
        this.tag("SettingsText").visible = false;
      } else if (this._index == 2) {
        this.tag("BackText").visible = false;
        this.tag("SubtitleText").visible = true;
        this.tag("SettingsText").visible = false;
      } else if (this._index == 3) {
        this.tag("BackText").visible = false;
        this.tag("SubtitleText").visible = false;
        this.tag("SettingsText").visible = true;
      }
    }
    _handleRight() {
      if (this._index < this.tag("Items").children.length - 1) {
        this._index++;
      }
      if (this._index === 0) {
        this.tag("BackText").visible = false;
        this.tag("SubtitleText").visible = false;
        this.tag("SettingsText").visible = false;
      } else if (this._index == 1) {
        this.tag("BackText").visible = true;
        this.tag("SubtitleText").visible = false;
        this.tag("SettingsText").visible = false;
      } else if (this._index == 2) {
        this.tag("BackText").visible = false;
        this.tag("SubtitleText").visible = true;
        this.tag("SettingsText").visible = false;
      } else if (this._index == 3) {
        this.tag("BackText").visible = false;
        this.tag("SubtitleText").visible = false;
        this.tag("SettingsText").visible = true;
      }
    }
    _handleDown() {
      Router.focusPage();
    }
    _handleEnter() {
      // Router.restoreFocus();
      if (this._index == 0) {
        Router.navigate("main");
      }
      if (this._index == 2) {
        Router.focusWidget("SubtitleMenu");
      } else if (this._index == 3) {
        Router.focusWidget("SettingsMenu");
      }
    }
    get activeItem() {
      return this.tag("Items").children[this._index];
    }
    _getFocused() {
      return this.activeItem;
    }
  }

  class Settings extends Lightning.Component {
    static _template() {
      return {
        h: 100,
        alpha: 0.5
        // Label: {
        //   mountY: 0.5,
        //   y: 50,
        //   text: { fontFace: "Regular", fontSize: 64 },
        // },
      };
    }

    // set label(v) {
    //   this.tag("Label").text = v;
    // }

    // set pageId(v) {
    //   this._pageId = v;
    // }

    // get pageId() {
    //   return this._pageId;
    // }

    _focus() {
      this.alpha = 1;
    }
    _unfocus() {
      this.alpha = 0.5;
    }
  }

  class SettingsMenu extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        w: 500,
        h: 1920,
        color: 0xff212121,
        alpha: 0.8,
        x: 1920,
        transitions: {
          x: {
            duration: 0.3,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)"
          },
          w: {
            duration: 0.3,
            timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)"
          }
        },
        SubItems: {
          color: 0xffffffff,
          y: 300,
          flex: {
            direction: "column"
          },
          Auto: {
            x: 130,
            type: Settings,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              textColor: 0xffffffff,
              text: "Auto"
            },
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          },
          High: {
            x: 130,
            type: Settings,
            // mountY: 0.5,
            //y: 50,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              text: "High"
            },
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            },
            pageId: "Off"
          },
          Good: {
            x: 130,
            type: Settings,
            // mountY: 0.5,
            //y: 50,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              text: "Good"
            },
            pageId: "Off",
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          },
          Data_Saver: {
            x: 130,
            type: Settings,
            // mountY: 0.5,
            //y: 50,
            text: {
              fontFace: "Regular",
              fontSize: 40,
              text: "Data Saver"
            },
            pageId: "Off",
            SRC: {
              x: -60,
              w: 50,
              h: 50,
              visible: false,
              src: Utils.asset("./icons/tick.png")
            }
          }
        },
        Subtitles: {
          x: 100,
          y: 180,
          text: {
            fontFace: "Regular",
            fontSize: 50,
            text: "Video Quality"
          }
        }
      };
    }
    _init() {
      this._indexS = 0;
    }
    _focus() {
      this.patch({
        smooth: {
          x: 1420
        }
      });

      //this.application.emit("blurContent", { amount: 3, scale: 1.2 });
    }

    _unfocus() {
      this.patch({
        smooth: {
          x: 1920
        }
      });

      //this.application.emit("blurContent", { amount: 0, scale: 1 });
    }

    _handleUp() {
      if (this._indexS > 0) {
        this._indexS--;
      }
      //console.log("Acive ", this.activeSubItem);
    }

    _handleDown() {
      if (this._indexS < this.tag("SubItems").children.length - 1) {
        this._indexS++;
      }
    }
    _handleRight() {
      Router.focusPage();
    }
    _handleEnter() {
      if (this._indexS == 0) {
        this.tag("SubItems").children[0].children[0].visible = true;
        this.tag("SubItems").children[1].children[0].visible = false;
        this.tag("SubItems").children[2].children[0].visible = false;
        this.tag("SubItems").children[3].children[0].visible = false;
      } else if (this._indexS == 1) {
        this.tag("SubItems").children[0].children[0].visible = false;
        this.tag("SubItems").children[1].children[0].visible = true;
        this.tag("SubItems").children[2].children[0].visible = false;
        this.tag("SubItems").children[3].children[0].visible = false;
      } else if (this._indexS == 2) {
        this.tag("SubItems").children[0].children[0].visible = false;
        this.tag("SubItems").children[1].children[0].visible = false;
        this.tag("SubItems").children[2].children[0].visible = true;
        this.tag("SubItems").children[3].children[0].visible = false;
      } else if (this._indexS == 3) {
        this.tag("SubItems").children[0].children[0].visible = false;
        this.tag("SubItems").children[1].children[0].visible = false;
        this.tag("SubItems").children[2].children[0].visible = false;
        this.tag("SubItems").children[3].children[0].visible = true;
      }
      Router.focusPage();
      // Router.navigate(this.activeSubItem.pageId);
    }

    get activeSubItem() {
      return this.tag("SubItems").children[this._indexS];
    }
    _getFocused() {
      return this.activeSubItem;
    }
  }

  class App extends Router.App {
    static getFonts() {
      return [{
        family: "Regular",
        url: Utils.asset("fonts/Roboto-Regular.ttf")
      }, {
        family: "Fresca",
        url: Utils.asset("fonts/Fresca-Regular.ttf")
      }, {
        family: "Londrina",
        url: Utils.asset("fonts/LondrinaSolid-Regular.ttf")
      }, {
        family: "SourceSansPro",
        url: Utils.asset("fonts/SourceSansPro-Regular.ttf")
      }];
    }
    _setup() {
      init(this.stage);
      Router.startRouter(routes, this);
    }
    static _template() {
      return {
        ...super._template(),
        Widgets: {
          // this hosts all the widgets
          Menu: {
            type: Menu
          },
          SubtitleMenu: {
            type: SubtitleMenu
          },
          SettingsMenu: {
            type: SettingsMenu
          }
        }
      };
    }
  }

  function index () {
    return Launch(App, ...arguments);
  }

  return index;

})(ui);
//# sourceMappingURL=appBundle.js.map
