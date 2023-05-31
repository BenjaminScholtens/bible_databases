// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#apddp')!.innerHTML = `
// <section>
// <div
//   class="flex-container centered-flex-column problem-section"
//   style="background-color: #fcfbfc; min-height: 100vh"
// >
//   <div class="maxTextWidth centered-flex-column">
//     <h2>Revolutionizing Pour-Over Coffee Brewing</h2>
//     <p>
//       The traditional pour-over coffee brewing process, while praised
//       for its ability to produce rich, flavorful coffee, is often
//       hindered by challenges such as inconsistent brewing temperature
//       and difficulty in achieving precise pouring consistency. Our
//       innovative passive float valve system addresses these issues,
//       elevating the pour-over brewing experience by ensuring a constant
//       brewing temperature and automating the water flow for precise
//       pouring consistency. This results in a better-tasting and more
//       consistent cup of coffee.
//     </p>
//     <p>
//       In addition to solving common brewing challenges, our passive
//       float valve system offers increased flexibility in brew
//       temperature and flow rate, empowering users to tailor their
//       brewing experience according to their preferences. By
//       revolutionizing the pour-over coffee brewing process, our
//       groundbreaking technology delivers a superior experience that
//       caters to the needs and preferences of coffee lovers worldwide.
//       Explore the benefits of our cutting-edge technology and elevate
//       your coffee products to new heights.
//     </p>
//   </div>
// </div>
// </section>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import { dsvFormat } from "d3-dsv";
import { mean } from "d3";
import { asvTranslationData } from "./asvTranslationData";
import { bookNames } from "./fullBookNameData";
import './style.css'

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
  // console.log({ data, response, dsfdsfd: asvTranslationData.resultset.row[0].field  });
  // Calculate averages
  const grouped = data.reduce((accumulator: AccumulatorType, row: RowData) => {
    const verse = row.verse_uid;
    if (!accumulator[verse]) {
      accumulator[verse] = [];
    }
    accumulator[verse].push(parseFloat(row.cosine_similarity));
    return accumulator;
  }, {} as AccumulatorType);
  // console.log({grouped: grouped['1001001'] });
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
      const bookName = bookNames.resultset.keys.find(key => key.b === asvTranslationDataForVerse.book)?.n
      const newSection = document.createElement("section");
      // newSection.textContent = `Verse ${asvTranslationDataForVerse.verse_text}: Average similarity = ${average}`;
      newSection!.innerHTML = `
      <section>
      <div
        class="flex-container centered-flex-column problem-section"
        style="background-color: #fcfbfc; min-height: 100vh"
      >
        <div class="maxTextWidth centered-flex-column">
          <h2>${bookName} ${asvTranslationDataForVerse.chapter}:${asvTranslationDataForVerse.verse_number}</h2>
          <p>
            ${asvTranslationDataForVerse.verse_text}
          </p>
          <h1>Average similarity </b> ${average}</h1>
        </div>
      </div>
      </section>
      `
      appDiv.appendChild(newSection);
      // Wait for the browser to paint the updates
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  }
}

};

loadData();
