import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps, Organization as OrganizationType } from '@/types';
import { showToast } from '@/utils/toast';
import { confirmAction } from '@/utils/sweetAlert';

interface IndexProps {
    auth: PageProps['auth'];
    organizations: OrganizationType[];
}

export default function Index({ auth, organizations }: IndexProps) {
    const { post } = useForm();

    const switchOrganization = async (organization: OrganizationType) => {
        const confirmed = await confirmAction(
            'Switch Organization',
            `Are you sure you want to switch to "${organization.name}"?`,
            'Yes, switch',
            'Cancel',
            'question'
        );

        if (confirmed) {
            post(route('organizations.switch', organization.id), {
                onSuccess: () => {
                    showToast.success(`Switched to ${organization.name} successfully!`);
                    // Refresh the page to update the organization context
                    router.reload({ only: ['currentOrganization'] });
                },
                onError: () => {
                    showToast.error('Failed to switch organization.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Organizations</h2>}
        >
            <Head title="Organizations" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Your Organizations</h1>
                                <Link
                                    href={route('organizations.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                >
                                    Create Organization
                                </Link>
                            </div>

                            {organizations.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">You don't have any organizations yet.</p>
                                    <Link
                                        href={route('organizations.create')}
                                        className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
                                    >
                                        Create your first organization
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {organizations.map((organization) => (
                                        <div key={organization.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-900">{organization.name}</h3>
                                            <p className="text-gray-600 mb-2">Slug: {organization.slug}</p>
                                            <p className="text-gray-600 mb-4">Role: {organization.pivot?.role || 'Member'}</p>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => switchOrganization(organization)}
                                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                                >
                                                    Switch to this Organization
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
