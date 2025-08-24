<?php

namespace App\Providers;

use App\Models\Contact;
use App\Models\ContactNote;
use App\Models\Organization;
use App\Policies\ContactNotePolicy;
use App\Policies\ContactPolicy;
use App\Policies\OrganizationPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * @var string[]
     */
    protected $policies = [
        Organization::class => OrganizationPolicy::class,
        Contact::class => ContactPolicy::class,
        ContactNote::class => ContactNotePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        // Define additional gates if needed
        Gate::define('manage-organizations', function ($user, $organization) {
            return $user->hasRole('Admin', $organization) ||
                $user->id === $organization->owner_user_id;
        });

        Gate::define('view-contacts', function ($user) {
            return $user->hasPermissionTo('view contacts');
        });

        Gate::define('create-contacts', function ($user) {
            return $user->hasPermissionTo('create contacts');
        });

        Gate::define('edit-contacts', function ($user) {
            return $user->hasPermissionTo('edit contacts');
        });

        Gate::define('delete-contacts', function ($user) {
            return $user->hasPermissionTo('delete contacts');
        });
    }
}
