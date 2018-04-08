(function() {
  /**
   * @constructor
   */
  const FrameReceiver = function(selector) {
    this.selector = selector || '.iframe-resize'

    this._receiveHandler = (e) => {
      this.receive(e.data)
    }

    this._resizeHandler = (e) => {
      this.send()
    }

    this._checkLoadHandler = (e) => {
      this.sendMessage(e.target)
    }

    window.addEventListener('message', this._receiveHandler)
    window.addEventListener('resize', this._resizeHandler)
    this.send()
  }

  FrameReceiver.prototype = {
    send() {
      console.log('parent:' ,this.selector)

      const iframes = document.querySelectorAll(this.selector)

      console.log('parent:' ,iframes)

      for (let i = 0, len = iframes.length; i < len; i++) {
        let iframe = iframes[i]

        console.log('parent:' ,iframe.id)

        this.sendMessage(iframe)
        if (iframe.id) {
          iframe.addEventListener('load', this._checkLoadHandler)
        }
      }
    },
    /**
     * @param iframe
     */
    sendMessage(iframe) {
      iframe.removeEventListener('load', this._checkLoadHandler)
      iframe.contentWindow.postMessage({
        id: iframe.id
      }, '*')
    },
    /**
     * @param data
     */
    receive(data) {
      console.log('parent:' ,data)

      if (!data.id || isNaN(data.height)) return
      const iframe = document.getElementById(data.id)
      iframe.style.height = `${data.height}px`
    }
  }

  window.FrameReceiver = new FrameReceiver()
})()