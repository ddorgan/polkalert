import settings from '../settings'
import notifications from '../notifications'

let settingsListener: boolean = null
let blockReceivedLagNotificationDelay: number = null
let noBlocksReceivedNotificationDelay: number = null
let notificationTimeout: NodeJS.Timeout = null

//TODO: figure out how block time settings are changed on the network
//so we don't fire false positives if block time changes - start watcher and update as required

function init() {
  blockReceivedLagNotificationDelay =
    settings.get().blockReceivedLagNotificationDelay * 1000
  noBlocksReceivedNotificationDelay =
    settings.get().noBlocksReceivedNotificationDelay * 1000

  clearTimeout(notificationTimeout)
  startTimeout()

  if (!settingsListener) {
    settingsListener = settings.onChange(init)
  }
}

function getTimeoutMessage() {
  return (
    "node didn't receive blocks for " +
    noBlocksReceivedNotificationDelay / 1000 +
    ' seconds, check your connection.\n' +
    'If you think this message is false alarm,' +
    'check your settings'
  )
}

function getBlockTimeMessage(blockReceivedTimeDifference: number) {
  return (
    'node received block after' +
    blockReceivedTimeDifference +
    ' ms check your connection.\n' +
    'If you think this message is false alarm,' +
    'check your settings'
  )
}

function startTimeout() {
  notificationTimeout = setTimeout(() => {
    notifications.send('connection', getTimeoutMessage())

    console.log(getTimeoutMessage())
  }, noBlocksReceivedNotificationDelay)
}

function ping(timestamp: number) {
  const blockReceivedTimeDifference = Date.now() - timestamp
  if (blockReceivedTimeDifference > blockReceivedLagNotificationDelay) {
    notifications.send(
      'connection',
      getBlockTimeMessage(blockReceivedTimeDifference)
    )
    console.log(getBlockTimeMessage(blockReceivedTimeDifference))
  }

  clearTimeout(notificationTimeout)
  startTimeout()
}

export default {
  init,
  ping
}
