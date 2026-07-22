import { SlidersHorizontal } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Chip from '../components/ui/Chip.jsx';
import Dropdown from '../components/ui/Dropdown.jsx';
import Input from '../components/ui/Input.jsx';
import Loader from '../components/ui/Loader.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import Textarea from '../components/ui/Textarea.jsx';

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button variant="secondary">
            <SlidersHorizontal size={16} />
            View Controls
          </Button>
        }
        description="Reusable interface foundation for future PrepFlow admin screens."
        title="Dashboard"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Placeholder</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Draft</Badge>
            <Chip>Metadata</Chip>
            <Chip>Tags</Chip>
          </div>
          <Tabs
            activeValue="overview"
            tabs={[
              { label: 'Overview', value: 'overview' },
              { label: 'Activity', value: 'activity' },
              { label: 'Archive', value: 'archive' },
            ]}
          />
          <ProgressBar label="Foundation readiness" value={64} />
        </Card>

        <Card className="space-y-4">
          <Input placeholder="Input placeholder" readOnly />
          <Textarea placeholder="Textarea placeholder" readOnly />
          <div className="flex items-center justify-between gap-3">
            <Loader label="Loader" />
            <Dropdown
              items={[
                { label: 'Option one', value: 'one' },
                { label: 'Option two', value: 'two' },
              ]}
              label="Dropdown"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
