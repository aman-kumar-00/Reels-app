type CloudinarySignatureResponse = {
  success: boolean;
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
};

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
};

const BACKEND_URL = 'http://localhost:5000';

export const uploadReel = async (
  fileUri: string,
  fileName?: string,
): Promise<CloudinaryUploadResult> => {
  // Get signature from backend
  const signatureResponse = await fetch(
    `${BACKEND_URL}/api/cloudinary/signature`,
  );

  if (!signatureResponse.ok) {
    throw new Error(
      `Signature request failed: ${signatureResponse.status}`,
    );
  }

  const signatureData =
    (await signatureResponse.json()) as CloudinarySignatureResponse;

  if (!signatureData.success) {
    throw new Error(
      'Failed to get Cloudinary signature',
    );
  }

  console.log('Cloudinary signature received');

  // Create multipart form data
  const formData = new FormData();

  formData.append(
    'file',
    {
      uri: fileUri,
      type: 'video/mp4',
      name: fileName || 'reel.mp4',
    } as any,
  );

  formData.append(
    'api_key',
    signatureData.apiKey,
  );

  formData.append(
    'timestamp',
    String(signatureData.timestamp),
  );

  formData.append(
    'signature',
    signatureData.signature,
  );

  // Cloudinary video upload URL
  const cloudinaryUrl =
    `https://api.cloudinary.com/v1_1/` +
    `${signatureData.cloudName}/video/upload`;

  console.log('Uploading video to Cloudinary...');

  const uploadResponse = await fetch(
    cloudinaryUrl,
    {
      method: 'POST',
      body: formData as any,
    },
  );

  const result = (await uploadResponse.json()) as any;

  if (!uploadResponse.ok) {
    console.log(
      'CLOUDINARY ERROR:',
      result,
    );

    throw new Error(
      result?.error?.message ||
        'Cloudinary upload failed',
    );
  }

  console.log(
    'CLOUDINARY UPLOAD SUCCESS:',
    result,
  );

  return result as CloudinaryUploadResult;
};