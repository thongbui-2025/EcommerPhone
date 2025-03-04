import { useState, useEffect } from "react";
import { Pencil, Trash, MapPin, X } from "lucide-react";
import axios from "axios";

const AddressList = () => {
  const [address, setAddress] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get("/Address/getByUser/" + userId)
      .then((response) => {
        setAddress(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const setDefault = (id) => {
    setAddress(
      address.map((addr) => ({
        ...addr,
        default: addr.id === id,
      }))
    );
    axios.patch(`/Address/setDefault/${id}?userId=${userId}`);
  };

  const deleteAddress = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
      setAddress(address.filter((addr) => addr.id !== id));
      axios.delete("/Address/"+ id);
    }
  };

  const addNewAddress = (newAddress) => {
    setAddress([...address, newAddress]); // Cập nhật danh sách địa chỉ
  };

  return (
    <div className="p-6 w-2/3 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <MapPin className="mr-2" /> Địa chỉ của tôi
        </h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      {address.length === 0 ? (
        <p className="text-gray-600 text-center">Bạn chưa có địa chỉ nào.</p>
      ) : (
        address.map((addr) => (
          <AddressItem
            key={addr.id}
            address={addr}
            setDefault={setDefault}
            deleteAddress={deleteAddress}
          />
        ))
      )}

      {isModalOpen && (
        <AddAddressModal
          onClose={() => setIsModalOpen(false)}
          onAdd={addNewAddress}
        />
      )}
    </div>
  );
};

const AddressItem = ({ address, setDefault, deleteAddress }) => {
  return (
    <div
      className={`mb-4 p-4 border rounded-lg shadow-sm ${
        address.default ? "border-red-500 bg-red-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="w-1/2">
          <p className="font-bold">
            {address.name} <span className="text-gray-500">| {address.phoneNumber}</span>
          </p>
          <p className="text-gray-600 mt-1">{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</p>
          {address.default && (
            <span className="text-red-500 font-bold text-sm mt-1 block">
              Mặc định
            </span>
          )}
        </div>
        <div className="w-1/2">
          <div className="flex justify-end items-center space-x-2">
            <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
              <Pencil size={14} className="mr-1" /> Cập nhật
            </button>
            {!address.default && (
              <button
                className="text-gray-600 hover:text-red-500 flex items-center text-sm"
                onClick={() => deleteAddress(address.id)}
              >
                <Trash size={14} className="mr-1" /> Xóa
              </button>
            )}
          </div>
          {!address.default && (
            <div className="flex justify-end items-center space-x-2 my-2">
              <button
                className="border border-gray-400 px-2 py-1 text-gray-600 hover:text-gray-900 flex items-center text-sm"
                onClick={() => setDefault(address.id)}
              >
                Thiết lập mặc định
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddAddressModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    userId: localStorage.getItem("userId"),
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    axios.get("/Location/cities").then((response) => {
      setCities(response.data);
    });
  }, []);

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setForm({ ...form, city: cityName, district: "", ward: "" });
  
    const selectedCity = cities.find((c) => c.name === cityName);
    if (selectedCity) {
      axios.get(`/Location/districts/${selectedCity.id}`).then((response) => {
        setDistricts(response.data);
        setWards([]); // Reset danh sách phường
      });
    }
  };
  
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setForm({ ...form, district: districtName, ward: "" });
  
    const selectedDistrict = districts.find((d) => d.name === districtName);
    const selectedCity = cities.find((c) => c.name === form.city); // Lấy ID của thành phố
  
    if (selectedDistrict && selectedCity) {
      axios.get(`/Location/wards/${selectedCity.id}/${selectedDistrict.id}`).then((response) => {
        setWards(response.data);
      });
    }
  };
  
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/Address", form);
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-500 bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Thêm địa chỉ mới</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            required
            className="border w-full p-2 mb-2 rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            className="border w-full p-2 mb-2 rounded"
          />
          <input
            type="text"
            name="street"
            placeholder="Địa chỉ (Số nhà, tên đường)"
            value={form.street}
            onChange={handleChange}
            required
            className="border w-full p-2 mb-2 rounded"
          />

          {/* Dropdown Thành phố */}
          <select
            name="city"
            value={form.city}
            onChange={handleCityChange}
            required
            className="border w-full p-2 mb-2 rounded"
          >
            <option value="">Chọn thành phố</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Dropdown Quận/Huyện */}
          <select
            name="district"
            value={form.district}
            onChange={handleDistrictChange}
            required
            disabled={!form.city}
            className="border w-full p-2 mb-2 rounded"
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>

          {/* Dropdown Phường/Xã */}
          <select
            name="ward"
            value={form.ward}
            onChange={handleChange}
            required
            disabled={!form.district}
            className="border w-full p-2 mb-4 rounded"
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>


          <button
            type="submit"
            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
          >
            Thêm địa chỉ
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressList;
