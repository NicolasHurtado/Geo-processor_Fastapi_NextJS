import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as request from 'supertest';
import { Server } from 'http';
import { AppModule } from './../src/app.module'; // Importa tu AppModule principal
import { GeoService } from './../src/geo/geo.service';
import { ProcessResponseDto } from './../src/geo/dto/process-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

// Mock GeoService
const mockGeoService = {
  processCoordinates: jest.fn(),
};

// Mock CacheManager (simple, Only for testing purposes)
const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

interface ErrorResponse {
  statusCode: number;
  message: string[] | string;
  error?: string;
}

describe('GeoController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GeoService)
      .useValue(mockGeoService)
      .overrideProvider(CACHE_MANAGER) // Override the real CACHE_MANAGER
      .useValue(mockCacheManager) // with our mock
      .compile();

    app = moduleFixture.createNestApplication();
    // Apply the same ValidationPipe that in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset the mocks before each test
    mockGeoService.processCoordinates.mockReset();
    mockCacheManager.get.mockReset();
    mockCacheManager.set.mockReset();
  });

  describe('/geo/process (POST)', () => {
    const validPayload = {
      points: [
        { lat: 40.7128, lng: -74.006 },
        { lat: 34.0522, lng: -118.2437 },
      ],
    };

    const mockServiceResponse: ProcessResponseDto = {
      centroid: { lat: 37.3825, lng: -96.12485 },
      bounds: {
        north: 40.7128,
        south: 34.0522,
        east: -74.006,
        west: -118.2437,
      },
    };

    it('Should process valid points and return 200 OK', async () => {
      mockGeoService.processCoordinates.mockResolvedValue(mockServiceResponse);
      // The CacheInterceptor will not interfere directly if the service is mocked like this,
      // since the call to the real service (and hence the cache) is avoided.
      // To specifically test the cache, we would need a different approach.

      const response: request.Response = await request(
        app.getHttpServer() as Server,
      )
        .post('/geo/process')
        .send(validPayload)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(mockServiceResponse);
      expect(mockGeoService.processCoordinates).toHaveBeenCalledWith(
        validPayload,
      );
    });

    it('should return 400 Bad Request for an empty points list', () => {
      return request(app.getHttpServer() as Server)
        .post('/geo/process')
        .send({ points: [] })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ErrorResponse;
          expect(body.message).toContain(
            "The 'points' array must contain at least one point.",
          );
        });
    });

    it("should return 400 Bad Request if the 'points' field is missing", () => {
      return request(app.getHttpServer() as Server)
        .post('/geo/process')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ErrorResponse;
          expect(body.message).toContain(
            "The 'points' field must be an array.",
          );
        });
    });

    it('should return 400 Bad Request for invalid lat/lng types', () => {
      return request(app.getHttpServer() as Server)
        .post('/geo/process')
        .send({ points: [{ lat: 'invalid', lng: -74.006 }] })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ErrorResponse;
          expect(body.message).toEqual(
            expect.arrayContaining([
              'points.0.The latitude must be a valid coordinate.',
              'points.0.The latitude must be a number.',
            ]),
          );
        });
    });

    it('should return 400 Bad Request for latitude out of range', () => {
      return request(app.getHttpServer() as Server)
        .post('/geo/process')
        .send({ points: [{ lat: 91.0, lng: -74.006 }] })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ErrorResponse;
          expect(body.message).toEqual(
            expect.arrayContaining([
              'points.0.The latitude must be a valid coordinate.',
            ]),
          );
        });
    });

    it('should return 400 Bad Request for longitude out of range', () => {
      return request(app.getHttpServer() as Server)
        .post('/geo/process')
        .send({ points: [{ lat: 40.0, lng: -181.0 }] })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ErrorResponse;
          expect(body.message).toEqual(
            expect.arrayContaining([
              'points.0.The longitude must be a valid coordinate.',
            ]),
          );
        });
    });

    it('should handle GeoService errors and return the appropriate status code', async () => {
      const errorMessage: string = 'Simulated service error';
      mockGeoService.processCoordinates.mockRejectedValue(
        new HttpException(errorMessage, HttpStatus.SERVICE_UNAVAILABLE),
      );

      const response: request.Response = await request(
        app.getHttpServer() as Server,
      )
        .post('/geo/process')
        .send(validPayload)
        .expect(HttpStatus.SERVICE_UNAVAILABLE);
      const body = response.body as ErrorResponse;
      expect(body.message).toEqual(errorMessage);
    });
  });
});
