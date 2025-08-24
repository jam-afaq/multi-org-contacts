<?php

namespace Tests\Fakes;

use App\Models\Organization;
use App\Services\CurrentOrganization;

class FakeCurrentOrganization extends CurrentOrganization
{
    public ?Organization $setTo = null;

    public function set(Organization $organization): void
    {
        $this->setTo = $organization;
    }

    public function get(): ?Organization
    {
        return $this->setTo;
    }
}
