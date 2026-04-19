const apiKey = process.env.GOOGLE_API_KEY;

const FOOD_KEYWORDS = [
  'american', 'mexican', 'italian', 'chinese', 'japanese', 'thai', 'indian', 'korean', 'mediterranean',
  'burgers', 'fries', 'nachos', 'pizza', 'ice cream', 'coffee', 'steak', 'breakfast', 'brunch',
  'sushi', 'tacos', 'salad', 'sandwiches', 'bbq', 'seafood', 'vegan', 'vegetarian', 'dessert', 'cocktails', 'wine', 'beer'
];

async function test() {
  const q = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=food&key=${apiKey}`;
  const res = await fetch(q);
  const json = await res.json();
  const places = json.results.slice(0, 3);
  
  const start = Date.now();
  const details = await Promise.all(places.map(async place => {
    const dres = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=editorial_summary,reviews&key=${apiKey}`);
    const djson = await dres.json();
    return { place, detail: djson.result };
  }));
  console.log('Fetch Time:', Date.now() - start, 'ms');

  for (const item of details) {
    const textBlob = [
      item.detail.editorial_summary?.overview || '',
      ...(item.detail.reviews || []).map(r => r.text)
    ].join(' ').toLowerCase();

    const matchedTags = FOOD_KEYWORDS.filter(kw => textBlob.includes(kw));

    console.log(item.place.name);
    console.log('Desc:', item.detail.editorial_summary?.overview || 'None');
    console.log('Tags:', matchedTags.slice(0, 4));
    console.log('---');
  }
}

test();
