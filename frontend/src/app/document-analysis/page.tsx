import DocumentAnalysis from "@/components/documentAnalysis/DocumentAnalysis";

export default function DocumentAnalysisPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-4 bg-gradient-to-br from-background to-emerald-950/10 dark:from-background dark:to-emerald-900/10">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-10">
          Document Analysis
        </h1>

        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl shadow-lg p-8 md:p-10 hover:shadow-emerald-500/20 transition-all duration-300">
          <DocumentAnalysis />
        </div>
      </div>
    </div>
  );
}
