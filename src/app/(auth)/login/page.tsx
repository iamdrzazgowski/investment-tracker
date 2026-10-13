import { LoginForm } from '@/features/auth/components/login-form';
import { AuthShell } from '@/features/auth/components/auth-shell';

export default function LoginPage() {
    return (
        <AuthShell>
            <LoginForm />
        </AuthShell>
    );
}
