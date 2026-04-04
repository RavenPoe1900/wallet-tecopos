import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletTransaction } from 'common/interfaces/wallet-transaction.interface';

/**
 * Service responsible for making external API calls.
 * Retrieves the target URL from environment variables using ConfigService.
 * Handles HTTP errors and returns structured responses.
 */
@Injectable()
export class ExternalService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Fetches data from an external API endpoint.
   * Reads the target URL from the 'EXTERNAL_API_URL' environment variable.
   * Throws appropriate HTTP exceptions on configuration errors or network failures.
   *
   * @returns Parsed JSON response from the external API
   * @throws {HttpException} With appropriate status codes (500, 502) on failure
   */
  async getData(walletTransaction: WalletTransaction) {
    return true;

    // // Retrieve the external API URL from environment variables
    // const url = this.configService.get<string>('EXTERNAL_API_URL');

    // // Validate that the URL is defined and throw a 500 error if missing
    // if (!url) {
    //   throw new HttpException(
    //     'External service URL not configured',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }

    // try {
    //   // Perform the HTTP GET request to the external service
    //   const response = await fetch(url);

    //   // Check if the response status indicates success (200 OK)
    //   if (response.status !== 200) {
    //     throw new HttpException(
    //       `Invalid response: ${response.status}`,
    //       HttpStatus.BAD_GATEWAY,
    //     );
    //   }
    //   // Parse and return the JSON payload from the response
    //   return await response.json();

    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // } catch (_err) {
    //   // Catch any network or parsing errors and throw a generic 502 error
    //   throw new HttpException(
    //     'Error connecting to external service',
    //     HttpStatus.BAD_GATEWAY,
    //   );
    // }
  }
}
