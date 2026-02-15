import ProductForm from './_components/product-form';
import { ProductFormProvider } from './_components/product-form-provider';
import { Mic } from 'lucide-react';

export default function NewProductPage() {
  return (
    <ProductFormProvider>
      <div className="relative min-h-screen w-full bg-background">
        <ProductForm />

        {/* TODO: Wire up this button to activate voice assistant listening (Speech-to-Text) */}
        <button className="fixed bottom-24 right-4 z-50 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center md:right-8 md:bottom-28">
            <Mic className="h-8 w-8" />
        </button>
      </div>
    </ProductFormProvider>
  );
}
