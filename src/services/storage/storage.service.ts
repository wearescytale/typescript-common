import { Injectable } from "@angular/core";

import { StorageModel } from "../../models";

/**
 * @ngdoc service
 * @name Storage
 * @description
 * Provides a key-value store using localStorage to persist data.
 */
@Injectable()
export class StorageService {
    /**
     * @ngdoc method
     * @name Storage#get
     * @description
     * Retrieve a value from the storage by key,
     * optionally supplying a placeholder if missing.
     *
     * @param {string} key Used to retrieve the value with
     * @param {*=} placeholder Optional value to use if the key is not found
     * @returns {*} value found in storage, or placeholder if not found
     * @throws if the key is not found, and a placeholder is not given
     */
    get <T>(key: string, placeholder?: T): T {
        if (localStorage[key] !== undefined) {
            const datum: StorageModel = JSON.parse(localStorage[key]);

            if (!datum.expiry || datum.expiry > ((new Date()).getTime() / 1000 || 0)) {
                return datum.value;
            }
        }

        return placeholder;
    }

    /**
     * @ngdoc method
     * @name Storage#set
     * @description
     * Store a value storage, optionally supplying an expiry time.
     *
     * @param {string} key to store the value under
     * @param {*=} value to store
     * @param {int=} expiry number of seconds before the value should expire (default is never)
     * @returns {*} value passed in
     * @throws if the value is a function
     */
    set <T>(key: string, value: T, expiry?: number): T {
        const datum: StorageModel = new StorageModel(value);

        if (expiry) {
            datum.expiry = ((new Date()).getTime() / 1000 || 0) + expiry;
        }

        this.delete(key);
        localStorage[key] = JSON.stringify(datum);

        return value;
    }

    /**
     * @ngdoc method
     * @name Storage#has
     * @description
     * Check if a value is in the storage
     *
     * @param {string} key to check
     * @returns {boolean} true if the key exists in the storage, false otherwise
     */
    has <T>(key: string): boolean {
        try {
            this.get<T>(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * @ngdoc method
     * @name Storage#delete
     * @description
     * Deletes a value from the storage
     *
     * @param {string} key to delete
     */
    delete (key: string): void {
        delete localStorage[key];
    }

    /**
     * @ngdoc method
     * @name Storage#clear
     * @description
     * Clears all keys set in the storage
     */
    clear (): void {
        Object.keys(localStorage)
            .forEach(function(key) {
                this.delete(key);
            }.bind(this));
    }
}
