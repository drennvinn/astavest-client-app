import Big from 'big.js';

const fillRightZero = (n: number): string => new Array(n + 1).join('0');

const fixRound = (value: number | string, decimals: number | string): string => {
    value = parseFloat(value.toString()) || 0;
    decimals = parseFloat(decimals.toString()) || 0;
    return Big(value).round(decimals, 0).toFixed();
};

const fractionCount = (value: number | string): number => ((value.toString()).split('.')[1] || '').length;

const getRandomPortion = (num: number, times: number): string[] => {
    const response: string[] = [];
    if (times <= 1) {
        response.push(fixRound(num, 2));
        return response;
    }

    const current = fixRound(Math.random() * (num / 2), 2);
    response.push(current);
    return response.concat(getRandomPortion(num - parseFloat(current), --times));
};

interface FormatOptions {
    period?: string;
    thousand?: string;
    decimal?: string;
}

const useArithmetic = () => {
    return {
        fractionCount: fractionCount,
        getRandomNumber: (min: number, max: number): number => Math.random() * (max - min) + min,
        getRandomPortion: getRandomPortion,
        format: function (value: number | string, options: FormatOptions = {}): string {
            const period = options.period || '.';
            const thousandSeparator = options.thousand || ',';
            const decimalSeparator = options.decimal || '.';
            const valueParts = value.toString().split(period);
            return valueParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) + (valueParts[1] ? decimalSeparator + valueParts[1] : '');
        },
        fix: function (value: number | string, decimals: number): string {
            const n = fixRound(value, decimals);
            const dot = n.indexOf('.');
            if ((dot === -1) && decimals) {
                return n + '.' + fillRightZero(decimals);
            }

            const v = n.toString();
            const diff = decimals - fractionCount(v);
            return diff > 0 ? (n + '' + fillRightZero(diff)) : v;
        },
        abs:        (x: number | string): Big => Big(x).abs(),
        exponent:   (x: number | string): number => Big(x).e,
        times:      (x: number | string, y: number | string): Big => Big(x).times(Big(y)),
        div:        (x: number | string, y: number | string): Big => Big(x).div(Big(y)),
        plus:       (x: number | string, y: number | string): Big => Big(x).plus(Big(y)),
        minus:      (x: number | string, y: number | string): Big => Big(x).minus(Big(y)),
        isEq:       (x: number | string, y: number | string): boolean => Big(x).eq(Big(y)),
        isGt:       (x: number | string, y: number | string): boolean => Big(x).gt(Big(y)),
        isGte:      (x: number | string, y: number | string): boolean => Big(x).gte(Big(y)),
        isLt:       (x: number | string, y: number | string): boolean => Big(x).lt(Big(y)),
        isLte:      (x: number | string, y: number | string): boolean => Big(x).lte(Big(y))
    }

}

export default useArithmetic;
