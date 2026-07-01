export const metadata = {
  title: "DEVO-AI-OS",
  description: "AI Creative Operating System"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
