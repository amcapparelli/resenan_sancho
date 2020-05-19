import { useState } from 'react';

const useUploadImages = (initValue: string): [string, Function, boolean] => {
  const [fileURL, setFileURL] = useState<string>(initValue);
  const [loading, setLoading] = useState<boolean>(false);
  const uploadCover = async ({ target }: any, preset: string) => {
    setLoading(true);
    const { files } = target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', preset);
    try {
      const imageResponse = await fetch('https://api.cloudinary.com/v1_1/dnhkw9n4n/image/upload/',
        {
          method: 'POST',
          body: data,
        });
      const file = await imageResponse.json();
      setFileURL(file.secure_url);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return [fileURL, uploadCover, loading];
};

export default useUploadImages;
