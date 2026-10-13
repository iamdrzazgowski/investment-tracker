import { SignupForm } from '@/features/auth/components/signup-form';
import { AuthShell } from '@/features/auth/components/auth-shell';

export default function SignupPage() {
    return (
        <AuthShell>
            <SignupForm />
        </AuthShell>
    );
}
