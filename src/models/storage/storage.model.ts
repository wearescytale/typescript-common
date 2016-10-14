/**
 * Data model for objects stored in the localstorage
 */
export class StorageModel {
    expiry: number;
    value: any;

    constructor (value: any, expiry?: number) {
        this.value = value;

        if (expiry) {
            this.expiry = expiry;
        }
    }
}
