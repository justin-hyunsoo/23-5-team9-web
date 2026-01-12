import fetchClient from './client';

export const regionApi = {
    getRegions: () => fetchClient('/api/region/'),
    detectRegion: (lat: number, lng: number) => fetchClient('/api/region/detect', {
        method: 'POST',
        body: JSON.stringify({ latitude: lat, longitude: lng }),
    }),
};
