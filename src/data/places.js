/**
 * Go Siargao catalog — transcribed verbatim from the Claude Design source.
 * Used to seed Convex (convex/seed.ts) and as an offline fallback.
 */
export const ICON_PATHS = {
    coffee: 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z M5 2v2M9 2v2M13 2v2',
    nav: 'm3 11 19-9-9 19-2-8-8-2z',
    home: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    waves: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.4 2 5 2c1.3 0 1.9-.5 2.5-1 M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2c1.3 0 1.9-.5 2.5-1 M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2c1.3 0 1.9-.5 2.5-1',
    cal: 'M8 2v4M16 2v4M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    clock: 'M12 7v5l3 3 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    peso: 'M7 3v18 M7 3h6a4 4 0 0 1 0 8H7 M4 9h12 M4 13h12',
    sun: 'M12 3v2M12 19v2M5 12H3M21 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M17 17l1.4 1.4M5.6 5.6 7 7 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
};
export function catPath(c) {
    return c === 'eat'
        ? ICON_PATHS.coffee
        : c === 'tour'
            ? ICON_PATHS.nav
            : c === 'stay'
                ? ICON_PATHS.home
                : c === 'beach'
                    ? ICON_PATHS.waves
                    : ICON_PATHS.cal;
}
export const PLACES = {
    cloud9: { id: 'cloud9', name: 'Cloud 9 Boardwalk', area: 'General Luna', cat: 'beach', catLabel: 'Surf Spot', tint: '#0E7C86', tags: ['Sunrise', 'Iconic'], price: 'Free', priceLabel: 'Free entry', hours: 'Open 24h', best: 'Sunrise', travel: 'In town', openNow: true, blurb: "The wooden boardwalk that put Siargao on the map. Walk out over the reef at first light, watch the surfers paddle into Cloud 9's famous barrels, and grab a coffee from the shacks nearby. Busiest at dawn — that's the point." },
    sugba: { id: 'sugba', name: 'Sugba Lagoon', area: 'Del Carmen', cat: 'tour', catLabel: 'Lagoon', tint: '#2F7A4F', tags: ['Boat trip', 'Snorkel'], price: '₱₱', priceLabel: '₱₱', hours: '7AM–4PM', best: 'Late morning', travel: '~1.5 hr', openNow: true, blurb: "Glassy emerald water ringed by mangroves and limestone. Jump off the diving board, paddle a kayak, or just float. It's a boat trip from Del Carmen — go early to beat the day-tour crowds and bring everything you need." },
    magpupungko: { id: 'magpupungko', name: 'Magpupungko Rock Pools', area: 'Pilar', cat: 'beach', catLabel: 'Tidal Pools', tint: '#0A5A62', tags: ['Low tide only', 'Swim'], price: '₱', priceLabel: '₱50 entry', hours: 'Tide-dependent', best: 'Low tide', travel: '~45 min', openNow: false, blurb: "Natural tidal pools that only appear at low tide — check the tide chart before you ride out. When it's right, you get deep turquoise pools carved into the rock, perfect for jumping in. When it's high, there's nothing to see." },
    kermit: { id: 'kermit', name: 'Kermit Siargao', area: 'General Luna', cat: 'eat', catLabel: 'Italian', tint: '#F2762E', tags: ['Wood-fired pizza', 'Surfer fave'], price: '₱₱', priceLabel: '₱₱', hours: '7AM–11PM', best: 'Dinner', travel: 'In town', openNow: true, blurb: "The surf-camp pizzeria everyone ends up at. Wood-fired Neapolitan pizza, strong espresso, and a buzzy garden full of travelers comparing wave stories. Get there before 7pm or expect a wait — no reservations." },
    shaka: { id: 'shaka', name: 'Shaka Siargao', area: 'General Luna', cat: 'eat', catLabel: 'Healthy', tint: '#F2762E', tags: ['Smoothie bowls', 'Vegan'], price: '₱', priceLabel: '₱', hours: '7AM–6PM', best: 'Breakfast', travel: 'In town', openNow: true, blurb: "The smoothie-bowl spot you'll see all over your feed for a reason. Thick açaí and dragonfruit bowls piled with fruit and granola, plus proper coffee. The neon mural out front is basically a Siargao landmark now." },
    harana: { id: 'harana', name: 'Harana Surf Resort', area: 'General Luna', cat: 'stay', catLabel: 'Resort', tint: '#E84F5C', tags: ['Pool', 'Surf lessons'], price: '₱₱₱', priceLabel: '₱₱₱', hours: 'Reception 24h', best: 'Any time', travel: 'In town', openNow: true, blurb: "A laid-back surf resort with a great pool, on-site board rental, and morning lessons for beginners. Walkable to the Cloud 9 area but tucked back enough to be quiet at night. Books out fast in peak season." },
    maasin: { id: 'maasin', name: 'Maasin River', area: 'Maasin', cat: 'tour', catLabel: 'River', tint: '#2F7A4F', tags: ['Rope swing', 'Free'], price: 'Free', priceLabel: 'Free', hours: 'Daytime', best: 'Midday', travel: '~30 min', openNow: true, blurb: "The famous leaning coconut palm and a rope swing over a freshwater river. It's a quick, fun stop on the way to or from the north — go midweek and earlier in the day to have the swing mostly to yourself." },
    pacifico: { id: 'pacifico', name: 'Pacifico Beach', area: 'Pacifico', cat: 'beach', catLabel: 'Beach', tint: '#0E7C86', tags: ['Quiet', 'Surf'], price: 'Free', priceLabel: 'Free', hours: 'Open 24h', best: 'Sunset', travel: '~1 hr', openNow: true, blurb: "The mellow north-coast alternative to General Luna. Long empty beach, uncrowded waves, and a handful of cool little cafés and bars. Worth the ride up if you want the quiet, slower side of the island." },
    naked: { id: 'naked', name: 'Naked Island', area: 'General Luna', cat: 'tour', catLabel: 'Sandbar', tint: '#2F7A4F', tags: ['Island hop', 'Boat'], price: '₱₱', priceLabel: '₱₱', hours: 'Boat trip', best: 'Morning', travel: '~40 min boat', openNow: true, blurb: "A pure white sandbar with zero shade — the first stop on the classic three-island hop with Daku and Guyam. Bring a hat, water, and reef-safe sunscreen. Mornings are calmest for the boat ride out." },
    bravo: { id: 'bravo', name: 'Bravo Beach Resort', area: 'General Luna', cat: 'eat', catLabel: 'Beachfront', tint: '#F2762E', tags: ['Tapas', 'Sunset'], price: '₱₱₱', priceLabel: '₱₱₱', hours: '7AM–11PM', best: 'Sunset', travel: 'In town', openNow: true, blurb: "Spanish-leaning beachfront dining with the best sunset seats in General Luna. Order tapas and a cocktail, sink into the loungers, and time it for golden hour. Pricier than most, but the view earns it." },
};
export const PLACE_IDS = Object.keys(PLACES);
export const CATEGORIES = [
    { key: 'eat', label: 'Eat', tint: '#F2762E', path: ICON_PATHS.coffee },
    { key: 'tour', label: 'Tours', tint: '#2F7A4F', path: ICON_PATHS.nav },
    { key: 'stay', label: 'Stay', tint: '#E84F5C', path: ICON_PATHS.home },
    { key: 'beach', label: 'Beaches', tint: '#0E7C86', path: ICON_PATHS.waves },
    { key: 'events', label: 'Events', tint: '#0A5A62', path: ICON_PATHS.cal },
];
export const EVENTS = [
    { id: 'market', name: 'Sunday Pop-up Market', venue: 'Cloud 9', date: 'SUN', day: '22', time: '4–9 PM', tag: 'Market', tint: '#E84F5C', place: 'cloud9' },
    { id: 'fullmoon', name: 'Full Moon Beach Party', venue: 'Pacifico Beach', date: 'WED', day: '25', time: '9 PM late', tag: 'Party', tint: '#F2762E', place: 'pacifico' },
    { id: 'reggae', name: 'Live Reggae Night', venue: 'Bravo Beach', date: 'FRI', day: '27', time: '8 PM', tag: 'Music', tint: '#2F7A4F', place: 'bravo' },
    { id: 'surfcomp', name: 'Cloud 9 Surf Cup', venue: 'Cloud 9 reef', date: 'SAT', day: '28', time: 'All day', tag: 'Surf', tint: '#0E7C86', place: 'cloud9' },
];
export const COLLECTIONS = [
    { title: 'Best sunset bars', key: 'sunset', items: ['bravo', 'harana', 'pacifico'] },
    { title: 'Hidden lagoons', key: 'lagoon', items: ['sugba', 'maasin', 'magpupungko'] },
    { title: 'Where the surfers eat', key: 'eat', items: ['kermit', 'shaka', 'bravo'] },
    { title: 'Worth the habal-habal ride', key: 'ride', items: ['magpupungko', 'pacifico', 'naked'] },
];
export const ITINERARY = [
    {
        label: 'Day 1',
        date: 'Fri 20',
        items: [
            { placeId: 'shaka', timeLabel: '8:00 · Breakfast', path: ICON_PATHS.coffee },
            { placeId: 'cloud9', timeLabel: '10:00 · Surf check', path: ICON_PATHS.waves },
            { placeId: 'bravo', timeLabel: '17:30 · Sunset & tapas', path: ICON_PATHS.coffee },
        ],
    },
    {
        label: 'Day 2',
        date: 'Sat 21',
        items: [
            { placeId: 'sugba', timeLabel: '07:30 · Boat trip', path: ICON_PATHS.nav },
            { placeId: 'maasin', timeLabel: '15:00 · Rope swing', path: ICON_PATHS.nav },
        ],
    },
];
export const MAP_PINS = [
    { id: 'cloud9', x: '62%', y: '40%' },
    { id: 'kermit', x: '40%', y: '52%' },
    { id: 'sugba', x: '24%', y: '30%' },
    { id: 'pacifico', x: '72%', y: '22%' },
    { id: 'magpupungko', x: '80%', y: '58%' },
    { id: 'maasin', x: '34%', y: '70%' },
];
export const EXPLORE_CHIPS = ['Open Now', 'General Luna', 'Cloud 9', 'Free', 'Pacifico', 'Surf', 'Foodie'];
export const EVENT_CHIPS = ['This week', 'Weekend', 'Music', 'Markets', 'Surf', 'Parties'];
export const POPULAR = ['Sugba Lagoon', 'tacos', 'sunset bars', 'Cloud 9', 'lagoons', 'smoothie bowls'];
export const RECENTS = ['pizza', 'Magpupungko', 'Naked Island'];
export const TIP_BANK = {
    cloud9: ['Go for sunrise — the light and the surfers are unreal', 'Coffee shacks open early right by the boardwalk', 'It gets busy by 7am, arrive before'],
    sugba: ['Book the boat from Del Carmen the day before', 'Bring cash, water and snacks — nothing to buy out there', 'Go early to beat the big day-tour groups'],
    magpupungko: ['Only worth it at low tide — check the tide chart', '₱50 entry, bring small cash', 'Wear reef shoes, the rocks are sharp'],
    kermit: ['No reservations — come before 7pm', 'Cash and card both fine here', 'Try the house special pizza'],
    default: ['Bring cash — many spots are card-free', 'A habal-habal from GL runs ~₱150', 'Download the offline map before you ride out'],
};
export function placeFacts(p) {
    return [
        { path: ICON_PATHS.clock, label: 'Hours', value: p.hours },
        { path: ICON_PATHS.peso, label: 'Price', value: p.priceLabel },
        { path: ICON_PATHS.sun, label: 'Best time', value: p.best },
        { path: ICON_PATHS.pin, label: 'Area', value: p.area },
        { path: ICON_PATHS.nav, label: 'Getting there', value: p.travel },
    ];
}
