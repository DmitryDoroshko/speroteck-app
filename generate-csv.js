const axios = require("axios");

const fetchedData = axios.get("https://reqres.in/api/users").then(data => {
  const requestData = data.data.data;
  // [ID, Email, First Name, Last Name]

  let csvDataToWrite = "";

  for (let csvField of requestData) {
    csvDataToWrite += `${csvField.id}, ${csvField.email}, ${csvField.first_name}, ${csvField.last_name}\n`;
  }

  require("fs").writeFileSync("FILE.CSV", csvDataToWrite);
}).catch(error => {
  console.log(error);
});

console.log(fetchedData);