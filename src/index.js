<<<<<<< HEAD
import 'v8-compile-cache'
import { app, dialog } from 'electron'
import fixPath from 'fix-path'
import { criticalErrorDialog } from './dialogs'
import logger from './common/logger'
import setupProtocolHandlers from './protocol-handlers'
import setupI18n from './i18n'
import setupNpmOnIpfs from './npm-on-ipfs'
import setupDaemon from './daemon'
import setupWebUI from './webui'
import setupAutoLaunch from './auto-launch'
import setupDownloadHash from './download-hash'
import setupTakeScreenshot from './take-screenshot'
import setupAppMenu from './app-menu'
import setupArgvFilesHandler from './argv-files-handler'
import setupAutoUpdater from './auto-updater'
import setupTray from './tray'
import setupIpfsOnPath from './ipfs-on-path'
import setupAnalytics from './analytics'
import setupSecondInstance from './second-instance'
import setupCohosting from './cohosting'
=======
require('v8-compile-cache')
const { app, dialog } = require('electron')
const fixPath = require('fix-path')
const { criticalErrorDialog } = require('./dialogs')
const logger = require('./common/logger')
const setupProtocolHandlers = require('./protocol-handlers')
const setupI18n = require('./i18n')
const setupNpmOnIpfs = require('./npm-on-ipfs')
const setupDaemon = require('./daemon')
const setupWebUI = require('./webui')
const setupAutoLaunch = require('./auto-launch')
const setupDownloadCid = require('./download-cid')
const setupTakeScreenshot = require('./take-screenshot')
const setupAppMenu = require('./app-menu')
const setupArgvFilesHandler = require('./argv-files-handler')
const setupAutoUpdater = require('./auto-updater')
const setupTray = require('./tray')
const setupIpfsOnPath = require('./ipfs-on-path')
const setupAnalytics = require('./analytics')
const setupSecondInstance = require('./second-instance')
>>>>>>> origin/dependabot/npm_and_yarn/electron-10.1.2

// Hide Dock
if (app.dock) app.dock.hide()

// Sets User Model Id so notifications work on Windows 10
app.setAppUserModelId('io.ipfs.desktop')

// Fixes $PATH on macOS
fixPath()

// Only one instance can run at a time
if (!app.requestSingleInstanceLock()) {
  process.exit(0)
}

const ctx = {}

app.on('will-finish-launching', () => {
  setupProtocolHandlers(ctx)
})

function handleError (err) {
  // Ignore network errors that might happen during the
  // execution.
  if (err.stack.includes('net::')) {
    return
  }

  logger.error(err)
  criticalErrorDialog(err)
}

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

async function run () {
  try {
    await app.whenReady()
  } catch (e) {
    dialog.showErrorBox('Electron could not start', e.stack)
    app.exit(1)
  }

  try {
    await setupAnalytics(ctx) // ctx.countlyDeviceId
    await setupI18n(ctx)
    await setupAppMenu(ctx)

    await setupWebUI(ctx) // ctx.webui, launchWebUI
    await setupTray(ctx) // ctx.tray
    await setupDaemon(ctx) // ctx.getIpfsd, startIpfs, stopIpfs, restartIpfs
    await setupAutoUpdater(ctx) // ctx.checkForUpdates

    await Promise.all([
      setupArgvFilesHandler(ctx),
      setupAutoLaunch(ctx),
      setupSecondInstance(ctx),
      setupCohosting(ctx),
      // Setup global shortcuts
      setupDownloadCid(ctx),
      setupTakeScreenshot(ctx),
      // Setup PATH-related features
      setupNpmOnIpfs(ctx),
      setupIpfsOnPath(ctx)
    ])
  } catch (e) {
    handleError(e)
  }
}

run()
