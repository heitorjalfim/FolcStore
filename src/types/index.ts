export * from './artesao';
export * from './customer';
export * from './product';

export interface RootData {
    artesaos: Artesao[];
    customers: Customer[];
    products: Product[];
}
