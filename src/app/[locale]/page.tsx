import { useTranslations } from "next-intl";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskTable } from "@/features/tasks/components/task-table";

export default function HomePage() {
	const t = useTranslations("tasks");

	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
			<div className="space-y-6">
				<TaskForm />
				<TaskTable />
			</div>
		</main>
	);
}
