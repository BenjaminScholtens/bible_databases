import untyped_ASV_translation_data from './t_asv.json'
const asvTranslation: TranslationJson = untyped_ASV_translation_data as TranslationJson;
type TranslationJson = {
  resultset: ResultSet;
}

type ResultSet = {
  row: Row[];
}

type Row = {
    field: [number, number, number, number, string];
  }


interface TransformedField {
    verse_uid: number;
    book: number;
    chapter: number;
    verse_number: number;
    verse_text: string;
  }
  
  interface TransformedRow {
    field: TransformedField;
  }
  
  interface TransformedResultSet {
    row: TransformedRow[];
  }
  
  interface TransformedTranslationJson {
    resultset: TransformedResultSet;
  }
  

function transformData(data: TranslationJson): TransformedTranslationJson {
    const transformedData: TransformedTranslationJson = {
      resultset: {
        row: data.resultset.row.map(row => ({
          field: {
            verse_uid: row.field[0],
            book: row.field[1],
            chapter: row.field[2],
            verse_number: row.field[3],
            verse_text: row.field[4]
          }
        }))
      }
    };
  
    return transformedData;
  }

  export const asvTranslationData = transformData(asvTranslation);
  