<?php

namespace App\Http\Middleware;

use App\Services\CurrentOrganization;
use Closure;
use Illuminate\Http\Request;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentOrganization
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle(Request $request, Closure $next): Response
    {
        $currentOrganization = app(CurrentOrganization::class);

        if (! $currentOrganization->get() && $request->user()) {
            $organization = $request->user()->organizations()->first();

            if ($organization) {
                $currentOrganization->set($organization);
            }
        }

        return $next($request);
    }
}
