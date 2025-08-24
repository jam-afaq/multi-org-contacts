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
