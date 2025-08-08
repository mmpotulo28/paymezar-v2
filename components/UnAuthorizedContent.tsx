import { Card, CardBody, Link } from "@heroui/react";
import { Lock } from "lucide-react";

const UnAuthorizedContent: React.FC<{ className?: string }> = ({ className = "" }) => {
	return (
		<Card className={`w-full max-w-xl shadow-lg border border-default-200 ${className}`}>
			<CardBody className="flex flex-col items-center justify-center gap-6 p-8">
				<div className="flex flex-col items-center gap-3">
					<Lock size={48} className="text-primary" />
					<span className="text-xl font-bold text-default-800 text-center">
						You need to be authenticated to access this content
					</span>
					<span className="text-default-500 text-center text-sm">
						Please sign in to view your profile and account details.
					</span>
					<Link showAnchorIcon color="primary" className="mt-2" href="/auth/sign-in">
						Sign In
					</Link>
				</div>
			</CardBody>
		</Card>
	);
};

export default UnAuthorizedContent;
