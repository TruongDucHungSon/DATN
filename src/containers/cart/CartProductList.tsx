'use client';
// base
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
// routes
import { ROUTER } from '@/utils/routes/routes';
// redux
import { selectCartItems } from '@/redux/cart/selectors';
import { removeFromCart, updateCartItemQuantity } from '@/redux/cart/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
// icons
import ButtonLink from '@/compound/demo-button/button-link/ButtonLink';
import { MdKeyboardArrowDown } from '../../compound/icons/index';
import { useCallback } from 'react';
const CartProductList = () => {
	// Use useDispatch and useSelector to get dispatch and state from Redux
	const dispatch = useAppDispatch(); // Get dispatch from Redux
	const itemBagCart = useAppSelector(selectCartItems); // Get list of items from Redux

	// Declare state and ref
	const dropdownRefs = useRef<Record<string, HTMLUListElement | null>>({}); // Ref to store dropdowns
	const [showDropdowns, setShowDropdowns] = useState<Record<string, boolean>>({}); // State to control dropdown visibility

	// Function to handle removing item from cart
	const handleRemoveItem = (id: string, size: string) => {
		dispatch(removeFromCart({ id, size })); // Dispatch removeFromCart action with id and size of the item to remove
	};

	// Function to open dropdown for changing item quantity
	const openShowModalQuantity = (id: string, size: string) => {
		const newShowDropdowns = { ...showDropdowns, [`${id}-${size}`]: true }; // Set dropdown value to true
		setShowDropdowns(newShowDropdowns); // Update state to show dropdown
	};

	// Function to close dropdown

	// Function to handle changing item quantity
	const handleQuantityChange = (id: string, size: string, quantity: number) => {
		// Dispatch updateCartItemQuantity action to update item quantity
		dispatch(updateCartItemQuantity({ id, size, quantity }));
		closeShowModalQuantity(id, size);
	};

	// Function to calculate total priceS
	const closeShowModalQuantity = useCallback(
		(id: string, size: string) => {
			const newShowDropdowns = { ...showDropdowns, [`${id}-${size}`]: false };
			setShowDropdowns(newShowDropdowns);
		},
		[showDropdowns],
	);
	// Effect to close dropdown when clicking outside
	useEffect(() => {
		const closeDropdown = (event: MouseEvent) => {
			Object.keys(dropdownRefs.current).forEach((key) => {
				const ref = dropdownRefs.current[key];
				if (ref && !ref.contains(event.target as Node)) {
					const [itemId, size] = key.split('-');
					closeShowModalQuantity(itemId, size);
				}
			});
		};
		document.addEventListener('mousedown', closeDropdown);
		return () => {
			document.removeEventListener('mousedown', closeDropdown);
		};
	}, [closeShowModalQuantity]);

	return (
		<div className="bag-cart-box">
			<div className="shopping-cart-title-box">
				<h4 className="title _text-uppercase">shopping cart</h4>
				<div className="qty">{itemBagCart.length || '0'} item</div>
			</div>
			<div className="shopping-cart-lists">
				<h4 className="title">Ship</h4>
				{itemBagCart?.length === 0 ? (
					<div className="empty">
						<p>There are no items in your bag.</p>
						<div>
							<ButtonLink color="three">Shop Men</ButtonLink>
							<ButtonLink color="three">Shop Women</ButtonLink>
						</div>
					</div>
				) : (
					itemBagCart.map((item: any) => (
						<div
							className="shopping-cart-item _border-bottom"
							key={item.id}
						>
							<Link
								href={`${ROUTER.PRODUCT_DETAIL}/${item.slug}`}
								className="image"
							>
								<Image
									width={500}
									height={500}
									src={item.images[0]}
									alt={`cart item ${item.id}`}
								/>
							</Link>
							<div className="shopping-cart-desc">
								<div className="item-infor">
									<p className="brand">2H3T&#39;s® Premium</p>
									<div className="name-inner">
										<Link
											className="name"
											href={`${ROUTER.PRODUCT_DETAIL}/${item.slug}`}
										>
											{item.name}
										</Link>
									</div>
									<p className="color">Luxor Heat Light Wash</p>
									<p className="price">${item.discountPrice.toFixed(2)}</p>
									<div className="infor">
										<div className="size">{item.size}</div>
										<button
											className="qty"
											type="button"
											onClick={() => openShowModalQuantity(item.id, item.size)}
										>
											Qty: {item.quantity} <MdKeyboardArrowDown />
										</button>
										{/* Dropdown to select quantity */}
										{showDropdowns[`${item.id}-${item.size}`] && (
											<ul
												className="dropdown-inner"
												ref={(ref) => {
													dropdownRefs.current[`${item.id}-${item.size}`] = ref;
												}}
											>
												{[1, 2, 3, 4, 5, 6].map((value) => (
													<li
														className="item"
														key={value}
														onClick={() => handleQuantityChange(item.id, item.size, value)}
													>
														{value}
													</li>
												))}
											</ul>
										)}
									</div>
								</div>
								<div className="item-total">
									<div className="actions">
										<button
											className="remove"
											type="button"
											onClick={() => handleRemoveItem(item.id, item.size)}
										>
											Remove Product
										</button>
									</div>
									<div className="total">
										Total:
										<span className="price">
											${(item.discountPrice * item.quantity).toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default CartProductList;
