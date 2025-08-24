export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Organization {
    id: number;
    name: string;
    slug: string;
    owner_user_id: number;
    created_at: string;
    updated_at: string;
    pivot?: {
        user_id: number;
        organization_id: number;
        role: string;
        created_at: string;
        updated_at: string;
    };
}

export interface Contact {
    id: number;
    organization_id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    avatar_path: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    updater?: User;
    organization?: Organization;
    notes?: ContactNote[];
    meta?: ContactMeta[];
}

export interface ContactNote {
    id: number;
    contact_id: number;
    user_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface ContactMeta {
    id: number;
    contact_id: number;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User;
        permissions?: string[];
    };
    currentOrganization?: Organization | null;
    flash?: {
        success?: string;
        error?: string;
    };
    contacts?: {
        data: Contact[];
        links: any[];
    };
    filters?: {
        search?: string;
    };
    organizations?: Organization[];
    [key: string]: any;
}
