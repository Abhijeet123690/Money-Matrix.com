export default async function handler(req, res) {
  const { keywords } = req.query;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to search symbols' });
  }
}
