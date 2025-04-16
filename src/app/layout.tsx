import { ProviderWrapper } from "@/components";
import "../styles/main.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Rubik Solver</title>
        <link
          type="image/x-icon"
          rel="shortcut icon"
          href="/images/meta/favicons/ff0000.png"
        />
      </head>
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
