"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter, Chip } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AlertCircleIcon, Lock, MailWarning } from "lucide-react";
import { useRouter } from "next/navigation";

import { supabaseClient } from "@/lib/db";

function getHashParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const hash = window.location.hash.substring(1); // Remove '#'
  const params = new URLSearchParams(hash);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hashParams = getHashParams();

    if (hashParams.error_description) {
      setError(decodeURIComponent(hashParams.error_description));
    } else if (hashParams.error) {
      setError(decodeURIComponent(hashParams.error));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabaseClient.auth.updateUser({ password });

      if (error) {
        setError(error.message || "Failed to reset password.");
      } else {
        setSuccess("Password reset successfully! You can now sign in.");
        setTimeout(() => {
          router.replace("/auth/sign-in");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-xl border border-default-200">
        <CardHeader className="text-2xl font-bold text-center mb-2">
          Set a new password
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <MailWarning className="text-danger" size={48} />
              <div className="text-lg font-semibold text-danger text-center">
                Password Reset Link Error
              </div>
              <div className="text-default-400 text-center text-sm text-danger">
                <AlertCircleIcon
                  className="inline-block mr-1"
                  color="red"
                  size={18}
                />
                {error}
              </div>
              <Button
                className="mt-2"
                color="primary"
                radius="full"
                variant="shadow"
                onClick={() => router.replace("/auth/forgot-password")}
              >
                Request New Reset Link
              </Button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                required
                autoComplete="new-password"
                label="New Password"
                name="password"
                startContent={<Lock size={18} />}
                type="password"
                value={password}
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full mt-2"
                color="primary"
                isLoading={loading}
                radius="full"
                startContent={<Lock size={18} />}
                type="submit"
              >
                Reset Password
              </Button>
              {success && (
                <div className="text-green-600 text-center">{success}</div>
              )}
            </form>
          )}
        </CardBody>
        <CardFooter className="flex flex-col gap-2 items-center">
          <span className="text-xs text-default-500">
            Back to{" "}
            <Link color="primary" href="/auth/sign-in">
              Sign in
            </Link>
          </span>
          <Chip className="mt-2" color="primary" variant="flat">
            Your information is always private & secure
          </Chip>
        </CardFooter>
      </Card>
    </div>
  );
}
