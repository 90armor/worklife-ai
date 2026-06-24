<?php

/*
 * ⚠️  The value keys here are duplicated in frontend/src/lib/constants/profileOptions.ts.
 * Backend is the source of truth. Keep both lists of keys in sync.
 * Only the value keys are shared; display labels and translations live solely in the frontend.
 *
 * Rule: never change a key once data is stored against it — change labels on the frontend instead.
 */

return [

    /*
     * Nationality keys are non-exhaustive: the backend accepts any string up to VARCHAR(100)
     * because the frontend's "other" flow sends the user's typed value directly (not "other").
     * These keys are listed for documentation and potential future strict-mode use only.
     */
    'nationality' => [
        'vietnamese',
        'chinese',
        'filipino',
        'nepali',
        'indonesian',
        'myanmar',
        'korean',
        'thai',
        'cambodian',
        'brazilian',
        'indian',
        'bangladeshi',
        'sri_lankan',
        'mongolian',
        'american',
        'british',
        'other',
    ],

    'preferred_language' => [
        'english',
        'japanese',
        'vietnamese',
        'chinese',
        'tagalog',
        'nepali',
        'indonesian',
        'burmese',
        'korean',
        'thai',
        'khmer',
        'portuguese',
        'hindi',
        'bengali',
        'other',
    ],

    /*
     * Occupation allows free-text when the frontend submits a custom value (the "other" flow
     * stores the user's typed text, not the literal key "other"). The controller therefore
     * accepts any string up to max length; these keys are kept here for reference and for
     * UI-level validation if a strict mode is needed in the future.
     */
    'occupation' => [
        'caregiver',
        'manufacturing',
        'construction',
        'agriculture',
        'food_service',
        'hospitality',
        'it_engineering',
        'logistics',
        'retail',
        'cleaning',
        'education',
        'healthcare',
        'office',
        'student',
        'other',
    ],

    'prefecture' => [
        'hokkaido',
        'aomori',
        'iwate',
        'miyagi',
        'akita',
        'yamagata',
        'fukushima',
        'ibaraki',
        'tochigi',
        'gunma',
        'saitama',
        'chiba',
        'tokyo',
        'kanagawa',
        'niigata',
        'toyama',
        'ishikawa',
        'fukui',
        'yamanashi',
        'nagano',
        'gifu',
        'shizuoka',
        'aichi',
        'mie',
        'shiga',
        'kyoto',
        'osaka',
        'hyogo',
        'nara',
        'wakayama',
        'tottori',
        'shimane',
        'okayama',
        'hiroshima',
        'yamaguchi',
        'tokushima',
        'kagawa',
        'ehime',
        'kochi',
        'fukuoka',
        'saga',
        'nagasaki',
        'kumamoto',
        'oita',
        'miyazaki',
        'kagoshima',
        'okinawa',
    ],

];
