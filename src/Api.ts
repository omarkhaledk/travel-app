import allCities from './Data/Cities.json';

import { calcTotalDistance } from './Helpers';

export const getCitiesByName = (city: string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (city.toLowerCase() === 'fail') {
                reject('You searched with the term "fail" so the api has failed');
            }

            const filtered = allCities.filter(c => typeof c[0] === 'string' &&
                c[0].toLowerCase().startsWith(city.toLowerCase())).map(x => ({
                    label: x[0],
                    value: x[0]
                }));

            resolve(filtered);
        }, 1000);
    });
}

export const calculateDistances = (cities: any = []) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isDijonSelected = cities.find((c: string) => c === 'Dijon');
            if (isDijonSelected) reject('You have selected the city Dijon so the api has failed');
            resolve(calcTotalDistance(cities, allCities));
        }, 2000);
    });
}