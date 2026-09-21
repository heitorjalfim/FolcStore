import { Artesao } from './artesao';
import { Customer } from './customer';
import { Product } from './product';
import { Admin } from './admin';
import { Avaliacao } from './avaliacao';

export * from './artesao';
export * from './customer';
export * from './product';
export * from './admin';
export * from './order';
export * from './avaliacao';

export interface RootData {
    artesaos: Artesao[];
    customers: Customer[];
    products: Product[];
    admin: Admin[];
    avaliacoes: Avaliacao[];
}