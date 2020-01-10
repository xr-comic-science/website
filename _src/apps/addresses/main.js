import App from './App.svelte';
import addresses from '../../data/addresses.json';

export default function(el, language) {
    const app = new App({
        target: el,
        props: {
            addresses,
            language
        }
    });
}
