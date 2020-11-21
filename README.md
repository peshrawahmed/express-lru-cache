# express-lru-cache

[![NPM version](https://img.shields.io/npm/v/express-lru-cache.svg?style=flat)](https://www.npmjs.org/package/express-lru-cache)

[Express](http://expressjs.com/) middleware that serves as a stopgap for [Varnish](http://en.wikipedia.org/wiki/Varnish_%28software%29) – for times when you don't have time to set up Varnish or want something simpler.
**This package is a copy of [express-lru](https://www.npmjs.com/package/express-lru) with some extra abilities for getting and deleting single or mutliple keys**

A few notes:

- It will only cache `200`-status responses.
- Response headers (like `Content-Type`) will be cached and served like normal.
- Supports JSON, Buffers, and Strings.
- Has a "skip" option that allows for control of what requests bypass the cache. In most cases you’ll want to return `true` for logged in users.

### Example Usage

```js
const ExpressLruCache = require('express-lru-cache');
const app = express();
global.Cacher = new ExpressLruCache({
    max: 1000,
    ttl: 60000
}); // initialize the cacher right after initializing express app..

const cache = Cacher.middleware({
    skip: function(req) {
        return !!req.user;
    }
});

app.get('/myroute', cache, function(req, res, next) {
    if(i_have_to_purge_the_cache) Cacher.reset();
    if(i_have_to_purge_a_specific_cache) Cacher.del('/some-url');
});
```

### Options

```js
    {
        ttl: 1000 // TTL. Default 30000 .
        max: 1000 // maxAfge. Default 1000
    }
```

### Methods

##### middleware(options)
Returns an express middleware for the cache.

```js
// options
    {
        skip: function(req){
            return !!req.user // when to disable cache
        }
    }
```

##### set(key, value, maxAge)
Sets a new value to a cache.

##### get(key, cb)
Gets cached value for a key.

##### del(key)
Deletes a key and its value from the cache.

##### reset()
Purges all the cache.

##### keys()
Gets all the keys inside the store.

##### peek(key)
Works like **.get(key)** but does not update the "recently used"-ness of the key.

##### has(key)
Checks if a key exists.
___
**Your contribution to this package will be appreciated. Please create a pull request for any changes.**

## License

Copyright &copy; 2019 [Peshraw Ahmed](https://github.com/peshrawahmed) & [Contributors](https://github.com/naturalatlas/express-lru/graphs/contributors)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
