import { useProductsQuery } from '@/query/products/getDataProducts';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { selectIsToggleModalSale } from '@/redux/modal/selector';
import { closeModalSale } from '@/redux/modal/slice';
import { Product } from '@/utils/type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GrFormClose, VscBell } from '../../compound/icons/index';
import ProductSale from './ProductSale';

// Utility function to get a random sample of array elements
const getRandomSample = (array: Product[], size: number) => {
	const shuffled = array.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
};

const Sale = () => {
	const { data: DATA_PRODUCTS } = useProductsQuery(1, 10);
	const dispatch = useAppDispatch();
	const IsToggleModalSale = useAppSelector(selectIsToggleModalSale);
	const saleInnerRef = useRef<HTMLDivElement | null>(null);
	const HOURS_SETINTERVAL = 8 * 60 * 60 * 1000;
	const [productsToShow, setProductsToShow] = useState<Product[]>([]);

	const updateProductsToShow = useCallback(() => {
		if (DATA_PRODUCTS?.products) {
			setProductsToShow(getRandomSample(DATA_PRODUCTS.products, 8));
		}
	}, [DATA_PRODUCTS]);

	const closeModalIfOutsideClick = useCallback(
		(event: MouseEvent) => {
			if (saleInnerRef.current && !saleInnerRef.current.contains(event.target as Node)) {
				dispatch(closeModalSale());
			}
		},
		[dispatch],
	);
	useEffect(() => {
		if (IsToggleModalSale) {
			document.addEventListener('click', closeModalIfOutsideClick);
		} else {
			document.removeEventListener('click', closeModalIfOutsideClick);
		}

		return () => {
			document.removeEventListener('click', closeModalIfOutsideClick);
		};
	}, [IsToggleModalSale, closeModalIfOutsideClick]);

	useEffect(() => {
		updateProductsToShow();
		const interval = setInterval(updateProductsToShow, HOURS_SETINTERVAL);
		return () => clearInterval(interval);
	}, [updateProductsToShow, HOURS_SETINTERVAL]);

	return (
		<section className="main-sale">
			<div
				className={`sale-wrapper ${IsToggleModalSale ? '_show' : ''}`}
				ref={saleInnerRef}
			>
				<div></div>
				<div className="sale-top">
					<div className="title-box">
						<div className="title">
							<VscBell size={18} />
							Something you viewed is on sale!
						</div>
						<GrFormClose
							className="icon"
							onClick={() => dispatch(closeModalSale())}
						/>
					</div>
				</div>
				<div className="sale-product-list _custom-scrollbar">
					{productsToShow.map((item: Product) => (
						<ProductSale
							key={item._id}
							id={item.slug}
							images={item.images && item.images.length > 0 ? item.images : ['']}
							name={item.name}
							price={item.price}
							size="Sale up to30%"
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Sale;
