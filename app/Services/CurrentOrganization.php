<?php

namespace App\Services;

use App\Models\Organization;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CurrentOrganization
{
    protected string $key = 'current_organization_id';

    public function set(Organization $organization): void
    {
        Session::put($this->key, $organization->id);
    }

    public function get(): ?Organization
    {
        $organizationId = Session::get($this->key);

        if (! $organizationId && Auth::check()) {
            $organization = Auth::user()->organizations()->first();

            if ($organization) {
                $this->set($organization);

                return $organization;
            }

            return null;
        }

        return Organization::find($organizationId);
    }

    public function clear(): void
    {
        Session::forget($this->key);
    }
}
