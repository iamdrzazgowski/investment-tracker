type Props = {
    params: Promise<{
        ticker: string;
    }>;
};

export default async function AssetPage({ params }: Props) {
    const { ticker } = await params;

    return <div>{ticker}</div>;
}
