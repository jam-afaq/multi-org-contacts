<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactNoteRequest;
use App\Models\Contact;
use App\Models\ContactNote;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;

class ContactNoteController extends Controller
{
    public function store(StoreContactNoteRequest $request, Contact $contact): RedirectResponse
    {
        $contact->notes()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        return redirect()->back()->with('success', 'Note added successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function update(StoreContactNoteRequest $request, ContactNote $note): RedirectResponse
    {
        $this->authorize('update', $note);

        $note->update([
            'body' => $request->body,
        ]);

        return redirect()->back()->with('success', 'Note updated successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(ContactNote $note): RedirectResponse
    {
        $this->authorize('delete', $note);

        $note->delete();

        return redirect()->back()->with('success', 'Note deleted successfully.');
    }
}
