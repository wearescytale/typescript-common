/**
 * Interface of the Storage definition
 */
export interface StorageInterface {
    get <T>(key: string, placeholder?: T): T;
    set <T>(key: string, value: T, expiry: number): T;
    has <T>(key: string): boolean;
    delete (key: string): void;
    clear (): void;
}
