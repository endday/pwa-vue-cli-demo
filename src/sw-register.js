// sw-register.js
const version = Number(__SW_VERSION__)
const project = __PROJECT_NAME__

function emitUpdate () {
  var event = document.createEvent('Event')
  event.initEvent('sw.update', true, true)
  window.dispatchEvent(event)
}

function emitUnregister () {
  var event = document.createEvent('Event')
  event.initEvent('sw.unregister', true, true)
  window.dispatchEvent(event)
}

function unregister () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration()
      .then(function (registration) {
        if (registration) {
          registration.unregister().then(function () {
            emitUnregister()
          })
        }
      })
  }
}

const failSwName = 'fail:' + project + '-sw-version'

function getFailVersion () {
  const version = window.localStorage.getItem(failSwName)
  if (version) {
    return Number(version)
  }
  return ''
}

function setFailVersion () {
  window.localStorage.setItem(failSwName, version)
}

if (getFailVersion() !== version && 'serviceWorker' in navigator) {
  // 如果是新的版本，那就尝试注册安装
  navigator.serviceWorker.register('/zhangyi/sw?version=' + version) // eslint-disable-line
    .then(function (reg) {
      if (reg.waiting) {
        emitUpdate()
        return
      }
      reg.onupdatefound = function () {
        var installingWorker = reg.installing
        installingWorker.onstatechange = function () {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              emitUpdate()
            }
          }
        }
      }
    })
    .catch(function (e) {
      console.error('Error during service worker registration:', e)
      // 注册失败后，在session中写入失败的版本，并直接卸载
      setFailVersion()
      unregister()
    })
} else {
  // 直接卸载
  unregister()
}
