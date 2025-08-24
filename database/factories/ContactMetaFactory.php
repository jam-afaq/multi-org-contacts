<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\ContactMeta;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactMetaFactory extends Factory
{
    protected $model = ContactMeta::class;

    public function definition(): array
    {
        return [
            'contact_id' => Contact::factory(), // create related contact automatically
            'key' => $this->faker->word(),
            'value' => $this->faker->sentence(),
        ];
    }
}
