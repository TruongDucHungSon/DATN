'use client';
// base
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// components
import SectionProducts from '@/components/SectionProducts';
import Button from '@/compound/demo-button/button/Button';
import Image from 'next/image';
import Comment from './Comment';
// lodash
import { map } from 'lodash';
// icons
import {
	BsStarFill,
	BsStarHalf,
	HiOutlineMinusSm,
	IoIosArrowDown,
	IoIosArrowUp,
	MdOutlineAdd,
	MdReportGmailerrorred,
	PiShoppingBagOpenBold,
	TbHeart,
} from '../../compound/icons/index';
// swiper
import { Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// redux
import { useAppDispatch, useAppSelector } from '@/redux/hook';

// react-query
import { useProductDetailQuery, useProductsQuery } from '@/query/products/getDataProducts';
// constants
import { addToCart } from '@/redux/cart/slice';
import { BREAKPOINTS } from '@/utils/breakpoints/constants';
import { LIMIT, PAYMENT_METHOD } from './constants';
// icons
import ModalNotification from '@/modals/notification/Notification';
import { usePostFavorite } from '@/query/favorite/handleApiFavorite';
import { selectInformationUserLoginEmail } from '@/redux/auth/selectors';
import { HiMiniHeart } from '../../compound/icons/index';

const PageProductDetail = () => {
	const { mutate: MUTATION_FAVORITE, isLoading: LOADING_FAVORITE } = usePostFavorite();
	const inforUser = useAppSelector(selectInformationUserLoginEmail);
	const { data: DATA_PRODUCTS, isLoading: LOADING_PRODUCT, error: ERROR_PRODUCT } = useProductsQuery();

	const userId = inforUser?._id || null;
	// get query id product
	const params = useParams();
	const id = params.id;
	const {
		data: DATA_PRODUCT_DETAIL,
		isLoading: LOADING_PRODUCT_DETAIL,
		error,
		refetch,
	} = useProductDetailQuery(id as string);
	const [selectedSize, setSelectedSize] = useState<string>('');
	const [showSizeError, setShowSizeError] = useState<boolean>(false);
	const [activeThumb, setActiveThumb] = useState<any>(null);
	const [quantity, setQuantity] = useState<number>(1);
	const [activePaymentMethod, setActivePaymentMethod] = useState<string>('Ship');

	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState('');

	useEffect(() => {
		if (id) {
			refetch(); // refetch data when the id changes
		}
	}, [id, refetch]);

	const increaseQuantity = () => {
		setQuantity(quantity + 1);
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
		if (quantity === 1) {
			return;
		}
	};
	const handleSizeSelect = (size: string) => {
		setSelectedSize(size);
		setShowSizeError(false);
	};

	const handleAddToFavorites = () => {
		if (DATA_PRODUCT_DETAIL && userId) {
			MUTATION_FAVORITE(
				{
					userId: userId as string,
					productId: DATA_PRODUCT_DETAIL._id as string,
				},
				{
					onSuccess: () => {
						setModalMessage('Item successfully added to favorites.');
						setModalVisible(true);
					},
					onError: () => {
						setModalMessage('The product is already in your favorites list.');
						setModalVisible(true);
					},
				},
			);
		}
	};

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		if (modalVisible) {
			timer = setTimeout(() => {
				setModalVisible(false);
			}, 3000); // Close modal after 2 seconds
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [modalVisible]);

	useEffect(() => {
		if (id) {
			refetch();
		}
	}, [id, refetch]);

	useEffect(() => {
		refetch();
		setSelectedSize('');
		setShowSizeError(false);
		setQuantity(1);
	}, [id]);

	// handle bag cart use redux
	const dispatch = useAppDispatch();
	const handleAddToCart = () => {
		if (!selectedSize) {
			setShowSizeError(true);
			return;
		} else {
			const productToAdd = {
				id: DATA_PRODUCT_DETAIL?._id,
				name: DATA_PRODUCT_DETAIL?.name,
				price: DATA_PRODUCT_DETAIL?.price,
				size: selectedSize,
				quantity: quantity,
				images: DATA_PRODUCT_DETAIL?.images,
				discountPrice: discountedPrice,
			};
			dispatch(addToCart(productToAdd));
			setModalMessage('Item successfully added to cart.');
			setModalVisible(true);
		}
	};
	if (LOADING_PRODUCT_DETAIL) {
		return (
			<div className="site-loading">
				<div className="chaotic-orbit"></div>
			</div>
		);
	}

	if (!DATA_PRODUCT_DETAIL) {
		return <div>Product not found</div>;
	}
	const discountedPrice = DATA_PRODUCT_DETAIL.price * (1 - DATA_PRODUCT_DETAIL.discount / 100);

	return (
		<main className="site-detail ">
			{/* Modal Notification */}
			<ModalNotification
				stateModalVisible={modalVisible}
				message={modalMessage}
				onClose={() => setModalVisible(false)}
			/>
			<section className="detail container">
				{/* slide Image product */}
				<div className="detail-slide">
					<div className="swiper-thumbsImages">
						<Swiper
							className="gallery-product-detail"
							modules={[Thumbs, Navigation]}
							onSwiper={setActiveThumb}
							navigation={{
								nextEl: '.product-detail-actions > .action.-next',
								prevEl: '.product-detail-actions > .action.-prev',
							}}
							breakpoints={{
								[BREAKPOINTS.xs]: {
									slidesPerView: LIMIT.THUMB_MOBILE,
									direction: 'horizontal',
									slidesPerGroup: LIMIT.THUMB_MOBILE,
									allowTouchMove: true,
									spaceBetween: 10,
								},
								[BREAKPOINTS.sm]: {
									slidesPerView: LIMIT.THUMB_MOBILE,
									direction: 'vertical',
									slidesPerGroup: LIMIT.THUMB_MOBILE,
									allowTouchMove: true,
									spaceBetween: 10,
								},
								[BREAKPOINTS.lg]: {
									slidesPerView: LIMIT.THUMB_DESKTOP,
									direction: 'vertical',
									slidesPerGroup: LIMIT.THUMB_DESKTOP,
									allowTouchMove: false,
									spaceBetween: 35,
								},
							}}
						>
							{DATA_PRODUCT_DETAIL.images &&
								DATA_PRODUCT_DETAIL.images.map((image: string, index: number) => (
									<SwiperSlide
										className="gallery-product-detail-item"
										key={index}
									>
										<Image
											className="slide-image"
											width={150}
											height={150}
											src={image}
											alt={`Thumbnail ${index}`}
										/>
									</SwiperSlide>
								))}
						</Swiper>
						<div className="product-detail-actions">
							<button
								type="button"
								className="action -prev"
							>
								<IoIosArrowUp />
							</button>
							<button
								type="button"
								className="action -next"
							>
								<IoIosArrowDown />
							</button>
						</div>
					</div>
					{/* end of thumbnails */}
					<div className="main-slide">
						<Swiper
							slidesPerView={1}
							spaceBetween={20}
							className="main-slide-image-product-detail"
							modules={[Thumbs]}
							thumbs={{
								swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null,
							}}
						>
							{map(DATA_PRODUCT_DETAIL.images, (image: string, index: number) => (
								<SwiperSlide
									key={index}
									className="main-swiper-slide"
								>
									<div className="item-main-slide">
										<Image
											width={600}
											height={740}
											src={image}
											alt=""
										/>
										<div onClick={handleAddToFavorites}>
											<HiMiniHeart size={20} />
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
					{/* end of main slide */}
				</div>
				{/* information product */}
				<div className="detail-info ">
					<div className="detail-title">
						<p>SonTruong&#39;s® Premium</p>
						<h3 className="name">{DATA_PRODUCT_DETAIL.name}</h3>
						<div className="detail-icons">
							<div className="detail-icon">
								<BsStarFill />
								<BsStarFill />
								<BsStarFill />
								<BsStarFill />
								<BsStarHalf />
							</div>
							<p>(39)</p>
						</div>
						<p className="detail-price">${discountedPrice.toFixed(2)}</p>
						<div className="detail-content">2+ for $49 Each: Applied at Checkout</div>
					</div>
					<div className="detail-size">
						<div className="title">Size</div>
						<div className="size-list _text-uppercase">
							{map(DATA_PRODUCT_DETAIL.size, (item, index) => (
								<div
									className={`item ${selectedSize === item ? '-selected-size-product-detail' : ''}`}
									key={index}
									onClick={() => handleSizeSelect(item)}
								>
									{item}
								</div>
							))}
						</div>
						{showSizeError ? (
							<p className="error-message">Please select a size before adding to bag.</p>
						) : (
							''
						)}
					</div>
					<div className="detail-quantity">
						<div className="title">Select Quantity</div>
						<div className="action">
							<button
								type="button"
								disabled={quantity === 1}
								className="item"
								onClick={decreaseQuantity}
							>
								<HiOutlineMinusSm />
							</button>
							<p className="item">{quantity}</p>
							<button
								type="button"
								className="item"
								onClick={increaseQuantity}
							>
								<MdOutlineAdd />
							</button>
						</div>
					</div>
					<div className="detail-payment-method-list">
						{map(PAYMENT_METHOD, ({ title, content }) => (
							<div
								className={`item ${activePaymentMethod === title ? '-active' : ''}`}
								onClick={() => setActivePaymentMethod(title)}
								key={title}
							>
								<h3 className="title">{title}</h3>
								<p className="description">{content}</p>
							</div>
						))}
					</div>
					<div className="detail-disable">
						<div className="item">
							Stock: <span className="qty-stock">{DATA_PRODUCT_DETAIL.stock}</span>
						</div>
					</div>

					<div className="description">
						<h4 className="title">Description</h4>
						<div className="detail-description">
							<p>{DATA_PRODUCT_DETAIL.description}</p>
						</div>
					</div>
					<div className="detail-nature">
						<p className="item">Style # A46790000</p>
						<p className="items">Color: Black - Dark Wash</p>
					</div>
					<div
						className="detail-click"
						onClick={handleAddToCart}
					>
						<p className="item">Add to Bag</p>
					</div>
					<div className="detail-note">
						<div>
							<PiShoppingBagOpenBold size={20} />
							<p>Free Shipping and Returns for Levis® Red</p>
						</div>
						<div>
							<p>Tab™ Members</p>
							<MdReportGmailerrorred size={20} />
						</div>
					</div>
				</div>
				{/* button fixed */}
				<div className="actions-fixed">
					<button
						type="button"
						className="button-add-favorite"
					>
						<TbHeart />
					</button>
					<Button
						className="button-add-product"
						onClick={handleAddToCart}
					>
						Add to Bag
					</Button>
				</div>
			</section>
			{/* section product */}
			<SectionProducts
				title="YOU MAY ALSO LIKE"
				productList={DATA_PRODUCTS}
				loading={LOADING_PRODUCT} // add the loading property
				error={ERROR_PRODUCT}
			/>
			<SectionProducts
				title="CUSTOMERS ALSO BOUGHT"
				productList={DATA_PRODUCTS}
				loading={LOADING_PRODUCT} // add the loading property
				error={ERROR_PRODUCT}
			/>
			{/* comment */}
			<Comment />
		</main>
	);
};

export default PageProductDetail;
