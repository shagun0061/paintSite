import { KeyRound, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { AdminPage } from '../../components/admin/AdminPage.jsx';
import { ConfirmButton } from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, fieldProps } from '../../components/ui/Field.jsx';
import { ErrorState, Spinner } from '../../components/ui/States.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { admin, changePassword } from '../../services/endpoints.js';

function ChangePassword() {
  const toast = useToast();
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (values.newPassword !== values.confirm) {
      setErrors({ confirm: 'Passwords do not match' });
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast('Password changed. Other devices have been signed out.');
      setValues({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setErrors(Object.keys(err.details).length ? err.details : { currentPassword: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-sans text-lg font-bold">Change password</h2>
      <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-5 sm:grid-cols-3">
        <Field id="currentPassword" label="Current password" error={errors.currentPassword}>
          <input {...fieldProps('currentPassword', errors.currentPassword)} type="password" autoComplete="current-password" value={values.currentPassword} onChange={set('currentPassword')} />
        </Field>
        <Field id="newPassword" label="New password" error={errors.newPassword} hint="At least 10 characters, letters and numbers.">
          <input {...fieldProps('newPassword', errors.newPassword, { hint: true })} type="password" autoComplete="new-password" value={values.newPassword} onChange={set('newPassword')} />
        </Field>
        <Field id="confirm" label="Confirm new password" error={errors.confirm}>
          <input {...fieldProps('confirm', errors.confirm)} type="password" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} />
        </Field>
        <div className="sm:col-span-3">
          <Button type="submit" icon={KeyRound} loading={saving}>
            Update password
          </Button>
        </div>
      </form>
    </section>
  );
}

function Users() {
  const toast = useToast();
  const { user: me } = useAuth();
  const { data, error, loading, reload } = useAsync((o) => admin.users(o), []);
  const [values, setValues] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await admin.createUser(values);
      toast(`Account created for ${values.email}`);
      setValues({ name: '', email: '', password: '', role: 'editor' });
      reload();
    } catch (err) {
      setErrors(Object.keys(err.details).length ? err.details : { email: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function remove(u) {
    try {
      await admin.deleteUser(u._id);
      toast('Account removed');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-sans text-lg font-bold">Team accounts</h2>
      <p className="mt-1 text-sm text-navy-600">
        Editors can manage projects, services, reviews and enquiries. Only admins can change business settings, delete enquiries and manage accounts.
      </p>
      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} className="mt-5" />
      ) : (
        <ul className="mt-5 divide-y divide-navy-100 rounded-xl ring-1 ring-navy-100">
          {data.items.map((u) => (
            <li key={u._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {u.name} {u._id === me?._id && <span className="font-normal text-navy-500">(you)</span>}
                </p>
                <p className="truncate text-sm text-navy-600">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={u.role === 'admin' ? 'accent' : 'neutral'}>{u.role}</Badge>
                {u._id !== me?._id && (
                  <ConfirmButton size="sm" variant="ghost" className="text-red-600" title="Remove account?" message={`${u.email} will no longer be able to sign in.`} confirmLabel="Remove" onConfirm={() => remove(u)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove {u.email}</span>
                  </ConfirmButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5 border-t border-navy-100 pt-6 sm:grid-cols-2">
        <h3 className="font-sans font-bold sm:col-span-2">Add an account</h3>
        <Field id="u-name" label="Name" error={errors.name}>
          <input {...fieldProps('u-name', errors.name)} value={values.name} onChange={set('name')} />
        </Field>
        <Field id="u-email" label="Email" error={errors.email}>
          <input {...fieldProps('u-email', errors.email)} type="email" value={values.email} onChange={set('email')} />
        </Field>
        <Field id="u-password" label="Temporary password" error={errors.password} hint="At least 10 characters, letters and numbers. Ask them to change it.">
          <input {...fieldProps('u-password', errors.password, { hint: true })} type="password" autoComplete="new-password" value={values.password} onChange={set('password')} />
        </Field>
        <Field id="u-role" label="Role">
          <select {...fieldProps('u-role')} value={values.role} onChange={set('role')}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" icon={UserPlus} loading={saving}>
            Create account
          </Button>
        </div>
      </form>
    </section>
  );
}

export default function Account() {
  const { user, isAdmin } = useAuth();
  return (
    <AdminPage title="Account & users" description={`Signed in as ${user?.email}`}>
      <div className="space-y-6">
        <ChangePassword />
        {isAdmin && <Users />}
      </div>
    </AdminPage>
  );
}
