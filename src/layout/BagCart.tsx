'use client';
// base
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
// icons
import { GiFireworkRocket, HiOutlineShoppingBag } from '../compound/icons/index';
// components
import ButtonLink from '@/compound/demo-button/button-link/ButtonLink';
import Button from '@/compound/demo-button/button/Button';
// routes
import { ROUTER } from '@/utils/routes/routes';
// redux
import { selectCartItems, selectIsOpenCartDrawer } from '@/redux/cart/selectors';
import { closeCart } from '@/redux/cart/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
// lodash
import { map } from 'lodash';
// type
import { Product } from '@/utils/type';
const BagCart = () => {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector(selectIsOpenCartDrawer);
	const itemBagCart = useAppSelector(selectCartItems);

	// Function to handle scroll behavior when cart is opened or closed
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (isOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}

			return () => {
				document.body.style.overflow = 'auto';
			};
		}
	}, [isOpen]);

	// Function to calculate the estimated total price of items in the cart
	const calculateEstimatedTotal = () => {
		let total = 0;
		itemBagCart.forEach((item: Product) => {
			total += (item.price || 0) * (item.quantity || 1);
		});
		return total.toFixed(2);
	};

	return (
		<section
			className={`site-bag-cart ${isOpen ? '-show' : ''}`}
			onMouseLeave={() => dispatch(closeCart())}
		>
			<div className="bag-cart-wrapper">
				<div className="title-box">
					<h4 className="title _text-uppercase">
						your bag
						<div className="inner-cart-number">
							<Link
								href={ROUTER.CART}
								className="header-icon-item"
								id="shopping-bag-anchor"
							>
								<HiOutlineShoppingBag
									color="#000"
									size={24}
								/>
							</Link>
							<p>{itemBagCart.length || '0'}</p>
						</div>
					</h4>
					<div className="sub-title">
						<GiFireworkRocket />
						20% off new Sons® subscribers.
						<div className="link">Sign Up</div>
					</div>
				</div>
				<div className="cart-inner">
					<h4 className="title">Ship</h4>
					<div className="cart-list">
						{itemBagCart.length === 0 ? (
							// Render message if cart is empty
							<div className="empty">
								<p>There are no items in your bag.</p>
								<div>
									<ButtonLink color="three">Shop Men</ButtonLink>
									<ButtonLink color="three">Shop Women</ButtonLink>
								</div>
							</div>
						) : (
							// Render cart items if cart is not empty
							map(itemBagCart, (item: Product) => (
								<div
									className="cart-item"
									key={item.id}
								>
									<Link
										href={`${ROUTER.PRODUCT_DETAIL}/${item?.slug}`}
										className="image"
									>
										{item.images && item.images.length > 0 && (
											<Image
												width={500}
												height={500}
												loading="lazy"
												src={item.images[0]}
												alt="product cart item"
											/>
										)}
									</Link>
									<div className="desc">
										<Link
											href={`${ROUTER.PRODUCT_DETAIL}/${item?.slug}`}
											className="name"
										>
											{item.name}
										</Link>
										<p className="sub-name">Wild Bunch - Medium Wash</p>
										<p className="price">
											{item.discountPrice ? `$${item.discountPrice.toFixed(2)}` : 'N/A'}
											{item.price && <del className="old-price">${item.price.toFixed(2)}</del>}
										</p>
										<div className="type-wrapper">
											<p className="size">{item.size}</p>
											<div className="quantity">Qty: {item.quantity || 1}</div>
										</div>
										<div className="sub-title">
											Subtotal:{' '}
											<span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
			<div className="total-wrapper">
				<div className="total">
					<div className="title">Estimated Total</div>
					{/* Display estimated total */}
					<p className="total-number">${calculateEstimatedTotal()}</p>
				</div>
				<Link
					href={ROUTER.CART}
					className="button"
				>
					<Button className="item">Checkout</Button>
				</Link>
			</div>
		</section>
	);
};

export default BagCart;
