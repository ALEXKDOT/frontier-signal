# Model catalog review — 23 November 2026

Automated primary-source review of Anthropic, Google and Meta, against the 16 November catalog. This draft records catalog maintenance, not a safety assessment. Proposed company replacements are in `/private/tmp/frontier-companies-1123.json`; this research task did not modify production data or publish.

| Provider | Previous entries | Reviewed entries | Substantive result |
| --- | ---: | ---: | --- |
| Anthropic | 19 | 19 | Lineup and access unchanged |
| Google | 84 | 85 | Neon added; Genie 4 API access expanded; two transcription descriptions updated; one positioning correction and two source-link repairs |
| Meta | 37 | 37 | Lineup and access unchanged |

All three provider dates and their model check dates advance to 2026-11-23. Existing retired and announced-only entries remain. There are 141 entries across these replacements, including four retired Google entries and one announced-only Meta entry. Featured pairs remain Fable 5.2/Opus 5.5, Carbon/Hydrogen and Wonder Full/Ember.

## Anthropic

Reconciled the entire [model overview](https://platform.claude.com/docs/en/models/overview), [lifecycle table](https://platform.claude.com/docs/en/about-claude/model-deprecations) and [release notes](https://platform.claude.com/docs/en/release-notes/overview). No new named model or retirement since the preceding review. The latest release-note items concern billing and watermarking rather than new model versions.

Fable 5.2 remains the public high-capability selection; Anthropic recommends Opus 5.5 for most workloads. Mythos 5.2/5.1/5 remain restricted. Mythos Preview is deprecated with retirement still unannounced. Sonnet 4.5 remains available during its announced retirement period, ending 30 November. “Not sooner than” dates for active models remain support commitments rather than firm retirement dates. Earlier active Fable, Opus, Sonnet and Haiku versions are retained. These decisions follow the [official lifecycle definitions and table](https://platform.claude.com/docs/en/about-claude/model-deprecations).

## Google

- Added **Gemini 4 Neon**, generally available in the paid API on **18 November**. Its [model card](https://aistudio.google.com/docs/models/gemini-4-neon) documents multimodal input, text output and a unified million-token context. The [selection guide](https://aistudio.google.com/docs/choosing-a-model) positions it between Hydrogen and Carbon for demanding interactive work. Carbon remains the strongest featured model and Hydrogen the everyday choice.
- Changed **Genie 4** from restricted to available following its **19 November API release**. The [current model card](https://aistudio.google.com/docs/models/genie-4) describes steerable video with synchronized audio. The release metadata now explicitly represents API availability; the earlier 27 October trusted-tester preview remains historical context, not a separate model. The [release notes](https://aistudio.google.com/docs/changelog) establish both Neon and Genie API dates.
- Both **Gemini 3.5 Transcribe** endpoints gained voice editing on **17 November**. Updated their purposes using the [file-transcription guide](https://aistudio.google.com/docs/transcribe#voice-editing) and [live-transcription guide](https://aistudio.google.com/docs/live-api/live-transcribe#voice-editing). Their original 26 August model release dates remain; the feature update is not another model release.
- Described **Gemini 3.8 Flash** as an earlier generation alongside Gemini 4, consistent with the [complete catalog](https://aistudio.google.com/docs/models).
- Repaired **CodeGemma** and **CodeGemma 1.1** source links: their old documentation URL now redirects to the generic Gemma index. Google's [CodeGemma card](https://huggingface.co/google/codegemma-7b-it) and [CodeGemma 1.1 card](https://huggingface.co/google/codegemma-1.1-7b-it) still provide the weights.

Reconciled all sections of the [Gemini catalog](https://aistudio.google.com/docs/models) and [deprecations](https://aistudio.google.com/docs/deprecations): speech, image/video, music, embeddings, robotics, managed agents and older available versions. The explicit 1 December redirections for Gemini 2.5 Pro/Flash and 3 December redirection for Omni 1.1 remain. Nano Banana 2 remains deprecated without a shutdown date. Earliest possible shutdown dates for older speech/image models remain qualified prose, without firm `retirementAt` values.

The [Google Cloud Veo table](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) continues to offer 3.1 and 3.1 Fast as GA and 3.1 Lite as preview, despite retirement of separate Gemini API previews. [Gemini 3.8 Flash Cyber](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash-cyber) remains allowlisted. [Project Genie](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie/) remains the source for Genie 3 product access.

Checked the [Gemma releases](https://ai.google.dev/gemma/docs/releases), [five-size Gemma 4 lineup](https://ai.google.dev/gemma/docs/core), earlier-generation cards, and specialist pages for translation, embeddings, moderation, coding, recurrent and encoder-decoder models. The latest listed family release remains EmbeddingGemma 2 on 6 October. [MedGemma](https://developers.google.com/health-ai-developer-foundations/medgemma) still offers both 1 and 1.5. Quantizations and speculative-decoding helpers remain grouped with their parent models.

## Meta

Reconciled the [complete API catalog](https://dev.meta.ai/docs/models), [pricing inventory](https://dev.meta.ai/products/meta-model-api), [model selection guide](https://dev.meta.ai/docs/choose-a-model), model pages, [Llama repository](https://github.com/meta-llama/llama-models) and [Purple Llama safeguards](https://github.com/meta-llama/PurpleLlama). Spark 1.1–1.3 remain offered; contributor variants are equivalent access modes, not extra models. Wonder remains explicitly preview; [Wonder Full remains subscription-only in Muse Code](https://dev.meta.ai/docs/muse-wonder). The existing preview classifications are retained where older preview language and current availability wording differ; missing preview wording alone is not evidence of a GA announcement.

[Muse Glimmer](https://dev.meta.ai/models/muse-glimmer) and [Muse Spark Open](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B) remain downloadable. The [Muse Voice/Avatar article](https://research.meta.ai/blog/bringing-your-muse-to-life) supports product-only models; their exact rollout dates remain unverified. [Muse Video](https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/) remains announced-only because the checked announcement still says coming soon and the API inventory does not offer it.

The [20 November Muse Code 3D feature](https://dev.meta.ai/resources/blog/build-3d-models-with-muse-code) exposes “Nano” and “Pro” tools, but does not establish a named Meta-developed model identity or its underlying provider. Recorded as product tooling, not invented Muse model cards.

## Limits and date decisions

This review covers the established provider catalog scope; it does not claim to enumerate every research checkpoint. Google's separate Health AI Developer Foundations catalog includes additional specialty models outside the existing Gemini/Gemma/Genie/Veo boundary; those and unrelated Meta research-perception families were not added in this maintenance run.

Preserved unresolved release notes for DiffusionGemma, SAM 3.1 API launch, Muse realtime products and older moderation weights. Google's lifecycle table gives different dates for Gemini 3.1 Flash TTS/Live from the explicit [release-note launches](https://aistudio.google.com/docs/changelog); retained 15 April/26 March rather than silently replacing them. The Llama repository summary says 4 December for Llama 3.3, while its [version license explicitly says 6 December 2024](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/LICENSE); retained the existing license-backed date. No speculative retirements or launch dates were added.
