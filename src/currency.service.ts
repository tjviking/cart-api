import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Axios from 'axios';
import { AppConfig } from './app.config';

@Injectable()
export class CurrencyService {
    static logger = new Logger(CurrencyService.name);
    static baseCurrency: string = 'EUR';
    static currencies: Record<string, number> = {};

    static exists(currency: string): boolean {
        return CurrencyService.currencies[currency] !== undefined;
    }

    static get(currency: string): number {
        if (currency === CurrencyService.baseCurrency) return 1.0;
        return CurrencyService.currencies[currency];
    }

    /* recalculates price from one currency to other */
    static recalculate(srcCurrency: string, dstCurrency: string, value: number): number {
        let val: number = 0;
        /* 1st stage - convert to base */
        val = value / CurrencyService.get(srcCurrency);

        /* 2nd stage - convert to destination currency */
        val = val * CurrencyService.get(dstCurrency);

        /* round */
        val = parseFloat(val.toFixed(2));
        return val;
    }

    /* refreshes currency echange data */
    static async freshen() {
        CurrencyService.logger.debug('Cron: Currency exchange update, called every 10 minutes');

        let prices: any;

        try {
            prices = await Axios.get(AppConfig.currencyServiceAddress);
            if (prices.data) {
                let tempCurr: Record<string, number> = {};
                let tempBase: string = 'EUR';
                if (prices.data.base)
                    tempBase = prices.data.base;

                if (prices.data.rates)
                    Object.keys(prices.data.rates).forEach((cur) => {
                        if (typeof cur === 'string' && typeof prices.data.rates[cur] === 'number')
                            tempCurr[cur] = prices.data.rates[cur];
                    });

                if (Object.keys(tempCurr).length > 0) {
                    CurrencyService.baseCurrency = tempBase;
                    CurrencyService.currencies = tempCurr;
                } else CurrencyService.logger.error('Cron: Currency exchange table seems empty!');

            }
        } catch (e) {
            CurrencyService.logger.error('Cron: Problem getting currency exchange table!', e)
        }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleCron() {
        await CurrencyService.freshen();
    }
}