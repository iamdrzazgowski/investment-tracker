import { fetchYahooQuote } from '@/lib/market-data/yahoo';

type Props = {
    params: Promise<{
        ticker: string;
    }>;
};

export default async function AssetPage({ params }: Props) {
    const { ticker } = await params;
    const data = await fetchYahooQuote(ticker);

    console.log(data); // AAPL

    return <div>{ticker}</div>;
}
