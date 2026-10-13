import { AssetClasses } from '@/features/landing/components/asset-classes';
import { CtaBand } from '@/features/landing/components/cta-band';
import { Hero } from '@/features/landing/components/hero';
import { LandingFooter } from '@/features/landing/components/landing-footer';
import { LandingHeader } from '@/features/landing/components/landing-header';
import { ProductList } from '@/features/landing/components/product-list';

export default function Home() {
    return (
        <>
            <LandingHeader />
            <main>
                <Hero />
                <AssetClasses />
                <ProductList />
                <CtaBand />
            </main>
            <LandingFooter />
        </>
    );
}
