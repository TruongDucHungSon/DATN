import { getCartFromLocalStorage, saveCartToLocalStorage } from '@/utils/localStorage';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	cartItems: getCartFromLocalStorage(),
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		// handle cart
		addToCart: (state, action) => {
			const { id, name, price, size, quantity, images, discountPrice } = action.payload;
			const existingItemIndex = state.cartItems.findIndex((item: any) => item.id === id && item.size === size);
			if (existingItemIndex !== -1) {
				state.cartItems[existingItemIndex].quantity += quantity;
			} else {
				state.cartItems.push({ id, name, price, size, quantity, images, discountPrice });
			}
			saveCartToLocalStorage(state.cartItems);
		},

		removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
			const { id, size } = action.payload;
			state.cartItems = state.cartItems.filter((item: any) => item.id !== id || item.size !== size);
			saveCartToLocalStorage(state.cartItems);
		},

		updateCartItemQuantity: (state, action) => {
			const { id, quantity } = action.payload;
			const itemToUpdate = state.cartItems.find((item: any) => item.id === id);
			if (itemToUpdate) {
				itemToUpdate.quantity = quantity;
				saveCartToLocalStorage(state.cartItems);
			}
		},
		// handle toggle open cart
		openCart: (state) => {
			state.isOpen = true;
		},
		closeCart: (state) => {
			state.isOpen = false;
		},
	},
});

export const { openCart, closeCart, addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;

export default cartSlice;
