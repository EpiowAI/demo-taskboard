import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import "../globals.css";

export const metadata = {
	title: "Taskboard — Modern Project Flow",
	description: "A beautifully crafted task management experience",
};

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();

	return (
		<html lang={locale} className="dark">
			<body className="min-h-dvh bg-surface text-text-primary antialiased">
				{/* Ambient gradient background */}
				<div className="pointer-events-none fixed inset-0 -z-10">
					<div className="absolute -top-[40%] left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full bg-accent/[0.04] blur-[120px]" />
					<div className="absolute -bottom-[20%] -right-[10%] h-[60vh] w-[60vw] rounded-full bg-accent/[0.03] blur-[100px]" />
				</div>
				<NextIntlClientProvider messages={messages}>
					<QueryProvider>
						{children}
						<Toaster
							richColors
							position="bottom-center"
							toastOptions={{
								className: "glass !rounded-2xl !border-border-subtle",
							}}
						/>
					</QueryProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
