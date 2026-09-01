import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

export default async function LoginPage() {
  const session = await auth0.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-primary">
      {/* Background image */}
      <div className="absolute inset-0 opacity-100">
        <Image
          src="/images/login_background.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-background/20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-10 block">
            <Image
              src="/logo/optilab_logo.png"
              alt="OptiLab Logo"
              width={220}
              height={70}
              priority
              className="mx-auto h-auto w-[220px] object-contain"
            />
          </Link>

          {/* Login card */}
          <div className="rounded-[2rem] border border-border bg-surface/95 p-8 shadow-2xl shadow-primary/10 backdrop-blur-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-accent"
            >
              <ArrowLeft size={18} />
              Volver al inicio
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-primary">
              Iniciar sesión
            </h1>

            <p className="mt-3 text-sm leading-6 text-secondary">
              Accede a tu espacio de trabajo para gestionar el inventario del
              laboratorio.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-extrabold text-white transition hover:bg-secondary"
              >
                <LogIn size={18} />
                Iniciar sesión
              </a>

              <a
                href="/auth/login?screen_hint=signup"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-4 text-sm font-extrabold text-primary transition hover:border-accent"
              >
                <UserPlus size={18} />
                Crear una cuenta
              </a>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-secondary">
              El acceso seguro es gestionado mediante Auth0.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-secondary">
            © 2026 OptiLab
          </p>
        </section>
      </div>
    </main>
  );
}