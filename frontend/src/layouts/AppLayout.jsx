import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-50">
      <Outlet />
    </main>
  );
}

export default AppLayout;
