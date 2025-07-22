<script lang="ts">
	import type { CandidateData } from '$lib/types/candidate';

	let { candidateData, b64 }: { candidateData: CandidateData; b64: string } = $props();

	// Helper to get initials
	function getInitials(firstName?: string, lastName?: string): string {
		return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
	}

	// Helper to format location
	function formatLocation(data: CandidateData): string | null {
		if (data.city && data.country_full_name) {
			return `${data.city}, ${data.country_full_name}`;
		}
		return data.location ?? null;
	}
</script>

<div class="rounded-lg border bg-card p-6 shadow-sm">
	<div class="flex items-start gap-4">
		{#if b64}
			<img
				src={`data:image/png;base64,${b64}`}
				alt={candidateData.full_name ?? 'Profile picture'}
				class="h-16 w-16 rounded-full object-cover"
			/>
		{:else}
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<span class="text-xl font-semibold"
					>{getInitials(candidateData.first_name, candidateData.last_name)}</span
				>
			</div>
		{/if}

		<div class="flex-1 space-y-2">
			<div>
				<h3 class="text-xl font-semibold">{candidateData.full_name ?? 'N/A'}</h3>
				<p class="text-sm text-muted-foreground">{candidateData.headline ?? 'N/A'}</p>
			</div>

			<div class="flex flex-wrap gap-1">
				{#if formatLocation(candidateData)}
					<span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
						{formatLocation(candidateData)}
					</span>
				{/if}
				{#if candidateData.connections}
					<span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
						{candidateData.connections} connections
					</span>
				{/if}
			</div>

			{#if candidateData.skills && candidateData.skills.length > 0}
				<div>
					<h4 class="text-sm font-medium">Skills</h4>
					<div class="mt-1 flex flex-wrap gap-1">
						{#each candidateData.skills.slice(0, 8) as skill (skill)}
							<span
								class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
							>
								{skill}
							</span>
						{/each}
						{#if candidateData.skills.length > 8}
							<span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
								+{candidateData.skills.length - 8} more
							</span>
						{/if}
					</div>
				</div>
			{/if}

			{#if candidateData.people_also_viewed && candidateData.people_also_viewed.length > 0}
				<div>
					<h4 class="text-sm font-medium">People also viewed</h4>
					<div class="mt-1 space-y-1">
						{#each candidateData.people_also_viewed.slice(0, 2) as person (person.link)}
							<p class="text-sm font-medium">{person.name}</p>
							<p class="text-xs text-muted-foreground">
								{person.link}
							</p>
						{/each}
					</div>
				</div>
			{/if}
			{#if candidateData.experiences && candidateData.experiences.length > 0}
				<div>
					<h4 class="text-sm font-medium">Experience</h4>
					<div class="mt-1 space-y-1">
						{#each candidateData.experiences.slice(0, 2) as experience, index (index)}
							<div>
								<p class="text-sm font-medium">{experience.title} at {experience.company}</p>
								{#if experience.starts_at}
									<p class="text-xs text-muted-foreground">
										{experience.starts_at.year} - {experience.ends_at
											? experience.ends_at.year
											: 'Present'}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<slot name="actions" />
		</div>
	</div>
</div>
