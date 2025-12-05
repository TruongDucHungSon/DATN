'use client';

import SectionProducts from '@/components/SectionProducts';
import { useProductsQuery } from '@/query/products/getDataProducts';
import BannerSection from './BannerSection';
import Carousel from './Carousel';
import Content from './Content';
import Discovers from './Discovers';

export default function Home() {
	// Define state variables or constants for different sections
	const page1 = 1;
	const pageSize1 = 10;

	const page2 = 2;
	const pageSize2 = 10;

	// Fetch products for different sections
	const {
		data: DATA_PRODUCTS1,
		isLoading: LOADING_PRODUCT1,
		error: ERROR_PRODUCT1,
	} = useProductsQuery(page1, pageSize1);
	const {
		data: DATA_PRODUCTS2,
		isLoading: LOADING_PRODUCT2,
		error: ERROR_PRODUCT2,
	} = useProductsQuery(page2, pageSize2);

	return (
		<main className="home-page">
			<BannerSection
				footer="Discount auto-applied at checkout. Online & in select stores."
				className="bg-light-orange"
				title="30-70% OFF + FREE SHIPPING"
				subtitle="THE FRIENDS & FAMILY EVENT"
				description="Friendship, family and fantastic deals—your circle deserves it all. Online & in select stores. Prices as marked."
			/>
			<Content />
			<BannerSection
				title="EXTRA 50% OFF SALE"
				subtitle="SALE ON SALE"
				description="These savings burn fast and burn bright. Get them now before they’re gone."
				footer="Auto-applied at checkout. Online only."
			/>
			<SectionProducts
				title="STYLES YOU MAY LIKE"
				productList={DATA_PRODUCTS1}
				loading={LOADING_PRODUCT1}
				error={ERROR_PRODUCT1}
			/>
			<SectionProducts
				title="STYLES YOU MAY LIKE"
				productList={DATA_PRODUCTS1}
				loading={LOADING_PRODUCT1}
				error={ERROR_PRODUCT1}
			/>
			<SectionProducts
				title="STYLES YOU MAY LIKE"
				productList={DATA_PRODUCTS1}
				loading={LOADING_PRODUCT1}
				error={ERROR_PRODUCT1}
			/>
			<SectionProducts
				title="BESTSELLERS WE RECOMMEND"
				productList={DATA_PRODUCTS2}
				loading={LOADING_PRODUCT2}
				error={ERROR_PRODUCT2}
			/>
			<Carousel />
		</main>
	);
}
