'use client';

export default function VerifyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Check Your Email</h2>
        <p className="text-center text-gray-600 dark:text-gray-300">
          We've sent you an email with a link to verify your account. Please check your inbox and click the link to complete your registration.
        </p>
      </div>
    </div>
  );
} 