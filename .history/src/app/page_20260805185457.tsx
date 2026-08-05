import dynamic from "next/dynamic";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductHeader } from "@/components/products/ProductHeader";
import { ProductListSkeleton } from "@/components/products/ProductListSkeleton";

const ProductFilters = dynamic(
  () =>
    import("@/components/products/ProductFilters").then(
      (mod) => mod.ProductFilters
    )
);

const ProductList = dynamic(
  () =>
    import("@/components/products/ProductList").then((mod) => mod.ProductList),
  { loading: () => <ProductListSkeleton /> }
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <ProductHeader />

      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
          <ProductForm />

          <div className="flex flex-col gap-6">
            <ProductFilters />
            <ProductList />
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-center text-sm text-slate-400 sm:px-6 lg:px-8 dark:text-neutral-500">
        Victor Cervantes · Prueba tecnica
      </footer>
    </div>
  );
}
