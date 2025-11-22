// Simple in-memory cache singleton for email -> user_id
class EmailToIdCache {
  constructor() {
    this.cache = new Map();
  }

  get(email) {
    return this.cache.get(email);
  }

  set(email, id) {
    this.cache.set(email, id);
  }

  has(email) {
    return this.cache.has(email);
  }
}

module.exports = new EmailToIdCache();
