import { Injectable } from "@angular/core";

import { StorageService } from "../../services";

/**
 * @ngdoc service
 * @name CacheService
 * @description
 * Provides a key-value store to cache data using localStorage to persist data.
 */
@Injectable()
export class CacheService {
    private cacheStoreKey: string = 'cache-store';
    private cacheStore: Object;

    constructor (private storageService: StorageService) {
        this.cacheStore = <Object>this.storageService.get(this.cacheStoreKey, {});

        if (!this.cacheStore) {
            this.cacheStore = this.storageService.set(this.cacheStoreKey, {});
        }
    }

    /**
     * @ngdoc method
     * @name CacheService#get
     * @description
     * Retrieve a value from the cache by key, optionally supplying a placeholder if missing.
     *
     * @param {string} key Used to retrieve the value with
     * @param {*=} placeholder Optional value to use if the key is not found
     * @returns {*} value found in cache, or placeholder if not found
     */
    get <T>(key: string, placeholder?: any, ctor?: { new(): T }):T {
        if (!this._keyValid(key)) return placeholder;

        if (!ctor) return this.cacheStore[key].value;

        const a = new ctor();
        Object.keys(a).forEach(p => a[p] = this.cacheStore[key].value[p]);

        return a;
    };

    /**
     * @ngdoc method
     * @name CacheService#set
     * @description
     * Set a value into the cache, optionally specifying an expiry time
     *
     * @param {string} key Name of key to save the value under
     * @param {*} value Value to save
     * @param {int=} expiry Number of seconds before the value should expire (default is never)
     * @returns {*} The value passed in
     */
    set <T>(key: string, value: T, expiry?: number) {
        this.cacheStore[key] = {
            value: value
        };
        if (expiry) {
            this.cacheStore[key].expiry = ((new Date()).getTime() / 1000 || 0) + expiry;
        }

        // Save latest version of cache in the LocalStorage
        this.cacheStore = this.storageService.set(this.cacheStoreKey, this.cacheStore);

        return value;
    };

    /**
     * @ngdoc method
     * @name CacheService#has
     * @description
     * Determines if a key has been set.
     *
     * @param {string} key to check
     * @returns {boolean} true if found, false if not found
     */
    has (key: string) {
        return this._keyValid(key);
    };

    /**
     * @ngdoc method
     * @name CacheService#delete
     * @description
     * Removes a key, if set.
     *
     * @param {string} key to delete
     */
    delete (key: string) {
        delete this.cacheStore[key];

        // Save latest version of cache in the LocalStorage
        this.cacheStore = this.storageService.set(this.cacheStoreKey, this.cacheStore);
    };

    /**
     * @ngdoc method
     * @name CacheService#clear
     * @description
     * Clears all keys currently set in the cache
     */
    clear () {
        this.cacheStore = {};

        // Save latest version of cache in the LocalStorage
        this.cacheStore = this.storageService.set(this.cacheStoreKey, this.cacheStore);
    };

     /**
     * @ngdoc method
     * @name CacheService#_keyValid
     * @description
     * Validates if there is any value stored in cache with that key and
     * if expired
     *
     * @returns {boolean} true if valid, false if not
     */
    private _keyValid (key:string): boolean {
        if (!this.cacheStore[key]) return false;

        return !this.cacheStore[key].expiry || this.cacheStore[key].expiry < ((new Date()).getTime() / 1000 || 0);
    }
}
