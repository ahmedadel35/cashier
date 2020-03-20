import { Type } from './type';
import { Brand } from './brand';
export interface Bill {
    id?: number;
    typeId: number;
    brandId: number;
    quantity: number;
    price: number;
    value: number;
    state?: string | 'hot' | 'cold';
    date?: string;
    created_at?: string;
    date?: string;
    updated_at?: string;
    type?: Type;
    brand?: Brand;
}
