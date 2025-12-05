'use client';
// base
import Link from 'next/link';
// redux
import { useAppSelector } from '@/redux/hook';
// components
import CustomImage from '@/compound/customImage/CustomImage';
import ButtonLink from '@/compound/demo-button/button-link/ButtonLink';
// useQuery
import { useDeleteOrder, useGetAllOrder } from '@/query/order/handleOrder';
import { selectInformationUserLoginEmail } from '@/redux/auth/selectors';
import { useQueryClient } from 'react-query';
// types
import { CartItem, Order } from '@/utils/type';
// lodash
import { map } from 'lodash';
// axios
import axios from 'axios';

const YourOrder = () => {
	const queryClient = useQueryClient();
	const inforUser = useAppSelector(selectInformationUserLoginEmail);
	const { data: DATA_ORDER, isLoading: LOADING_ORDER, error: ERROR_ORDER } = useGetAllOrder();
	const { mutate: MUTATE_ORDER, isLoading: LOADING_DELETE_ORDER, error: ERROR_DELETE_ORDER } = useDeleteOrder();

	// Ensure inforUser is defined and has an _id property
	const id_User = inforUser?._id;

	// Filter orders by user ID
	const filterOrders = (orders: Order[]): Order[] => {
		return orders.filter((order) => order.userId === id_User);
	};

	const FILTERED_ORDERS = Array.isArray(DATA_ORDER) ? filterOrders(DATA_ORDER) : [];

	// 🟣 🔥 function thanh toán PayOS
	const handlePayOSPayment = async (orderId: string, amount: number) => {
		try {
			const res = await axios.post('https://ecommerce-api-1-jkdw.onrender.com/order/payos/create-payment', {
				orderId,
				amount: Math.floor(amount), // ✅ chuyển thành số nguyên
			});

			if (res.data?.checkoutUrl) {
				window.location.href = res.data.checkoutUrl;
			}
		} catch (err) {
			console.error('PayOS error:', err);
		}
	};

	return (
		<main className="container">
			<div className="bag-cart-box mt-15">
				<div className="shopping-cart-title-box">
					<h4 className="title _text-uppercase">Your Order</h4>
					<div className="qty">
						{FILTERED_ORDERS.length} item{FILTERED_ORDERS.length !== 1 ? 's' : ''}
					</div>
				</div>
				{LOADING_ORDER || LOADING_DELETE_ORDER ? (
					<div className="site-loading">
						<div className="chaotic-orbit"></div>
					</div>
				) : ERROR_ORDER ? (
					<div>Error</div>
				) : FILTERED_ORDERS.length === 0 ? (
					<div className="empty">
						<p>There are no items in your order.</p>
						<div>
							<ButtonLink color="three">Shop Men</ButtonLink>
							<ButtonLink color="three">Shop Women</ButtonLink>
						</div>
					</div>
				) : (
					<div>
						{map(FILTERED_ORDERS, (order: Order) => (
							<div
								key={order._id}
								className="order-wrapper"
							>
								<div className="order-information">
									<h4>ORDER INFORMATION</h4>
									<p>
										Code orders: <span>{order._id}</span>
									</p>
									<p>
										Customer: <span>{order.name}</span>
									</p>
									<p>
										Province: <span>{order.province}</span>
									</p>
									<p>
										District: <span>{order.district}</span>
									</p>
									<p>
										Commune: <span>{order.commune}</span>
									</p>
									<p>
										Address: <span>{order.address}</span>
									</p>
									<p>
										Phone number: <span>{order.phone}</span>
									</p>
									<p>
										Total: <span>${order.total}</span>
									</p>

									{/* 🔥 Nút thanh toán PayOS */}
									{order.status !== 'Paid' && (
										<button
											className="btn btn-primary mt-2"
											onClick={
												() => handlePayOSPayment(order._id, Math.floor(order.total)) // đảm bảo số nguyên
											}
										>
											Pay via PayOS
										</button>
									)}

									<p>
										Order date: <span>{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
									</p>
									<p>
										Order status: <span>{order.status}</span>
									</p>
								</div>
								<div className="order-list-items">
									<h4>ORDER ITEMS</h4>

									{order.cartItems.map((cartItem: CartItem) => (
										<div
											key={cartItem.productId?._id}
											className="order-item"
										>
											<Link
												href={`/product/${cartItem.productId?.slug}`}
												className="image"
											>
												<CustomImage
													width={150}
													height={150}
													alt="order image-item"
													src={cartItem.productId?.images?.[0] ?? ''}
												/>
											</Link>
											<div className="desc">
												<Link href={`/product/${cartItem.productId?.slug}`}>
													{cartItem.productId?.name}
												</Link>
												<p>Quantity: {cartItem.quantity}</p>
												<p>Size: {cartItem.size}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
};

export default YourOrder;
