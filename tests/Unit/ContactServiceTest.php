<?php

namespace Tests\Unit;

use App\Models\Contact;
use App\Models\Organization;
use App\Models\User;
use App\Services\ContactService;
use App\Services\CurrentOrganization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class ContactServiceTest extends TestCase
{
    use RefreshDatabase;

    private ContactService $contactService;
    private Organization $organization;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);

        $this->organization = Organization::factory()->create([
            'owner_user_id' => $this->user->id,
        ]);

        $this->organization->users()->attach($this->user->id, ['role' => 'Admin']);

        // Mock the CurrentOrganization service
        $currentOrganizationMock = Mockery::mock(CurrentOrganization::class);
        $currentOrganizationMock->shouldReceive('get')
            ->andReturn($this->organization);

        $this->app->instance(CurrentOrganization::class, $currentOrganizationMock);

        $this->contactService = app(ContactService::class);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_can_get_contacts_with_pagination()
    {
        Contact::factory()->count(15)->create([
            'organization_id' => $this->organization->id,
        ]);

        $result = $this->contactService->get([]);

        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(10, $result->perPage());
        $this->assertEquals(15, $result->total());
    }

    /** @test */
    public function it_can_search_contacts()
    {
        $contact1 = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
        ]);

        $contact2 = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
        ]);

        $result = $this->contactService->get(['search' => 'John']);

        $this->assertCount(1, $result->items());
        $this->assertEquals('John', $result->items()[0]->first_name);
    }

    /** @test */
    public function it_can_create_a_contact()
    {
        Storage::fake('public');

        $data = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'phone' => '123-456-7890',
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ];

        $result = $this->contactService->create($data);

        $this->assertInstanceOf(Contact::class, $result);
        $this->assertEquals('Test', $result->first_name);
        $this->assertEquals('test@example.com', $result->email);
        $this->assertNotNull($result->avatar_path);
        $this->assertEquals($this->organization->id, $result->organization_id);
    }

    /** @test */
    public function it_prevents_duplicate_email_within_same_organization()
    {
        $existingContact = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'email' => 'duplicate@example.com',
        ]);

        $data = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'duplicate@example.com',
        ];

        $result = $this->contactService->create($data);

        $this->assertIsArray($result);
        $this->assertEquals('DUPLICATE_EMAIL', $result['error']);
        $this->assertEquals($existingContact->id, $result['existing_contact_id']);
    }

    /** @test */
    public function it_allows_same_email_in_different_organizations()
    {
        $otherOrganization = Organization::factory()->create();

        Contact::factory()->create([
            'organization_id' => $otherOrganization->id,
            'email' => 'shared@example.com',
        ]);

        $data = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'shared@example.com',
        ];

        $result = $this->contactService->create($data);

        $this->assertInstanceOf(Contact::class, $result);
        $this->assertEquals('shared@example.com', $result->email);
    }

    /** @test */
    public function it_can_update_a_contact()
    {
        Storage::fake('public');

        $contact = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'Old',
            'last_name' => 'Name',
            'email' => 'old@example.com',
        ]);

        $data = [
            'first_name' => 'New',
            'last_name' => 'Name',
            'email' => 'new@example.com',
            'avatar' => UploadedFile::fake()->image('new-avatar.jpg'),
        ];

        $result = $this->contactService->update($data, $contact);

        $this->assertInstanceOf(Contact::class, $result);
        $this->assertEquals('New', $result->first_name);
        $this->assertEquals('new@example.com', $result->email);
        $this->assertNotNull($result->avatar_path);
    }

    /** @test */
    public function it_prevents_updating_to_duplicate_email()
    {
        $contact1 = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'email' => 'contact1@example.com',
        ]);

        $contact2 = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'email' => 'contact2@example.com',
        ]);

        $data = [
            'first_name' => 'Updated',
            'last_name' => 'Contact',
            'email' => 'contact1@example.com', // Try to use contact1's email
        ];

        $result = $this->contactService->update($data, $contact2);

        $this->assertIsArray($result);
        $this->assertEquals('DUPLICATE_EMAIL', $result['error']);
        $this->assertEquals($contact1->id, $result['existing_contact_id']);
    }

    /** @test */
    public function it_allows_updating_contact_with_same_email()
    {
        $contact = Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'email' => 'same@example.com',
        ]);

        $data = [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => 'same@example.com', // Same email
        ];

        $result = $this->contactService->update($data, $contact);

        $this->assertInstanceOf(Contact::class, $result);
        $this->assertEquals('Updated', $result->first_name);
        $this->assertEquals('same@example.com', $result->email);
    }

    /** @test */
    public function it_throws_exception_when_no_organization_selected()
    {
        $currentOrganizationMock = Mockery::mock(CurrentOrganization::class);
        $currentOrganizationMock->shouldReceive('get')
            ->andReturn(null);

        $this->app->instance(CurrentOrganization::class, $currentOrganizationMock);

        $contactService = app(ContactService::class);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('No organization selected');

        $contactService->create([
            'first_name' => 'Test',
            'last_name' => 'User',
        ]);
    }

    /** @test */
    public function it_throws_exception_when_updating_meta_for_different_organization_contact()
    {
        $otherOrganization = Organization::factory()->create();
        $contact = Contact::factory()->create([
            'organization_id' => $otherOrganization->id,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Contact does not belong to current organization');

        $this->contactService->updateMeta([], $contact);
    }
}
