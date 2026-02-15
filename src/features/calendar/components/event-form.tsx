"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	type CreateEventInput,
	CreateEventSchema,
	type EventType,
} from "@/features/calendar/schemas/event.schema";

const COLORS = ["blue", "purple", "rose", "amber", "emerald", "cyan"] as const;

const colorDotMap: Record<string, string> = {
	blue: "bg-[oklch(0.7_0.18_265)]",
	purple: "bg-[oklch(0.65_0.2_300)]",
	rose: "bg-[oklch(0.65_0.2_10)]",
	amber: "bg-[oklch(0.78_0.15_80)]",
	emerald: "bg-[oklch(0.72_0.17_155)]",
	cyan: "bg-[oklch(0.75_0.14_200)]",
};

interface EventFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CreateEventInput) => void;
	initialDate?: Date;
	editEvent?: EventType | null;
	isPending?: boolean;
}

export function EventForm({
	open,
	onClose,
	onSubmit,
	initialDate,
	editEvent,
	isPending,
}: EventFormProps) {
	const t = useTranslations("calendar");

	const defaultStart = initialDate ? `${format(initialDate, "yyyy-MM-dd")}T09:00` : "";
	const defaultEnd = initialDate ? `${format(initialDate, "yyyy-MM-dd")}T10:00` : "";

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CreateEventInput>({
		resolver: zodResolver(CreateEventSchema),
		defaultValues: {
			title: "",
			description: "",
			startAt: defaultStart,
			endAt: defaultEnd,
			color: "blue",
		},
	});

	const selectedColor = watch("color");

	useEffect(() => {
		if (editEvent) {
			reset({
				title: editEvent.title,
				description: editEvent.description ?? "",
				startAt: format(new Date(editEvent.startAt), "yyyy-MM-dd'T'HH:mm"),
				endAt: format(new Date(editEvent.endAt), "yyyy-MM-dd'T'HH:mm"),
				color: editEvent.color,
			});
		} else {
			reset({
				title: "",
				description: "",
				startAt: defaultStart,
				endAt: defaultEnd,
				color: "blue",
			});
		}
	}, [editEvent, reset, defaultStart, defaultEnd]);

	const handleFormSubmit = (data: CreateEventInput) => {
		const payload = {
			...data,
			startAt: new Date(data.startAt).toISOString(),
			endAt: new Date(data.endAt).toISOString(),
		};
		onSubmit(payload);
	};

	return (
		<AnimatePresence>
			{open && (
				<>
					{/* Backdrop */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						onKeyDown={(e) => e.key === "Escape" && onClose()}
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
					/>

					{/* Modal */}
					<m.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: "spring", stiffness: 400, damping: 30 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
					>
						<div className="glass w-full max-w-lg rounded-3xl p-6 shadow-2xl shadow-black/20">
							<h2 className="text-lg font-semibold text-text-primary mb-6">
								{editEvent ? t("editEvent") : t("addEvent")}
							</h2>

							<form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
								{/* Title */}
								<label className="block">
									<span className="mb-1.5 block text-xs font-medium text-text-secondary">
										{t("eventTitle")}
									</span>
									<input
										{...register("title")}
										placeholder={t("eventTitlePlaceholder")}
										className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
									/>
									{errors.title && (
										<p className="mt-1 text-xs text-danger">{errors.title.message}</p>
									)}
								</label>

								{/* Description */}
								<label className="block">
									<span className="mb-1.5 block text-xs font-medium text-text-secondary">
										{t("eventDescription")}
									</span>
									<textarea
										{...register("description")}
										placeholder={t("eventDescriptionPlaceholder")}
										rows={2}
										className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
									/>
								</label>

								{/* Start / End */}
								<div className="grid grid-cols-2 gap-4">
									<label className="block">
										<span className="mb-1.5 block text-xs font-medium text-text-secondary">
											{t("startTime")}
										</span>
										<input
											type="datetime-local"
											{...register("startAt")}
											className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors [color-scheme:dark]"
										/>
										{errors.startAt && (
											<p className="mt-1 text-xs text-danger">{errors.startAt.message}</p>
										)}
									</label>
									<label className="block">
										<span className="mb-1.5 block text-xs font-medium text-text-secondary">
											{t("endTime")}
										</span>
										<input
											type="datetime-local"
											{...register("endAt")}
											className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors [color-scheme:dark]"
										/>
										{errors.endAt && (
											<p className="mt-1 text-xs text-danger">{errors.endAt.message}</p>
										)}
									</label>
								</div>

								{/* Color */}
								<fieldset>
									<legend className="mb-2 text-xs font-medium text-text-secondary">
										{t("color")}
									</legend>
									<div className="flex gap-2">
										{COLORS.map((color) => (
											<button
												key={color}
												type="button"
												onClick={() => setValue("color", color)}
												className={`h-8 w-8 rounded-full transition-all ${colorDotMap[color]} ${
													selectedColor === color
														? "ring-2 ring-white/40 ring-offset-2 ring-offset-surface scale-110"
														: "opacity-60 hover:opacity-100"
												}`}
												aria-label={t(`colors.${color}`)}
											/>
										))}
									</div>
								</fieldset>

								{/* Actions */}
								<div className="flex justify-end gap-3 pt-2">
									<button
										type="button"
										onClick={onClose}
										className="rounded-xl px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
									>
										{t("cancel")}
									</button>
									<button
										type="submit"
										disabled={isPending}
										className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
									>
										{isPending ? "…" : t("save")}
									</button>
								</div>
							</form>
						</div>
					</m.div>
				</>
			)}
		</AnimatePresence>
	);
}
