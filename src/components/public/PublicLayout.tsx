import Navbar from "@/components/public/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
                {children}
            </main>
        </>
    );
}
