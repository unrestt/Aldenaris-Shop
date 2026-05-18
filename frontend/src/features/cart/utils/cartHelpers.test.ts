import { describe, it, expect } from "vitest";
import { 
    calculateSubtotal, 
    calculateShipping, 
    addItemToCart, 
    removeItemFromCart, 
    updateItemQuantity
} from "./cartHelpers";
import type { CartItemWithProduct } from "./cartHelpers";
import type { CartItem } from "../types/cartTypes";
import type { Product } from "../../products/types/productTypes";

const mockProducts: Product[] = [
    { id: "1", name: "Carhartt Hoodie", brand: "Carhartt", price: 709, category: "Bluzy", sizes: ["M"], thumbnail: "", images: [], description: "" },
    { id: "2", name: "S Logo Hoodie", brand: "Supreme", price: 1299, category: "Bluzy", sizes: ["L"], thumbnail: "", images: [], description: "" }
];

describe("Cart Helpers", () => {
    describe("calculateSubtotal", () => {
        it("should calculate correct subtotal for multiple items", () => {
            const items: CartItemWithProduct[] = [
                { productId: "1", size: "M", quantity: 2, product: mockProducts[0] },
                { productId: "2", size: "L", quantity: 1, product: mockProducts[1] }
            ];
            expect(calculateSubtotal(items)).toBe(709 * 2 + 1299);
        });

        it("should return 0 for empty cart", () => {
            expect(calculateSubtotal([])).toBe(0);
        });
    });

    describe("calculateShipping", () => {
        it("should return 30 for subtotal below or equal 1000", () => {
            expect(calculateShipping(709)).toBe(30);
        });

        it("should return 0 for subtotal above 1000 (free shipping)", () => {
            expect(calculateShipping(1299)).toBe(0);
        });

        it("should return 0 when subtotal is 0", () => {
            expect(calculateShipping(0)).toBe(0);
        });
    });

    describe("addItemToCart", () => {
        it("should add new item to cart if it does not exist", () => {
            const items: CartItem[] = [];
            const result = addItemToCart(items, { productId: "1", size: "M", quantity: 1 });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ productId: "1", size: "M", quantity: 1 });
        });

        it("should increase quantity if item already exists in the same size", () => {
            const items: CartItem[] = [
                { productId: "1", size: "M", quantity: 1 }
            ];
            const result = addItemToCart(items, { productId: "1", size: "M", quantity: 2 });
            expect(result).toHaveLength(1);
            expect(result[0].quantity).toBe(3);
        });

        it("should add separate item if size is different", () => {
            const items: CartItem[] = [
                { productId: "1", size: "M", quantity: 1 }
            ];
            const result = addItemToCart(items, { productId: "1", size: "L", quantity: 2 });
            expect(result).toHaveLength(2);
            expect(result[1]).toEqual({ productId: "1", size: "L", quantity: 2 });
        });
    });

    describe("removeItemFromCart", () => {
        it("should remove specific item from cart matching ID and size", () => {
            const items: CartItem[] = [
                { productId: "1", size: "M", quantity: 1 },
                { productId: "1", size: "L", quantity: 2 }
            ];
            const result = removeItemFromCart(items, "1", "M");
            expect(result).toHaveLength(1);
            expect(result[0].size).toBe("L");
        });
    });

    describe("updateItemQuantity", () => {
        it("should update quantity of item matching ID and size", () => {
            const items: CartItem[] = [
                { productId: "1", size: "M", quantity: 2 }
            ];
            const result = updateItemQuantity(items, "1", "M", 1);
            expect(result[0].quantity).toBe(3);
        });
    });
});
