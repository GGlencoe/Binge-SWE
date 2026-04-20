const apiKey = process.env.GOOGLE_API_KEY;

async function test() {
  const q = `https://places.googleapis.com/v1/places:searchText`;
  const res = await fetch(q, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos,places.primaryType,places.types,places.rating,places.priceLevel,places.editorialSummary,places.location'
    },
    body: JSON.stringify({
      textQuery: 'restaurants',
      maxResultCount: 5,
    })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

test();
