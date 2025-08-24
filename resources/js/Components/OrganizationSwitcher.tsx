import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Organization } from '@/types';

interface OrganizationSwitcherProps {
    currentOrganization: Organization;
}

export default function OrganizationSwitcher({ currentOrganization }: OrganizationSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { post } = useForm();

    const switchOrganization = (organizationId: number) => {
        post(route('organizations.switch', organizationId), {
            preserveScroll: true,
        });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
            >
                {currentOrganization.name}
                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                        href={route('organizations.index')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Manage Organizations
                    </Link>
                    <Link
                        href={route('organizations.create')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Create New Organization
                    </Link>
                </div>
            )}
        </div>
    );
}
