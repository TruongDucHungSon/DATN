'use client';

import Product from '@/components/Product';
import SectionProducts from '@/components/SectionProducts';
import { useCategoriesQuery } from '@/query/categories/getCategories';
import { useFilterProductsQuery, useProductsQuery } from '@/query/products/getDataProducts';
import { Category } from '@/utils/type';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BsFilterLeft, GrFormNext, GrFormPrevious } from '../../compound/icons/index';
import { slidesPerView, spaceBetween } from './contains';
import { useDebounce } from './hooks';
import { LoadingSkeletonCategory } from './loading';

const PageProducts = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultPageSize = 10;
	const initialPage = parseInt(searchParams.get('page') || '1', 10);
	const initialPageSize = parseInt(searchParams.get('pageSize') || `${defaultPageSize}`, 10);
	const initialName = searchParams.get('name') || '';

	const [currentPage, setCurrentPage] = useState<number>(initialPage);
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [name, setName] = useState<string>(initialName);

	const debouncedName = useDebounce(name, 1000); // Use custom hook for debounce

	const { data: categoriesData, isLoading: loadingCategories, error: errorCategories } = useCategoriesQuery();

	const {
		data: productsData,
		isLoading: loadingProducts,
		error: errorProducts,
	} = useProductsQuery(currentPage, pageSize);

	const {
		data: DATA_PRODUCT_FILTER,
		isLoading: LOADING_PRODUCT_FILTER,
		error: ERROR_PRODUCT_FILTER,
	} = useFilterProductsQuery(debouncedName); // Use debounced name

	const handleProductPageChange = (page: number) => {
		setCurrentPage(page);
		router.push(`?page=${page}&pageSize=${pageSize}`);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	useEffect(() => {
		if (debouncedName) {
			router.push(`?name=${debouncedName}`);
		}
	}, [debouncedName, router]);

	const totalPages = productsData ? productsData?.totalPages : 0;
	const DATA_PRODUCTS = DATA_PRODUCT_FILTER || productsData?.products;

	return (
		<Fragment>
			<main className="site-products-page container">
				<section className="site-categories">
					{!errorCategories && (
						<>
							<h4 className="content _text-center">
								<p className="content-title">Clothing</p>
								<p>/</p>
								<p className="sub-content">Woman</p>
							</h4>
							<p className="title _text-center">WOMANS CLOTHES</p>
							<div className="categories-list">
								{loadingCategories || !categoriesData || errorCategories ? (
									<LoadingSkeletonCategory />
								) : (
									<Swiper
										slidesPerView={slidesPerView.base}
										spaceBetween={spaceBetween.base}
										scrollbar={{ hide: false }}
										breakpoints={{
											768: {
												slidesPerView: slidesPerView.tablet,
												spaceBetween: spaceBetween.tablet,
											},
											1024: {
												slidesPerView: slidesPerView.desktop,
												spaceBetween: spaceBetween.desktop,
											},
										}}
										modules={[Scrollbar]}
										className="swiper-categories"
									>
										{categoriesData.map((category: Category) => (
											<SwiperSlide key={category._id}>
												<div className="category-item">
													<Link
														href={`/product/category/${category._id}`}
														className="image"
													>
														<Image
															alt="category-item"
															width={500}
															height={500}
															loading="lazy"
															src={category.image}
														/>
													</Link>
													<div>
														<p className="category-link">{category.name}</p>
													</div>
												</div>
											</SwiperSlide>
										))}
									</Swiper>
								)}
							</div>
						</>
					)}
				</section>

				<section className="main-section-products">
					<div className="filter-wrapper">
						<div className="filters-inner">
							<div className="filter">
								<BsFilterLeft size={22} />
								Filter
							</div>
							<div className="filter">
								<label htmlFor="filter-select-products">Sort by</label>
								<select
									name="filter-select-products"
									id="filter-select-products"
									className="filter-select-products"
								>
									<option value="recommended">Recommended</option>
									<option value="Price-Low-High">Price Low-High</option>
									<option value="Price-High-Low">Price High-Low</option>
								</select>
							</div>
						</div>
						<p className="total-products">{productsData?.totalProducts} items</p>
					</div>

					<div className="products-wrapper">
						<aside className="sidebar-wrapper">
							<div className="sidebar-inner">
								{/* Search Input */}
								<div className="search-wrapper">
									<input
										type="text"
										placeholder="Search products..."
										onChange={handleSearchChange}
										defaultValue={initialName}
									/>
									<BsSearch />
								</div>
								<div className="sidebar-type">
									{/* Render categories in the sidebar */}
									{loadingCategories || !categoriesData || errorCategories ? (
										<div>Loading...</div>
									) : (
										<div className="categories-list">
											{categoriesData.map((category: Category) => (
												<div
													className="category-item"
													key={category._id}
												>
													<Link
														className="link-color"
														href={`/product/category/${category._id}`}
													>
														{category.name}
													</Link>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</aside>

						<section className="wrapper-product-list">
							{loadingProducts || LOADING_PRODUCT_FILTER ? (
								<div className="loading-skeleton-product">
									{Array.from({ length: initialPageSize }).map((_, index) => (
										<div
											className="card-is-loading"
											key={index}
										>
											<div className="image"></div>
											<div className="content">
												<h2></h2>
												<h2></h2>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="main-products-list">
									{DATA_PRODUCTS?.map((product: any) => (
										<Product
											key={product._id}
											id={product._id}
											slug={product.slug}
											name={product.name}
											images={product.images}
											price={product.price}
											discount={product.discount}
											brand="Son's Premium"
											sale="30% off $125+ Applied at Checkout"
											button="Quick Add"
										/>
									))}
								</div>
							)}

							{/* Pagination section */}
							{productsData && productsData?.products ? (
								<div className="pagination-wrapper">
									<button
										type="button"
										className="button"
										onClick={() => handleProductPageChange(currentPage - 1)}
										disabled={currentPage === 1}
									>
										<GrFormPrevious size={20} /> <p className="label">Prev</p>
									</button>

									<div className="pagination-list ">
										{Array.from({ length: totalPages }).map((_, index) => {
											const pageNumber = index + 1;
											return (
												<button
													key={pageNumber}
													onClick={() => handleProductPageChange(pageNumber)}
													className={`item ${pageNumber === currentPage ? '-active' : ''}`}
												>
													{pageNumber}
												</button>
											);
										})}
									</div>

									<button
										type="button"
										className="button"
										onClick={() => handleProductPageChange(currentPage + 1)}
										disabled={currentPage === totalPages}
									>
										<p className="label">Next</p> <GrFormNext size={20} />
									</button>
								</div>
							) : null}
						</section>
					</div>
				</section>
			</main>

			<SectionProducts
				title="BESTSELLERS WE RECOMMEND"
				productList={productsData}
				loading={loadingProducts}
				error={errorProducts}
			/>
		</Fragment>
	);
};

export default PageProducts;
