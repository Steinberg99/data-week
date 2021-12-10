const express = require("express");
const app = express();
const port = 4200;
const emissionData = require("./emissionData.json");
const comparisonData = require("./comparisonData.json");

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

// Homepage.
app.get("/", (req, res) => {
  res.render("home", {});
});

// Results page.
app.post("/result", (req, res) => {
  const trainDistance = req.body.train;
  const emissions = calculateEmissions(req.body); // Calculate emissions per vehicle.
  const totalEmissions = calculateTotalEmissions(emissions, req.body.days); // Calculate total emissions.
  const overview = determineOverview(emissions, trainDistance); // Determine the emissions overview.
  const comparison = calculateComparison(totalEmissions); // Calculate the comparison values.
  const emojiCount = determineEmojiCount(trainDistance, comparison);

  // Render the results page.
  res.render("result", {
    trainDistance: trainDistance,
    emissions: emissions,
    totalEmissions: totalEmissions,
    overview: overview,
    comparison: comparison,
    emojiCount: emojiCount
  });
});

//Function to calculate emissions per vehicle.
function calculateEmissions(input) {
  const weeks = 38;
  Object.keys(emissionData).map(key => {
    input[key] = Math.floor(
      (input[key] * emissionData[key] * input.days * weeks * 2) / 1000
    );
  });
  return input;
}

// Function to calculate total emissions.
function calculateTotalEmissions(emissions, days) {
  let total = 0;
  for (let key in emissionData) {
    total += emissions[key];
  }
  return total; // Times two due to the outward and return journey
}

// Function to determine the emissions overview.
function determineOverview(emissions, trainDistance) {
  let overview = [];
  Object.keys(emissionData).forEach(key => {
    if (emissions[key] !== 0 || (key === "train" && trainDistance > 0)) {
      overview.push({
        emoji: emoji(key),
        vehicle: vehicle(key),
        emission: emissions[key]
      });
    }
  });
  return overview;
}

// Key to emoji.
function emoji(string) {
  switch (string) {
    case "train":
      return "🚆";
    case "bus":
      return "🚍";
    case "subway":
      return "🚇";
    case "tram":
      return "🚋";
    case "motorcycle":
      return "🏍️";
    case "gasScooter":
      return "🛵";
    case "electricScooter":
      return "🛵";
    case "electricBike":
      return "🚲";
    case "gasCar":
      return "🚘";
    case "dieselCar":
      return "🚙";
    case "hybridCar":
      return "🚘";
    case "electricCar":
      return "🚘";
  }
}

// Key to vehicle.
function vehicle(string) {
  switch (string) {
    case "train":
      return "Trein";
    case "bus":
      return "Bus";
    case "subway":
      return "Metro";
    case "tram":
      return "Tram";
    case "motorcycle":
      return "Motor";
    case "gasScooter":
      return "Benzine scooter";
    case "electricScooter":
      return "Elektrische scooter";
    case "electricBike":
      return "Elektrische fiets";
    case "gasCar":
      return "Benzine auto";
    case "dieselCar":
      return "Diesel auto";
    case "hybridCar":
      return "Hybride auto";
    case "electricCar":
      return "Elektrische auto";
  }
}

// Function to calculate the comparison values.
function calculateComparison(totalEmissions) {
  let comparison = {};
  Object.keys(comparisonData).forEach(key => {
    comparison[key] = Math.floor(totalEmissions / comparisonData[key]);
  });
  return comparison;
}

// Function to determine the emoji count.
function determineEmojiCount(trainDistance, comparison) {
  let emojiCount = {};
  const maxEmoji = 88;
  Object.keys(comparison).forEach(key => {
    comparison[key] <= maxEmoji
      ? (emojiCount[key] = comparison[key])
      : (emojiCount[key] = maxEmoji);
  });
  trainDistance >= maxEmoji || trainDistance == 0
    ? (emojiCount["train"] = maxEmoji)
    : (emojiCount["train"] = parseInt(trainDistance));
  if ((emojiCount["beef"] += emojiCount["chicken"] > maxEmoji)) {
    emojiCount["chicken"] = maxEmoji - emojiCount["beef"];
  }
  return emojiCount;
}

app.listen(port, () => {
  console.log(`Listening at https://localhost:${port}`);
});
