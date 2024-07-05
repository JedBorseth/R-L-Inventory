import { NextAuthSessionProvider } from "~/components/sessionProvider";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "R&L Inventory App",
  description: "App created by Jed Borseth",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <NextAuthSessionProvider session={session}>
        <body>{children}</body>
      </NextAuthSessionProvider>
    </html>
  );
}
