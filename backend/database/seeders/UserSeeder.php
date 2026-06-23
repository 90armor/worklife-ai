<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'full_name'          => 'Ninety Armor',
                'email'              => 'ninetyarmor@example.com',
                'nationality'        => 'Myanmar',
                'preferred_language' => 'mm',
                'prefecture'         => 'Tokyo',
                'occupation'         => 'Caregiver',
            ],
            [
                'full_name'          => 'Nguyen Thi Lan',
                'email'              => 'lan@example.com',
                'nationality'        => 'Vietnam',
                'preferred_language' => 'vi',
                'prefecture'         => 'Osaka',
                'occupation'         => 'Factory Worker',
            ],
            [
                'full_name'          => 'Siti Rahayu',
                'email'              => 'siti@example.com',
                'nationality'        => 'Indonesia',
                'preferred_language' => 'id',
                'prefecture'         => 'Nagoya',
                'occupation'         => 'IT Engineer',
            ],
            [
                'full_name'          => 'Bikash Sharma',
                'email'              => 'bikash@example.com',
                'nationality'        => 'Nepal',
                'preferred_language' => 'ne',
                'prefecture'         => 'Sapporo',
                'occupation'         => 'Restaurant Staff',
            ],
            [
                'full_name'          => 'Maria Tanaka',
                'email'              => 'maria@example.com',
                'nationality'        => 'Japan',
                'preferred_language' => 'jp',
                'prefecture'         => 'Hokkaido',
                'occupation'         => 'Teacher',
            ]
        ];

        foreach ($users as $user) {
            DB::table('users')->insert([
                'id'                 => (string) Str::uuid(),
                'email'              => $user['email'],
                'password_hash'      => Hash::make('password'),
                'full_name'          => $user['full_name'],
                'nationality'        => $user['nationality'],
                'preferred_language' => $user['preferred_language'],
                'prefecture'         => $user['prefecture'],
                'occupation'         => $user['occupation'],
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);
        }
    }
}
