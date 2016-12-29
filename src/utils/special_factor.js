/* special_factor.js --- calculate special factor
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

let maxCommonFactor = (a, b) => {
    if (a === b) return a;

    return a > b ? maxCommonFactor(a - b, b) : maxCommonFactor(b - a, a);
};

let fetchFactor = (a) => {
    let offset = 2;
    let sqrt_a = Math.sqrt(a);
    let factors = [];
    while (offset < sqrt_a) {
        if (a % offset === 0) {
            factors.push(offset);
            a = a / offset;
        } else {
            offset++;
        }
    }

    return factors;
};

let increaselyMultFactorForSpecialDatumMark = (factors, datum_mark) => {
    let result = 1;
    let old_distance = Math.abs(datum_mark - result);

    for (let i = 0; i < factors.length; i++) {
        let distance = Math.abs(datum_mark - result * factors[i]);
        if (distance >= old_distance) break;

        old_distance = distance;
        result *= factors[i];
    }

    return [result, old_distance];
};

let decreaselyMultFactorForSpecialDatumMark = (factors, datum_mark) => {
    let result = 1;
    let old_distance = Math.abs(datum_mark - result);

    for (let i = factors.length - 1; i > -1; i--) {
        let distance = Math.abs(datum_mark - result * factors[i]);
        if (distance >= old_distance) break;

        old_distance = distance;
        result *= factors[i];
    }

    return [result, old_distance];
};

export const factorForSpecialDatumMark = (a, b, datum_mark) => {
    let factors = fetchFactor(maxCommonFactor(a, b));

    let [der, ded] = decreaselyMultFactorForSpecialDatumMark(factors, datum_mark);
    let [inr, ind] = increaselyMultFactorForSpecialDatumMark(factors, datum_mark);

    return ded > ind ? inr : der;
};

export default factorForSpecialDatumMark;

/* special_factor.js ends here */
