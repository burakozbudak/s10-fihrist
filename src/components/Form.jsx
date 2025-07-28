import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

// API’ye yeni kişi ekleyen fonksiyon
const addContact = async (data) => {
  const response = await axios.post(
    "https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact",
    data
  );
  return response.data;
};

export default function Form() {
  const navigate = useHistory();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({ mode: "all" });

  // useMutation ile ekleme işlemi
  const mutation = useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      // Ekleme başarılıysa, contacts query’sini geçersiz kıl
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate("/");
    },
  });

  const handleFormSubmit = (data) => {
    if (!isValid) return;
    mutation.mutate(data);
  };

  return (
    <form
      id="contact-form"
      className="contactForm"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          type="text"
          {...register("first_name", { required: "Name is required" })}
        />
        <input
          placeholder="Last"
          type="text"
          {...register("last_name", { required: "Last Name is required" })}
        />
      </p>
      <label>
        <span>Email</span>
        <input
          type="text"
          placeholder="john.doe@example.com"
          {...register("email", { required: "Email Address is required" })}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          type="text"
          {...register("avatar", { required: "Avatar is required" })}
        />
      </label>
      {Object.keys(errors).length !== 0 && (
        <ul className="text-red-600 py-4 px-5 bg-red-200 rounded-xl">
          {errors.first_name && <li>{errors.first_name.message}</li>}
          {errors.last_name && <li>{errors.last_name.message}</li>}
          {errors.email && <li>{errors.email.message}</li>}
          {errors.avatar && <li>{errors.avatar.message}</li>}
        </ul>
      )}
      <p>
        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Kaydediliyor..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={mutation.isLoading}
        >
          Cancel
        </button>
      </p>
    </form>
  );
}
