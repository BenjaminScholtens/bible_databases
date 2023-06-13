import * as d3 from 'd3';

interface VerseData {
    verse_uid: string;
    version_code_1: string;
    version_code_2: string;
    cosine_similarity: number;
    average_cosine_similarity: number;
    cosine_similarity_percentile: number;
}

export function createPieChart(verse: VerseData) {
    // Use the verse's percentile directly
    const data = [
        {
            percentile: "Similarity Percentile",
            value: verse.cosine_similarity_percentile,
        },
        {
            percentile: "Other",
            value: 1 - verse.cosine_similarity_percentile,
        },
    ];

    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(`#my_dataviz_${verse.verse_uid}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.percentile))
        .range(d3.schemeReds[3]);

    const pie = d3.pie<d3.PieArcDatum<VerseData>>().value(d => d.value);

    const data_ready = pie(data as any);

    const arcGenerator = d3.arc<d3.PieArcDatum<any>>()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        // .attr('fill', d => color(d.data.percentile))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        // .text(d => d.data.percentile)
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 17);
}
