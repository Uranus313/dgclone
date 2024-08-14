import crypto from 'crypto';
export function generateRandomString(length) {
    const randomBytes = crypto.randomBytes(length/2);
    // console.log(randomBytes);
    return randomBytes.toString('hex');
}