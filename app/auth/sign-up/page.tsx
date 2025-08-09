"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Chip,
  Checkbox,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  AlertCircleIcon,
  ShieldCheck,
  Lock,
  CheckCircle2,
  UserPlus,
  KeyRound,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignUp, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    username: "",
  });
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: signup, 2: verify email
  const [userInfo, setUserInfo] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const { user } = useUser();

  // If already authenticated, redirect to account page
  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isLoaded || !signUp) {
      setError("Sign up is not available");
      setLoading(false);

      return;
    }

    if (!legalAccepted) {
      setError("You must accept the terms and conditions to continue");
      setLoading(false);

      return;
    }

    try {
      // Create user with Clerk including all required fields
      const result = await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
      });

      // Check the status of the sign-up attempt
      if (result.status === "missing_requirements") {
        // Check if there are actually missing fields
        if (result.missingFields && result.missingFields.length > 0) {
          setError(
            `Please complete the following fields: ${result.missingFields.join(", ")}`,
          );
          setLoading(false);

          return;
        }

        // If no missing fields but status is missing_requirements,
        // it likely means email verification is needed
        if (result.unverifiedFields?.includes("email_address")) {
          // Send verification email
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });

          setUserInfo({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
          });
          setSuccess(true);
          setStep(2);
        } else {
          setError("Account creation incomplete. Please try again.");
          setLoading(false);

          return;
        }
      } else if (result.status === "abandoned") {
        setError("Sign up session was abandoned. Please try again.");
        setLoading(false);

        return;
      } else if (result.status === "complete") {
        // Account is fully created and verified - redirect to sign-in
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/sign-in?message=account-created");
        }, 1500);
      } else {
        // Handle other statuses or unverified email
        if (result.unverifiedFields?.includes("email_address")) {
          // Send verification email
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });

          setUserInfo({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
          });
          setSuccess(true);
          setStep(2);
        } else {
          setError("Unable to proceed with sign up. Please try again.");
          setLoading(false);

          return;
        }
      }
    } catch (err: any) {
      console.error("Sign up error:", err);

      // Handle specific Clerk errors
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map((error: any) => {
          if (error.code === "session_exists") {
            return "You are already signed in. Please sign out first or go to your account.";
          }
          if (error.code === "form_identifier_exists") {
            return "An account with this email already exists.";
          }
          if (error.code === "form_username_exists") {
            return "This username is already taken.";
          }
          if (error.code === "form_phone_number_exists") {
            return "An account with this phone number already exists.";
          }
          if (error.code === "form_password_pwned") {
            return "This password has been found in a data breach. Please choose a different password.";
          }
          if (error.code === "form_password_too_common") {
            return "This password is too common. Please choose a more secure password.";
          }
          if (error.code === "form_param_format_invalid") {
            return `Invalid format for ${error.meta?.paramName || "field"}.`;
          }

          return error.message || "An error occurred during sign up.";
        });

        setError(errorMessages[0]);

        // If session exists, redirect to account page
        if (err.errors[0]?.code === "session_exists") {
          setTimeout(() => {
            router.push("/account");
          }, 2000);
        }
      } else {
        setError(err.message || "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setError(null);

    if (!signUp) {
      setError("Verification not available");
      setVerifyLoading(false);

      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/sign-in?message=email-verified");
        }, 1500);
      } else if (completeSignUp.status === "abandoned") {
        setError("Verification session was abandoned. Please start over.");
        setTimeout(() => {
          setStep(1);
          setUserInfo(null);
          setVerificationCode("");
        }, 2000);
      } else {
        setError("Verification failed. Please check your code and try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);

      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map((error: any) => {
          if (error.code === "form_code_incorrect") {
            return "The verification code is incorrect.";
          }
          if (error.code === "verification_expired") {
            return "The verification code has expired. Please request a new one.";
          }
          if (error.code === "verification_failed") {
            return "Verification failed. Please try again.";
          }

          return error.message || "Verification failed.";
        });

        setError(errorMessages[0]);
      } else {
        setError(err.message || "Verification failed");
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] ">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row shadow-xl border border-default-200 overflow-hidden">
        {/* Left: Illustration & Security Info */}
        <div className="hidden md:flex flex-col justify-between items-center bg-gradient-to-br from-primary-100 to-primary-50 p-8 w-1/2 min-h-[500px]">
          <div className="flex flex-col items-center gap-4">
            <ShieldCheck className="text-primary mb-2" size={64} />
            <h2 className="text-2xl font-bold text-primary text-center">
              Your Security is Our Priority
            </h2>
            <p className="text-default-600 text-center max-w-xs">
              All your data is encrypted and protected with industry-leading
              security. We never share your information with third parties.
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-8 w-full">
            <div className="flex items-center gap-2">
              <Lock className="text-success" size={20} />
              <span className="text-sm text-default-700">
                256-bit SSL Encryption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={20} />
              <span className="text-sm text-default-700">
                2FA & biometric login supported
              </span>
            </div>
            <div className="flex items-center gap-2">
              <KeyRound className="text-success" size={20} />
              <span className="text-sm text-default-700">
                Private keys never leave your device
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center mt-8">
            <span className="text-xs text-default-400 mt-2">
              Trusted by thousands of users
            </span>
          </div>
        </div>
        {/* Right: Sign Up Form & Stepper */}
        <div className="flex-1 flex flex-col justify-center p-8 bg-background">
          {step === 1 && (
            <>
              <CardHeader className="text-2xl font-bold text-center mb-2">
                Create your account
              </CardHeader>
              <CardBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex gap-2">
                    <Input
                      required
                      autoComplete="given-name"
                      className="flex-1"
                      label="First Name"
                      name="firstName"
                      startContent={<User size={16} />}
                      value={form.firstName}
                      variant="bordered"
                      onChange={handleChange}
                    />
                    <Input
                      required
                      autoComplete="family-name"
                      className="flex-1"
                      label="Last Name"
                      name="lastName"
                      startContent={<User size={16} />}
                      value={form.lastName}
                      variant="bordered"
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    required
                    autoComplete="username"
                    description="Choose a unique username"
                    label="Username"
                    name="username"
                    startContent={<User size={16} />}
                    value={form.username}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    required
                    autoComplete="email"
                    label="Email"
                    name="email"
                    startContent={<Mail size={16} />}
                    type="email"
                    value={form.email}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    required
                    autoComplete="tel"
                    description="Include country code (e.g., +27)"
                    label="Phone Number"
                    name="phoneNumber"
                    startContent={<Phone size={16} />}
                    type="tel"
                    value={form.phoneNumber}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    required
                    autoComplete="new-password"
                    label="Password"
                    name="password"
                    startContent={<Lock size={16} />}
                    type="password"
                    value={form.password}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Checkbox
                    className="mt-2"
                    isSelected={legalAccepted}
                    size="sm"
                    onValueChange={setLegalAccepted}
                  >
                    I accept the{" "}
                    <Link color="primary" href="/support/terms" size="sm">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link color="primary" href="/support/privacy" size="sm">
                      Privacy Policy
                    </Link>
                  </Checkbox>
                  <Button
                    className="w-full mt-2"
                    color="primary"
                    disabled={!legalAccepted}
                    isLoading={loading}
                    radius="full"
                    startContent={<UserPlus size={18} />}
                    type="submit"
                  >
                    Sign Up
                  </Button>
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircleIcon size={18} /> {error}
                    </div>
                  )}
                  {success && step === 1 && (
                    <div className="text-green-600 text-center">
                      Account created! Redirecting to sign in...
                    </div>
                  )}
                  {success && step === 2 && (
                    <div className="text-green-600 text-center">
                      Account created! Check your email for verification.
                    </div>
                  )}
                </form>
              </CardBody>
              <CardFooter className="flex flex-col gap-2 items-center">
                <span className="text-xs text-default-500">
                  Already have an account?{" "}
                  <Link color="primary" href="/auth/sign-in">
                    Sign in
                  </Link>
                </span>
                <Chip className="mt-2" color="primary" variant="flat">
                  Your information is always private & secure
                </Chip>
              </CardFooter>
            </>
          )}
          {step === 2 && userInfo && (
            <>
              <CardHeader className="text-2xl font-bold text-center mb-2">
                Verify your email
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-4 items-center">
                  <Mail className="text-primary" size={48} />
                  <p className="text-default-700 text-center">
                    We've sent a verification code to{" "}
                    <strong>{userInfo.email}</strong>. Please enter the code
                    below to continue.
                  </p>
                  <form
                    className="flex flex-col gap-4 w-full max-w-xs"
                    onSubmit={handleVerifyEmail}
                  >
                    <Input
                      required
                      className="text-center"
                      label="Verification Code"
                      value={verificationCode}
                      variant="bordered"
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      color="primary"
                      isLoading={verifyLoading}
                      radius="full"
                      startContent={<CheckCircle2 size={18} />}
                      type="submit"
                    >
                      Verify Email
                    </Button>
                  </form>
                  {error && (
                    <div className="text-red-600 text-xs text-center">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-600 text-xs text-center">
                      Email verified! Redirecting to sign in...
                    </div>
                  )}
                </div>
              </CardBody>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
