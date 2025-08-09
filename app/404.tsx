"use client";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Link } from "@heroui/link";
import { Ghost, ArrowLeft, Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4">
      <Card className="w-full max-w-lg shadow-2xl border border-default-200">
        <CardHeader className="flex flex-col items-center gap-2">
          <Ghost className="text-primary mb-2 animate-bounce" size={64} />
          <h1 className="text-4xl font-bold text-center">
            404 - Page Not Found
          </h1>
          <p className="text-default-500 text-center max-w-xl mt-2">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-default-400 text-sm">
              Maybe you mistyped the address, or the page has been deleted.
            </span>
            <span className="text-default-400 text-sm">
              Don't worry, you can get back on track!
            </span>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              color="primary"
              startContent={<Home size={18} />}
              variant="solid"
              onClick={() => router.push("/")}
            >
              Go Home
            </Button>
            <Button
              color="secondary"
              startContent={<ArrowLeft size={18} />}
              variant="flat"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button
              as={Link}
              color="default"
              href="/support"
              startContent={<Search size={18} />}
              variant="bordered"
            >
              Support Center
            </Button>
          </div>
          <div className="mt-8 text-xs text-default-400 text-center">
            If you believe this is an error, please{" "}
            <Link color="primary" href="/support/contact">
              contact support
            </Link>
            .
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
