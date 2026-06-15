<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\OpenAIService;
use App\Services\SupabaseStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
    public function __construct(
        private OpenAIService $ai,
        private SupabaseStorageService $storage,
    ) {}

    /**
     * Ingest a document: store optional file, embed content, persist.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file' => 'nullable|file|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $this->storage->upload($request->file('file'), 'documents');
        }

        $embedding = $this->ai->embed($validated['content']);

        $document = Document::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'file_path' => $filePath,
        ]);

        DB::statement(
            'UPDATE documents SET embedding = ? WHERE id = ?',
            [Document::toVectorLiteral($embedding), $document->id]
        );

        return response()->json([
            'id' => $document->id,
            'title' => $document->title,
            'file_url' => $filePath ? $this->storage->publicUrl($filePath) : null,
        ], 201);
    }

    /**
     * Semantic search using cosine distance over pgvector.
     */
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'required|string',
            'limit' => 'nullable|integer|min:1|max:20',
        ]);

        $limit = $validated['limit'] ?? 5;
        $queryEmbedding = Document::toVectorLiteral($this->ai->embed($validated['query']));

        // <=> is pgvector's cosine distance operator (lower = more similar).
        $results = DB::select(
            'SELECT id, title, content, 1 - (embedding <=> ?) AS similarity
             FROM documents
             ORDER BY embedding <=> ?
             LIMIT ?',
            [$queryEmbedding, $queryEmbedding, $limit]
        );

        return response()->json(['results' => $results]);
    }

    /**
     * RAG: retrieve relevant docs then answer with OpenAI chat.
     */
    public function ask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'required|string',
        ]);

        $queryEmbedding = Document::toVectorLiteral($this->ai->embed($validated['query']));

        $context = DB::select(
            'SELECT content FROM documents ORDER BY embedding <=> ? LIMIT 4',
            [$queryEmbedding]
        );

        $answer = $this->ai->chat(
            $validated['query'],
            array_map(fn ($row) => $row->content, $context)
        );

        return response()->json(['answer' => $answer]);
    }
}
