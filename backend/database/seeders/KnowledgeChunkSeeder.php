<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KnowledgeChunkSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch guide IDs by title for FK references
        $guideIds = DB::table('guides')->pluck('id', 'title');

        $chunks = [
            // IMMIGRATION
            [
                'guide_title' => 'How to Change Your Address (転居届)',
                'title'       => 'Address Change: Required Documents',
                'category'    => 'IMMIGRATION',
                'language'    => 'en',
                'content'     => 'To change your registered address in Japan, bring your Residence Card (在留カード) and personal seal (印鑑) to the nearest city hall or ward office within 14 days of moving.',
                'source_url'  => 'https://www.soumu.go.jp/english/',
            ],
            [
                'guide_title' => 'How to Change Your Address (転居届)',
                'title'       => 'Address Change: Deadline and Penalties',
                'category'    => 'IMMIGRATION',
                'language'    => 'en',
                'content'     => 'Foreign residents must report a change of address within 14 days. Failure to notify the city hall may result in a fine under the Basic Resident Registration Act.',
                'source_url'  => 'https://www.soumu.go.jp/english/',
            ],

            // INSURANCE
            [
                'guide_title' => 'National Health Insurance Registration (国民健康保険)',
                'title'       => 'NHI: Who Must Enroll',
                'category'    => 'INSURANCE',
                'language'    => 'en',
                'content'     => 'All foreign residents in Japan with a valid residence status of more than 3 months must enroll in National Health Insurance (国民健康保険) unless they are covered by employer-sponsored social insurance.',
                'source_url'  => 'https://www.mhlw.go.jp/english/policy/health-medical/health-insurance/index.html',
            ],
            [
                'guide_title' => 'National Health Insurance Registration (国民健康保険)',
                'title'       => 'NHI: Premium Calculation',
                'category'    => 'INSURANCE',
                'language'    => 'en',
                'content'     => 'National Health Insurance premiums are based on your previous year\'s income (所得). New arrivals with no prior income in Japan typically pay a minimum premium. Premiums are billed annually and can be paid in instalments at convenience stores or banks.',
                'source_url'  => null,
            ],

            // TAX
            [
                'guide_title' => 'Resident Tax Payment Guide (住民税)',
                'title'       => 'Resident Tax: Special vs Ordinary Collection',
                'category'    => 'TAX',
                'language'    => 'en',
                'content'     => 'Resident tax (住民税) is collected either via special collection (特別徴収), deducted from your salary by your employer, or ordinary collection (普通徴収), where you receive a notice and pay directly. If you change jobs, your tax collection method may switch.',
                'source_url'  => 'https://www.tax.metro.tokyo.lg.jp/english/',
            ],
            [
                'guide_title' => 'Resident Tax Payment Guide (住民税)',
                'title'       => 'Resident Tax: Leaving Japan',
                'category'    => 'TAX',
                'language'    => 'en',
                'content'     => 'If you leave Japan before the end of the tax year, you must appoint a tax agent (納税管理人) or pay all outstanding resident tax before departure. Unpaid taxes can affect future re-entry to Japan.',
                'source_url'  => null,
            ],

            // BANKING
            [
                'guide_title' => 'Opening a Bank Account in Japan',
                'title'       => 'Bank Account: Documents Required',
                'category'    => 'BANKING',
                'language'    => 'en',
                'content'     => 'To open a bank account in Japan as a foreign resident, you need your Residence Card (在留カード), passport, and a Japanese phone number. Some banks require you to have been a resident for at least 6 months.',
                'source_url'  => null,
            ],

            // WORKPLACE
            [
                'guide_title' => 'Japanese Workplace Etiquette for Foreign Workers',
                'title'       => 'Workplace: Hierarchy and Politeness',
                'category'    => 'WORKPLACE',
                'language'    => 'en',
                'content'     => 'Japanese workplaces are hierarchical. Use polite language (敬語) when speaking to supervisors. Address seniors using their surname followed by -san (e.g., Yamada-san). Avoid disagreeing with a superior in public.',
                'source_url'  => null,
            ],
            [
                'guide_title' => 'Japanese Workplace Etiquette for Foreign Workers',
                'title'       => 'Workplace: Punctuality',
                'category'    => 'WORKPLACE',
                'language'    => 'en',
                'content'     => 'Punctuality is critical in Japanese workplaces. Arriving even a few minutes late is considered disrespectful. Always inform your supervisor in advance if you may be late due to an unexpected event.',
                'source_url'  => null,
            ],

            // HOUSING
            [
                'guide_title' => 'Renting an Apartment in Japan as a Foreign Worker',
                'title'       => 'Housing: Key Money and Deposits Explained',
                'category'    => 'HOUSING',
                'language'    => 'en',
                'content'     => 'When renting in Japan, you will typically pay a security deposit (敷金) of 1–2 months\' rent (refundable) and key money (礼金) of 1–2 months\' rent (non-refundable). These upfront costs can total 4–6 months\' rent before moving in.',
                'source_url'  => null,
            ],
            [
                'guide_title' => 'Renting an Apartment in Japan as a Foreign Worker',
                'title'       => 'Housing: Guarantor Requirements for Foreigners',
                'category'    => 'HOUSING',
                'language'    => 'en',
                'content'     => 'Most Japanese landlords require a guarantor (保証人). Foreign workers without a Japanese guarantor can use a rental guarantee company (保証会社). The guarantee company fee is typically 50–100% of one month\'s rent, paid annually.',
                'source_url'  => null,
            ],
        ];

        foreach ($chunks as $chunk) {
            DB::table('knowledge_chunks')->insert([
                'id'         => (string) Str::uuid(),
                'guide_id'   => $guideIds[$chunk['guide_title']] ?? null,
                'title'      => $chunk['title'],
                'category'   => $chunk['category'],
                'language'   => $chunk['language'],
                'content'    => $chunk['content'],
                'source_url' => $chunk['source_url'],
                // embedding is left NULL — populate via the embedding ingestion command
                'created_at' => now(),
            ]);
        }
    }
}
