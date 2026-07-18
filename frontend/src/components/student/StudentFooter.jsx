function StudentFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
              P
            </div>
            <span className="text-sm font-semibold text-zinc-300">PrepFlow</span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} PrepFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default StudentFooter;
