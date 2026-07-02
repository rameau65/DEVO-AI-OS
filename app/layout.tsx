export const metadata = {
  title: "DEVO-AI-OS v1.1",
  description: "AI Creative Operating System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
