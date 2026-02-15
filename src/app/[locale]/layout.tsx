import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import "../globals.css";

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
			<body className="min-h-screen bg-zinc-900 text-white antialiased">
				<NextIntlClientProvider messages={messages}>
					<QueryProvider>
						{children}
						<Toaster richColors position="bottom-right" />
					</QueryProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
