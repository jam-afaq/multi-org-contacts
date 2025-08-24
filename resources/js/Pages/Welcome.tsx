import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
                                    auth,
                                }: PageProps) {
    return (
        <>
            <Head title="Welcome to Contact Management System" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-4xl px-6">
                        <header className="py-12 text-center">
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                    Contact Management System
                                </h1>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Organize your contacts, manage multiple organizations,
                                    and streamline your communication with our powerful contact management solution.
                                </p>
                            </div>

                            <nav className="flex justify-center space-x-6">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-lg border border-blue-600 transition-colors duration-200"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="grid gap-8 md:grid-cols-3 mb-16">
                            {/* Feature 1 */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Organizations</h3>
                                <p className="text-gray-600">
                                    Create and switch between different organizations to manage contacts for various teams or projects.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Management</h3>
                                <p className="text-gray-600">
                                    Full CRUD operations for contacts with avatar support, custom fields, and notes.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Role-based Access</h3>
                                <p className="text-gray-600">
                                    Admin and Member roles with different permissions to control access to features.
                                </p>
                            </div>
                        </main>

                        <footer className="text-center py-8">
                            <p className="text-gray-500">
                                Built with Laravel, Inertia.js, React, and Tailwind CSS
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
