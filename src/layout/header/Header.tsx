'use client';
// base
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
// images
import LogoSrc from '../../assets/images/logo/logoSpeedTour.jpg';
// Swiper
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// lodash
import { map } from 'lodash';
// components
import BagCart from '../BagCart';
import HeaderMobile from './Header-mobile';
// icons
import { CgSearch, HiOutlineShoppingBag, IoLocationSharp, TbHeart, VscBell } from '../../compound/icons/index';
// redux
import { selectInformationUserLoginEmail } from '@/redux/auth/selectors';
import { logoutGoogle } from '@/redux/auth/slice';
import { openCart } from '@/redux/cart/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { openModalLogin, openModalRegister, openModalSale } from '@/redux/modal/slice';
// modal
import Login from '@/modals/login/Login';
import Register from '@/modals/register/Register';
import Sale from '@/modals/sale/Sale';
// contains
import { useUserDetailQuery } from '@/query/user/handleApiUser';
import { selectCartItems } from '@/redux/cart/selectors';
import { isValidAccessToken } from '@/utils/cookies/cookieStorage';
import { ROUTER } from '@/utils/routes/routes';
import { MENU_LIST, SALE } from '../constants';
// hooks
import CustomImage from '@/compound/customImage/CustomImage';
import { useDebounce } from '@/containers/products/hooks';
import Logo from '@/compound/logo/Logo';

interface IPropsSale {
	id: number;
	label: string;
}
export const Header = () => {
	const dispatch = useAppDispatch();
	const inforUser = useAppSelector(selectInformationUserLoginEmail);
	const router = useRouter();
	const id_User = inforUser?._id;

	const { data: DATA_USER } = useUserDetailQuery(id_User as string);

	const itemBagCart = useAppSelector(selectCartItems);

	const [searchQuery, setSearchQuery] = useState<string>('');
	const debouncedSearchQuery = useDebounce(searchQuery, 1000);

	const handleRedirectToFavoritePage = () => {
		const isValidToken = isValidAccessToken();
		if (isValidToken) {
			router.push(ROUTER.FAVORITE);
		} else {
			dispatch(openModalLogin());
		}
	};
	const handleLogOutGoogle = () => dispatch(logoutGoogle());

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	useEffect(() => {
		if (debouncedSearchQuery) {
			router.push(`/product?name=${debouncedSearchQuery}`);
		}
	}, [debouncedSearchQuery, router]);

	return (
		<Fragment>
			<header className="site-header ">
				<div className="top-menu-wrapper">
					<div className="top-menu container">
						<div />
						{/* slide sale */}
						<div className="slides">
							<Swiper
								navigation={true}
								loop
								autoplay={{
									delay: 3500,
									disableOnInteraction: false,
								}}
								modules={[Navigation, Autoplay]}
							>
								{map(SALE, (item: IPropsSale) => (
									<SwiperSlide key={item.id}>
										<div className="top-menu-slide">
											{item.label} <p>details</p>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
						<div className="actions">
							{inforUser ? (
								// If user is logged in
								<>
									<div className="action">
										Hello,
										{DATA_USER && DATA_USER.firstName && DATA_USER.lastName
											? `${DATA_USER.firstName} ${DATA_USER.lastName}`
											: inforUser.displayName}
										<div className="dropdown">
											<Link href={ROUTER.YOUR_ORDER}>Order History</Link>
											<Link href={ROUTER.FAVORITE}>Favorites</Link>
											<Link href={ROUTER.PROFILE}>Profile</Link>
											<p onClick={handleLogOutGoogle}>Log out</p>
										</div>
									</div>
								</>
							) : (
								// If user is not logged in
								<>
									<button
										type="button"
										className="action"
										onClick={() => dispatch(openModalLogin())}
									>
										Login
									</button>
									<button
										type="button"
										className="action"
										onClick={() => dispatch(openModalRegister())}
									>
										SignUp
									</button>
								</>
							)}
							<div className="action -location">
								<IoLocationSharp />
								VietNam
							</div>
						</div>
					</div>
				</div>
				{/* NavBar */}
				<div className="main-menu container">
					<div className="nav">
						<div className="wrapper">
							<ul className="main-menu-list">
								{map(MENU_LIST, ({ label, route }) => (
									<li
										className="item"
										key={label}
									>
										<Link
											title={label}
											className="link"
											href={route}
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<Logo />

					<div className="search-site">
						<div className="field">
							{/* search */}
							<CgSearch size={20} />
							<input
								type="text"
								placeholder="What are you looking for ?"
								onChange={handleSearchChange}
								value={searchQuery}
							/>
						</div>
						<div className="icons">
							<button
								type="button"
								className="header-icon-item"
								onClick={() => dispatch(openModalSale())}
							>
								<VscBell size={24} />
							</button>
							<button
								type="button"
								className="header-icon-item"
								onClick={handleRedirectToFavoritePage}
							>
								<TbHeart
									size={24}
									color="#000"
								/>
							</button>
							<div className="inner-cart-number">
								<Link
									href={ROUTER.CART}
									className="header-icon-item "
									id="shopping-bag-anchor"
									onMouseEnter={() => dispatch(openCart())}
								>
									<HiOutlineShoppingBag
										color="#000"
										size={24}
									/>
								</Link>
								<p>{itemBagCart?.length || '0'}</p>
							</div>
						</div>
					</div>
				</div>
			</header>
			{/* modal cart */}
			{typeof window !== 'undefined' && <BagCart />}
			{/* modal sale */}
			{typeof window !== 'undefined' && <Sale />}
			{/* modal login */}
			{typeof window !== 'undefined' && <Login />}
			{/* modal register*/}
			{typeof window !== 'undefined' && <Register />}
			{/* header mobile */}
			<HeaderMobile handleRedirectToFavoritePage={handleRedirectToFavoritePage} />
		</Fragment>
	);
};
