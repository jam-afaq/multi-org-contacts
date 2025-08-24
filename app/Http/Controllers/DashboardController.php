<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactNote;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $contactsPerMonth = Contact::select(
            DB::raw("strftime('%m', created_at) as month"),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => date('M', mktime(0, 0, 0, (int) $row->month, 1)),
                    'count' => $row->count,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => [
                'contacts' => Contact::count(),
                'organizations' => Organization::count(),
                'notes' => ContactNote::count(),
                'thisWeek' => Contact::whereBetween('created_at', [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ])->count(),
            ],
            'contactsPerMonth' => $contactsPerMonth,
        ]);
    }
}
