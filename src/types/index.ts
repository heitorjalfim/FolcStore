export * from './artesao';
export * from './customer';
export * from './product';
export * from './admin';
export * from './order'

export interface RootData {
    artesaos: Artesao[];
    customers: Customer[];
    products: Product[];
    admin: Admin[];
}
