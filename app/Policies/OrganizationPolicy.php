<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Organization $organization): bool
    {
        return $user->organizations->contains($organization->id);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Organization $organization): bool
    {
        return $user->hasRole('Admin', $organization) ||
            $user->id === $organization->owner_user_id;
    }

    public function delete(User $user, Organization $organization): bool
    {
        return $user->id === $organization->owner_user_id;
    }

    public function manage(User $user, Organization $organization): bool
    {
        return $user->hasRole('Admin', $organization) ||
            $user->id === $organization->owner_user_id;
    }
}
