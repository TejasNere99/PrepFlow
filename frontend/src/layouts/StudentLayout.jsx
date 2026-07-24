import { Outlet } from 'react-router-dom';
import StudentHeader from '../components/student/StudentHeader.jsx';
import StudentFooter from '../components/student/StudentFooter.jsx';
import SearchOverlay from '../components/ui/SearchOverlay.jsx';

function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <StudentHeader />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          {children || <Outlet />}
        </div>
      </main>
      <StudentFooter />
      <SearchOverlay />
    </div>
  );
}

export default StudentLayout;
