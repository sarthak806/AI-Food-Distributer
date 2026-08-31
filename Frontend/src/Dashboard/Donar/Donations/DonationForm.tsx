import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from "react-router-dom";
import { Textarea } from '@/components/ui/textarea';
import { Upload, Calendar, MapPin, Pizza, ClipboardList, FileText, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import imageCompression from 'browser-image-compression';
import { useSnackbar } from 'notistack';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MAX_IMAGES = 4;
const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB in bytes

interface SelectedImageItem {
  file: File;
  previewUrl: string;
  id: string;
}

const DonationForm: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    expirationDate: '',
    pickupLocation: '',
    address: '',
    description: '',
    name: '',
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImageItem[]>([]);
  const [imageError, setImageError] = useState<string>('');

  const [errors, setErrors] = useState({
    foodType: '',
    quantity: '',
    expirationDate: '',
    pickupLocation: '',
    address: '',
    description: '',
    name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const compressImage = async (file: File): Promise<File> => {
    // If file is smaller than 2MB, no heavy compression needed
    if (file.size <= 2 * 1024 * 1024) {
      return file;
    }

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.warn('Image compression fallback, using original file:', error);
      return file;
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - selectedImages.length;

    if (availableSlots <= 0) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} food images.`);
      enqueueSnackbar(`Maximum of ${MAX_IMAGES} images allowed.`, { variant: 'warning' });
      return;
    }

    const filesToAdd = filesArray.slice(0, availableSlots);
    if (filesArray.length > availableSlots) {
      enqueueSnackbar(`Only ${availableSlots} more image(s) can be added. (Max ${MAX_IMAGES})`, { variant: 'info' });
    }

    const validNewImages: SelectedImageItem[] = [];

    for (const file of filesToAdd) {
      // 1GB Max File Size check
      if (file.size > MAX_FILE_SIZE_BYTES) {
        enqueueSnackbar(`File "${file.name}" exceeds 1GB limit (${formatFileSize(file.size)}).`, { variant: 'error' });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validNewImages.push({
        file,
        previewUrl,
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      });
    }

    if (validNewImages.length > 0) {
      setSelectedImages((prev) => [...prev, ...validNewImages]);
      setImageError('');
    }

    // Reset input value so the same file could be selected again if removed
    e.target.value = '';
  };

  const handleRemoveImage = (idToRemove: string) => {
    setSelectedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== idToRemove);
      const removed = prev.find((img) => img.id === idToRemove);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return filtered;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: value ? '' : `This field is required` });
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmationDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmationDialog(false);
    setIsSubmitting(true);
    setUploadStatus('Preparing donation details...');

    try {
      if (!user) {
        enqueueSnackbar('Please login to submit a donation', {
          variant: 'warning',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        navigate('/user/login');
        return;
      }

      const uploadedImageUrls: string[] = [];

      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          setUploadStatus(`Uploading image ${i + 1} of ${selectedImages.length}...`);
          const item = selectedImages[i];
          try {
            const processedFile = await compressImage(item.file);
            const base64Image = await convertImageToBase64(processedFile);
            const uploadResponse = await axios.post(
              `${import.meta.env.VITE_Backend_URL}/api/upload`,
              { base64Image, folder: 'donations' },
              { withCredentials: true, timeout: 60000 }
            );

            if (uploadResponse.data && uploadResponse.data.url) {
              uploadedImageUrls.push(uploadResponse.data.url);
            }
          } catch (uploadErr) {
            console.error(`Failed to upload image ${i + 1}:`, uploadErr);
            enqueueSnackbar(`Failed to upload image ${i + 1} (${item.file.name}).`, { variant: 'error' });
          }
        }
      }

      setUploadStatus('Creating donation record...');

      const donationData = {
        donor: user._id || user.id,
        foodType: formData.foodType,
        quantity: parseInt(formData.quantity),
        expirationDate: new Date(formData.expirationDate).toISOString(),
        pickupLocation: `${formData.pickupLocation}${formData.address ? ', ' + formData.address : ''}`,
        description: formData.description,
        name: formData.name,
        imageUrl: uploadedImageUrls[0] || '',
        images: uploadedImageUrls,
      };

      // Create donation
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/donations/create`,
        donationData,
        { withCredentials: true }
      );

      if (response.status === 201 && response.data.data?._id) {
        const donationId = response.data.data._id;
        
        // Match with nearby NGOs
        try {
          setUploadStatus('Notifying nearby NGOs...');
          const matchResponse = await axios.post(
            `${import.meta.env.VITE_Backend_URL}/api/donations/match-ngos`,
            {
              donorId: donationId,
              pickupLocation: donationData.pickupLocation,
              expirationDate: donationData.expirationDate
            },
            { withCredentials: true }
          );

          if (matchResponse.data?.matches?.length > 0) {
            const matchCount = matchResponse.data.matches.length;
            enqueueSnackbar(
              `Donation created! Notified ${matchCount} nearby NGO${matchCount > 1 ? 's' : ''}.`,
              {
                variant: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                autoHideDuration: 5000
              }
            );
          } else {
            enqueueSnackbar(
              'Donation created successfully! No nearby NGOs found at the moment.',
              {
                variant: 'info',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                autoHideDuration: 5000
              }
            );
          }
        } catch (matchError) {
          console.error('Error matching with NGOs:', matchError);
        }

        // Clean up object URLs
        selectedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));

        // Reset form
        setFormData({
          foodType: '',
          quantity: '',
          expirationDate: '',
          pickupLocation: '',
          address: '',
          description: '',
          name: '',
        });
        setSelectedImages([]);

        // Navigate to my donations page
        navigate('/user/Donar/mydonations');
      }
    } catch (error: any) {
      console.error('Donation submission error:', error);
      const errMsg = error.response?.data?.message || 'Failed to submit donation';
      enqueueSnackbar(errMsg, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-2xl shadow-2xl border rounded-2xl bg-white p-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Donation Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              {
                label: 'Name of Food',
                name: 'name',
                icon: <FileText className="w-5 h-5" />,
                type: 'text',
                placeholder: 'e.g., Rice, Curry, Bread, Fruits'
              },
              {
                label: 'Donation Description',
                name: 'description',
                icon: <FileText className="w-5 h-5" />,
                component: Textarea,
                placeholder: 'Describe the food items, packaging, condition, and any special instructions'
              },
              {
                label: 'Food Type',
                name: 'foodType',
                icon: <Pizza className="w-5 h-5" />,
                placeholder: 'e.g., Cooked Food, Packaged Food, Bakery, Raw Ingredients'
              },
              {
                label: 'Quantity (Servings)',
                name: 'quantity',
                icon: <ClipboardList className="w-5 h-5" />,
                type: 'number',
                placeholder: 'Number of people it can serve'
              },
              {
                label: 'Expiration Date & Time',
                name: 'expirationDate',
                icon: <Calendar className="w-5 h-5" />,
                type: 'datetime-local'
              },
              {
                label: 'Pickup Location',
                name: 'pickupLocation',
                icon: <MapPin className="w-5 h-5" />,
                placeholder: 'Area / Landmark / Neighborhood'
              },
              {
                label: 'Detailed Address',
                name: 'address',
                icon: <MapPin className="w-5 h-5" />,
                component: Textarea,
                placeholder: 'Complete street address with apartment/building number'
              },
            ].map(({ label, name, icon, type = 'text', component: Component = Input, placeholder }) => (
              <div key={name} className="space-y-1">
                <Label htmlFor={name} className="text-lg font-medium flex items-center gap-2 text-gray-700">
                  {icon} {label}
                </Label>
                <Component
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name as keyof typeof formData] as string}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                  required={name !== 'description'}
                />
                {errors[name as keyof typeof errors] && (
                  <p className="text-sm text-red-500">{errors[name as keyof typeof errors]}</p>
                )}
              </div>
            ))}

            {/* Multiple Food Images Upload Section (Up to 4 images, max 1GB each) */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium flex items-center gap-2 text-gray-700">
                  <Upload className="w-5 h-5 text-red-600" /> Food Images ({selectedImages.length}/{MAX_IMAGES})
                </Label>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2.5 py-1 rounded-full">
                  Max 4 images • Up to 1GB each
                </span>
              </div>

              {/* Upload Input Area */}
              {selectedImages.length < MAX_IMAGES && (
                <div className="relative border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors rounded-xl p-4 text-center cursor-pointer bg-gray-50/60 hover:bg-red-50/30">
                  <input
                    id="donationImages"
                    name="donationImages"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isSubmitting}
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <div className="p-2 bg-red-100 text-red-600 rounded-full">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Click or drag images to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG, WEBP up to 1GB ({MAX_IMAGES - selectedImages.length} slot{MAX_IMAGES - selectedImages.length > 1 ? 's' : ''} left)
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Images Preview Grid */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {selectedImages.map((imgItem, index) => (
                    <div
                      key={imgItem.id}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm aspect-square"
                    >
                      <img
                        src={imgItem.previewUrl}
                        alt={`Food preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(imgItem.id)}
                          className="self-end bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-transform hover:scale-110"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="bg-black/60 px-1.5 py-0.5 rounded truncate text-center">
                          {formatFileSize(imgItem.file.size)}
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {imageError && <p className="text-sm text-red-500">{imageError}</p>}
            </div>

            <div className="flex flex-col items-center justify-center pt-4 gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white text-lg py-3 px-8 rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadStatus || 'Submitting Donation...'}
                  </>
                ) : (
                  'Confirm Donation'
                )}
              </Button>
              {isSubmitting && uploadStatus && (
                <p className="text-xs text-muted-foreground animate-pulse">{uploadStatus}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Shadcn UI Confirmation Dialog */}
      <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Donation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this donation with {selectedImages.length} food image{selectedImages.length === 1 ? '' : 's'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmationDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-red-600 hover:bg-red-500 text-white">
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DonationForm;