'use client';
// base
import Link from 'next/link';
import { Fragment } from 'react';
//  Swiper
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// lodash
import { map } from 'lodash';
// components
import Logo from '@/compound/logo/Logo';
import BagCart from '../BagCart';
import HeaderMobile from './Header-mobile';
//  icons
import { CgSearch, HiOutlineShoppingBag, IoLocationSharp, TbHeart, VscBell } from '../../compound/icons/index';
// redux
import { selectInformationUserLoginEmail } from '@/redux/auth/selectors';
import { logoutGoogle } from '@/redux/auth/slice';
import { openCart } from '@/redux/cart/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { openModalLogin, openModalRegister, openModalSale } from '@/redux/modal/slice';
// react-query
// modal
import Login from '@/modals/login/Login';
import Register from '@/modals/register/Register';
import Sale from '@/modals/sale/Sale';
// contains
import { ROUTER } from '@/utils/routes/routes';
import { MENU_LIST, SALE } from '../constants';

interface IPropsSaler {
	id: number;
	label: string;
}

export const Header = () => {
	const dispatch = useAppDispatch();
	const inforUser = useAppSelector(selectInformationUserLoginEmail);

	const handleLogOutGoogle = () => dispatch(logoutGoogle());

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
								{map(SALE, (item: IPropsSaler) => (
									<SwiperSlide key={item.id}>
										<h6 className="top-menu-slide">
											{item.label} <p>details</p>
										</h6>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
						<div className="actions">
							{inforUser ? (
								// If user is logged in
								<>
									<span className="action">Hello, {inforUser.displayName}</span>
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
							<Logo />
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
					<div className="search-site">
						<div className="field">
							<CgSearch size={20} />
							<input
								type="text"
								placeholder="What are you looking for ?"
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
							<Link
								href={ROUTER.FAVORITE}
								type="button"
								className="header-icon-item"
							>
								<TbHeart
									size={24}
									color="#000"
								/>
							</Link>

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
						</div>
					</div>
				</div>
			</header>
			{/* modal cart */}
			<BagCart />
			{/* modal sale */}
			<Sale />
			{/* modal login */}
			<Login />
			{/* modal register*/}
			<Register />
			{/* header mobile */}
			<HeaderMobile />
			{/* header desktop */}
		</Fragment>
	);
};
