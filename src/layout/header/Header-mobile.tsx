'use client';
// base
import Link from 'next/link';
// images
import LogoSrc from '../../assets/images/logo/logoSpeedTour.jpg';
// components
// icons
import { CgSearch, GrFormClose, HiOutlineMenuAlt4, HiOutlineShoppingBag, VscBell } from '../../compound/icons/index';
// base
import { useEffect, useRef, useState } from 'react';

// Import Swiper
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// lodash
import { map } from 'lodash';
// redux
import { selectInformationUserLoginEmail } from '@/redux/auth/selectors';
import { logoutGoogle } from '@/redux/auth/slice';
import { selectCartItems } from '@/redux/cart/selectors';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { openModalLogin, openModalRegister, openModalSale } from '@/redux/modal/slice';
// contains
import { ROUTER } from '@/utils/routes/routes';
import { MENU_LIST, SALE } from '../constants';
// custom-hook
import CustomImage from '@/compound/customImage/CustomImage';
import useNoScrollBody from '@/custom-hook/useNoScrollBody';
import { useUserDetailQuery } from '@/query/user/handleApiUser';
import Logo from '@/compound/logo/Logo';
import { useCallback } from 'react';
interface IPropsSale {
	id?: number;
	label?: string;
	handleRedirectToFavoritePage: () => void;
}

const HeaderMobile = ({ handleRedirectToFavoritePage }: IPropsSale) => {
	const dispatch = useAppDispatch();
	const itemBagCart = useAppSelector(selectCartItems);
	const inforUser = useAppSelector(selectInformationUserLoginEmail);
	const id_User = inforUser?._id;

	const { data: DATA_USER } = useUserDetailQuery(id_User as string);
	const [openNav, setOpenNav] = useState<boolean>(false);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const handleOpenNav = () => {
		setOpenNav(true);
	};
	const handleCloseNav = () => {
		setOpenNav(false);
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
			handleCloseNav();
		}
	}, []);

	useEffect(() => {
		if (openNav) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openNav, handleClickOutside]);

	useNoScrollBody(openNav);
	const handleLogOutGoogle = () => dispatch(logoutGoogle());

	return (
		<header className={`site-header-mobile `}>
			<div className="header-mobile-inner container">
				<div className="menu-icon">
					<HiOutlineMenuAlt4
						size={22}
						onClick={handleOpenNav}
					/>
				</div>
				<Logo />
				<div className="actions">
					<CgSearch size={22} />
					<VscBell
						onClick={() => dispatch(openModalSale())}
						size={22}
						color="#000"
					/>
					<div className="inner-cart-number">
						<Link
							href={ROUTER.CART}
							className="header-icon-item "
							id="shopping-bag-anchor"
						>
							<HiOutlineShoppingBag
								color="#000"
								size={24}
							/>
						</Link>
						<p>{itemBagCart.length || '0'}</p>
					</div>
				</div>
			</div>
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
							<h6 className="top-menu-slide">
								{item.label} <p>details</p>
							</h6>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className={`nav-mobile _overlay ${openNav ? 'show-nav' : 'hidden-nav'}`}>
				<div
					ref={wrapperRef}
					className={`wrapper-mobile  ${openNav ? 'show-nav' : 'hidden-nav'}`}
				>
					<div className="top">
						<Logo />
						<GrFormClose
							size={28}
							onClick={handleCloseNav}
						/>
					</div>
					<ul className="main-menu-mobile _text-uppercase ">
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
					<div className="action_wrapper _text-capitalize _border-top">
						<div className="action_list">
							<button
								type="button"
								onClick={handleRedirectToFavoritePage}
							>
								Favorite
							</button>
							{DATA_USER ? (
								// If user is logged in
								<>
									<p className="action">Hello, {DATA_USER.firstName || inforUser.displayName}</p>
									<Link href={ROUTER.ORDER}>Order History</Link>
									<Link href={ROUTER.PROFILE}>Profile</Link>
									<button
										type="button"
										className="action"
										onClick={handleLogOutGoogle}
									>
										Logout
									</button>
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
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default HeaderMobile;
