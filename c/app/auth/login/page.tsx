import { LoginForm } from "@/app/components/login/login-form";

const LoginPage = () => {
  return (
    <main className="min-h-dvh bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 px-4 text-white">
      <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
