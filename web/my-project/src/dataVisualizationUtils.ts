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
  showPercent = true,
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
    // @ts-ignore
    .attr("fill", (d) => color(d.data.percentile)) // Set the fill color using the color scale
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);
    

  // Add the similarity percentile text in the middle of the donut
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", 18);

  if (showPercent) {
    svg.text((percentageFloat * 100).toFixed(1) + "%" + " " + "Percentile");
  }
}

type CreateBarChartProps = {
  selectionId: string;
  data: BarChartData[];
  size: number;
  margin?: Margin; // Optional. If not provided, you could set default values within the function.
};

type BarChartData = {
  category: string;
  value: number;
};

type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function createBarChart({
  selectionId,
  data,
  size,
  margin = { top: 5, right: 10, bottom: 15, left: 10 },
}: CreateBarChartProps) {
  const height = size;
  const width = size * 1.25;

  const svg = d3
    .select(`#${selectionId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis scale
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.category))
    .padding(0.2);

  // Y axis scale
  const y = d3
    .scaleLinear()
    // @ts-ignore
    .domain([0, d3.max(data, (d) => d.value)]) 
    .range([height, 0]);

  // Bars
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    // @ts-ignore  
    .attr("x", (d: data) => x(d.category))
    .attr("y", (d) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", "red");
}

export function createPercentileText(cosineSimilarityPercentile: number) {
  var percentile = cosineSimilarityPercentile * 100;
  if (percentile < 1) {
    return "below the 1st percentile";
  } else if (percentile < 5) {
    return "below the 5th percentile";
  } else if (percentile < 10) {
    return "below the 10th percentile";
  } /* else if (percentile < 20) {
    return "below the 20th percentile";
  } else if (percentile < 30) {
    return "below the 30th percentile";
  } else if (percentile < 40) {
    return "below the 40th percentile";
  } */ else if (percentile < 50) {
    return "below the 50th percentile";
  } /* else if (percentile < 60) {
    return "above the 50th percentile";
  } else if (percentile < 70) {
    return "above the 60th percentile";
  } else if (percentile < 80) {
    return "above the 70th percentile";
  } */ else if (percentile < 90) {
    return "above the 80th percentile";
  } else if (percentile < 95) {
    return "above the 90th percentile";
  } else if (percentile < 99) {
    return "above the 95th percentile";
  } else {
    return "above the 99th percentile";
  }
}
