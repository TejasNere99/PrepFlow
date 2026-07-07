import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <Outlet />
      </div>
    </main>
  );
}

export default PublicLayout;
