'use client';

// base
import { useCallback, useEffect, useRef } from 'react';
// components
import Button from '@/compound/demo-button/button/Button';
import FormInput from '@/compound/formInput/FormInput';
// react-hook-form
import { useForm } from 'react-hook-form';
// icons
import { GrFormClose } from '../../compound/icons/index';
// redux
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { selectIsToggleModalRegister } from '@/redux/modal/selector';
import { closeModalRegister, openModalLogin } from '@/redux/modal/slice';
// custom-hook
import useNoScrollBody from '@/custom-hook/useNoScrollBody';
// yup
import { useRegisterMutation } from '@/query/authentication/authentication';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
	firstName: yup.string().required('First name is required'),
	lastName: yup.string().required('Last name is required'),
	email: yup.string().email('Invalid email format').required('Email is required'),
	password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

interface IRegisterProps {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const Register = () => {
	// redux
	const isOpenToggleModalOpen = useAppSelector(selectIsToggleModalRegister);
	const dispatch = useAppDispatch();
	const registerInnerRef = useRef<HTMLDivElement | null>(null);

	// handle close modal
	const closeModal = useCallback(() => {
		dispatch(closeModalRegister());
	}, [dispatch]);

	// handle click out side
	const closeModalIfOutsideClick = useCallback(
		(event: MouseEvent) => {
			if (registerInnerRef.current && !registerInnerRef.current.contains(event.target as Node)) {
				closeModal();
			}
		},
		[closeModal],
	);

	useEffect(() => {
		if (isOpenToggleModalOpen) {
			document.addEventListener('click', closeModalIfOutsideClick);
		} else {
			document.removeEventListener('click', closeModalIfOutsideClick);
		}

		return () => {
			document.removeEventListener('click', closeModalIfOutsideClick);
		};
	}, [isOpenToggleModalOpen, closeModalIfOutsideClick]);

	// handle hidden scroll body
	useNoScrollBody(isOpenToggleModalOpen);

	// react hook form
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IRegisterProps>({
		resolver: yupResolver(schema),
	});

	const handleOpenModalLogin = async () => {
		await dispatch(closeModalRegister());
		dispatch(openModalLogin());
	};

	// handle register
	const { mutate: MUTATION_REGISTER, isLoading: LOADING_REGISTER } = useRegisterMutation();

	const onSubmit = async (formData: any) => {
		try {
			MUTATION_REGISTER(formData); // gọi đúng kiểu
		} catch (error) {
			console.error('Register error:', error);
		}
	};

	return (
		<section className={`register-wrapper _overlay ${isOpenToggleModalOpen ? '-show' : ''}`}>
			<div
				className="register-inner _custom-scrollbar"
				ref={registerInnerRef}
			>
				<GrFormClose
					className="icon"
					onClick={closeModal}
				/>
				{/* description */}
				<div className="desc _text-center">
					<h4 className="title _text-uppercase">
						<p>2H3T&#39;s</p>REDTAB™
					</h4>
					<p className="content">JOIN OUR RED TAB™ PROGRAM AND GET FREE SHIPPING ON EVERY ORDER.</p>
					<p className="description ">
						Sign up for Levi&#39;s® Red Tab™ to get exclusive access to products, events, and offers. Just
						provide a few details. It&#39;s free to join and open to all.
					</p>
				</div>
				{/* form register */}
				<form
					className="form-register-inner"
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormInput
						name="firstName"
						label="First Name*"
						control={control}
						type="text"
						errors={errors}
					/>
					<FormInput
						name="lastName"
						label="Last Name*"
						control={control}
						type="text"
						errors={errors}
					/>
					<FormInput
						name="email"
						label="Email*"
						control={control}
						type="text"
						errors={errors}
					/>
					<FormInput
						name="password"
						label="Password*"
						control={control}
						type="password"
						errors={errors}
					/>

					<div className="alert">
						Passwords must be at least 8 characters and cant be easy to guess - commonly used or risky
						passwords are not permitted.
					</div>
					<div className="notice">
						By creating an account, I agree to the <p>LS&Co. Terms of Use</p> and the
						<p>Red Tab Member Program Terms and Conditions.</p> I have read the LS&Co. Privacy Policy and{' '}
						<p>Financial Incentive Notice and offer terms.</p>
					</div>

					<Button
						type="submit"
						className="btn-submit"
					>
						{LOADING_REGISTER ? 'Loading...' : 'Join'}
					</Button>
					<button
						className="btn-open-modal"
						type="button"
						onClick={handleOpenModalLogin}
					>
						Log in with an existing account
					</button>
				</form>
			</div>
		</section>
	);
};

export default Register;
