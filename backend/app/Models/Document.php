<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'title',
        'content',
        'file_path',
        'embedding',
    ];

    protected $hidden = [
        'embedding',
    ];

    /**
     * Format a PHP array as a pgvector literal: [1,2,3] -> '[1,2,3]'
     *
     * @param array<int, float> $vector
     */
    public static function toVectorLiteral(array $vector): string
    {
        return '[' . implode(',', $vector) . ']';
    }
}
