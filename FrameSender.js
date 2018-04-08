(function() {
  /**
   * iframeの子側のスクリプト
   * iframeのIDを受診した後、iframeのコンテンツ内の高さを送信する
   * @constructor
   */
  var FrameSender = function() {
    var self = this
    this._receiveHandler = function(e) {
      self.receive(e.data)
    }
    window.addEventListener('message', this._receiveHandler)
  }

  FrameSender.prototype = {
    /**
     * messageを受信したときの処理
     * @param data
     */
    receive: function(data) {
      var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined)
      if (typeof target != 'undefined' && document.body.offsetHeight) {
        target.postMessage({
          id: data.id,
          height: document.body.offsetHeight,
        }, '*')
      }
    },
    send: function() {
      if (!window.frameElement) return
      var id = window.frameElement.id
      if (!id) return
      this.receive({id: id})
    }
  }

  window.FrameSender =  new FrameSender()
})