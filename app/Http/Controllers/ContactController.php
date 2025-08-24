<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use App\Services\ContactService;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Throwable;

class ContactController extends Controller
{
    private ContactService $contactService;

    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    public function index(Request $request): Response|RedirectResponse
    {
        try {
            $contacts = $this->contactService->get($request->all());

            return Inertia::render('Contacts/Index', [
                'contacts' => $contacts,
                'filters' => $request->only(['search']),
            ]);
        } catch (Throwable $e) {
            Log::error('contacts_index_error', ['error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Unable to load contacts.');
        }
    }

    public function create(): Response|RedirectResponse
    {
        try {
            return Inertia::render('Contacts/Create');
        } catch (Throwable $e) {
            Log::error('contacts_create_error', ['error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Unable to open create form.');
        }
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function store(StoreContactRequest $request): RedirectResponse|JsonResponse
    {
        try {
            $result = $this->contactService->create($request->validated());

            if (is_array($result) && isset($result['error']) && $result['error'] === 'DUPLICATE_EMAIL') {
                return response()->json([
                    'code' => 'DUPLICATE_EMAIL',
                    'existing_contact_id' => $result['existing_contact_id'],
                ], 422);
            }

            if ($result instanceof Contact) {
                return redirect()->route('contacts.index')
                    ->with('success', 'Contact created successfully.');
            }

            return redirect()->back()
                ->with('error', 'Failed to create contact.');

        } catch (\Exception $e) {
            Log::error('contacts_store_error', ['error' => $e->getMessage()]);

            if ($e->getMessage() === 'No organization selected') {
                return redirect()->route('organizations.index')
                    ->with('error', 'Please select an organization first.');
            }

            return redirect()->back()
                ->with('error', 'Failed to create contact.');
        }
    }

    public function show(Contact $contact): Response|RedirectResponse
    {
        try {

            $contact->load(['notes.user', 'meta', 'creator', 'updater']);

            return Inertia::render('Contacts/Show', [
                'contact' => $contact,
            ]);
        } catch (AuthorizationException $e) {
            return redirect()->route('contacts.index')->with('error', 'Unauthorized.');
        } catch (Throwable $e) {
            Log::error('contacts_show_error', ['error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Failed to load contact details.');
        }
    }

    public function edit(Contact $contact): Response|RedirectResponse
    {
        try {
            return Inertia::render('Contacts/Edit', [
                'contact' => $contact,
            ]);
        } catch (Throwable $e) {
            Log::error('contacts_edit_error', ['error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Unable to load edit form.');
        }
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function update(UpdateContactRequest $request, Contact $contact): RedirectResponse|JsonResponse
    {
        try {
            $result = $this->contactService->update($request->validated(), $contact);

            if (is_array($result) && isset($result['error']) && $result['error'] === 'DUPLICATE_EMAIL') {
                return response()->json([
                    'code' => 'DUPLICATE_EMAIL',
                    'existing_contact_id' => $result['existing_contact_id'],
                ], 422);
            }

            if ($result instanceof Contact) {
                return redirect()->route('contacts.index')
                    ->with('success', 'Contact updated successfully.');
            }

            return redirect()->back()
                ->with('error', 'Failed to update contact.');

        } catch (Exception $e) {
            Log::error('contacts_update_error', ['error' => $e->getMessage()]);

            if ($e->getMessage() === 'No organization selected') {
                return redirect()->route('organizations.index')
                    ->with('error', 'Please select an organization first.');
            }

            return redirect()->back()
                ->with('error', 'Failed to update contact.');
        }
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        try {
            if ($contact->avatar_path) {
                Storage::disk('public')->delete($contact->avatar_path);
            }

            $contact->delete();

            return redirect()->route('contacts.index')
                ->with('success', 'Contact deleted successfully.');
        } catch (Throwable $e) {
            Log::error('contacts_destroy_error', ['error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Failed to delete contact.');
        }
    }

    public function duplicate(Contact $contact): RedirectResponse
    {
        try {
            $this->contactService->duplicate($contact);

            return redirect()->route('contacts.index')
                ->with('success', 'Contact duplicated successfully.');

        } catch (Exception $e) {
            Log::error('contacts_duplicate_error', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to duplicate contact.');
        }
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function updateMeta(Request $request, Contact $contact): RedirectResponse
    {
        try {
            $this->contactService->updateMeta($request->meta ?? [], $contact);

            return redirect()->back()->with('success', 'Custom fields updated successfully.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();

        } catch (Exception $e) {

            if ($e->getMessage() === 'No organization selected') {
                return redirect()->route('organizations.index')
                    ->with('error', 'Please select an organization first.');
            }

            if ($e->getMessage() === 'Contact does not belong to current organization') {
                return redirect()->back()
                    ->with('error', 'You cannot update this contact.');
            }

            return redirect()->back()
                ->with('error', 'Failed to update custom fields.');
        }
    }
}
