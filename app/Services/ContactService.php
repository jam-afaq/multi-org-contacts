<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\ContactMeta;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class ContactService
{
    public function get(array $data): LengthAwarePaginator
    {
        $query = Contact::with(['creator', 'updater'])
            ->orderBy('first_name')
            ->orderBy('last_name');

        if (! empty($data['search'])) {
            $search = $data['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->paginate(10);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws Exception
     */
    public function create(array $data): Contact|array
    {
        $organization = app(CurrentOrganization::class)->get();

        if (! $organization) {
            throw new Exception('No organization selected');
        }

        if (! empty($data['email'])) {
            $existingContact = Contact::where('organization_id', $organization->id)
                ->whereRaw('LOWER(email) = ?', [strtolower($data['email'])])
                ->first();

            if ($existingContact) {
                Log::info('duplicate_contact_blocked', [
                    'org_id' => $organization->id,
                    'email' => $data['email'],
                    'user_id' => auth()->id(),
                ]);

                return [
                    'error' => 'DUPLICATE_EMAIL',
                    'existing_contact_id' => $existingContact->id,
                ];
            }
        }

        $avatarPath = null;
        if (! empty($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            $avatarPath = $data['avatar']->store('avatars', 'public');
        }

        return Contact::create([
            'organization_id' => $organization->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'avatar_path' => $avatarPath,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws Exception
     */
    public function update(array $data, Contact $contact): Contact|array
    {
        $organization = app(CurrentOrganization::class)->get();

        if (! $organization) {
            throw new Exception('No organization selected');
        }

        if (! empty($data['email']) && strtolower($data['email']) !== strtolower($contact->email)) {
            $existingContact = Contact::where('organization_id', $organization->id)
                ->where('id', '!=', $contact->id)
                ->whereRaw('LOWER(email) = ?', [strtolower($data['email'])])
                ->first();

            if ($existingContact) {
                Log::info('duplicate_contact_update_blocked', [
                    'org_id' => $organization->id,
                    'email' => $data['email'],
                    'user_id' => auth()->id(),
                    'contact_id' => $contact->id,
                ]);

                return [
                    'error' => 'DUPLICATE_EMAIL',
                    'existing_contact_id' => $existingContact->id,
                ];
            }
        }

        $avatarPath = $contact->avatar_path;
        if (! empty($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            if ($avatarPath) {
                Storage::disk('public')->delete($avatarPath);
            }
            $avatarPath = $data['avatar']->store('avatars', 'public');
        }

        $contact->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'] ?? $contact->email,
            'phone' => $data['phone'] ?? $contact->phone,
            'avatar_path' => $avatarPath,
            'updated_by' => auth()->id(),
        ]);

        return $contact->fresh();
    }

    /**
     * @throws Exception
     */
    public function duplicate(Contact $contact): Contact
    {
        try {
            $newContact = $contact->replicate();
            $newContact->email = null;
            $newContact->created_by = auth()->id();
            $newContact->updated_by = auth()->id();
            $newContact->save();

            foreach ($contact->meta as $meta) {
                ContactMeta::create([
                    'contact_id' => $newContact->id,
                    'key' => $meta->key,
                    'value' => $meta->value,
                ]);
            }

            return $newContact->load('meta');

        } catch (\Exception $e) {
            Log::error('contact_duplication_failed', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);

            throw new \Exception('Failed to duplicate contact: '.$e->getMessage());
        }
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws Exception
     */
    public function updateMeta(array $metaData, Contact $contact): void
    {
        $organization = app(CurrentOrganization::class)->get();

        if (! $organization) {
            throw new Exception('No organization selected');
        }

        if ($contact->organization_id !== $organization->id) {
            throw new Exception('Contact does not belong to current organization');
        }

        try {
            DB::transaction(function () use ($metaData, $contact) {
                $contact->meta()->delete();

                foreach ($metaData as $meta) {
                    if (! empty($meta['key']) && ! empty($meta['value'])) {
                        ContactMeta::create([
                            'contact_id' => $contact->id,
                            'key' => $meta['key'],
                            'value' => $meta['value'],
                        ]);
                    }
                }
            });

        } catch (Exception $e) {
            Log::error('contact_meta_update_failed', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);

            throw new Exception('Failed to update contact meta: '.$e->getMessage());
        }
    }
}
