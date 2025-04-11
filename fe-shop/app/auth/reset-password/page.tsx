import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function Page() {
    return (
        <div className="bg-white h-screen flex justify-center items-center py-16 sm:py-24 lg:py-32">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
