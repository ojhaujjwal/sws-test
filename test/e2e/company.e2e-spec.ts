import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { SuperTest } from 'supertest';

describe('Company', () => {
  const LIST_ENDPOINT = '/api/v1/companies';

  let app;
  let superTest: SuperTest<any>;

  const createListEndpoint = (queryString?: string) => `${LIST_ENDPOINT}?${queryString}`;
  const sendGetReqToListEndpoint = (queryString?: string) =>  superTest.get(createListEndpoint(queryString));

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    superTest = request(app.getHttpServer());
  });

  describe('GET /api/v1/companies', () => {
    it('should return all the companies in first page', async () => {
      const response = await sendGetReqToListEndpoint()
        .expect(200);

      expect(response.body.items).toHaveLength(10);
      expect(response.body.meta.totalItems).toEqual(12);
      expect(response.body.meta.totalPages).toEqual(2);
    });

    it('should be able to alter the page size with a query param', async () => {
      const response1 = await sendGetReqToListEndpoint('perPage=5')
        .expect(200);

      expect(response1.body.items).toHaveLength(5);
      expect(response1.body.meta.totalItems).toEqual(12);
      expect(response1.body.meta.totalPages).toEqual(3);

      const response2 = await sendGetReqToListEndpoint('perPage=15')
        .expect(200);

      expect(response2.body.items).toHaveLength(12);
      expect(response2.body.meta.totalItems).toEqual(12);
      expect(response2.body.meta.totalPages).toEqual(1);
    });


    it('should be able to filter company by specified exchange symbols', async () => {
      const response = await sendGetReqToListEndpoint('exchangeSymbols[]=NYSE&exchangeSymbols[]=ASX')
        .expect(200);

      expect(response.body.items).toHaveLength(7);
      expect(response.body.meta.totalItems).toEqual(7);

      expect(new Set(response.body.items.map((item) => item.exchangeSymbol))).toEqual(new Set(['NYSE', 'ASX']));
    });

    it('should be able to filter by score', async () => {
      const response = await sendGetReqToListEndpoint('scores[past]=2')
        .expect(200);

      expect(response.body.items).toHaveLength(4);
      expect(response.body.meta.totalItems).toEqual(4);

      expect(new Set(response.body.items.map((item) => item.scores.past))).toEqual(new Set([2]));
    });

    it('should be able to filter by combination of filters in query', async () => {
      const response = await sendGetReqToListEndpoint('scores[past]=2&exchangeSymbols[]=NYSE&sort=-scores.value')
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
        first: createListEndpoint('scores=&exchangeSymbols=NYSE&sort=-scores.value&limit=10'),
        previous: '',
        next: '',
        last: createListEndpoint('scores=&exchangeSymbols=NYSE&sort=-scores.value&page=1&limit=10')
      });
    });

    it('should be able to sort in ascending/descending order by specified score', async () => {
      const response1 = await sendGetReqToListEndpoint('exchangeSymbols[]=ASX&sort=scores.value')
        .expect(200);

      const scores1: ReadonlyArray<number> = response1.body.items.map((company) => company.scores.value);

      expect([...scores1].sort()).toEqual(scores1);

      const response2 = await sendGetReqToListEndpoint('exchangeSymbols[]=ASX&sort=-scores.value')
        .expect(200);

      const scores2: ReadonlyArray<number> = response2.body.items.map((company) => company.scores.value);

      expect([...scores2].reverse()).toEqual(scores1);
    });

    it('should be able to sort in ascending/descending order by volatility', async () => {
      const volatilityOrder = ['Microsoft', 'Facebook', 'Apple', 'Tesla', 'Amazon.com'];

      const response1 = await sendGetReqToListEndpoint('exchangeSymbols[]=NasdaqGS&sort=volatility')
        .expect(200);

      expect(response1.body.items.map((item) => item.name)).toEqual(volatilityOrder);

      const response2 = await sendGetReqToListEndpoint('exchangeSymbols[]=NasdaqGS&sort=-volatility')
        .expect(200);

      expect(response2.body.items.map((item) => item.name)).toEqual(volatilityOrder.reverse());
    });
  });

});

