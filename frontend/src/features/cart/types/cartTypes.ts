export interface CartItem{
    productId: string;
    quantity: number;
    size: string;
}

export interface UserCart{
    id: string;
    userId: string;
    items: CartItem[];
}