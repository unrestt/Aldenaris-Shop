export interface Product{
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
    images: string[];
    thumbnail: string;
    sizes?: string[];
    description?: string;
}