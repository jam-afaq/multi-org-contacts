<?php

namespace App\Policies;

use App\Models\ContactNote;
use App\Models\User;

class ContactNotePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ContactNote $contactNote): bool
    {
        return $user->id === $contactNote->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ContactNote $contactNote): bool
    {
        return $user->id === $contactNote->user_id;
    }

    public function delete(User $user, ContactNote $contactNote): bool
    {
        return $user->id === $contactNote->user_id;
    }
}
