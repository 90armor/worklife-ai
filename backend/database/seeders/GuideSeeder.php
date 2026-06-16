<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GuideSeeder extends Seeder
{
    public function run(): void
    {
        $guides = [
            [
                'title'      => 'How to Change Your Address (転居届)',
                'category'   => 'IMMIGRATION',
                'language'   => 'en',
                'summary'    => 'When you move within Japan, you must notify your city hall within 14 days. This guide explains the steps for foreign residents.',
                'content'    => "## Steps to Change Address\n\n1. Visit your new city hall (市役所) or ward office (区役所) within 14 days of moving.\n2. Bring your Residence Card (在留カード) and personal seal (印鑑) if you have one.\n3. Fill in the Change of Address form (転居届).\n4. Your Residence Card will be updated on the spot with your new address.\n5. Notify the National Pension and Health Insurance offices of your new address.\n\n## Important Notes\n- Failing to report a change of address may result in penalties.\n- Notify your employer, bank, and Japan Post of your new address separately.",
                'source_url' => 'https://www.soumu.go.jp/english/',
            ],
            [
                'title'      => 'National Health Insurance Registration (国民健康保険)',
                'category'   => 'INSURANCE',
                'language'   => 'en',
                'summary'    => 'Foreign residents staying in Japan for more than 3 months must join National Health Insurance (NHI). This guide walks you through registration.',
                'content'    => "## Who Must Join\nAll foreign residents with a status of residence of 3 months or longer are required to enroll in NHI, unless covered by employer-provided insurance.\n\n## Registration Steps\n1. Visit your local city hall with your Residence Card and passport.\n2. Request the National Health Insurance application form.\n3. Submit the form and receive your insurance card (保険証) within a few weeks.\n\n## Premiums\nPremiums are calculated based on your previous year's income. The first year is typically lower. You will receive a payment slip (納付書) by mail.\n\n## Coverage\nNHI covers 70% of medical costs. You pay the remaining 30% at the clinic.",
                'source_url' => 'https://www.mhlw.go.jp/english/policy/health-medical/health-insurance/index.html',
            ],
            [
                'title'      => 'Resident Tax Payment Guide (住民税)',
                'category'   => 'TAX',
                'language'   => 'en',
                'summary'    => 'Resident tax is levied on all residents of Japan, including foreign workers. Learn how it is calculated and how to pay it.',
                'content'    => "## What Is Resident Tax?\nResident tax (住民税) is collected by your prefecture and municipality based on your income from the prior year.\n\n## Payment Methods\n- **Special collection (特別徴収)**: Deducted from your monthly salary by your employer.\n- **Ordinary collection (普通徴収)**: You receive a tax notice and pay in up to 4 instalments.\n\n## When to Pay\nTax notices arrive in June each year. Payment deadlines are typically in June, August, October, and January.\n\n## How to Pay\n- At a bank or convenience store using the payment slip.\n- Via automatic bank transfer if registered.\n\n## If You Leave Japan\nYou must settle any outstanding resident tax before departing.",
                'source_url' => 'https://www.tax.metro.tokyo.lg.jp/english/',
            ],
            [
                'title'      => 'Opening a Bank Account in Japan',
                'category'   => 'BANKING',
                'language'   => 'en',
                'summary'    => 'A practical guide for foreign workers on how to open a bank account in Japan, including required documents and recommended banks.',
                'content'    => "## Required Documents\n- Residence Card (在留カード)\n- Passport\n- Phone number (Japanese SIM recommended)\n- Initial deposit (varies by bank, some accept ¥0)\n\n## Recommended Banks for Foreigners\n- **Japan Post Bank (ゆうちょ銀行)**: Accepts residents after 6 months; widely accepted for salary deposits.\n- **Seven Bank (セブン銀行)**: Easy online application with multilingual support.\n- **Shinsei Bank**: English-language support and internet banking.\n\n## Process\n1. Visit a branch or apply online.\n2. Fill in the account opening form.\n3. Your cash card (キャッシュカード) arrives by mail within 1–2 weeks.\n\n## Tips\n- Some banks require you to have lived in Japan for at least 6 months.\n- Bring a Japanese-speaking colleague if you are not confident with Japanese.",
                'source_url' => null,
            ],
            [
                'title'      => 'Japanese Workplace Etiquette for Foreign Workers',
                'category'   => 'WORKPLACE',
                'language'   => 'en',
                'summary'    => 'Understand the key cultural norms in Japanese workplaces, including communication styles, punctuality, and hierarchy.',
                'content'    => "## Punctuality\nArriving on time — or preferably a few minutes early — is essential. Being late without advance notice is considered disrespectful.\n\n## Hierarchy (上下関係)\nJapanese workplaces are hierarchical. Address seniors with their title and surname (e.g., Tanaka-san). Wait for seniors to sit and eat first.\n\n## Communication\n- Use polite language (敬語) when speaking to supervisors.\n- Avoid saying 'no' directly; instead say 'it may be difficult' (難しいかもしれません).\n- Ask questions to clarify but do not challenge decisions publicly.\n\n## Group Harmony (和)\n- Teamwork is valued over individual achievement.\n- Avoid actions that draw negative attention to others.\n\n## After-Work Socialising (飲み会)\nAfter-work drinks (飲み会) are common. Participation is often expected, though you may decline politely.",
                'source_url' => null,
            ],
            [
                'title'      => 'Renting an Apartment in Japan as a Foreign Worker',
                'category'   => 'HOUSING',
                'language'   => 'en',
                'summary'    => 'A guide to navigating Japan\'s rental market as a foreign resident, including guarantor requirements and typical costs.',
                'content'    => "## Typical Costs\n- **Security deposit (敷金)**: Usually 1–2 months' rent; returned when you leave if no damage.\n- **Key money (礼金)**: A non-refundable payment to the landlord, typically 1–2 months.\n- **Agency fee (仲介手数料)**: Paid to the real estate agent, typically 1 month's rent.\n\n## Guarantor (保証人)\nMost landlords require a Japanese guarantor or a rental guarantee company (保証会社). As a foreign worker, using a guarantee company is the most common route.\n\n## Required Documents\n- Residence Card\n- Passport\n- Employment contract or proof of income\n- Bank statement\n\n## Tips\n- Look for 外国人可 (foreigners welcome) listings.\n- Sharehouse options are easier to enter and require less upfront cost.\n- Your company may assist with finding accommodation upon arrival.",
                'source_url' => null,
            ],
        ];

        foreach ($guides as $guide) {
            DB::table('guides')->insert([
                'id'         => (string) Str::uuid(),
                'title'      => $guide['title'],
                'category'   => $guide['category'],
                'language'   => $guide['language'],
                'summary'    => $guide['summary'],
                'content'    => $guide['content'],
                'source_url' => $guide['source_url'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
