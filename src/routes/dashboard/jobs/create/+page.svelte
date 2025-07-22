<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type {
		CreateStep,
		Currency,
		Job,
		JobPriority,
		JobStatus,
		JobType,
		Requirement,
		RequirementType
	} from '$lib/types/job.js';

	let currentStep: CreateStep = $state('basic');
	let isSaving = $state(false);
	let validationErrors = $state<string[]>([]);

	let formData: Job = $state({
		id: '',
		title: '',
		department: '',
		location: '',
		type: '' as JobType,
		status: '' as JobStatus,
		priority: '' as JobPriority,
		salary: {
			min: 0,
			max: 0,
			currency: '' as Currency
		},
		postedDate: new Date().toISOString().split('T')[0],
		updatedDate: new Date().toISOString().split('T')[0],
		description: '',
		responsibilities: ['Design and implement new features', 'Write clean, maintainable code'],
		requirements: [],
		benefits: ['Health insurance', 'Flexible working hours'],
		tech_stack: ['Typescript', 'Svelte', 'Tailwind CSS'],
		remote_policy: '' as keyof typeof REMOTE_POLICY_OPTIONS
	});

	let showResponsibilitiesMock = $state(true);
	let showBenefitsMock = $state(true);
	let showTechStackMock = $state(true);
	let isSalaryOptional = $state(false);

	const REMOTE_POLICY_OPTIONS = {
		remote: 'Remote',
		hybrid: 'Hybrid',
		'on-site': 'On-site'
	} as const;

	function updateFormData(updates: Partial<Job>) {
		formData = {
			...formData,
			...updates
		};
	}

	function handleSelectChange(name: string, value: { value: string; label: string }) {
		let updates: Partial<Job> = {};
		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			updates = {
				[parent]: {
					...(formData[parent as keyof Job] as Record<string, any>),
					[child]: value.value
				}
			};
		} else {
			updates = {
				[name]: value.value
			};
		}

		formData = {
			...formData,
			...updates
		};
	}

	function handleRequirementChange(name: string, value: { value: string; label: string }) {
		const [parent, child] = name.split('.');
		formData = {
			...formData,
			requirements: formData.requirements.map((req, index) => {
				if (index === parseInt(parent)) {
					return { ...req, [child]: value.value };
				}
				return req;
			})
		};
	}

	function validateBasicStep(): boolean {
		const errors: string[] = [];
		if (!formData.title) errors.push('Title is required');
		if (!formData.department) errors.push('Department is required');
		if (!formData.location) errors.push('Location is required');
		if (!formData.type) errors.push('Job type is required');
		if (!formData.remote_policy) errors.push('Remote policy is required');
		if (!formData.priority) errors.push('Priority is required');
		if (!isSalaryOptional) {
			if (!formData.salary.currency) errors.push('Currency is required');
			if (!formData.salary.min || !formData.salary.max) errors.push('Salary range is required');
		}
		if (!formData.description) errors.push('Description is required');
		if (formData.responsibilities.length === 0)
			errors.push('At least one responsibility is required');

		validationErrors = errors;
		return errors.length === 0;
	}

	function validateRequirementsStep(): boolean {
		const errors: string[] = [];
		if (formData.requirements.length === 0) {
			errors.push('At least one requirement is required');
		} else {
			formData.requirements.forEach((req, index) => {
				if (!req.description) errors.push(`Requirement ${index + 1} description is required`);
				if (!req.weight) errors.push(`Requirement ${index + 1} weight is required`);
			});
		}
		if (formData.benefits.length === 0) errors.push('At least one benefit is required');
		if (formData.tech_stack.length === 0) errors.push('At least one tech stack item is required');

		validationErrors = errors;
		return errors.length === 0;
	}

	function validateFinalSubmission(): boolean {
		const errors: string[] = [];
		if (!formData.title?.trim()) errors.push('Job title is required');
		if (!formData.department?.trim()) errors.push('Department is required');
		if (!formData.location?.trim()) errors.push('Location is required');
		if (!formData.type) errors.push('Job type is required');
		if (!formData.remote_policy) errors.push('Remote policy is required');
		if (!formData.priority) errors.push('Priority is required');
		if (!formData.description?.trim()) errors.push('Job description is required');
		if (formData.responsibilities.length === 0)
			errors.push('At least one responsibility is required');

		if (!isSalaryOptional) {
			if (!formData.salary.currency) errors.push('Currency is required');
			if (!formData.salary.min || !formData.salary.max) errors.push('Salary range is required');
			if (formData.salary.min > formData.salary.max)
				errors.push('Minimum salary cannot be greater than maximum salary');
			if (formData.salary.min < 0 || formData.salary.max < 0)
				errors.push('Salary values cannot be negative');
		}

		if (formData.requirements.length === 0) errors.push('At least one requirement is required');
		formData.requirements.forEach((req, index) => {
			if (!req.description?.trim()) errors.push(`Requirement ${index + 1} description is required`);
			if (!req.weight) errors.push(`Requirement ${index + 1} weight is required`);
			if (req.weight < 1 || req.weight > 10)
				errors.push(`Requirement ${index + 1} weight must be between 1 and 10`);
		});

		if (formData.benefits.length === 0) errors.push('At least one benefit is required');

		if (formData.tech_stack.length === 0) errors.push('At least one tech stack item is required');

		validationErrors = errors;
		return errors.length === 0;
	}

	async function handleSave() {
		if (!validateFinalSubmission()) {
			return;
		}

		isSaving = true;
		try {
			const response = await fetch('/api/jobs/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				window.location.href = '/dashboard/jobs';
			} else {
				const error = await response.json();
				validationErrors = [error.message || 'Failed to create job posting'];
			}
		} catch (error) {
			console.error('Error saving job:', error);
			validationErrors = ['An unexpected error occurred while saving the job posting'];
		} finally {
			isSaving = false;
		}
	}

	function moveToNextStep() {
		switch (currentStep) {
			case 'basic':
				if (!validateBasicStep()) return;
				currentStep = 'requirements';
				break;
			case 'requirements':
				if (!validateRequirementsStep()) return;
				currentStep = 'review';
				break;
			case 'review':
				handleSave();
				break;
		}
	}

	function moveToPreviousStep() {
		switch (currentStep) {
			case 'requirements':
				currentStep = 'basic';
				break;
			case 'review':
				currentStep = 'requirements';
				break;
		}
	}

	function getStepIndex() {
		switch (currentStep) {
			case 'basic':
				return 0;
			case 'requirements':
				return 1;
			case 'review':
				return 2;
			default:
				return 0;
		}
	}

	function handleStepClick(index: number) {
		const steps: CreateStep[] = ['basic', 'requirements', 'review'];
		currentStep = steps[index];
	}
