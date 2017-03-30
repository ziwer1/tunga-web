import numeral from 'numeral';

export function isInt(n) {
    return parseInt(n) === n;
}

export function parseNumber(number, precision=2) {
    return numeral(number).format('0,0.[00]');
}

export function truncateWords(sentence, number=25) {
    if(!sentence) {
        return sentence;
    }
    var all_words = sentence.split(' ');
    var has_more = all_words.length > number;
    return all_words.splice(0, number).join(' ') + (has_more?' ...':'');
}
