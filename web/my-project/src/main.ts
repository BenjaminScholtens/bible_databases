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
import { dsvFormat } from "d3-dsv";
import { mean } from "d3";
import { asvTranslationData } from "./asvTranslationData";

type AccumulatorType = { [verse_uid: string]: number[] };

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
  const response = await fetch("/cosine_similarity_results.tsv");
  const text = await response.text();
  const data = tsv.parse(text) as RowData[];
  console.log({ data, response, dsfdsfd: asvTranslationData.resultset.row[0].field  });
  // Calculate averages
  const grouped = data.reduce((accumulator: AccumulatorType, row: RowData) => {
    const verse = row.verse_uid;
    if (!accumulator[verse]) {
      accumulator[verse] = [];
    }
    accumulator[verse].push(parseFloat(row.cosine_similarity));
    return accumulator;
  }, {} as AccumulatorType);
  console.log({grouped: grouped['1001001'] });
  const averages = Object.entries(grouped).map(([verse, values]) => {
    return {
      verse,
      average: mean(values),
    };
  });

// Display the data
const appDiv = document.querySelector<HTMLDivElement>("#app")!;
for (const { verse, average } of averages) {
  if (verse && average !== undefined) {  // Checking average !== undefined because average can be 0
    const asvTranslationDataForVerse = asvTranslationData.resultset.row.find(row => `${row.field.verse_uid}` === verse)?.field
    if (asvTranslationDataForVerse) {
      const p = document.createElement("p");
      p.textContent = `Verse ${asvTranslationDataForVerse.verse_text}: Average similarity = ${average}`;
      appDiv.appendChild(p);
      // Wait for the browser to paint the updates
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  }
}

};

loadData();
