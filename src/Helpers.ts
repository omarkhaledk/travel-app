
interface TotalDistance {
    fromCity: string;
    toCity: string;
    distance: number;
}

interface Result {
    totalDistances: TotalDistance[];
    total: number;
}

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number, unit: string): number => {
    if (lat1 === lat2 && lon1 === lon2) {
        return 0;
    }
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
        dist *= 1.609344;
    }
    if (unit === "N") {
        dist *= 0.8684;
    }
    return Math.round(dist);
};

export const calcTotalDistance = (selectedCities: string[], allCities: any[]): Result => {
    let totalDistances: TotalDistance[] = [];
    let total = 0;

    for (let i = 0; i < selectedCities.length - 1; i++) {
        const currentCity = allCities.find(
            (city) => city[0] === selectedCities[i]
        );
        const nextCity = allCities.find(
            (city) => city[0] === selectedCities[i + 1]
        );

        if (!currentCity || !nextCity) {
            throw new Error("City not found in allCities");
        }

        const distance = haversineDistance(
            currentCity[1],
            currentCity[2],
            nextCity[1],
            nextCity[2],
            "K"
        );

        total += distance;

        totalDistances.push({
            fromCity: currentCity[0],
            toCity: nextCity[0],
            distance: distance,
        });
    }

    return { totalDistances, total };
}
