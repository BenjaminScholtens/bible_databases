# Bible Verses Embedding Similarity

## Overview
This project is focused on creating an open-source tool to compare the similarity between various versions of Bible verses using natural language processing techniques. Specifically, it uses a transformer model to generate embeddings for verses from different versions, and then calculates the cosine similarity between these embeddings. This provides a measure of the similarity between the semantic content of the verses in different versions.

## Data Preview
https://translation-ambiguity-project.netlify.app/

## Key Features

- **Embedding Generation:** This project uses a transformer model to generate embeddings for each verse. These embeddings capture the semantic content of the verses, enabling comparison between versions.

- **Cosine Similarity Calculation:** The cosine similarity between embeddings of the same verse from different versions is calculated and stored, providing a measure of the similarity between these verses.

- **Data Collection and Preprocessing:** The project includes utilities for loading and preprocessing Bible verses from various versions in JSON format.

- **Logging and Results:** The calculated cosine similarities are stored in a TSV file, and a log file is maintained to keep track of progress and ensure results aren't duplicated.

## How to Use

1. **Preparation:** First, you'll need to collect the Bible text in JSON format for each version you wish to compare. These should be stored in a `./json/` directory in the root of the project.

2. **Running the script:** Run the script. It will automatically process the Bible verse files, generate embeddings, calculate cosine similarities, and store the results in a TSV file. Progress will be logged to a separate file to ensure work isn't duplicated.

3. **Analysis:** Once the script has run, you can analyze the results by opening the TSV file. Each row in the file represents a pair of verses, with the calculated cosine similarity between them.

## Dependencies
- PyTorch
- Huggingface Transformers
- Numpy
- CSV, JSON, and OS libraries

## Limitations and Future Work
- Currently, the script needs to be run on the entire Bible at once, and can take a significant amount of time to complete. Future work could include breaking down the task into smaller chunks to be processed individually or in parallel.

- The project currently compares verses on a one-to-one basis. Future versions could potentially include more sophisticated comparison methods, such as comparing a verse with a group of surrounding verses to provide more context.

## Contributing
We welcome contributions to this project! Whether you're interested in adding new features, fixing bugs, or simply improving the documentation, we'd love to have your help. Please feel free to submit a pull request or open an issue to discuss your ideas.

## License
This project is licensed under the terms of the MIT license.

Please note that this project is for educational and research purposes and is not officially endorsed by or affiliated with any specific Bible translation. The Bible translations used in this project are those that are freely available and in the public domain.
