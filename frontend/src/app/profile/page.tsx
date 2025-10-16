import Profile from "@/components/profile/Profile";

export default function ProfilePage() {
  return (
    // Main container with a theme-consistent background
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      
      {/* Visual effect background elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      
      {/* Centered content area for the profile card */}
      <div className="w-full max-w-lg">
        <Profile />
      </div>

    </div>
  );
}
