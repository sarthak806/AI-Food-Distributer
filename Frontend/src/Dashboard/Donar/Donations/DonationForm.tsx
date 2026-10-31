import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAX_IMAGES = 4;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const categories = [
  { value: "cooked_meals", label: "Cooked Meals" },
  { value: "bakery_products", label: "Bakery Products" },
  { value: "fruits_vegetables", label: "Fruits & Vegetables" },
  { value: "packaged_food", label: "Packaged Food" },
  { value: "raw_ingredients", label: "Raw Ingredients" },
  { value: "dairy_products", label: "Dairy Products" },
  { value: "other", label: "Other" },
];

const units = [
  { value: "servings", label: "Servings" },
  { value: "kilograms", label: "Kilograms (kg)" },
  { value: "grams", label: "Grams (g)" },
  { value: "litres", label: "Litres (L)" },
  { value: "packets", label: "Packets" },
  { value: "individual_items", label: "Individual items" },
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Contains meat/fish/egg",
  "Mixed/multiple",
  "Not specified",
];

const storageOptions = [
  "Refrigerated",
  "Frozen",
  "Kept hot",
  "Room temperature",
  "Other/unknown",
];

const packagingOptions = [
  "Sealed/packaged",
  "Packed in containers",
  "Bulk/unpacked",
  "Other",
];

interface FormData {
  name: string;
  category: string;
  otherCategory: string;
  description: string;
  quantity: string;
  unit: string;
  dietaryCategory: string;
  allergens: string;
  preparationDate: string;
  storageCondition: string;
  otherStorage: string;
  packagingStatus: string;
  packagingNotes: string;
  expirationDate: string;
  pickupStart: string;
  pickupEnd: string;
  pickupLocation: string;
  pincode: string;
  address: string;
  pickupInstructions: string;
  confirmation: boolean;
}

interface SelectedImage {
  file: File;
  previewUrl: string;
  id: string;
}

type FormErrors = Partial<Record<keyof FormData | "images", string>>;

const initialFormData: FormData = {
  name: "",
  category: "",
  otherCategory: "",
  description: "",
  quantity: "",
  unit: "servings",
  dietaryCategory: "Not specified",
  allergens: "",
  preparationDate: "",
  storageCondition: "",
  otherStorage: "",
  packagingStatus: "",
  packagingNotes: "",
  expirationDate: "",
  pickupStart: "",
  pickupEnd: "",
  pickupLocation: "",
  pincode: "",
  address: "",
  pickupInstructions: "",
  confirmation: false,
};

const inputClass = "mt-2 min-h-11 w-full rounded-xl border-[#c9d9c9]";

const DonationForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isVerifyingPincode, setIsVerifyingPincode] = useState(false);
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);

  const isCookedFood = formData.category === "cooked_meals";

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const verifyPincode = async (value: string) => {
    const pincode = value.trim();

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeValid(false);
      setErrors((current) => ({
        ...current,
        pincode: "Enter a valid six-digit pincode.",
      }));
      return false;
    }

    setIsVerifyingPincode(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/location/pincode/${pincode}`,
      );
      const valid = response.data?.valid === true;
      setPincodeValid(valid);
      setErrors((current) => ({
        ...current,
        pincode: valid
          ? ""
          : "Pincode does not exist. Enter a valid pincode.",
      }));
      return valid;
    } catch (requestError) {
      console.error("Pincode verification failed:", requestError);
      setPincodeValid(false);
      setErrors((current) => ({
        ...current,
        pincode: "Pincode could not be verified. Please try again.",
      }));
      return false;
    } finally {
      setIsVerifyingPincode(false);
    }
  };

  const validate = async () => {
    const nextErrors: FormErrors = {};
    const quantity = Number(formData.quantity);
    const expiration = new Date(formData.expirationDate);
    const pickupStart = new Date(formData.pickupStart);
    const pickupEnd = new Date(formData.pickupEnd);

    if (!formData.name.trim()) {
      nextErrors.name = "Enter the name of the food.";
    }
    if (!formData.category) {
      nextErrors.category = "Choose a food category.";
    }
    if (formData.category === "other" && !formData.otherCategory.trim()) {
      nextErrors.otherCategory = "Enter the category name.";
    }
    if (!formData.description.trim()) {
      nextErrors.description = "Describe the food, condition, and packaging.";
    } else if (formData.description.trim().length > 500) {
      nextErrors.description = "Keep the description under 500 characters.";
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      nextErrors.quantity = "Enter a quantity greater than zero.";
    }
    if (!formData.dietaryCategory) {
      nextErrors.dietaryCategory = "Choose a dietary category.";
    }
    if (!formData.storageCondition) {
      nextErrors.storageCondition = "Choose a storage condition.";
    }
    if (
      formData.storageCondition === "Other/unknown" &&
      !formData.otherStorage.trim()
    ) {
      nextErrors.otherStorage = "Describe the storage condition.";
    }
    if (!formData.packagingStatus) {
      nextErrors.packagingStatus = "Choose a packaging status.";
    }
    if (!formData.expirationDate || Number.isNaN(expiration.getTime())) {
      nextErrors.expirationDate = "Enter the applicable safety deadline.";
    } else if (expiration <= new Date()) {
      nextErrors.expirationDate = "The safety deadline must be in the future.";
    }
    if (!formData.pickupStart || Number.isNaN(pickupStart.getTime())) {
      nextErrors.pickupStart = "Choose when pickup becomes available.";
    }
    if (!formData.pickupEnd || Number.isNaN(pickupEnd.getTime())) {
      nextErrors.pickupEnd = "Choose when pickup availability ends.";
    } else if (
      !Number.isNaN(pickupStart.getTime()) &&
      pickupEnd <= pickupStart
    ) {
      nextErrors.pickupEnd =
        "Pickup end time must be after pickup start time.";
    }
    if (
      !Number.isNaN(expiration.getTime()) &&
      !Number.isNaN(pickupEnd.getTime()) &&
      pickupEnd > expiration
    ) {
      nextErrors.pickupEnd =
        "Pickup must end before the safety deadline.";
    }
    if (!formData.pickupLocation.trim()) {
      nextErrors.pickupLocation = "Enter an area or landmark.";
    }
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      nextErrors.pincode = "Enter a valid six-digit pincode.";
    } else if (pincodeValid !== true) {
      const verified = await verifyPincode(formData.pincode);
      if (!verified) {
        nextErrors.pincode =
          "Pincode does not exist. Enter a valid pincode.";
      }
    }
    if (!formData.address.trim()) {
      nextErrors.address = "Enter the detailed pickup address.";
    }
    if (!formData.confirmation) {
      nextErrors.confirmation =
        "Confirm that the information provided is accurate.";
    }
    if (images.length > MAX_IMAGES) {
      nextErrors.images = `Choose no more than ${MAX_IMAGES} images.`;
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const availableSlots = MAX_IMAGES - images.length;
    const nextImages: SelectedImage[] = [];
    let imageMessage = "";

    files.slice(0, availableSlots).forEach((file) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        imageMessage = "Use JPG, PNG, or WebP images.";
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        imageMessage = "Each image must be 10 MB or smaller.";
        return;
      }
      nextImages.push({
        file,
        previewUrl: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random()}`,
      });
    });

    if (files.length > availableSlots) {
      imageMessage = `You can add ${availableSlots} more image${
        availableSlots === 1 ? "" : "s"
      }.`;
    }

    setImages((current) => [...current, ...nextImages]);
    setErrors((current) => ({ ...current, images: imageMessage }));
    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const convertImageToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read image."));
      reader.readAsDataURL(file);
    });

  const uploadImages = async () => {
    const urls: string[] = [];
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      setUploadStatus(`Uploading image ${index + 1} of ${images.length}...`);
      const compressed = await imageCompression(image.file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      });
      const base64Image = await convertImageToBase64(compressed);
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/upload`,
        { base64Image, folder: "donations" },
        { withCredentials: true, timeout: 60000 },
      );
      if (!response.data?.url) {
        throw new Error(`Image ${index + 1} upload failed.`);
      }
      urls.push(response.data.url);
    }
    return urls;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }
    if (!user) {
      navigate("/user/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedImageUrls = await uploadImages();
      setUploadStatus("Creating donation record...");
      const categoryLabel =
        formData.category === "other"
          ? formData.otherCategory.trim()
          : categories.find(
              (category) => category.value === formData.category,
            )?.label || formData.category;
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/donations/create`,
        {
          name: formData.name.trim(),
          foodType: categoryLabel,
          category: formData.category,
          otherCategory: formData.otherCategory.trim(),
          description: formData.description.trim(),
          quantity: Number(formData.quantity),
          unit: formData.unit,
          dietaryCategory: formData.dietaryCategory,
          allergens: formData.allergens.trim() || "Unknown / not provided",
          preparationDate: formData.preparationDate || undefined,
          storageCondition: formData.storageCondition,
          otherStorage: formData.otherStorage.trim(),
          packagingStatus: formData.packagingStatus,
          packagingNotes: formData.packagingNotes.trim(),
          expirationDate: new Date(formData.expirationDate).toISOString(),
          pickupStart: new Date(formData.pickupStart).toISOString(),
          pickupEnd: new Date(formData.pickupEnd).toISOString(),
          pickupLocation:
            `${formData.pickupLocation.trim()}, ${formData.address.trim()}`,
          pickupArea: formData.pickupLocation.trim(),
          pincode: formData.pincode.trim(),
          address: formData.address.trim(),
          pickupInstructions: formData.pickupInstructions.trim(),
          safetyConfirmedAt: new Date().toISOString(),
          imageUrl: uploadedImageUrls[0] || "",
          images: uploadedImageUrls,
        },
        { withCredentials: true },
      );

      if (response.status !== 201 || !response.data?.data?._id) {
        throw new Error("The donation was not confirmed by the server.");
      }

      enqueueSnackbar("Donation posted successfully!", {
        variant: "success",
      });
      navigate("/user/Donar/mydonations");
    } catch (requestError) {
      console.error("Donation submission error:", requestError);
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : requestError instanceof Error
          ? requestError.message
          : "Could not submit the donation.";
      enqueueSnackbar(message || "Could not submit the donation.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7faf5] px-4 py-8 md:px-8">
      <Card className="mx-auto max-w-4xl border-[#dce5dd] shadow-sm">
        <CardContent className="p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#17633b]">
              Share surplus
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-[#14231d]">
              Create a donation
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#536258]">
              Give NGOs the structured details they need to understand,
              match, and collect your food donation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <FormSection
              number="01"
              title="Food details"
              icon={<FileText />}
            >
              <Field
                id="name"
                label="Name of food"
                required
                error={errors.name}
              >
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="e.g., Rice, Dal, Roti, Vegetable Curry"
                  className={inputClass}
                />
              </Field>
              <Field
                id="category"
                label="Food category"
                required
                error={errors.category}
              >
                <select
                  id="category"
                  value={formData.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Field>
              {formData.category === "other" && (
                <Field
                  id="otherCategory"
                  label="Other category"
                  required
                  error={errors.otherCategory}
                >
                  <Input
                    id="otherCategory"
                    value={formData.otherCategory}
                    onChange={(event) =>
                      updateField("otherCategory", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}
              <Field
                id="description"
                label="Donation description"
                required
                helper={`${formData.description.length}/500 · Describe the items, preparation, packaging, and condition.`}
                error={errors.description}
                full
              >
                <Textarea
                  id="description"
                  value={formData.description}
                  maxLength={500}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="50 sealed vegetarian meal boxes containing rice, dal, and roti."
                  className="mt-2 min-h-28 rounded-xl border-[#c9d9c9]"
                />
              </Field>
              <Field
                id="quantity"
                label="Quantity"
                required
                error={errors.quantity}
              >
                <Input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(event) =>
                    updateField("quantity", event.target.value)
                  }
                  placeholder="e.g., 50"
                  className={inputClass}
                />
              </Field>
              <Field id="unit" label="Unit" required>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(event) =>
                    updateField("unit", event.target.value)
                  }
                  className={inputClass}
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                id="dietaryCategory"
                label="Dietary category"
                required
                error={errors.dietaryCategory}
              >
                <select
                  id="dietaryCategory"
                  value={formData.dietaryCategory}
                  onChange={(event) =>
                    updateField("dietaryCategory", event.target.value)
                  }
                  className={inputClass}
                >
                  {dietaryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field
                id="allergens"
                label="Allergens and cross-contact notes"
                helper="Use “Unknown / not provided” if you cannot confirm."
                full
              >
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(event) =>
                    updateField("allergens", event.target.value)
                  }
                  placeholder="e.g., Contains peanuts; prepared near dairy"
                  className={inputClass}
                />
              </Field>
            </FormSection>

            <FormSection
              number="02"
              title="Food safety & handling"
              icon={<ShieldCheck />}
              note="Share information to help recipients assess the donation. ShareBite does not certify food safety."
            >
              {isCookedFood && (
                <Field
                  id="preparationDate"
                  label="Preparation date and time"
                  helper="Use your local time."
                >
                  <Input
                    id="preparationDate"
                    type="datetime-local"
                    value={formData.preparationDate}
                    onChange={(event) =>
                      updateField("preparationDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}
              <Field
                id="storageCondition"
                label="Storage condition"
                required
                error={errors.storageCondition}
              >
                <select
                  id="storageCondition"
                  value={formData.storageCondition}
                  onChange={(event) =>
                    updateField("storageCondition", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Choose storage condition</option>
                  {storageOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
              {formData.storageCondition === "Other/unknown" && (
                <Field
                  id="otherStorage"
                  label="Storage explanation"
                  required
                  error={errors.otherStorage}
                >
                  <Input
                    id="otherStorage"
                    value={formData.otherStorage}
                    onChange={(event) =>
                      updateField("otherStorage", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}
              <Field
                id="packagingStatus"
                label="Packaging status"
                required
                error={errors.packagingStatus}
              >
                <select
                  id="packagingStatus"
                  value={formData.packagingStatus}
                  onChange={(event) =>
                    updateField("packagingStatus", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Choose packaging status</option>
                  {packagingOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field id="packagingNotes" label="Packaging notes" full>
                <Input
                  id="packagingNotes"
                  value={formData.packagingNotes}
                  onChange={(event) =>
                    updateField("packagingNotes", event.target.value)
                  }
                  placeholder="e.g., Individual sealed containers"
                  className={inputClass}
                />
              </Field>
              <Field
                id="expirationDate"
                label="Safety deadline or use-by date"
                required
                helper="This is not a guarantee that food is safe."
                error={errors.expirationDate}
              >
                <Input
                  id="expirationDate"
                  type="datetime-local"
                  value={formData.expirationDate}
                  onChange={(event) =>
                    updateField("expirationDate", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </FormSection>

            <FormSection
              number="03"
              title="Pickup details"
              icon={<MapPin />}
            >
              <Field
                id="pickupLocation"
                label="Pickup area or landmark"
                required
                error={errors.pickupLocation}
              >
                <Input
                  id="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(event) =>
                    updateField("pickupLocation", event.target.value)
                  }
                  placeholder="Area, landmark, or neighborhood"
                  className={inputClass}
                />
              </Field>
              <Field
                id="pincode"
                label="Pincode"
                required
                helper={
                  isVerifyingPincode
                    ? "Checking pincode..."
                    : pincodeValid
                      ? "Pincode verified."
                      : "Enter a valid six-digit Indian pincode."
                }
                error={errors.pincode}
              >
                <Input
                  id="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.pincode}
                  onBlur={() => {
                    if (formData.pincode) {
                      void verifyPincode(formData.pincode);
                    }
                  }}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "");
                    updateField("pincode", value);
                    setPincodeValid(null);
                  }}
                  placeholder="e.g., 411001"
                  className={`${inputClass} ${
                    pincodeValid === true
                      ? "border-green-600 focus-visible:ring-green-600"
                      : ""
                  }`}
                  aria-describedby="pincode-help"
                />
              </Field>
              <Field
                id="address"
                label="Detailed pickup address"
                required
                error={errors.address}
              >
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="Building/shop number, street, area, and nearby landmark"
                  className="mt-2 min-h-28 rounded-xl border-[#c9d9c9]"
                />
              </Field>
              <Field
                id="pickupStart"
                label="Pickup available from"
                required
                error={errors.pickupStart}
              >
                <Input
                  id="pickupStart"
                  type="datetime-local"
                  value={formData.pickupStart}
                  onChange={(event) =>
                    updateField("pickupStart", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <Field
                id="pickupEnd"
                label="Pickup available until"
                required
                error={errors.pickupEnd}
              >
                <Input
                  id="pickupEnd"
                  type="datetime-local"
                  value={formData.pickupEnd}
                  onChange={(event) =>
                    updateField("pickupEnd", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <Field id="pickupInstructions" label="Pickup instructions" full>
                <Textarea
                  id="pickupInstructions"
                  value={formData.pickupInstructions}
                  onChange={(event) =>
                    updateField("pickupInstructions", event.target.value)
                  }
                  placeholder="e.g., Use the side entrance or call on arrival"
                  className="mt-2 min-h-24 rounded-xl border-[#c9d9c9]"
                />
              </Field>
            </FormSection>

            <FormSection
              number="04"
              title="Photos & confirmation"
              icon={<ImageIcon />}
            >
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label
                    htmlFor="donationImages"
                    className="flex items-center gap-2 text-sm font-bold"
                  >
                    <Upload className="h-4 w-4 text-[#17633b]" />
                    Add food photos
                  </Label>
                  <span className="text-xs text-[#536258]">
                    {images.length}/{MAX_IMAGES} images
                  </span>
                </div>
                <div
                  className="relative mt-3 rounded-2xl border-2 border-dashed
                    border-[#c9d9c9] bg-[#f7faf5] p-6 text-center
                    transition hover:border-[#17633b] hover:bg-[#eef6eb]"
                >
                  <input
                    id="donationImages"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    onChange={handleImageSelect}
                    disabled={isSubmitting || images.length === MAX_IMAGES}
                    className="absolute inset-0 h-full w-full cursor-pointer
                      opacity-0 disabled:cursor-not-allowed"
                  />
                  <ImageIcon className="mx-auto h-8 w-8 text-[#17633b]" />
                  <p className="mt-2 text-sm font-bold text-[#14231d]">
                    Click or drag images to upload
                  </p>
                  <p className="mt-1 text-xs text-[#536258]">
                    JPG, PNG, or WebP · maximum 10 MB each
                  </p>
                </div>
                {errors.images && (
                  <p className="mt-2 text-sm text-red-700">
                    {errors.images}
                  </p>
                )}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square
                          overflow-hidden rounded-xl border border-[#dce5dd]"
                      >
                        <img
                          src={image.previewUrl}
                          alt={`Donation preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label={`Remove image ${index + 1}`}
                          onClick={() => removeImage(image.id)}
                          className="absolute right-2 top-2 grid h-8 w-8
                            place-items-center rounded-full bg-red-600
                            text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label
                className="flex cursor-pointer items-start gap-3 rounded-2xl
                  border border-[#dce5dd] bg-[#f7faf5] p-4 sm:col-span-2"
              >
                <input
                  id="confirmation"
                  type="checkbox"
                  checked={formData.confirmation}
                  onChange={(event) =>
                    updateField("confirmation", event.target.checked)
                  }
                  className="mt-1 h-5 w-5 accent-[#17633b]"
                />
                <span className="text-sm leading-6 text-[#536258]">
                  I confirm that the information provided is accurate and
                  that I have followed applicable food-handling guidance.
                </span>
              </label>
              {errors.confirmation && (
                <p className="text-sm text-red-700 sm:col-span-2">
                  {errors.confirmation}
                </p>
              )}
            </FormSection>

            <div className="flex flex-col items-center gap-3 border-t
              border-[#dce5dd] pt-6 sm:flex-row sm:justify-end"
            >
              {uploadStatus && (
                <p className="text-sm text-[#536258]">{uploadStatus}</p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-h-11 w-full rounded-full bg-[#17633b]
                  px-7 text-white transition hover:-translate-y-0.5
                  hover:bg-[#22784a] hover:shadow-lg sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting donation...
                  </>
                ) : (
                  "Post donation"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

function FormSection({
  number,
  title,
  icon,
  note,
  children,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#dce5dd] bg-white p-5
      sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center
          rounded-xl bg-[#eef6eb] text-[#17633b]"
        >
          {icon}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em]
            text-[#17633b]"
          >
            Section {number}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-[#14231d]">
            {title}
          </h2>
          {note && (
            <p className="mt-2 text-xs leading-5 text-[#536258]">
              {note}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  required = false,
  helper,
  error,
  full = false,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label htmlFor={id} className="text-sm font-bold text-[#14231d]">
        {label} {required && <span aria-hidden="true">*</span>}
      </Label>
      {children}
      {helper && !error && (
        <p className="mt-1 text-xs leading-5 text-[#536258]">{helper}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default DonationForm;
