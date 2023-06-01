import { mean } from "d3";
import { asvTranslationData } from "./asvTranslationData";
import { bookNames } from "./fullBookNameData";
import "./style.css";

type AccumulatorType = { [verse_uid: string]: number[] };

interface RowData {
  verse_uid: string;
  version_code_1: string;
  version_code_2: string;
  cosine_similarity: string;
}

const selectElement = document.querySelector<HTMLSelectElement>('#book-selector')!;

selectElement?.addEventListener('change', (event) => {
  const selectElement = event.target as HTMLSelectElement;
  const bookCode = selectElement.value;
  console.log(bookCode);
  loadData(bookCode);
});


const loadData = async (bookCode: string) => {
  const response = await fetch(`/booksOfTheBibleRelationData/${bookCode}.json`);
  const data: RowData[] = await response.json();

  // Calculate averages
  const grouped = data.reduce((accumulator: AccumulatorType, row: RowData) => {
    const verse = row.verse_uid;
    if (!accumulator[verse]) {
      accumulator[verse] = [];
    }
    accumulator[verse].push(parseFloat(row.cosine_similarity));
    return accumulator;
  }, {} as AccumulatorType);

  const averages = Object.entries(grouped).map(([verse, values]) => {
    return {
      verse,
      average: mean(values),
    };
  });

  const sidebar = document.querySelector<HTMLDivElement>("#sidebar")!;



  // Clear the existing content
  const appDiv = document.querySelector<HTMLDivElement>("#app")!;
  sidebar.innerHTML = '';
  appDiv.innerHTML = '';

  averages.forEach(({ verse, average }) => {
    if (verse && average) {
      const button = document.createElement("button");
      // button.textContent = `Verse ${verse}`;
      button.style.opacity = `${1 - average}`; // assuming 'average' is a value between 0 and 1
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
  for (const { verse, average } of averages) {
    if (verse && average !== undefined) {
      // Checking average !== undefined because average can be 0
      const asvTranslationDataForVerse = asvTranslationData.resultset.row.find(
        (row) => `${row.field.verse_uid}` === verse
      )?.field;
      if (asvTranslationDataForVerse) {
        const bookName = bookNames.resultset.keys.find(
          (key) => key.b === asvTranslationDataForVerse.book
        )?.n;
        const newSection = document.createElement("section");
        newSection.id = `section-${verse}`;
        // newSection.textContent = `Verse ${asvTranslationDataForVerse.verse_text}: Average similarity = ${average}`;
        newSection!.innerHTML = /*html*/ `
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
      `;
        appDiv.appendChild(newSection);
        // Wait for the browser to paint the updates
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
  }
};

// initial load
if (selectElement?.value) {
  loadData(selectElement?.value);
}
