
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-300 text-white">
      <NavBar />
      <main className="p-4">{children}</main>
      <Footer />
    </div>
  );
}