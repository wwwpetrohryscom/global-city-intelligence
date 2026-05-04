// Provider boundary for future AI-assisted text generation.
// Intentionally NOT wired to any external API. The platform's content layer is
// deterministic and build-safe; this interface only documents the shape a
// future provider would need to satisfy.

export interface ContentProviderRequest {
  /** Short, neutral instruction shown to the model. */
  prompt: string;
  /** Structured facts the model is allowed to use. No invention permitted. */
  facts: Record<string, unknown>;
  /** Soft cap on output length so generated copy stays page-appropriate. */
  maxLength: number;
}

export interface ContentProvider {
  generateText(request: ContentProviderRequest): Promise<string>;
}

/**
 * Default no-op provider. Refuses to call out so build-time pages remain
 * deterministic. Future providers can replace this without changing pages.
 */
export const noopContentProvider: ContentProvider = {
  async generateText() {
    throw new Error(
      "No external content provider is configured. Use deterministic generators in lib/content/generators.ts.",
    );
  },
};
