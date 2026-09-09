import { Card, Field, inputCls } from "@/components/ui";
import { changeOwnPassword } from "@/app/actions/user";

const GABIM_MESSAGES: Record<string, string> = {
  fjalekalim_gabim: "Fjalëkalimi aktual është i pasaktë.",
  fjalekalim_shkurter: "Fjalëkalimi i ri duhet të ketë të paktën 6 shenja.",
  mospershtatje: "Fjalëkalimi i ri dhe konfirmimi nuk përputhen.",
};

export default function ChangePasswordForm({
  gabim,
  sukses,
}: {
  gabim?: string;
  sukses?: string;
}) {
  return (
    <Card className="p-6 max-w-md">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Ndrysho Fjalëkalimin</h2>

      {sukses && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mb-4">
          Fjalëkalimi u ndryshua me sukses.
        </p>
      )}
      {gabim && GABIM_MESSAGES[gabim] && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
          {GABIM_MESSAGES[gabim]}
        </p>
      )}

      <form action={changeOwnPassword} className="space-y-4">
        <Field label="Fjalëkalimi Aktual" required>
          <input type="password" name="currentPassword" required className={inputCls} />
        </Field>
        <Field label="Fjalëkalimi i Ri" required>
          <input type="password" name="newPassword" required minLength={6} className={inputCls} />
        </Field>
        <Field label="Konfirmo Fjalëkalimin e Ri" required>
          <input type="password" name="confirmPassword" required minLength={6} className={inputCls} />
        </Field>
        <div className="pt-2">
          <button
            type="submit"
            className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
          >
            Ndrysho Fjalëkalimin
          </button>
        </div>
      </form>
    </Card>
  );
}
