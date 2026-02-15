"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateEvent } from "../hooks/use-events";
import { type CreateEventInput, CreateEventSchema } from "../schemas/event.schema";

const COLORS = [
	{ value: "blue", class: "bg-blue-400" },
	{ value: "purple", class: "bg-purple-400" },
	{ value: "rose", class: "bg-rose-400" },
	{ value: "amber", class: "bg-amber-400" },
	{ value: "emerald", class: "bg-emerald-400" },
	{ value: "cyan", class: "bg-cyan-400" },
] as const;

interface EventFormProps {
	defaultDate: Date;
	onClose: () => void;
}

export function EventForm({ defaultDate, onClose }: EventFormProps) {
	const t = useTranslations("calendar");
	const createEvent = useCreateEvent();
	const dateStr = format(defaultDate, "yyyy-MM-dd");

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CreateEventInput>({
		resolver: zodResolver(CreateEventSchema),
		defaultValues: {
			title: "",
			startAt: `${dateStr}T09:00`,
			endAt: `${dateStr}T10:00`,
			color: "blue",
		},
	});

	const activeColor = watch("color");

	const onSubmit = handleSubmit(async (data) => {
		await createEvent.mutateAsync({
			...data,
			startAt: new Date(data.startAt).toISOString(),
			endAt: new Date(data.endAt).toISOString(),
		});
		toast.success(t("eventCreated"));
		onClose();
	});

	return (
		<>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
				className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
			/>

			{/* Form panel */}
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.97 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 20, scale: 0.97 }}
				className="fixed inset-x-4 bottom-4 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] glass rounded-3xl p-6 z-50 shadow-2xl"
			>
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-lg font-semibold text-text-primary">{t("newEvent")}</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-1.5 rounded-xl hover:bg-surface-overlay/60 text-text-muted hover:text-text-primary transition-colors"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form onSubmit={onSubmit} className="space-y-4">
					{/* Title */}
					<div>
						<label
							htmlFor="ev-title"
							className="block text-xs font-medium text-text-secondary mb-1.5 pl-1"
						>
							{t("eventTitle")}
						</label>
						<input
							id="ev-title"
							{...register("title")}
							placeholder={t("eventTitlePlaceholder")}
							autoComplete="off"
							autoFocus
							className="w-full rounded-xl border border-border-subtle/40 bg-surface/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
						/>
						{errors.title && (
							<p className="mt-1 text-xs text-danger pl-1">{errors.title.message}</p>
						)}
					</div>

					{/* Time */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label
								htmlFor="ev-start"
								className="block text-xs font-medium text-text-secondary mb-1.5 pl-1"
							>
								{t("startTime")}
							</label>
							<input
								id="ev-start"
								type="datetime-local"
								{...register("startAt")}
								className="w-full rounded-xl border border-border-subtle/40 bg-surface/60 px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
							/>
						</div>
						<div>
							<label
								htmlFor="ev-end"
								className="block text-xs font-medium text-text-secondary mb-1.5 pl-1"
							>
								{t("endTime")}
							</label>
							<input
								id="ev-end"
								type="datetime-local"
								{...register("endAt")}
								className="w-full rounded-xl border border-border-subtle/40 bg-surface/60 px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
							/>
						</div>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="ev-desc"
							className="block text-xs font-medium text-text-secondary mb-1.5 pl-1"
						>
							{t("description")}
						</label>
						<textarea
							id="ev-desc"
							{...register("description")}
							rows={2}
							placeholder={t("descriptionPlaceholder")}
							className="w-full rounded-xl border border-border-subtle/40 bg-surface/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all resize-none"
						/>
					</div>

					{/* Color picker */}
					<div>
						<label className="block text-xs font-medium text-text-secondary mb-2 pl-1">
							{t("color")}
						</label>
						<div className="flex gap-2">
							{COLORS.map((c) => (
								<button
									key={c.value}
									type="button"
									onClick={() => setValue("color", c.value)}
									className={`h-7 w-7 rounded-full ${c.class} transition-all ${
										activeColor === c.value
											? "ring-2 ring-offset-2 ring-offset-surface scale-110"
											: "opacity-50 hover:opacity-80"
									}`}
								/>
							))}
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={createEvent.isPending}
						className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
					>
						{createEvent.isPending ? (
							<span className="inline-flex items-center gap-1.5">
								<span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
								{t("creating")}
							</span>
						) : (
							t("createEvent")
						)}
					</button>
				</form>
			</motion.div>
		</>
	);
}
