const apiKey = process.env.GOOGLE_API_KEY;

async function test() {
  const q = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants&key=${apiKey}`;
  const res = await fetch(q);
  const json = await res.json();
  const placeId = json.results[0].place_id;
  
  const dq = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=editorial_summary,reviews,types&key=${apiKey}`;
  const dres = await fetch(dq);
  const djson = await dres.json();
  console.log(JSON.stringify(djson, null, 2));
}

test();
