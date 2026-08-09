import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import Input from '../../ui/Input.jsx';
import Modal from '../../ui/Modal.jsx';

const studyDays = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

function PlannerSettingsModal({ isOpen, onClose, onSave, settings }) {
  const [form, setForm] = useState({
    dailyStudyMinutes: settings?.dailyStudyMinutes || 120,
    preferredStudyDays: settings?.preferredStudyDays || [1, 2, 3, 4, 5, 6],
    preferredStudyTime: settings?.preferredStudyTime || '',
  });

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      preferredStudyDays: current.preferredStudyDays.includes(day)
        ? current.preferredStudyDays.filter((value) => value !== day)
        : [...current.preferredStudyDays, day].sort(),
    }));
  };

  return (
    <Modal
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="ghost">Cancel</Button>
          <Button onClick={() => onSave(form)}>Save</Button>
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
      title="Planner Settings"
    >
      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-300">Daily study minutes</span>
          <Input
            min="15"
            onChange={(event) => setForm((current) => ({ ...current, dailyStudyMinutes: event.target.value }))}
            type="number"
            value={form.dailyStudyMinutes}
          />
        </label>
        <div className="space-y-2">
          <span className="text-sm font-medium text-zinc-300">Preferred study days</span>
          <div className="flex flex-wrap gap-2">
            {studyDays.map((day) => (
              <button
                className={`rounded-md border px-3 py-2 text-xs transition-colors ${
                  form.preferredStudyDays.includes(day.value)
                    ? 'border-zinc-200 bg-zinc-100 text-zinc-950'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                }`}
                key={day.value}
                onClick={() => toggleDay(day.value)}
                type="button"
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-300">Preferred study time</span>
          <Input
            onChange={(event) => setForm((current) => ({ ...current, preferredStudyTime: event.target.value }))}
            placeholder="Evening, 7 PM, after class"
            value={form.preferredStudyTime}
          />
        </label>
      </div>
    </Modal>
  );
}

export default PlannerSettingsModal;
