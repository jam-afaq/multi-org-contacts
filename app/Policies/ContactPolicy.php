<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view contacts');
    }

    public function view(User $user, Contact $contact): bool
    {
        return $user->hasPermissionTo('view contacts') &&
            $user->organizations->contains($contact->organization_id);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create contacts');
    }

    public function update(User $user, Contact $contact): bool
    {
        return $user->hasPermissionTo('edit contacts') &&
            $user->organizations->contains($contact->organization_id);
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $user->hasPermissionTo('delete contacts') &&
            $user->organizations->contains($contact->organization_id);
    }

    public function duplicate(User $user, Contact $contact): bool
    {
        return $user->hasPermissionTo('create contacts') &&
            $user->organizations->contains($contact->organization_id);
    }
}
