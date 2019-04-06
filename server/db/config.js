export default {
  mongo: 'mongodb://test:test12345@db.pup.pub:27017/wunderlist',
  redis: {
    get host() {
      return 'db.pup.pub'
    },
    get port() {
      return 6379
    }
  }
}
