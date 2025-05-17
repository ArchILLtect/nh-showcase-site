
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
        <main className="p-4">{children}</main>
      <Footer />
    </div>
  );
}