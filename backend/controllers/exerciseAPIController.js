require('dotenv').config();
const base_uri = process.env.EXERCISEDB_BASE_URI;
const apiKey = process.env.EXERCISEDB_API_KEY;
const host = process.env.EXERCISEDB_HOST;
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': apiKey,
		'x-rapidapi-host': host
	}
};
const search = async (query) => {
  try {
    const response = await fetch(`${base_uri}/name/${query}`, options);
    const result = await response.json();
    return result;
  } catch(error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  search,
}