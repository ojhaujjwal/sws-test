import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { SuperTest } from 'supertest';

describe('Company', () => {
  const LIST_ENDPOINT = '/api/v1/companies';

  let app;
  let superTest: SuperTest<any>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    superTest = request(app.getHttpServer());
  });

  describe('GET /api/v1/companies', () => {
    const createEndpoint = (queryString?: string) => `${LIST_ENDPOINT}?${queryString}`;
    const sendGetReq = (queryString?: string) =>  superTest.get(createEndpoint(queryString));

    it('should return all the companies in first page', async () => {
      const response = await sendGetReq()
        .expect(200);

      expect(response.body.items).toHaveLength(10);
      expect(response.body.meta.totalItems).toEqual(12);
      expect(response.body.meta.totalPages).toEqual(2);
    });

    it('should be able to alter the page size with a query param', async () => {
      const response1 = await sendGetReq('perPage=5')
        .expect(200);

      expect(response1.body.items).toHaveLength(5);
      expect(response1.body.meta.totalItems).toEqual(12);
      expect(response1.body.meta.totalPages).toEqual(3);

      const response2 = await sendGetReq('perPage=15')
        .expect(200);

      expect(response2.body.items).toHaveLength(12);
      expect(response2.body.meta.totalItems).toEqual(12);
      expect(response2.body.meta.totalPages).toEqual(1);
    });


    it('should be able to filter company by specified exchange symbols', async () => {
      const response = await sendGetReq('exchangeSymbols[]=NYSE&exchangeSymbols[]=ASX')
        .expect(200);

      expect(response.body.items).toHaveLength(7);
      expect(response.body.meta.totalItems).toEqual(7);

      expect(new Set(response.body.items.map((item) => item.exchangeSymbol))).toEqual(new Set(['NYSE', 'ASX']));
    });

    it('should be able to filter by score', async () => {
      const response = await sendGetReq('scores[past]=2')
        .expect(200);

      expect(response.body.items).toHaveLength(4);
      expect(response.body.meta.totalItems).toEqual(4);

      expect(new Set(response.body.items.map((item) => item.scores.past))).toEqual(new Set([2]));
    });

    it('should be able to filter by combination of filters in query', async () => {
      const response = await sendGetReq('scores[past]=2&exchangeSymbols[]=NYSE&sort=-scores.value')
        .expect(200);

      expect(response.body.items).toHaveLength(2);
      expect(response.body.meta).toEqual({
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1
      });

      expect(response.body.items).toEqual([
        {
          id: "49A0E7C9-F918-4E97-AECA-D8D37F9A3F4F",
          name: "Delta Air Lines",
          exchangeSymbol: "NYSE",
          uniqueSymbol: "NYSE:DAL",
          lastClosingPrice: 22.69,
          scores: {
            past: 2,
            future: 6,
            dividend: 0,
            value: 5,
            health: 2
          }
        },
        {
          id: "A0A1A293-FDA8-48DF-9EBF-35556CDE3235",
          name: "Walt Disney",
          exchangeSymbol: "NYSE",
          uniqueSymbol: "NYSE:DIS",
          lastClosingPrice: 118.02,
          scores: {
            past: 2,
            future: 4,
            dividend: 0,
            value: 1,
            health: 1
          }
        }
      ]);

      expect(response.body.links).toEqual({
        first: createEndpoint('scores=&exchangeSymbols=NYSE&sort=-scores.value&limit=10'),
        previous: '',
        next: '',
        last: createEndpoint('scores=&exchangeSymbols=NYSE&sort=-scores.value&page=1&limit=10')
      });
    });

    it('should be able to sort in ascending/descending order by specified score', async () => {
      const response1 = await sendGetReq('exchangeSymbols[]=ASX&sort=scores.value')
        .expect(200);

      const scores1: ReadonlyArray<number> = response1.body.items.map((company) => company.scores.value);

      expect([...scores1].sort()).toEqual(scores1);

      const response2 = await sendGetReq('exchangeSymbols[]=ASX&sort=-scores.value')
        .expect(200);

      const scores2: ReadonlyArray<number> = response2.body.items.map((company) => company.scores.value);

      expect([...scores2].reverse()).toEqual(scores1);
    });

    it('should be able to sort in ascending/descending order by volatility', async () => {
      const volatilityOrder = ['Microsoft', 'Facebook', 'Apple', 'Tesla', 'Amazon.com'];

      const response1 = await sendGetReq('exchangeSymbols[]=NasdaqGS&sort=volatility')
        .expect(200);

      expect(response1.body.items.map((item) => item.name)).toEqual(volatilityOrder);

      const response2 = await sendGetReq('exchangeSymbols[]=NasdaqGS&sort=-volatility')
        .expect(200);

      expect(response2.body.items.map((item) => item.name)).toEqual(volatilityOrder.reverse());
    });
  });

  describe('GET /api/v1/companies/:companyId/price-timeline', () => {
    const sendGetReq = (companyId: string, queryString?: string) =>
      superTest.get(`${LIST_ENDPOINT}/${companyId}/price-timeline?${queryString}`);

    it('should return the prices', async () => {
      const response = await sendGetReq('424EB65E-8C34-42BF-A107-61F93D4E9E6D')
        .expect(200);

      expect(response.body.items).toHaveLength(42);
    });

    it('should return the prices up to the specified date', () => {
      return sendGetReq('424EB65E-8C34-42BF-A107-61F93D4E9E6D', 'upto=2020-05-20')
        .expect(200, {
          items: [
            {
              price: 183.51,
              date: "2020-05-22"
            },
            {
              price: 183.43,
              date: "2020-05-21"
            },
            {
              price: 185.66,
              date: "2020-05-20"
            }
          ]
        })
    });
  });
});

