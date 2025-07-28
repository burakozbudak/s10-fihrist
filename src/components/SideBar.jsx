import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

// API’den kişi listesini çeken fonksiyon
const getContacts = async () => {
  const response = await axios.get(
    "https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact"
  );
  return response.data;
};

export default function SideBar() {
  // useQuery ile kişi listesini al
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contacts"], // Benzersiz query anahtarı
    queryFn: getContacts,
  });

  return (
    <div
      id="sidebar"
      className="w-84 bg-stone-100 border-r border-stone-200 flex flex-col"
    >
      <h1 className="text-xl font-medium m-0 pt-4 px-8">C2W Contacts</h1>
      <div className="px-8 flex items-center gap-2 py-4 border-b border-stone-300">
        <Link to="/contacts/new">
          <button type="submit">New</button>
        </Link>
        <Link to="/">
          <button type="submit">Home</button>
        </Link>
      </div>
      <nav className="px-8 flex-1 overflow-auto pt-4">
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p>Hata: {error.message}</p>
        ) : contacts.length ? (
          <ul className="contactList p-0 m-0 list-none">
            {contacts.map((contact) => (
              <li key={contact.id} className="my-1 mx-0">
                <NavLink
                  to={`/contacts/${contact.id}`}
                  data-testid="contact"
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                >
                  {contact.first_name || contact.last_name ? (
                    <>
                      <span>{contact.first_name}</span>
                      <span className="ml-1">{contact.last_name}</span>
                    </>
                  ) : (
                    <i className="text-stone-500">No Name</i>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No contacts</i>
          </p>
        )}
      </nav>
    </div>
  );
}
