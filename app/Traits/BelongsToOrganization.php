<?php

namespace App\Traits;

use App\Services\CurrentOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

trait BelongsToOrganization
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    protected static function bootBelongsToOrganization(): void
    {
        static::addGlobalScope('organization', function (Builder $builder) {
            $currentOrganization = app(CurrentOrganization::class);

            if ($currentOrganization->get()) {
                $builder->where('organization_id', $currentOrganization->get()->id);
            }
        });

        static::creating(function (Model $model) {
            $currentOrganization = app(CurrentOrganization::class);

            if ($currentOrganization->get() && ! $model->organization_id) {
                $model->organization_id = $currentOrganization->get()->id;
            }
        });
    }
}
