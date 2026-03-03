export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2]">
      <div className="absolute top-0 left-0 w-full h-64 bg-[#1F2937] rounded-b-[60px]" />
      <div className="relative w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
