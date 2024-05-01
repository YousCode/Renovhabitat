import { Navbar } from "./navbar";

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="text-white lg:px-16 lg:py-14 p-4 lg:h-[calc(100vh-80px)] flex flex-col">
        {children}
      </main>
    </>
  );
};
