import AdminPanel from "@/components/AdminPanel";

export const metadata = {
  title: "Love Control Console - Admin",
  description: "Secure panel to configure relationship memories and letters.",
};

export default function AdminPage() {
  return (
    <div className="w-full min-h-screen bg-obsidian">
      <AdminPanel />
    </div>
  );
}
