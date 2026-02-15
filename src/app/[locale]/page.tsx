import { useTranslations } from "next-intl";
import { TaskBoard } from "@/features/tasks/components/task-board";

export default function HomePage() {
	const t = useTranslations("tasks");

	return (
		<main className="mx-auto max-w-5xl px-6 py-16">
			{/* Header */}
			<header className="mb-12">
				<div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent mb-4">
					<span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
					Live workspace
				</div>
				<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-text-primary via-text-primary to-text-secondary bg-clip-text">
					{t("title")}
				</h1>
				<p className="mt-2 text-text-secondary text-lg">
					Organize, prioritize, and ship — all in one flow.
				</p>
			</header>

			<TaskBoard />
		</main>
	);
}
