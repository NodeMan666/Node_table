import config from 'config3';

const stripe = require('stripe')(config.stripe.STRIPE_SECRET);

const plans = [{
        'name': 'Small',
        'id': 'small',
        'price': 10
    },
    {
        'name': 'Medium',
        'id': 'medium',
        'price': 30
    },
    {
        'name': 'Large',
        'id': 'large',
        'price': 50
    }
];

function generateToken(callback, num='4242424242424242', month=12, year=2017, cvc=123) {
    stripe.tokens.create({
        card: {
            "number": num,
            "exp_month": month,
            "exp_year": year,
            "cvc": cvc
        }
    }, callback);
}

export default {
    stripe: stripe,
    stripePubKey: config.stripe.STRIPE_PUBLISHABLE,
    generateToken: generateToken,
    plans: plans
}
