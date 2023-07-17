import {
  ApplicantDto,
  FinancesDto,
  StockDataDto,
  StockDto,
} from './submit.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  INVALID_APPLICANT_AGE_ERROR,
  INVALID_DATE_OF_BIRTH_ERROR,
  INVALID_STOCK_NAME,
} from 'src/common/response-messages';
import { randomBytes } from 'crypto';

const submittedData: Record<string, ApplicantDto> = {};

/**
 * Service for performing postal code lookups
 */
@Injectable()
export class SubmitService {
  stockPrices: Record<string, StockDataDto> = {};

  /**
   * Verify a base64 image is a valid JPG, PNG or GIF image
   * @param base64 {String} The image data
   * @returns {boolean}
   *
   * IMPLEMENTED AS CUSTOM DECORATOR.
   * REFER TO src/common/decorators/is-valid-image.ts
   */
  private async validateImageUpload(base64: string): Promise<boolean> {
    // TODO: verify the base 64 image is a JPEG, GIF or PNG image
    return base64?.length > 0;
  }

  /**
   * Computers the total stock vlaue by multiplying quantity of
   * stock by 18.  This is not a real value.
   * @param stock {StockDto} The stock information
   * @returns {number}
   */
  private async computeStockValue(stock: StockDto): Promise<number> {
    // TODO: implement an API lookup to fetch the value using
    // the API key provided in the `.env.localdev` file and
    // the documentation here: https://www.alphavantage.co/documentation/

    const stockDetails = (
      await (
        await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.name}&apikey=SSU7DUS18ZI9SZ77`,
        )
      ).json()
    )['Global Quote'];

    const stockPrice = stockDetails['05. price'];
    const prevStockPrice = stockDetails['08. previous close'];

    if (!stockPrice || !prevStockPrice) {
      throw new HttpException(INVALID_STOCK_NAME, HttpStatus.BAD_REQUEST);
    }

    this.stockPrices[stock.name] = {
      stockPrice: parseFloat(stockPrice),
      prevStockPrice: parseFloat(prevStockPrice),
    };

    return stock.quantity * parseFloat(stockPrice);
  }

  private async computeTotalAssets(finances: FinancesDto): Promise<number> {
    let total = finances.salaryPerQuarter * 4;
    for (const stock of finances.stock) {
      total += await this.computeStockValue(stock);
    }
    return total;
  }

  private async computeTotalLiabilities(
    finances: FinancesDto,
  ): Promise<number> {
    return (
      (finances.currentHomeLoanDebt ?? 0) + (finances.totalCreditCardDebt ?? 0)
    );
  }

  /**
   * Determines an applicant's loan eligibility based on their submitted
   * financial information
   * @param submitDto {SubmitDto} The payload information
   * @returns {number}
   */
  async determineEligiblity(applicantDto: ApplicantDto): Promise<boolean> {
    // verify the image
    const validImage = await this.validateImageUpload(applicantDto.license);
    if (!validImage) {
      // TODO: add an invalid image error to the DTO and Swagger definitions
      throw new Error('not-yet-implemented');
    }
    const dateOfBirth = new Date(applicantDto.dateOfBirth);

    // verify the applicant's age
    if (!dateOfBirth.getFullYear()) {
      throw new HttpException(
        INVALID_DATE_OF_BIRTH_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      throw new HttpException(
        INVALID_APPLICANT_AGE_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
    // "save" their application, note that data will be lost when server restarts
    const id = randomBytes(4).toString('hex');
    submittedData[id] = applicantDto;
    // compute their loan eligibility
    const totalAssets = await this.computeTotalAssets(applicantDto.finances);
    const totalLiabilities = await this.computeTotalLiabilities(
      applicantDto.finances,
    );
    return totalAssets > totalLiabilities;
  }
}
