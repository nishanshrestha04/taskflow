import { useState, useCallback } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignee: '',
  tags: '',
};

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...initialData,
          tags: Array.isArray(initialData.tags)
            ? initialData.tags.join(', ')
            : '',
        }
      : DEFAULT_FORM,
  );
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 100)
      errs.title = 'Title must be under 100 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Task title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="e.g. Implement OAuth login"
        error={errors.title}
        required
        autoFocus
      />
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What needs to be done? (optional)"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          options={PRIORITY_OPTIONS}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Due date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
        />
        <Input
          label="Assignee"
          name="assignee"
          value={form.assignee}
          onChange={handleChange}
          placeholder="Name or email"
        />
      </div>
      <Input
        label="Tags"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="design, bug, feature (comma-separated)"
        hint="Separate multiple tags with commas"
      />
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
