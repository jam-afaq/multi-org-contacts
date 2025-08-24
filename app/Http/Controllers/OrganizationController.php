<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationRequest;
use App\Models\Organization;
use App\Services\OrganizationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrganizationController extends Controller
{
    private OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    public function index(): Response
    {
        $organizations = $this->organizationService->get();

        return Inertia::render('Organizations/Index', [
            'organizations' => $organizations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Organizations/Create');
    }

    public function store(StoreOrganizationRequest $request): RedirectResponse
    {
        try {
            $this->organizationService->create($request->validated());

            return redirect()->route('contacts.index')
                ->with('success', 'Organization created successfully.');

        } catch (Throwable $e) {

            logger()->error('Organization creation failed: '.$e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create organization. Please try again.');
        }
    }

    public function switch(Organization $organization): RedirectResponse
    {
        try {

            $this->organizationService->switch($organization);

            return redirect()->back()
                ->with('success', 'Organization switched successfully.');

        } catch (Throwable $e) {

            logger()->error('Organization switch failed: '.$e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to switch organization. Please try again.');
        }
    }
}
