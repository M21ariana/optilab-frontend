import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Mail } from "lucide-react";

export default function LoginPage() {
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

                        <form className="mt-8 space-y-5">
                            <label className="block">
                                <span className="mb-2 block text-sm font-bold">
                                    Correo electrónico
                                </span>

                                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                                    <Mail size={18} className="text-accent" />
                                    <input
                                        type="email"
                                        placeholder="usuario@laboratorio.com"
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-bold">Contraseña</span>

                                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                                    <Lock size={18} className="text-accent" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
                                    />
                                </div>
                            </label>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-secondary">
                                    <input type="checkbox" className="h-4 w-4 accent-[#2A9D8F]" />
                                    Recordarme
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="font-bold text-accent"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            <Link
                                href="/dashboard"
                                className="flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-4 text-sm font-extrabold text-white transition hover:bg-secondary"
                            >
                                Iniciar sesión
                            </Link>

                            <button
                                type="button"
                                className="flex w-full items-center justify-center rounded-2xl border border-border bg-white px-5 py-4 text-sm font-extrabold text-primary transition hover:border-accent"
                            >
                                Continuar con Auth0
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-secondary">
                        © 2026 OptiLab
                    </p>
                </section>
            </div>
        </main>
    );
}