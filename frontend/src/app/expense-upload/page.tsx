import ExpenseUpload from "@/components/expense/ExpenseUpload";

export default function ExpenseUploadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-100/30 via-white to-emerald-50/40 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-6">
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/30 dark:bg-zinc-800/40 border border-white/20 dark:border-zinc-700/40 shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
          Expense Upload
        </h1>
        <ExpenseUpload />
      </div>
    </div>
  );
}
