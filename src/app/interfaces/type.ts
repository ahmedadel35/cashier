import { Brand } from './brand';
export interface Type {
    id: number;
    name: string;
    brands?: Brand[];
    created_at: string;
    updated_at: string;
}
