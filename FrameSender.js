(function() {
  /**
   * @constructor
   */
  const FrameSender = function() {
    this._receiveHandler = (e) => {
      this.receive(e.data)
    }
    window.addEventListener('message', this._receiveHandler)
  }

  FrameSender.prototype = {
    /**
     * @param data
     */
    receive(data) {
      const target = parent.postMessage
        ? parent
        : (parent.document.postMessage)
          ? parent.document
          : undefined

      if (typeof target !== 'undefined' && document.body.offsetHeight) {
        target.postMessage({
          id: data.id,
          height: document.body.offsetHeight,
        }, '*')
      }
    },
  }

  window.FrameSender = new FrameSender()
})()