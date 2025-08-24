import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { PageProps, Contact, ContactNote } from '@/types';
import { showToast } from '@/utils/toast';
import Swal from "sweetalert2";

interface ShowProps {
    auth: PageProps['auth'];
    contact: Contact;
}


export default function Show({ auth, contact }: ShowProps) {
    const [editingNote, setEditingNote] = useState<ContactNote | null>(null);

    const {
        data: noteData,
        setData: setNoteData,
        post: postNote,
        put: putNote,
        reset: resetNote,
    } = useForm<{ body: string }>({ body: '' });


    const { delete: destroy } = useForm();

    const handleNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        postNote(route("contacts.notes.store", contact.id), {
            onSuccess: () => {
                resetNote(); // clears textarea
                showToast.success("Note added successfully!");
            },
            onError: () => {
                showToast.error("Failed to add note");
            },
        });
    };

    const startEditingNote = (note: ContactNote) => {
        setEditingNote(note);
        setNoteData("body", note.body);
    };

    // Update Note
    const handleNoteUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;

        putNote(route("notes.update", editingNote.id), {
            onSuccess: () => {
                resetNote();
                setEditingNote(null);
                showToast.success("Note updated successfully!");
            },
            onError: () => showToast.error("Failed to update note"),
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingNote(null);
        resetNote();
    };



    const handleNoteDelete = (note: ContactNote) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This note will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("notes.destroy", note.id), {
                    onSuccess: () => showToast.success("Note deleted"),
                    onError: () => showToast.error("Failed to delete note"),
                });
            }
        });
    };

    const {
        data: metaData,
        setData: setMetaData,
        post: postMeta,
        processing: metaProcessing,
    } = useForm<{ meta: { key: string; value: string }[] }>({
        meta: (contact.meta ?? []).length
            ? (contact.meta ?? []).map((m) => ({ key: m.key, value: m.value }))
            : [{ key: '', value: '' }],
    });

    const handleMetaUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        const filteredMeta = metaData.meta.filter(
            (field) => field.key.trim() && field.value.trim()
        );

        setMetaData("meta", filteredMeta);

        postMeta(route("contacts.meta.update", contact.id), {
            onSuccess: () => {
                showToast.success("Custom fields saved!");
                if (filteredMeta.length < 5) {
                    setMetaData("meta", [...filteredMeta, { key: "", value: "" }]);
                }
            },
            onError: () => showToast.error("Failed to save custom fields"),
        });
    };

    const addMetaField = () => {
        if (metaData.meta.length < 5) {
            setMetaData("meta", [...metaData.meta, { key: "", value: "" }]);
        }
    };

    const removeMetaField = (index: number) => {
        if (metaData.meta.length > 1) {
            setMetaData(
                "meta",
                metaData.meta.filter((_, i) => i !== index)
            );
        }
    };

    const updateMetaField = (
        index: number,
        field: "key" | "value",
        value: string
    ) => {
        const updated = [...metaData.meta];
        updated[index] = { ...updated[index], [field]: value };
        setMetaData("meta", updated);
    };

    const deleteContact = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This contact will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("contacts.destroy", contact.id), {
                    onSuccess: () => showToast.success("Contact deleted"),
                    onError: () => showToast.error("Failed to delete contact"),
                });
            }
        });
    };


    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contact: {contact.first_name} {contact.last_name}
                    </h2>
                    <div className="space-x-2">
                        <Link
                            href={route('contacts.edit', contact.id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('contacts.duplicate', contact.id)}
                            method="post"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Duplicate
                        </Link>
                        <button
                            onClick={deleteContact}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Contact: ${contact.first_name} ${contact.last_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* --- Left Column --- */}
                                <div className="md:col-span-1">
                                    {contact.avatar_path ? (
                                        <img
                                            src={`/storage/${contact.avatar_path}`}
                                            alt={contact.first_name}
                                            className="w-32 h-32 rounded-full mx-auto mb-4"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                                            <span className="text-4xl text-gray-400">
                                                {contact.first_name[0]}
                                                {contact.last_name[0]}
                                            </span>
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-bold text-center mb-2">
                                        {contact.first_name} {contact.last_name}
                                    </h2>

                                    <div className="space-y-2">
                                        {contact.email && (
                                            <div>
                                                <strong>Email:</strong>{' '}
                                                {contact.email}
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div>
                                                <strong>Phone:</strong>{' '}
                                                {contact.phone}
                                            </div>
                                        )}
                                        {contact.creator && (
                                            <div>
                                                <strong>Created:</strong>{' '}
                                                {new Date(
                                                    contact.created_at
                                                ).toLocaleDateString()}{' '}
                                                by {contact.creator.name}
                                            </div>
                                        )}
                                        {contact.updater && (
                                            <div>
                                                <strong>Updated:</strong>{' '}
                                                {new Date(
                                                    contact.updated_at
                                                ).toLocaleDateString()}{' '}
                                                by {contact.updater.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- Right Column --- */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Custom Fields */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Custom Fields
                                        </h3>
                                        <form onSubmit={handleMetaUpdate}>
                                            {metaData.meta.map((field, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                                                    <div className="col-span-5">
                                                        <input
                                                            type="text"
                                                            placeholder="Key"
                                                            value={field.key}
                                                            onChange={(e) =>
                                                                updateMetaField(index, "key", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                updateMetaField(index, "value", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        {metaData.meta.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMetaField(index)}
                                                                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex space-x-2">
                                                {metaData.meta.length < 5 && (
                                                    <button
                                                        type="button"
                                                        onClick={addMetaField}
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Add Field
                                                    </button>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={metaProcessing}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Save Fields
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">
                                            Notes
                                        </h3>

                                        {/* Add Note Form */}
                                        <form
                                            onSubmit={editingNote ? handleNoteUpdate : handleNoteSubmit}
                                            className="mb-4"
                                        >
                    <textarea
                        value={noteData.body}
                        onChange={(e) => setNoteData("body", e.target.value)}
                        className="w-full border rounded-lg p-2"
                        placeholder="Write a note..."
                        required
                    />
                                            <div className="mt-2 space-x-2">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                >
                                                    {editingNote ? "Update Note" : "Add Note"}
                                                </button>
                                                {editingNote && (
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>

                                        {/* Notes List */}
                                        {contact.notes?.length ? (
                                            <ul className="space-y-2">
                                                {contact.notes.map((note) => (
                                                    <li
                                                        key={note.id}
                                                        className="border rounded p-3 flex justify-between items-center"
                                                    >
                                                        <p className="text-gray-700">{note.body}</p>
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() => startEditingNote(note)}
                                                                className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleNoteDelete(note)}
                                                                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No notes yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
