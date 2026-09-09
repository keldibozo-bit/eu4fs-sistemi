import { Card, Field, inputCls } from "@/components/ui";
import { USER_ROLES, USER_ROLE_LABELS } from "@/lib/enums";
import type { User } from "@/lib/types";

export default function UserForm({
  action,
  defaultValues,
  isEdit,
}: {
  action: (fd: FormData) => void;
  defaultValues?: User;
  isEdit?: boolean;
}) {
  return (
    <Card className="p-6 max-w-lg">
      <form action={action} className="space-y-4">
        <Field label="Emri" required>
          <input name="name" required defaultValue={defaultValues?.name} className={inputCls} />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            name="email"
            required
            defaultValue={defaultValues?.email}
            className={inputCls}
          />
        </Field>
        <Field label="Roli" required>
          <select
            name="role"
            required
            defaultValue={defaultValues?.role ?? USER_ROLES[0]}
            className={inputCls}
          >
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>
                {USER_ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </Field>

        {isEdit ? (
          <Field label="Fjalëkalim i Ri (lëreni bosh nëse nuk doni ta ndryshoni)">
            <input type="password" name="newPassword" minLength={6} className={inputCls} />
          </Field>
        ) : (
          <Field label="Fjalëkalimi Fillestar" required>
            <input type="password" name="password" required minLength={6} className={inputCls} />
          </Field>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
          >
            Ruaj
          </button>
        </div>
      </form>
    </Card>
  );
}
