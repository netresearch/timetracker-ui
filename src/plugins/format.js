/**
 * Left pad numbers with 0
 *
 * @param {Number} num
 * @param {Number} size
 * @param {String} char
 * @return {string}
 */
export function pad(num, size, char = '0') {
  let s = num + ''
  while (s.length < size) {
    s = char + s
  }
  return s
}

export function formatMinutes(minutes, showPlusSign) {
  const time = Math.abs(parseInt(minutes))
  const hour = Math.floor(time / 60)
  const minute = time - (hour * 60)
  return (showPlusSign && minutes > 0 ? '+' : (minutes < 0 ? '-' : '')) + pad(hour, 2) + ':' + pad(minute, 2)
}

// Vue 3 plugin (no longer uses filters, provides global properties)
export default {
  install(app) {
    app.config.globalProperties.$formatMinutes = formatMinutes
    app.config.globalProperties.$pad = pad
  }
}