</script>

<div class="mx-auto max-w-[1200px] p-6">
	<div class="mb-8 flex items-center gap-4">
		<Button variant="outline" onclick={() => window.history.back()}>← Back</Button>
		<h1 class="text-2xl font-semibold text-foreground">Create New Position</h1>
	</div>

	<div class="rounded-xl bg-gradient-to-b from-background to-background/80 p-8 shadow-xl">
		<!-- Progress Indicator -->
		<div class="mb-10">
			<div class="mb-2 flex items-center justify-between">
				{#each ['Basic Info', 'Requirements', 'Review'] as step, index}
					<button
						class="text-sm font-medium transition-colors {getStepIndex() >= index
							? 'text-primary'
							: 'text-muted-foreground hover:text-foreground'}"
						onclick={() => handleStepClick(index)}
					>
						{step}
					</button>
				{/each}
			</div>
			<div class="relative h-2 overflow-hidden rounded-full bg-muted">
				<div
					class="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-300"
					style="width: {(getStepIndex() / 2) * 100}%"
				/>
			</div>
		</div>

		<!-- Current Step Content -->
		<div class="min-h-[300px]">
			{#if currentStep === 'basic'}
				<div class="space-y-6">
					<h2 class="text-xl font-semibold text-foreground">Basic Information</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<Label for="title">Title</Label>
							<p class="mb-2 text-sm text-muted-foreground">Position title for candidates</p>
							<Input
								id="title"
								name="title"
								bind:value={formData.title}
								placeholder="e.g. Senior Frontend Developer"
								class="mt-1"
							/>
						</div>

						<div>
							<Label for="department">Department</Label>
							<p class="mb-2 text-sm text-muted-foreground">Team or division</p>
							<Input
								id="department"
								name="department"
								bind:value={formData.department}
								placeholder="e.g. Engineering"
								class="mt-1"
							/>
						</div>

						<div>
							<Label for="location">Location</Label>
							<p class="mb-2 text-sm text-muted-foreground">Primary work location</p>
							<Input
								id="location"
								name="location"
								bind:value={formData.location}
								placeholder="e.g. San Francisco, CA"
								class="mt-1"
							/>
						</div>

						<div>
							<Label for="type">Type</Label>
							<p class="mb-2 text-sm text-muted-foreground">Employment type</p>
							<Select
								selected={formData.type}
								onSelectedChange={(e) => handleSelectChange('type', e)}
							>
								<SelectTrigger class="mt-1">
									{formData.type.charAt(0).toUpperCase() + formData.type.slice(1) ||
										'Select job type'}
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="full-time">Full-time</SelectItem>
									<SelectItem value="part-time">Part-time</SelectItem>
									<SelectItem value="contract">Contract</SelectItem>
									<SelectItem value="internship">Internship</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label for="remote_policy">Work Policy</Label>
							<p class="mb-2 text-sm text-muted-foreground">Remote, hybrid, or on-site</p>
							<Select
								selected={formData.remote_policy}
								onSelectedChange={(e) => handleSelectChange('remote_policy', e)}
							>
								<SelectTrigger class="mt-1">
									{formData.remote_policy.charAt(0).toUpperCase() +
										formData.remote_policy.slice(1) || 'Select work policy'}
								</SelectTrigger>
								<SelectContent>
									{#each Object.entries(REMOTE_POLICY_OPTIONS) as [value, label]}
										<SelectItem {value}>{label}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label for="priority">Priority</Label>
							<p class="mb-2 text-sm text-muted-foreground">Hiring urgency level</p>
							<Select
								selected={formData.priority}
								onSelectedChange={(e) => handleSelectChange('priority', e)}
							>
								<SelectTrigger class="mt-1">
									{formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1) ||
										'Select priority'}
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
						<h2 class="col-span-full text-xl font-semibold text-foreground">Salary Information</h2>
						<div>
							<Label for="currency">Currency</Label>
							<p class="mb-2 text-sm text-muted-foreground">Salary currency</p>
							<Select
								selected={formData.salary.currency}
								onSelectedChange={(e) => handleSelectChange('salary.currency', e)}
								disabled={isSalaryOptional}
							>
								<SelectTrigger class="mt-1">
									{formData.salary.currency.charAt(0).toUpperCase() +
										formData.salary.currency.slice(1) || 'Select currency'}
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USD">USD</SelectItem>
									<SelectItem value="EUR">EUR</SelectItem>
									<SelectItem value="GBP">GBP</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label for="salaryMin">Min Salary</Label>
							<p class="mb-2 text-sm text-muted-foreground">Annual minimum</p>
							<Input
								id="salaryMin"
								type="number"
								name="salary.min"
								bind:value={formData.salary.min}
								placeholder="e.g. 80000"
								class="mt-1"
								disabled={isSalaryOptional}
							/>
						</div>
						<div>
							<Label for="salaryMax">Max Salary</Label>
							<p class="mb-2 text-sm text-muted-foreground">Annual maximum</p>
							<div class="flex items-center gap-2">
								<Input
									id="salaryMax"
									type="number"
									name="salary.max"
									bind:value={formData.salary.max}
									placeholder="e.g. 120000"
									class="mt-1"
									disabled={isSalaryOptional}
								/>
								<div class="flex items-center space-x-2">
									<Checkbox id="salaryOptional" bind:checked={isSalaryOptional} />
									<Label for="salaryOptional" class="text-sm">Optional</Label>
								</div>
							</div>
						</div>
					</div>

					<div>
						<h2 class="mb-4 text-xl font-semibold text-foreground">Job Description</h2>
						<div>
							<Label for="description">Description</Label>
							<p class="mb-2 text-sm text-muted-foreground">Role overview and expectations</p>
							<Textarea
								id="description"
								name="description"
								bind:value={formData.description}
								placeholder="Describe the position..."
								rows={4}
								class="mt-1"
							/>
						</div>

						<div class="mt-6">
							<Label for="responsibilities">Responsibilities</Label>
							<p class="mb-2 text-sm text-muted-foreground">Key duties (press Enter to add)</p>
							<div
								class="mt-1 flex flex-wrap gap-2 rounded-md border border-input bg-background p-2"
							>
								{#each formData.responsibilities as resp, i}
									<div
										class="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm {showResponsibilitiesMock
											? 'opacity-50'
											: ''}"
									>
										{resp}
										<button
											class="ml-1 text-primary hover:text-primary/80"
											onclick={() => {
												if (showResponsibilitiesMock) return;
												formData.responsibilities = formData.responsibilities.filter(
													(_, index) => index !== i
												);
											}}
										>
											×
										</button>
									</div>
								{/each}
								<input
									type="text"
									class="flex-1 bg-transparent outline-none"
									placeholder={formData.responsibilities.length < 1
										? 'e.g. Design and implement new features'
										: ''}
									onkeydown={(e) => {
										if (e.key === 'Enter' && e.currentTarget.value.trim()) {
											formData.responsibilities = [
												...formData.responsibilities,
												e.currentTarget.value.trim()
											];
											e.currentTarget.value = '';
										}
										if (e.key === 'Backspace' && e.currentTarget.value.trim() === '') {
											formData.responsibilities = formData.responsibilities.slice(0, -1);
										}
									}}
									onfocus={() => {
										if (showResponsibilitiesMock) {
											formData.responsibilities = [];
											showResponsibilitiesMock = false;
										}
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			{:else if currentStep === 'requirements'}
				<div class="space-y-6">
					<h2 class="text-xl font-semibold text-foreground">Job Requirements</h2>
					<div>
						<h3 class="mb-4 font-medium text-foreground">Requirements</h3>
						{#each formData.requirements as req, index}
							<div class="mb-4 rounded-xl border border-border bg-card p-4">
								<div class="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<Label for={`req-type-${index}`}>Type</Label>
										<p class="mb-2 text-sm text-muted-foreground">Must have or Nice to have</p>
										<Select
											selected={req.type}
											onSelectedChange={(e) => handleRequirementChange(`${index}.type`, e)}
										>
											<SelectTrigger class="mt-1">
												{req.type.charAt(0).toUpperCase() + req.type.slice(1).replace(/-/g, ' ') ||
													'Select type'}
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="must-have">Must Have</SelectItem>
												<SelectItem value="nice-to-have">Nice to Have</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label for={`req-weight-${index}`}>Weight</Label>
										<p class="mb-2 text-sm text-muted-foreground">Importance (1-10)</p>
										<Input
											id={`req-weight-${index}`}
											type="number"
											min="1"
											max="10"
											bind:value={req.weight}
											class="mt-1"
										/>
									</div>
								</div>

								<div>
									<Label for={`req-description-${index}`}>Description</Label>
									<p class="mb-2 text-sm text-muted-foreground">Requirement details</p>
									<Textarea
										id={`req-description-${index}`}
										bind:value={req.description}
										rows={2}
										placeholder="e.g. Must have a degree in Computer Science"
										class="mt-1"
									/>
								</div>

								<div class="mt-3 flex justify-end">
									<Button
										variant="outline"
										onclick={() => {
											formData.requirements = formData.requirements.filter((_, i) => i !== index);
										}}
									>
										Remove
									</Button>
								</div>
							</div>
						{/each}

						<Button
							class="mt-2 w-full"
							onclick={() => {
								const newRequirement: Requirement = {
									id: `req-${Date.now()}`,
									type: 'must-have' as RequirementType,
									description: '',
									weight: 5
								};
								formData.requirements = [...formData.requirements, newRequirement];
							}}
						>
							+ Add Requirement
						</Button>
					</div>

					<div class="mt-6">
						<Label for="benefits">Benefits</Label>
						<p class="mb-2 text-sm text-muted-foreground">Company perks (press Enter to add)</p>
						<div class="mt-1 flex flex-wrap gap-2 rounded-md border border-input bg-background p-2">
							{#each formData.benefits as benefit, i}
								<div
									class="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm {showBenefitsMock
										? 'opacity-50'
										: ''}"
								>
									{benefit}
									<button
										class="ml-1 text-primary hover:text-primary/80"
										onclick={() => {
											if (showBenefitsMock) return;
											formData.benefits = formData.benefits.filter((_, index) => index !== i);
										}}
									>
										×
									</button>
								</div>
							{/each}
							<input
								type="text"
								class="flex-1 bg-transparent outline-none"
								placeholder={formData.benefits.length < 1
									? 'e.g. Health insurance, Remote work options'
									: ''}
								onkeydown={(e) => {
									if (e.key === 'Enter' && e.currentTarget.value.trim()) {
										formData.benefits = [...formData.benefits, e.currentTarget.value.trim()];
										e.currentTarget.value = '';
									}
									if (e.key === 'Backspace' && e.currentTarget.value.trim() === '') {
										formData.benefits = formData.benefits.slice(0, -1);
									}
								}}
								onfocus={() => {
									if (showBenefitsMock) {
										formData.benefits = [];
										showBenefitsMock = false;
									}
								}}
							/>
						</div>
					</div>

					<div class="mt-6">
						<Label for="techStack">Tech Stack</Label>
						<p class="mb-2 text-sm text-muted-foreground">
							Required technologies (press Enter to add)
						</p>
						<div class="mt-1 flex flex-wrap gap-2 rounded-md border border-input bg-background p-2">
							{#each formData.tech_stack as tech, i}
								<div
									class="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm {showTechStackMock
										? 'opacity-50'
										: ''}"
								>
									{tech}
									<button
										class="ml-1 text-primary hover:text-primary/80"
										onclick={() => {
											if (showTechStackMock) return;
											formData.tech_stack = formData.tech_stack.filter((_, index) => index !== i);
										}}
									>
										×
									</button>
								</div>
							{/each}
							<input
								type="text"
								class="flex-1 bg-transparent outline-none"
								placeholder={formData.tech_stack.length < 1
									? 'e.g. React, TypeScript, Node.js'
									: ''}
								onkeydown={(e) => {
									if (e.key === 'Enter' && e.currentTarget.value.trim()) {
										formData.tech_stack = [...formData.tech_stack, e.currentTarget.value.trim()];
										e.currentTarget.value = '';
									}
									if (e.key === 'Backspace' && e.currentTarget.value.trim() === '') {
										formData.tech_stack = formData.tech_stack.slice(0, -1);
									}
								}}
								onfocus={() => {
									if (showTechStackMock) {
										formData.tech_stack = [];
										showTechStackMock = false;
									}
								}}
							/>
						</div>
					</div>
				</div>
			{:else if currentStep === 'review'}
				<div class="space-y-6">
					<h2 class="text-xl font-semibold text-foreground">Review Position Details</h2>
					<div class="rounded-xl border border-border bg-card p-6">
						<h3 class="mb-6 font-medium text-foreground">Position Overview</h3>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<div class="mb-4">
									<p class="mb-1 text-sm text-muted-foreground">Title</p>
									<p class="text-foreground">{formData.title || 'Not specified'}</p>
								</div>

								<div class="mb-4">
									<p class="mb-1 text-sm text-muted-foreground">Department</p>
									<p class="text-foreground">{formData.department || 'Not specified'}</p>
								</div>

								<div class="mb-4">
									<p class="mb-1 text-sm text-muted-foreground">Location</p>
									<p class="text-foreground">{formData.location || 'Not specified'}</p>
								</div>
							</div>

							<div>
								<div class="mb-4">
									<p class="mb-1 text-sm text-muted-foreground">Work Policy</p>
									<p class="capitalize text-foreground">
										{formData.remote_policy || 'Not specified'}
									</p>
								</div>

								<div class="mb-4">
									<p class="mb-1 text-sm text-muted-foreground">Priority</p>
									<p class="capitalize text-foreground">{formData.priority || 'Not specified'}</p>
								</div>

								<div class="mb-4">
									<p class="mb-1 text-sm text-muted-foreground">Type</p>
									<p class="capitalize text-foreground">{formData.type || 'Not specified'}</p>
								</div>
							</div>
						</div>

						<div class="mt-4">
							<p class="mb-1 text-sm text-muted-foreground">Description</p>
							<p class="text-foreground">{formData.description || 'No description provided.'}</p>
						</div>

						{#if !isSalaryOptional}
							<div class="mt-6">
								<p class="mb-1 text-sm text-muted-foreground">Salary Range</p>
								<p class="text-foreground">
									{formData.salary.currency}
									{formData.salary.min.toLocaleString()} -{' '}
									{formData.salary.max.toLocaleString()}
								</p>
							</div>
						{/if}

						{#if formData.responsibilities.length > 0 && !showResponsibilitiesMock}
							<div class="mt-6">
								<p class="mb-2 text-sm text-muted-foreground">Responsibilities</p>
								<ul class="space-y-1">
									{#each formData.responsibilities as resp}
										<li class="flex items-start gap-2 text-foreground">
											<span class="mt-1 text-primary">•</span>
											{resp}
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if formData.tech_stack.length > 0 && !showTechStackMock}
							<div class="mt-6">
								<p class="mb-2 text-sm text-muted-foreground">Tech Stack</p>
								<div class="flex flex-wrap gap-2">
									{#each formData.tech_stack as tech}
										<span class="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
											{tech}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					{#if formData.requirements.length > 0}
						<div class="rounded-xl border border-border bg-card p-6">
							<h3 class="mb-6 font-medium text-foreground">
								Requirements ({formData.requirements.length})
							</h3>
							<div class="space-y-4">
								{#each formData.requirements as req}
									<div class="flex items-start gap-3">
										<span
											class="rounded px-2 py-1 text-xs font-medium {req.type === 'must-have'
												? 'bg-destructive/20 text-destructive'
												: 'bg-primary/20 text-primary'}"
										>
											{req.type === 'must-have' ? 'Must Have' : 'Nice to Have'}
										</span>
										<p class="flex-1 text-muted-foreground">{req.description}</p>
										<span
											class="rounded-full px-2 py-1 text-xs {req.weight >= 8
												? 'bg-primary/20 text-primary'
												: req.weight >= 5
													? 'bg-primary/20 text-primary'
													: 'bg-muted text-muted-foreground'}"
										>
											Weight: {req.weight}
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if formData.benefits.length > 0 && !showBenefitsMock}
						<div class="rounded-xl border border-border bg-card p-6">
							<h3 class="mb-6 font-medium text-foreground">Benefits</h3>
							<ul class="space-y-2">
								{#each formData.benefits as benefit}
									<li class="flex items-start gap-2 text-foreground">
										<span class="mt-1 text-primary">•</span>
										{benefit}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Navigation Buttons -->
		<div class="mt-10 flex flex-col gap-4 border-t border-border pt-6">
			{#if validationErrors.length > 0}
				<div class="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
					<ul class="list-inside list-disc">
						{#each validationErrors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			{/if}
			<div class="flex justify-between">
				<Button variant="outline" onclick={moveToPreviousStep} disabled={currentStep === 'basic'}>
					Previous Step
				</Button>

				<Button onclick={moveToNextStep} disabled={isSaving}>
					{currentStep === 'review' ? (isSaving ? 'Creating...' : 'Create Position') : 'Next Step'}
				</Button>
			</div>
		</div>
	</div>
</div>
