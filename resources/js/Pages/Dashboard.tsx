import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    UserGroupIcon,
    BuildingOfficeIcon,
    DocumentDuplicateIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import React from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface DashboardProps extends PageProps {
    stats: {
        contacts: number;
        organizations: number;
        notes: number;
        thisWeek: number;
    };
    contactsPerMonth: { month: string; count: number }[];
}

export default function Dashboard({ auth, stats, contactsPerMonth }: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Welcome */}
                    <div className="mb-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                Welcome back, {auth.user.name}!
                            </h3>
                            <p className="text-gray-600">
                                Here's an overview of your contact management system.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={<BuildingOfficeIcon className="w-6 h-6 text-green-600" />}
                            bg="bg-green-100"
                            title="Organizations"
                            value={stats.organizations}
                        />
                        <StatCard
                            icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
                            bg="bg-blue-100"
                            title="Total Contacts"
                            value={stats.contacts}
                        />
                        <StatCard
                            icon={<DocumentDuplicateIcon className="w-6 h-6 text-purple-600" />}
                            bg="bg-purple-100"
                            title="Notes Added"
                            value={stats.notes}
                        />
                        <StatCard
                            icon={<ArrowTrendingUpIcon className="w-6 h-6 text-orange-600" />}
                            bg="bg-orange-100"
                            title="This Week"
                            value={stats.thisWeek}
                        />
                    </div>

                    {/* Graph + Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Contacts Added (Last 6 Months)
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={contactsPerMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                <Link
                                    href={route('contacts.create')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    <UserGroupIcon className="w-5 h-5 mr-2" />
                                    Add New Contact
                                </Link>

                                <Link
                                    href={route('organizations.create')}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                                    Create Organization
                                </Link>

                                <Link
                                    href={route('contacts.index')}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                                    View All Contacts
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ icon, bg, title, value }: { icon: React.ReactNode, bg: string, title: string, value: number }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className={`p-2 ${bg} rounded-lg mr-4`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
