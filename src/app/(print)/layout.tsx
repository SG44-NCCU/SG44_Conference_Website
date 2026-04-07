// Minimal layout for print-only pages — no Navbar, no Footer, no padding
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
