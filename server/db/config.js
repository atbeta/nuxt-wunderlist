export default {
  mongo: 'mongodb://test:test12345@hk.pup.pub:27017/wunderlist',
  redis: {
    get host() {
      return 'hk.pup.pub'
    },
    get port() {
      return 6379
    }
  }
}
