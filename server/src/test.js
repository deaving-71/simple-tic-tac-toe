function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

for (let index = 0; index < 20; index++) {
  console.log(randomIntFromInterval(1, 2));
}
