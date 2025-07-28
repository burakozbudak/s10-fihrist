import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// API’den kişi bilgisini çeken fonksiyon
const getContact = async (contactId) => {
  const response = await axios.get(
    `https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact/${contactId}`
  );
  return response.data;
};

// API’den kişi silen fonksiyon
const deleteContact = async (contactId) => {
  await axios.delete(
    `https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact/${contactId}`
  );
};

export default function Contact() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useQuery ile kişi bilgisini al
  const {
    data: contact,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contact", contactId], // Kişiye özgü query anahtarı
    queryFn: () => getContact(contactId),
  });

  // useMutation ile silme işlemi
  const mutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      // Silme başarılıysa, contacts query’sini geçersiz kıl
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate("/");
    },
  });

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;
  if (!contact) return <p>Böyle bir kullanıcı yok</p>;

  return (
    <div id="contact" className="max-w-2xl flex gap-8 items-center">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
          className="w-48 h-48 bg-[#c8c8c8] rounded-3xl object-cover"
        />
      </div>

      <div className="flex-1">
        <h1
          data-testid="full_name"
          className="text-3xl font-bold m-0 leading-tight"
        >
          {contact.first_name || contact.last_name ? (
            <>
              {contact.first_name} {contact.last_name}
            </>
          ) : (
            <i>No Name</i>
          )}
        </h1>

        {contact.email && (
          <p className="m-0">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </p>
        )}

        <div className="mt-6">
          <button
            className="text-red-500"
            onClick={() => mutation.mutate(contactId)}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Siliniyor..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
