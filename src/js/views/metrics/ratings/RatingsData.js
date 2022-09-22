import { DummyDataWorkers } from "./DummyDataWorkers";

const RatingDataGenerator = () => {

  // First array
  let ratings = [];

  // Gathering all the ratings from each worker
  DummyDataWorkers.forEach((worker) => {
    ratings.push(worker.rating);
  });

  // Function to make an array of objects with all the ratings
  const findOccurrences = (arr = []) => {
    const results = [];

    arr.forEach((item) => {
      const index = results.findIndex((obj) => {
        return obj["rating"] === item;
      });
      if (index === -1) {
        results.push({
          rating: item,
          qty: 1
        });
      } else {
        results[index]["qty"]++;
      }
    });

    return results;
  };

  // Generating array
  let array = findOccurrences(ratings);

  // Calculating total of the quantities
  let total = array.reduce((s, { qty }) => s + qty, 0);

  // Generating and adding percentages as new properties
  let ratingsArray = array.map(({ rating, qty }) => ({
    rating,
    qty,
    pct: ((qty * 100) / total).toFixed(0)
  }));

  // Organizing objects by numerical order of the "rating" property
  let sortedArray = ratingsArray.sort((a, b) => (a.rating - b.rating))

  // Moving the first object ("Unavailable Rating") to the last position of the array
  sortedArray.push(sortedArray.shift());

  // Generating an object with the totals
  let totalsObj = { rating: "Total Employees", qty: total, pct: "100"}

  // Adding object with the totals to array
  sortedArray.push(totalsObj)

  // Adding id's to each object in the array
  sortedArray.forEach((item, i) => {
    item.id = i + 1;
  });

  // Returning the array
  return sortedArray
};

// Exporting the array
export const RatingsData = RatingDataGenerator()