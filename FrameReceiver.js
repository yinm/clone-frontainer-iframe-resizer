(function() {
  /**
   * iframeの親側のスクリプト
   * iframeのIDを送信した後、iframeコンテンツ内の高さを受け取って反映する
   * @constructor
   */
  var FrameReceiver = function(selector) {
    this.selector = selector || '.iframe-resize'

    var self = this
    this._receiveHandler = function(e) {
      self.receive(e.data)
    }
    this._resizeHandler = function(e) {
      self.send()
    }
    this._checkLoadHandler = function(e) {
      self.sendMessage(e.target)
    }
    window.addEventListener('message', this._receiveHandler)
    window.addEventListener('resize', this._resizeHandler)
    this.send()
  }

  FrameReceiver.prototype = {
    /**
     * iframeに高さを求めるメッセージを送信
     */
    send: function() {
      var iframes = document.querySelectorAll(this.selector)
      for (var i = 0, len = iframes.length; i < len; i++) {
        var iframe = iframes[i]
        this.sendMessage(iframe)
        if (iframe.id) {
          iframe.addEventListener('load', this._checkLoadHandler)
        }
      }
    },
    /**
     * 引数に渡したiframeにmessageを送信する
     * @param iframe
     */
    sendMessage: function(iframe) {
      iframe.removeEventListener('load', this._checkLoadHandler)
      iframe.contentWindow.postMessage({
        id: iframe.id
      }, '*')
    },
    /**
     * iframeからメッセージが送信されてきたときの処理
     * @param data
     */
    receive: function(data) {
      if (!data.id || isNaN(data.height)) return
      var iframe = document.getElementById(data.id)
      iframe.style.height = data.height + 'px'
    }
  }

  window.FrameReceiver = new FrameReceiver()
})