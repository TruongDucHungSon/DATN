import CustomImage from '@/compound/customImage/CustomImage';
import { ROUTER } from '@/utils/routes/routes';
import Link from 'next/link';

const Logo = () => {
	return (
		<div>
			<Link
				href={ROUTER.HOME}
				className="logo-link"
			>
				SONTRUONG
			</Link>
		</div>
	);
};

export default Logo;
