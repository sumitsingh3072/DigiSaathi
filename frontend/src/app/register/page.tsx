import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    // Main container with a background that adapts to dark/light mode
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      
      {/* Background shapes for visual effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      
      <div className="w-full max-w-md">
        <RegisterForm />
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 dark:text-green-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
