import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Cart, CartItem, Product } from "../types";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: Cart };

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      const newItems: CartItem[] = existing
        ? state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...state.items, { product, quantity }];
      return {
        items: newItems,
        total: newItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
        itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
      };
    }
    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(
        (i) => i.product.id !== action.payload
      );
      return {
        items: newItems,
        total: newItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
        itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
      };
    }
    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      const newItems =
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            );
      return {
        items: newItems,
        total: newItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
        itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
      };
    }
    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_KEY = "dziki-kisz-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Cart;
        if (parsed.items && Array.isArray(parsed.items))
          dispatch({ type: "LOAD_CART", payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined)
    throw new Error("useCart must be used within CartProvider");
  return ctx;
}
