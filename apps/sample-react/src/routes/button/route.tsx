import { Button, ButtonGroup } from "@srcube-ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import PageHeader from "@/components/page-header";

export const Route = createFileRoute("/button")({
	component: ButtonDemo,
});

type DemoItem = {
	label: string;
	value: string;
};

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
			<div className="text-sm font-semibold text-slate-900">{title}</div>
			{description ? (
				<div className="mt-1 text-xs text-slate-500">{description}</div>
			) : null}
			<div className="mt-3 flex flex-wrap gap-2">{children}</div>
		</section>
	);
}

function ButtonDemo() {
	const colors = useMemo<DemoItem[]>(
		() => [
			{ label: "Default", value: "default" },
			{ label: "Primary", value: "primary" },
			{ label: "Secondary", value: "secondary" },
			{ label: "Success", value: "success" },
			{ label: "Warning", value: "warning" },
			{ label: "Danger", value: "danger" },
		],
		[],
	);

	const variants = useMemo<DemoItem[]>(
		() => [
			{ label: "Solid", value: "solid" },
			{ label: "Outline", value: "outline" },
			{ label: "Flat", value: "flat" },
			{ label: "Text", value: "text" },
		],
		[],
	);

	const sizes = useMemo<DemoItem[]>(
		() => [
			{ label: "Small", value: "sm" },
			{ label: "Medium", value: "md" },
			{ label: "Large", value: "lg" },
		],
		[],
	);

	const radii = useMemo<DemoItem[]>(
		() => [
			{ label: "None", value: "none" },
			{ label: "Small", value: "sm" },
			{ label: "Medium", value: "md" },
			{ label: "Large", value: "lg" },
			{ label: "Full", value: "full" },
		],
		[],
	);

	return (
		<main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
			<PageHeader title="Button" />
			<div className="px-4 pb-8">
				<Section title="Colors" description="color + variant=solid">
					{colors.map((item) => (
						<Button key={item.value} color={item.value as never}>
							{item.label}
						</Button>
					))}
				</Section>

				<Section title="Variants" description="color=primary">
					{variants.map((item) => (
						<Button key={item.value} variant={item.value as never}>
							{item.label}
						</Button>
					))}
				</Section>

				<Section title="Sizes">
					{sizes.map((item) => (
						<Button key={item.value} size={item.value as never}>
							{item.label}
						</Button>
					))}
				</Section>

				<Section title="Radius">
					{radii.map((item) => (
						<Button key={item.value} radius={item.value as never}>
							{item.label}
						</Button>
					))}
				</Section>

				<Section title="States">
					<Button>Normal</Button>
					<Button isDisabled>Disabled</Button>
					<Button isLoading>Loading</Button>
					<Button
						isLoading="auto"
						onTap={async () => {
							await new Promise((resolve) => setTimeout(resolve, 800));
						}}
					>
						Auto Loading
					</Button>
				</Section>

				<Section title="Icon">
					<Button isIcon aria-label="Add">
						<span className="icon-[mdi--plus] text-lg" aria-hidden />
					</Button>
					<Button>
						<span className="icon-[mdi--star-outline] text-lg" aria-hidden />
						<span>Star</span>
					</Button>
				</Section>

				<section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
					<div className="text-sm font-semibold text-slate-900">Block</div>
					<div className="mt-3 flex flex-col gap-2">
						<Button isBlock>Primary Block</Button>
						<Button isBlock variant="outline">
							Outline Block
						</Button>
					</div>
				</section>

				<section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
					<div className="text-sm font-semibold text-slate-900">
						ButtonGroup
					</div>
					<div className="mt-3 flex flex-col gap-3">
						<ButtonGroup>
							<Button>Left</Button>
							<Button>Middle</Button>
							<Button>Right</Button>
						</ButtonGroup>
						<ButtonGroup isBlock>
							<Button>Yes</Button>
							<Button variant="outline">No</Button>
						</ButtonGroup>
					</div>
				</section>
			</div>
		</main>
	);
}
