function dateDiffrence(date1) {
  let currentDate = new Date();

  // Set the target date
  let targetDate = new Date(date1);

  // Add one year to the target date
  targetDate.setFullYear(targetDate.getFullYear() + 1);

  // Calculate the difference in milliseconds between the current date and target date
  let timeDiff = targetDate.getTime() - currentDate.getTime();

  // Calculate the difference in days
  let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  console.log("The difference in days is: " + daysDiff);
  return daysDiff;
}

module.exports = dateDiffrence;
