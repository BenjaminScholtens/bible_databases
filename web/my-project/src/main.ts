import { mean } from "d3";
import { asvTranslationData } from "./asvTranslationData";
import { bookNames } from "./fullBookNameData";
import "./style.css";
import {
  createPercentileText,
  createPieChart,
  createBarChart,
} from "./dataVisualizationUtils";

type AccumulatorType = {
  [verse_uid: string]: {
    value: number;
    version_code_1: string;
    version_code_2: string;
  }[];
};

export interface VerseData {
  verse_uid: string;
  version_code_1: string;
  version_code_2: string;
  cosine_similarity: number;
  average_cosine_similarity: number;
  cosine_similarity_percentile: number;
}
const selectElement =
  document.querySelector<HTMLSelectElement>("#book-selector")!;

selectElement?.addEventListener("change", (event) => {
  const selectElement = event.target as HTMLSelectElement;
  const bookCode = selectElement.value;
  console.log(bookCode);
  loadData(bookCode);
});

const loadData = async (bookCode: string) => {
  const response = await fetch(
    `/booksOfTheBibleRelationData/percentile_${bookCode}.json`
  );
  const data: VerseData[] = await response.json();

  // Calculate averages
  const grouped = data.reduce(
    (accumulator: AccumulatorType, row: VerseData) => {
      const verse = row.verse_uid;
      if (!accumulator[verse]) {
        accumulator[verse] = [];
      }
      accumulator[verse].push({
        value: row.cosine_similarity,
        version_code_1: row.version_code_1,
        version_code_2: row.version_code_2,
      });
      return accumulator;
    },
    {} as AccumulatorType
  );

  const averages = Object.entries(grouped).map(([verse, verseData]) => {
    return {
      verse,
      average: mean(verseData.map((data) => data.value)),
      // calclulate the standard deviation
      standard_deviation: Math.sqrt(
        mean(
          verseData.map(({ value }) =>
            Math.pow(value - mean(verseData.map((data) => data.value))!, 2)
          )
        )!
      ),
      rawValues: verseData,
    };
  });

  const sidebar = document.querySelector<HTMLDivElement>("#sidebar")!;

  const calculateOpacityFromAverage = (average: number) => {
    return (1 - average) * 3;
  };

  const appDiv = document.querySelector<HTMLDivElement>("#app")!;

  // Clear the existing content
  sidebar.innerHTML = "";
  appDiv.innerHTML = "";

  let observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // if there is a id in the url already then clear the text content of the button with the matching id
          if (window.location.hash) {
            const button = document.querySelector<HTMLButtonElement>(
              `#button-${window.location.hash.split("#")[1]}`
            )!;
            const average = averages.find(
              ({ verse }) => verse === window.location.hash.split("#")[1]
            )?.average;
            if (button && average) {
              button.textContent = "";
              button.style.backgroundColor = `rgba(207, 0, 0, ${calculateOpacityFromAverage(
                average
              )})`; // Modify this line
              button.style.padding = "0";
            }
          }
          history.pushState(null, "", "#" + entry.target.id.split("-")[1]);
          // update the text content of the button with the matching id
          const button = document.querySelector<HTMLButtonElement>(
            `#button-${entry.target.id.split("-")[1]}`
          );
          if (button) {
            button.textContent = `Verse ${entry.target.id.split("-")[1]}`;
            button.style.padding = "0.5rem";
          }
        }
      });
    },
    {
      threshold: 0.5, // Adjust this value as needed
    }
  );

  averages.forEach(({ verse, average }) => {
    if (verse && average) {
      const button = document.createElement("button");
      button.id = `button-${verse}`;
      // if the id stored in the url matches the id in the button add `Verse ${verse}` as the text content
      if (window.location.hash === `#${verse}`) {
        button.textContent = `Verse ${verse}`;
      }
      button.style.backgroundColor = `rgba(207, 0, 0, ${calculateOpacityFromAverage(
        average
      )})`; // Modify this line
      button.onclick = () => {
        const section = document.querySelector(`#section-${verse}`);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      };
      sidebar.appendChild(button);
    }
  });
  // Display the data
  for (const { verse, average, standard_deviation, rawValues } of averages) {
    if (verse && average !== undefined) {
      // Checking average !== undefined because average can be 0
      const asvTranslationDataForVerse = asvTranslationData.resultset.row.find(
        (row) => `${row.field.verse_uid}` === verse
      )?.field;
      const verseData = data.find((row) => `${row.verse_uid}` === verse);
      const percentileDate = verseData?.cosine_similarity_percentile || 0;
      if (asvTranslationDataForVerse) {
        const bookName = bookNames.resultset.keys.find(
          (key) => key.b === asvTranslationDataForVerse.book
        )?.n;
        const newSection = document.createElement("section");
        newSection.id = `section-${verse}`;
        observer.observe(newSection);

        const averagePieChart = `average_pie_chart_${verseData?.verse_uid}`;
        const standardDeviationPieChart = `standard_deviation_pie_chart_${verseData?.verse_uid}`;
        newSection!.innerHTML = /*html*/ `
          <div
            class="flex-container centered-flex-column"
            style="background-color: #fcfbfc; min-height: 100vh"
          >
              <div class="flex-column">
              <h1>${bookName} ${asvTranslationDataForVerse.chapter}:${
          asvTranslationDataForVerse.verse_number
        }</h1>    
                        
              </div>
            <div class="maxTextWidth centered-flex-column">
              <h2 class="text-align-center">
                  Translation continuity of ${bookName} ${
          asvTranslationDataForVerse.chapter
        }:${
          asvTranslationDataForVerse.verse_number
        } falls ${createPercentileText(
          percentileDate
        )} of verses in ${bookName}, having a ${(
          (1 - average) * 100
        ).toFixed(1)}% semantic ambiguity between the biblical translations. 
                </h2>       
              <div class="flex-row justify-space-evenly" style="padding-top: 2rem">
                <div class="flex-column">
                    <div id=${averagePieChart}></div>
                    <h3 class="text-align-center">${average.toFixed(
                      2
                    )}</h3>                    
                    <p class="text-align-center">Average similarity of biblical translations</p>
                </div>
                <div class="flex-column">
                    <div id=${standardDeviationPieChart}></div>
                    <h3 class="text-align-center">${standard_deviation.toFixed(
                      2
                    )}</h3>                    
                    <p class="text-align-center">Standard deviation of biblical translations</p>
                </div>
              </div>
            </div>
          </div>
      `;
        appDiv.appendChild(newSection);
        if (verseData) {
          createPieChart({
            selectionId: averagePieChart,
            percentageFloat: average,
            maxSize: 100,
            showPercent: false,
          });
          createBarChart({
            selectionId: standardDeviationPieChart,
            data: rawValues.map(({ value, version_code_1, version_code_2 }) => {
              return {
                category: `${version_code_1} vs ${version_code_2}`,
                value: value,
              };
            }),
            size: 40,
            margin: { top: 30, right: 20, bottom: 30, left: 20 },
          });
        }
        // Wait for the browser to paint the updates
        // await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
  }
};

// initial load
if (selectElement?.value) {
  loadData(selectElement?.value);
}
