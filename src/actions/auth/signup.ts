'use server';

import { auth } from '@/lib/auth';
import { signupSchema } from '@/lib/validations/auth';

export type SignupState = {
    success: boolean;
    error?: string;
    fieldErrors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
};

export async function signupAction(values: unknown): Promise<SignupState> {
    const result = signupSchema.safeParse(values);

    if (!result.success) {
        return {
            success: false,
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = result.data;

    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error('Signup error:', error);

        return {
            success: false,
            error: 'Unable to create your account. Please try again.',
        };
    }
}
