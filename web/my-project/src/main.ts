// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import { dsvFormat } from 'd3-dsv';
import { mean } from 'd3';

type AccType = { [verse_uid: string]: number[] };

interface RowData {
verse_uid: string;
version_code_1: string;
version_code_2: string;
cosine_similarity: string;
}
// Define the format
const tsv = dsvFormat("\t");

// Load and parse the TSV file
const loadData = async () => {
  const response = await fetch('/cosine_similarity_results.tsv');
  const text = await response.text();
  const data: RowData[] = tsv.parse(text) as any;
console.log({data, response})
  // Calculate averages
  const grouped = data.reduce((acc: AccType, row: RowData) => {
    const verse = row.verse_uid;
    if (!acc[verse]) {
      acc[verse] = [];
    }
    acc[verse].push(parseFloat(row.cosine_similarity));
    return acc;
  }, {} as AccType);
  

  const averages = Object.entries(grouped).map(([verse, values]) => {
    return {
      verse,
      average: mean(values)
    };
  });

  // Display the data
  const appDiv = document.querySelector<HTMLDivElement>('#app')!;
  averages.forEach(({ verse, average }) => {
    if (verse && average) {
      const p = document.createElement('p');
      p.textContent = `Verse ${verse}: Average similarity = ${average}`;
      appDiv.appendChild(p);
    }
  });
};

loadData();
