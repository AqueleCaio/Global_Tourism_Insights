const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Rota para obter dados de turismo
app.get('/api/tourism', async (req, res) => {
  const data = await prisma.tourismData.findMany({
    include: { country: true },
    orderBy: [{ country: { name: 'asc' } }, { year: 'asc' }]
  });
  res.json(data);
});

// Rota para adicionar dados
app.post('/api/tourism', async (req, res) => {
  const { countryId, year, visitors } = req.body;
  const newData = await prisma.tourismData.create({
    data: { countryId, year, visitors }
  });
  res.json(newData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
