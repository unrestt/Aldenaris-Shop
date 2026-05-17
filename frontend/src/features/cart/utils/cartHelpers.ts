import type { CartItem } from "../types/cartTypes";
import type { Product } from "../../products/types/productTypes";

export interface CartItemWithProduct extends CartItem {
    product: Product;
}

export const getCartItemsWithDetails = (
    items: CartItem[] | undefined,
    products: Product[] | undefined
): CartItemWithProduct[] => {
    if (!items || !products) return [];
    return items
        .map(item => {
            const product = products.find(p => p.id === item.productId);
            return { ...item, product: product! };
        })
        .filter(item => !!item.product);
};

export const calculateSubtotal = (cartItemsWithDetails: CartItemWithProduct[]): number => {
    return cartItemsWithDetails.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
};

export const calculateShipping = (subtotal: number): number => {
    if (subtotal === 0) return 0;
    return subtotal > 1000 ? 0 : 30;
};

export const addItemToCart = (
    items: CartItem[],
    newItem: { productId: string; size: string; quantity: number }
): CartItem[] => {
    const existingItem = items.find(
        item => item.productId === newItem.productId && item.size === newItem.size
    );

    if (existingItem) {
        return items.map(item => {
            if (item.productId === newItem.productId && item.size === newItem.size) {
                return { ...item, quantity: item.quantity + newItem.quantity };
            }
            return item;
        });
    }

    return [...items, newItem];
};

export const removeItemFromCart = (
    items: CartItem[],
    productId: string,
    size: string
): CartItem[] => {
    return items.filter(item => !(item.productId === productId && item.size === size));
};

export const updateItemQuantity = (
    items: CartItem[],
    productId: string,
    size: string,
    delta: number
): CartItem[] => {
    return items.map(item => {
        if (item.productId === productId && item.size === size) {
            return { ...item, quantity: item.quantity + delta };
        }
        return item;
    });
};
