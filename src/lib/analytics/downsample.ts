/** Rzedzi dane do ~`maxPoints` punktów, zawsze zachowując ostatni. */
export function downsample<T>(points: T[], maxPoints = 300): T[] {
    if (points.length <= maxPoints) return points;
    const step = Math.ceil(points.length / maxPoints);
    const sampled = points.filter((_, i) => i % step === 0);
    const last = points[points.length - 1];
    if (sampled[sampled.length - 1] !== last) sampled.push(last);
    return sampled;
}
