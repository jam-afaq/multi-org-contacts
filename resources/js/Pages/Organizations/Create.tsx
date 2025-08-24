import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { showToast } from '@/utils/toast';
import { confirmAction } from '@/utils/sweetAlert';

interface CreateProps {
    auth: PageProps['auth'];
}

interface FormData {
    name: string;
    slug: string;
}

export default function Create({ auth }: CreateProps) {
    const { data, setData, post, errors, processing } = useForm<FormData>({
        name: '',
        slug: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('organizations.store'), {
            onSuccess: () => {
                showToast.success('Organization created successfully!');
            },
            onError: () => {
                showToast.error('Failed to create organization. Please check the form.');
            },
        });
    };

    const handleCancel = async (e: React.MouseEvent) => {
        e.preventDefault();
        const confirmed = await confirmAction(
            'Cancel Organization Creation',
            'Are you sure you want to cancel? Any unsaved changes will be lost.',
            'Yes, cancel',
            'Continue editing'
        );

        if (confirmed) {
            router.visit(route('organizations.index'));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Organization</h2>}
        >
            <Head title="Create Organization" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Unique identifier for your organization (e.g., my-company).</p>
                                        {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                                    </div>
                                </div>

                                <div className="mt-6 flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Organization'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
