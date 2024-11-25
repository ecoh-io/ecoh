import { useEffect, useState } from 'react';
import axios from 'axios';

interface LinkPreview {
  title?: string;
  description?: string;
  images?: string[];
  url: string;
}

export const useLinkPreviews = (urls: string[]) => {
  const [previews, setPreviews] = useState<LinkPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.EXPO_PUBLIC_LINK_PREVIEW_API_KEY;

  useEffect(() => {
    let isCancelled = false;

    const fetchPreviews = async () => {
      if (!apiKey) {
        setError('LinkPreview API key is missing.');
        return;
      }

      setLoading(true);
      setError(null);
      const fetchedPreviews: LinkPreview[] = [];

      for (const url of urls) {
        try {
          const response = await axios.get('https://api.linkpreview.net/', {
            params: {
              key: apiKey,
              q: url,
            },
            headers: {
              skipAuthInterceptor: true,
            },
          });

          const data = response.data;

          fetchedPreviews.push({
            title: data.title,
            description: data.description,
            images: data.image ? [data.image] : [],
            url: data.url,
          });
        } catch (err) {
          console.error(`Failed to fetch preview for ${url}:`, err);
          fetchedPreviews.push({ url }); // Push minimal data if fetching fails
        }
      }

      if (!isCancelled) {
        setPreviews(fetchedPreviews);
        setLoading(false);
      }
    };

    if (urls.length > 0) {
      fetchPreviews();
    } else {
      setPreviews([]);
    }

    return () => {
      isCancelled = true;
    };
  }, [urls]);

  return { previews, loading, error };
};
