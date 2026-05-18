export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    thumbnail: string;
}

export interface ShippingDetails {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
}

export interface Order {
    id: string;
    userId: string;
    date: string; // Format daty ISO (np. "2026-05-18T17:51:39Z")
    status: string; // Np. "Opłacone", "W realizacji"
    total: number;
    shipping: number;
    items: OrderItem[];
    shippingDetails: ShippingDetails;
    paymentMethod: string; // Np. "BLIK", "Karta", "Przelew"
}

export interface CreateOrderInput {
    userId: string;
    items: OrderItem[];
    total: number;
    shipping: number;
    shippingDetails: ShippingDetails;
    paymentMethod: string;
}
