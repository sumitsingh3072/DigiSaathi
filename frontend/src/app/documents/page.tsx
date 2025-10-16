import Documents from "@/components/documents/Documents";

export default function DocumentsPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-4 bg-gradient-to-br from-background to-emerald-950/10 dark:from-background dark:to-emerald-900/10">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-10">
          Your Documents
        </h1>

        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300 hover:shadow-emerald-500/20">
          <Documents />
        </div>
      </div>
    </div>
  );
}
