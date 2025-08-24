<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view contacts',
            'create contacts',
            'edit contacts',
            'delete contacts',
            'manage organizations',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $adminRole = Role::create(['name' => 'Admin']);
        $adminRole->givePermissionTo($permissions);

        $memberRole = Role::create(['name' => 'Member']);
        $memberRole->givePermissionTo([
            'view contacts',
        ]);

        // Create admin user
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
        ]);

        // Assign Admin role to the admin user
        $adminUser->assignRole($adminRole);

        // Optional: Create a regular member user for testing
        $memberUser = User::create([
            'name' => 'Member User',
            'email' => 'member@gmail.com',
            'password' => Hash::make('12345678'),
        ]);

        $memberUser->assignRole($memberRole);

    }
}
