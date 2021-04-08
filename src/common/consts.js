const os = require('os')
const packageJson = require('../../package.json')

module.exports = Object.freeze({
  IS_MAC: os.platform() === 'darwin',
  IS_WIN: os.platform() === 'win32',
  VERSION: packageJson.version,
  GO_IPFS_VERSION: packageJson['go-ipfs']
    ? packageJson['go-ipfs'].version.slice(1)
    : packageJson.dependencies['go-ipfs-dep'],
  ELECTRON_VERSION: packageJson.dependencies.electron,
  COUNTLY_KEY: process.env.NODE_ENV === 'development'
    ? '6b00e04fa5370b1ce361d2f24a09c74254eee382'
    : '47fbb3db3426d2ae32b3b65fe40c564063d8b55d'
})
