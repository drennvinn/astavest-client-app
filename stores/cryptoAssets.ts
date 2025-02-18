import { defineStore } from 'pinia';

type Slug = 'ALGO' | 'BTC' | 'BNB' | 'ADA' | 'ETH' | 'DOT' | 'XRP' | 'SOL' | 'TRX';

interface SlugsInterface {
    [key: string]: Slug | string;
}

const slugs: SlugsInterface = {
    algorand: 'ALGO',
    bitcoin: 'BTC',
    bnb: 'BNB',
    cardano: 'ADA',
    ethereum: 'ETH',
    polkadot: 'DOT',
    ripple: 'XRP',
    solana: 'SOL',
    tron: 'TRX',
};

interface CryptoAssetsState {
    top: string[];
    pairs: string[];
    // tickers: { [key: string]: any };
    tickers: Array<any>;
    infos: { [key: string]: any };
    metas: {
        [key: string]: {
            name: string;
            slug: string;
            symbol: string;
            urls: { website: string };
            about: string;
        };
    };
    units: {
        [key: string]: {
            label: string;
            symbol: string;
            logo: string;
        };
    };
    baseUnits: string;
    graphOptions: {
        interval: string;
    };
    graphStats: {
        min: number;
        max: number;
    };
}

export const useCryptoAssets = defineStore({
    id: 'alert',
    state: (): CryptoAssetsState => ({
        top: ['BTC', 'ETH', 'SOL',
            'DOT', 'ADA', 'BNB', 'XRP', 'TRX', 'ALGO'
        ],
        pairs: [
            'btcusdt',
            'adausdt',
            'bnbusdt',
            'algousdt',
            'dotusdt',
            'ethusdt',
            'solusdt',
            'xrpusdt',
            'trxusdt'
        ],
        tickers: [],
        infos: {},
        metas: {
            ADA: {
                name: 'Cardano',
                slug: 'cardano',
                symbol: 'ada',
                urls: { website: 'https://www.cardano.org/' },
                about: 'Cardano is a proof-of-stake blockchain platform that says its goal is to allow "changemakers, innovators and visionaries" to bring about positive global change.',
            },
            ALGO: {
                name: 'Algorand',
                slug: 'algorand',
                symbol: 'algo',
                urls: { website: 'https://www.algorand.com' },
                about: 'Algorand is a self-sustaining, decentralized, blockchain-based network that supports a wide range of applications.',
            },
            BNB: {
                name: 'BNB',
                slug: 'bnb',
                symbol: 'bnb',
                urls: { website: 'https://www.binance.com' },
                about: 'Launched in July 2017, Binance is the biggest cryptocurrency exchange globally based on daily trading volume. Binance aims to bring cryptocurrency exchanges to the forefront of financial activity globally.',
            },
            BTC: {
                name: 'Bitcoin',
                slug: 'bitcoin',
                symbol: 'btc',
                urls: { website: 'https://bitcoin.org' },
                about: 'Bitcoin is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto. It was launched soon after, in January 2009.',
            },
            DOT: {
                name: 'Polkadot',
                slug: 'polkadot',
                symbol: 'dot',
                urls: { website: 'https://polkadot.network/' },
                about: 'Polkadot is an open-source sharded multichain protocol that connects and secures a network of specialized blockchains, facilitating cross-chain transfer of any data or asset types, not just tokens, thereby allowing blockchains to be interoperable with each other.',
            },
            ETH: {
                name: 'Ethereum',
                slug: 'ethereum',
                symbol: 'eth',
                urls: { website: 'https://www.ethereum.org' },
                about: 'Ethereum is a decentralized open-source blockchain system that features its own cryptocurrency, Ether. ETH works as a platform for numerous other cryptocurrencies, as well as for the execution of decentralized smart contracts.',
            },
            SOL: {
                name: 'Solana',
                slug: 'solana',
                symbol: 'sol',
                urls: { website: 'https://solana.com' },
                about: 'Solana is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions.',
            },
            TRX: {
                name: 'Tron',
                slug: 'tron',
                symbol: 'trx',
                urls: { website: 'https://tron.network' },
                about: 'TRON (TRX) is a decentralized blockchain-based operating system developed by the Tron Foundation and launched in 2017. Originally TRX tokens were ERC-20-based tokens deployed on Ethereum, but a year later they were moved to their own network.',
            },
            XRP: {
                name: 'Ripple',
                slug: 'ripple',
                symbol: 'xrp',
                urls: { website: 'https://xrpl.org' },
                about: 'Ripple is the currency that runs on a digital payment platform called RippleNet, which is on top of a distributed ledger database called XRP Ledger.',
            }
        },
        units: {
            USDT: {
                label: 'Tether',
                symbol: 'usdt',
            }
        },
        baseUnits: 'usdt',
        graphOptions: {
            interval: '15m'
        },
        graphStats: {
            min: 0,
            max: 0
        }
    }),


    getters: {
        topCurrencies: (state) => {
            return state.top.map((short) => state.metas[short]);
        },
        getCurrencyBySlug: (state) => (slug: string) => {
            const currencySlug = slugs[slug] as keyof typeof state.metas;
            return state.metas[currencySlug] || {};
        },
        getTickerBySlug: (state) => (slug: string) => {
            const currencySlug = slugs[slug] as keyof typeof state.metas;
            const pair = `${String(currencySlug).toLowerCase()}${state.baseUnits}`;
            return state.tickers[pair] || {};
        },
        getInfoBySlug: (state) => (slug: string) => {
            const currencySlug = slugs[slug] as keyof typeof state.metas;
            const pair = `${String(currencySlug).toLowerCase()}${state.baseUnits}`;
            return state.infos[pair] || {};
        },
        getGraphStats: (state) => () => state.graphStats || {},
    },


    actions: {},
});
