'use server';

import { auth } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';

export type LoginState = {
    success: boolean;

    error?: string;

    fieldErrors?: {
        email?: string[];
        password?: string[];
    };
};

export async function loginAction(values: unknown): Promise<LoginState> {
    const result = loginSchema.safeParse(values);

    if (!result.success) {
        return {
            success: false,
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password } = result.data;

    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error('Login error:', error);

        return {
            success: false,
            error: 'Invalid email or password.',
        };
    }
}
