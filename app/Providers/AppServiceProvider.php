<?php

namespace App\Providers;

use App\Models\Contact;
use App\Models\ContactNote;
use App\Models\Organization;
use App\Policies\ContactNotePolicy;
use App\Policies\ContactPolicy;
use App\Policies\OrganizationPolicy;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Organization::class => OrganizationPolicy::class,
        Contact::class => ContactPolicy::class,
        ContactNote::class => ContactNotePolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
