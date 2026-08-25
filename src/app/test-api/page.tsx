import { getOrganizations } from "@/lib/graphql/queries/organizations";

export default async function TestApiPage() {
  const result = await getOrganizations();

  return (
    <main className="min-h-screen bg-background p-10 text-primary">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black">
          Test API
        </h1>

        <p className="mt-2 text-secondary">
          Prueba de conexión Frontend → Render → Neon
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-secondary">
                Status
              </p>

              <p className="mt-1 text-xl font-black text-primary">
                {result.status}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-secondary">
                Total
              </p>

              <p className="mt-1 text-xl font-black text-primary">
                {result.count}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {result.data.map((organization) => (
              <div
                key={organization.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <p className="text-sm font-bold text-accent">
                  ID: {organization.id}
                </p>

                <h2 className="mt-1 text-xl font-black text-primary">
                  {organization.name}
                </h2>

                <div className="mt-3 text-sm text-secondary">
                  <p>
                    Creado: {organization.createdAt}
                  </p>

                  <p>
                    Actualizado: {organization.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {result.error && (
            <div className="mt-6 rounded-2xl border border-danger/20 bg-danger/5 p-4">
              <p className="font-bold text-danger">
                {result.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}