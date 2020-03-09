export interface Bill {
    id?: number;
    typeId: number;
    brandId: number;
    quantity: number;
    price: number;
    value: number;
    state?: string | 'hot' | 'cold';
    created_at: string;
    updated_at?: string;
}
