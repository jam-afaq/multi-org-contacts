<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactNoteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HealthCheckController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/healthz', HealthCheckController::class);

Route::get('/', function () {

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Organizations
    Route::get('/organizations', [OrganizationController::class, 'index'])->name('organizations.index');
    Route::get('/organizations/create', [OrganizationController::class, 'create'])->name('organizations.create');
    Route::post('/organizations', [OrganizationController::class, 'store'])->name('organizations.store');
    Route::post('/organizations/{organization}/switch', [OrganizationController::class, 'switch'])->name('organizations.switch');

    // Contacts
    Route::resource('contacts', ContactController::class);
    Route::post('/contacts/{contact}/duplicate', [ContactController::class, 'duplicate'])->name('contacts.duplicate');
    Route::post('/contacts/{contact}/meta', [ContactController::class, 'updateMeta'])->name('contacts.meta.update');

    // Contact Notes
    Route::post('/contacts/{contact}/notes', [ContactNoteController::class, 'store'])->name('contacts.notes.store');
    Route::put('/notes/{note}', [ContactNoteController::class, 'update'])->name('notes.update');
    Route::delete('/notes/{note}', [ContactNoteController::class, 'destroy'])->name('notes.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
