<?php

namespace App\Services;

use App\Models\Organization;
use Illuminate\Auth\Access\AuthorizationException;

class OrganizationService
{
    public function get(): mixed
    {
        return auth()->user()->organizations()->get();
    }

    public function create(array $data): void
    {
        $organization = Organization::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'owner_user_id' => auth()->id(),
        ]);

        $organization->users()->attach(auth()->id(), ['role' => 'Admin']);

        $currentOrganization = app(CurrentOrganization::class);
        $currentOrganization->set($organization);
    }

    /**
     * @throws AuthorizationException
     */
    public function switch(Organization $organization): void
    {
        $user = auth()->user();

        if (! $user->organizations->contains($organization->id)) {
            throw new AuthorizationException('You are not a member of this organization.');
        }

        $currentOrganization = app(CurrentOrganization::class);
        $currentOrganization->set($organization);
    }
}
