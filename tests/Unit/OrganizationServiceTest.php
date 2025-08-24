<?php

namespace Tests\Unit;

use App\Models\Organization;
use App\Models\User;
use App\Services\CurrentOrganization;
use App\Services\OrganizationService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Fakes\FakeCurrentOrganization;
use Tests\TestCase;

class OrganizationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected FakeCurrentOrganization $fakeCurrentOrg;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fakeCurrentOrg = new FakeCurrentOrganization;
        $this->app->instance(CurrentOrganization::class, $this->fakeCurrentOrg);
    }

    public function test_get_returns_authenticated_users_organizations(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create();
        $org3 = Organization::factory()->create(); // belongs to someone else

        $org1->users()->attach($user->id, ['role' => 'Admin']);
        $org2->users()->attach($user->id, ['role' => 'Member']);
        $org3->users()->attach($other->id, ['role' => 'Admin']);

        $this->actingAs($user);

        $service = app(OrganizationService::class);
        $result = $service->get();

        $this->assertCount(2, $result);
        $this->assertTrue($result->contains('id', $org1->id));
        $this->assertTrue($result->contains('id', $org2->id));
        $this->assertFalse($result->contains('id', $org3->id));
    }

    public function test_create_creates_org_attaches_user_and_sets_current_org(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $service = app(OrganizationService::class);

        $payload = ['name' => 'Acme Inc', 'slug' => 'acme-inc'];
        $service->create($payload);

        $this->assertDatabaseHas('organizations', [
            'name' => 'Acme Inc',
            'slug' => 'acme-inc',
            'owner_user_id' => $user->id,
        ]);

        $org = Organization::where('slug', 'acme-inc')->firstOrFail();

        $this->assertDatabaseHas('organization_user', [
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'role' => 'Admin',
        ]);

        $this->assertNotNull($this->fakeCurrentOrg->setTo);
        $this->assertTrue($this->fakeCurrentOrg->setTo->is($org));
    }

    public function test_switch_sets_current_org_for_member(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $org->users()->attach($user->id, ['role' => 'Member']);

        $this->actingAs($user);
        $service = app(OrganizationService::class);

        $service->switch($org);

        $this->assertNotNull($this->fakeCurrentOrg->setTo);
        $this->assertTrue($this->fakeCurrentOrg->setTo->is($org));
    }

    public function test_switch_throws_for_non_member(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();

        $this->actingAs($user);
        $service = app(OrganizationService::class);

        $this->expectException(AuthorizationException::class);
        $service->switch($org);

        $this->assertNull($this->fakeCurrentOrg->setTo);
    }
}
