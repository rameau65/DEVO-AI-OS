export const metadata = {
  title: "DEVO-AI-OS v2.0",
  description: "DEVO-AI-OS with OneMind Engine"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
