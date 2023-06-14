import * as d3 from "d3";

interface CreatePieChartProps {
  selectionId: string;
  percentageFloat: number;
  maxSize: number;
  showPercent?: boolean;
  padding?: number;
}
interface PieChartData {
  percentile: string;
  value: number;
}

export function createPieChart({
  selectionId,
  percentageFloat,
  maxSize,
  showPercent = true
}: CreatePieChartProps) {
  const data: PieChartData[] = [
    {
      percentile: "Similarity Percentile",
      value: percentageFloat,
    },
    {
      percentile: "Other",
      value: 1 - percentageFloat,
    },
  ];

  let containerWidth = window.innerWidth - window.innerWidth * 0.2;

  let size = Math.min(containerWidth, maxSize);

  const width = size;
  const height = size;
  const margin = 30;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3
    .select(`#${selectionId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.percentile))
    .range(["red", "grey"]); // Set "Similarity Percentile" slice to red and "Other" slice to grey

  const pie = d3.pie<d3.PieArcDatum<PieChartData>>().value((d) => d.value);

  const data_ready = pie(data as any);

  const arcGenerator = d3
    .arc<d3.PieArcDatum<any>>()
    .innerRadius(radius * 0.7)
    .outerRadius(radius);

  svg
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", (d) => color(d.data.percentile)) // Set the fill color using the color scale
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  // Add the similarity percentile text in the middle of the donut
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", 18)

  if (showPercent){
    svg.text((percentageFloat * 100).toFixed(1) + "%" + " " + "Percentile");
  }
}


export function createPercentileText(cosineSimilarityPercentile: number) {
  var percentile = cosineSimilarityPercentile * 100;
  if (percentile < 1) {
    return "below the first percentile";
  } else if (percentile < 5) {
    return "below the fifth percentile";
  } else if (percentile < 10) {
    return "below the tenth percentile";
  } else if (percentile < 20) {
    return "below the twentieth percentile";
  } else if (percentile < 30) {
    return "below the thirtieth percentile";
  } else if (percentile < 40) {
    return "below the fortieth percentile";
  } else if (percentile < 50) {
    return "below the fiftieth percentile";
  } else if (percentile < 60) {
    return "above the fiftieth percentile";
  } else if (percentile < 70) {
    return "above the sixtieth percentile";
  } else if (percentile < 80) {
    return "above the seventieth percentile";
  } else if (percentile < 90) {
    return "above the eightieth percentile";
  } else if (percentile < 95) {
    return "above the ninetieth percentile";
  } else if (percentile < 99) {
    return "above the ninety-fifth percentile";
  } else {
    return "above the ninety-ninth percentile";
  }
}
