import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ProcessRequestDto } from './dto/process-request.dto';
import { ProcessResponseDto } from './dto/process-response.dto';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private pythonServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.pythonServiceUrl = this.configService.get<string>(
      'PYTHON_SERVICE_URL',
      'http://backend-pythonXX:8000/process',
    );
    this.logger.log(`Python service URL: ${this.pythonServiceUrl}`);
  }

  async processCoordinates(
    processRequestDto: ProcessRequestDto,
  ): Promise<ProcessResponseDto> {
    const cacheKey = `geo-process-${JSON.stringify(processRequestDto.points)}`;
    this.logger.log(`Searching in cache with the key: ${cacheKey}`);

    const cachedData =
      await this.cacheManager.get<ProcessResponseDto>(cacheKey);
    if (cachedData) {
      this.logger.log('Cache hit!');
      return cachedData;
    }
    this.logger.log('Cache miss. Calling the Python service.');

    try {
      const response = await firstValueFrom(
        this.httpService
          .post<ProcessResponseDto>(this.pythonServiceUrl, processRequestDto)
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                `Error calling the Python service: ${error.message}`,
                error.stack,
              );
              if (error.response) {
                this.logger.error(
                  `Python service response: Status ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`,
                );
                throw new HttpException(
                  {
                    message:
                      'Error communicating with the geospatial processing service.',
                    statusCode: error.response.status,
                    originalError: error.response.data,
                  },
                  error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
                );
              } else if (error.request) {
                this.logger.error('No response from the Python service.');
                throw new HttpException(
                  'No response from the geospatial processing service.',
                  HttpStatus.SERVICE_UNAVAILABLE,
                );
              } else {
                this.logger.error(
                  'Error configuring the request to the Python service.',
                );
                throw new HttpException(
                  'Internal error trying to communicate with the geospatial processing service.',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              }
            }),
          ),
      );

      const responseData = response.data;
      // Añadimos el TTL aquí (ej. 60000 ms = 60 segundos)
      await this.cacheManager.set(cacheKey, responseData, 60000);
      this.logger.log('Python service response stored in cache with TTL 60s.');
      return responseData;
    } catch (error: unknown) {
      // If the error is already a HttpException, throw it
      if (error instanceof HttpException) {
        throw error;
      }

      let errorMessage = 'An unexpected error occurred';
      let errorStack: string | undefined = undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null) {
        const errObj = error as { message?: unknown; stack?: unknown };
        if (typeof errObj.message === 'string') {
          errorMessage = errObj.message;
        }
        if (typeof errObj.stack === 'string') {
          errorStack = errObj.stack;
        }
      }

      this.logger.error(
        `Unexpected error in processCoordinates: ${errorMessage}`,
        errorStack,
      );
      throw new HttpException(
        'An unexpected error occurred while processing the request.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
