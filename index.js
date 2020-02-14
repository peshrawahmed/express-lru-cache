const AsyncCache = require('async-cache');

class ExpressLruCache {
    constructor(options = {}) {
        if (options && typeof options !== 'object')
            throw new Error('options expected to be an object');
        this.skip = options.skip || null;
        this.loader = new AsyncCache({
            max: options.max || 1000,
            maxAge: options.ttl || 30000,
            load: function() {}
        });
        this.hasher =
            options.hasher ||
            function(req) {
                return req.originalUrl;
            };
    }

    del(key) {
        return this.loader.del(key);
    }

    get(key, cb) {
        return this.loader.get(key, cb);
    }

    set(key, value, maxAge) {
        return this.loader.set(key, value, maxAge);
    }

    reset() {
        return this.loader.reset();
    }

    keys() {
        return this.loader.keys();
    }

    has(key) {
        return this.loader.has(key);
    }

    peek(key) {
        return this.loader.peek(key);
    }

    middleware(options = {}) {
        const _self = this;
        if (options && typeof options !== 'object')
            throw new Error('options expected to be an object');
        const skip = options.skip || this.skip;

        return function(req, res, next) {
            if (skip && skip(req)) {
                return next();
            }

            var original_send = res.send;
            _self.loader._load = function(key, callback) {
                res.send = function() {
                    var body = arguments[arguments.length - 1];
                    if (
                        body &&
                        (typeof body === 'object' || Array.isArray(body)) &&
                        !Buffer.isBuffer(body)
                    ) {
                        body = new Buffer(JSON.stringify(body), 'utf8');
                    }
                    // we skip caching by returning an "error" to async-cache)
                    var nocache = res.statusCode && res.statusCode !== 200;
                    callback(nocache, {
                        body: body,
                        headers: res._headers,
                        status: res.statusCode
                    });
                };
                next();
            };

            var key = _self.hasher(req);
            _self.get(key, function(nocache, data) {
                if (data.headers) res.set(data.headers);
                original_send.apply(res, [data.body]);
            });
        };
    }
}

module.exports = ExpressLruCache;
