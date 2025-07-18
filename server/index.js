const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Rota para obter a lista de países (equivalente a /api/countries do exemplo anterior)
 * GET /api/countries
 */
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        iso3code: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * Rota para buscar dados turísticos por país(s), ano e tipo de agregação
 * Ex: GET /api/tourism?countryIds=BR,AR&startYear=2010&endYear=2020&aggregation=avg
 */
app.get('/api/tourism', async (req, res) => {
  try {
    const { countryIds, startYear, endYear, aggregation } = req.query;
    if (!countryIds || !startYear || !endYear) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    const countryIdList = countryIds.split(',');
    const start = parseInt(startYear);
    const end = parseInt(endYear);

    if (aggregation === 'none') {
      const rawData = await prisma.tourismData.findMany({
        where: {
          country_id: { in: countryIdList },
          year: { gte: start, lte: end }
        },
        include: {
          country: { select: { name: true, iso3code: true } },
          indicator: { select: { name: true } }
        },
        orderBy: { year: 'asc' }
      });

      const formatted = rawData.map(d => ({
        id: d.id,
        year: d.year,
        value: d.value,
        countryId: d.country_id,
        countryName: d.country.name
      }));

      return res.json(formatted);
    }

    // Para agregações: recarregamos data (nome já definido)
    const data = await prisma.tourismData.findMany({
      where: {
        country_id: { in: countryIdList },
        year: { gte: start, lte: end }
      },
      include: {
        country: { select: { name: true } },
      }
    });

    const grouped = {};
    for (const record of data) {
      const cid = record.country_id;
      if (!grouped[cid]) grouped[cid] = [];
      grouped[cid].push(record.value ?? 0);
    }

    const result = Object.entries(grouped).map(([countryId, values]) => {
      let aggregateValue;
      switch (aggregation) {
        case 'sum':
          aggregateValue = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          aggregateValue = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'max':
          aggregateValue = Math.max(...values);
          break;
        case 'min':
          aggregateValue = Math.min(...values);
          break;
        default:
          aggregateValue = values.reduce((a, b) => a + b, 0);
      }

      const countryName = data.find(d => d.country_id === countryId)?.country.name;

      return { countryId, countryName, value: aggregateValue, aggregation };
    });

    return res.json(result);
  } catch (error) {
    console.error('Erro no /api/tourism:', error);
    return res.status(500).json({ error: 'Erro interno', message: error.message });
  }
});




// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Gerenciamento de shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});