import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Welcome back, ${user?.name || 'Student'}!`}
        description="Pick up where you left off and track your progress."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <BookOpen size={48} className="text-zinc-600" />
          <h2 className="text-xl font-semibold text-zinc-100">Continue Learning</h2>
          <p className="text-sm text-zinc-400 max-w-sm">
            You haven't started any learning sheets yet. Browse our library to find the right sheet for you.
          </p>
          <Link to="/">
            <Button className="mt-4">Browse Sheets</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default StudentDashboard;
