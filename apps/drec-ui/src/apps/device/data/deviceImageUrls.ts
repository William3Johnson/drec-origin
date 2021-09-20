import { DeviceDTO } from '@energyweb/origin-drec-api-client';
import { useEffect, useState } from 'react';
import { publicFileDownloadHandler } from '../../../api';

export const useDeviceImageUrls = (imageIds: DeviceDTO['images']) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const getImageUrl = async (id: string) => {
        const response = await publicFileDownloadHandler(id);
        const imageType = (response as any).headers['content-type'];
        const blob = new Blob([Buffer.from((response.data as any).data as unknown as string)], {
            type: imageType
        });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        return imageUrl;
    };

    const getAndSetAllImages = async (imageIds: string[]) => {
        const receivedUrls = await Promise.all(imageIds.map(async (id) => await getImageUrl(id)));
        setImageUrls(receivedUrls);
    };

    useEffect(() => {
        if (imageIds?.length > 0) {
            getAndSetAllImages(imageIds);
        }
    }, [imageIds]);

    return imageUrls;
};