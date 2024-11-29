import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const EditPet = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");

  // FETCH PARA DATOS DE FIREBASE
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(
          "https://rep-kod-abril-24-default-rtdb.firebaseio.com/pets.json"
        );
        const data = await response.json();
        const petsData = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setPets(petsData);
      } catch (error) {
        console.error("Error fetching pets: ", error);
      }
    };
    fetchPets();
  }, []);

  // SUBMIT PARA ACTUALIZAR DATOS DE LA MASCOTA
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `https://rep-kod-abril-24-default-rtdb.firebaseio.com/pets/${selectedPet.id}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setStatusMessage("Mascota actualizada exitosamente.");
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
      } else {
        setStatusMessage("Error al actualizar la mascota.");
      }
    } catch (error) {
      console.error("Error al actualizar la mascota: ", error);
      setStatusMessage("Error al conectar con Firebase.");
    }
  };

  // SELECCIONAR A UNA MASCOTA
  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
    reset(pet); // FORMULARIO CON LOS DATOS DE LA MASCOTA SELECCIONADA
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Editar Mascota</h1>
      <div className="row">
        {/* SECCIÓN IZQUIERDA (CARDS DE MASCOTAS) */}
        <div className="col-md-6">
          <div className="row">
            {pets.map((pet, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="card" onClick={() => handleSelectPet(pet)}>
                  <img
                    src={pet.picture}
                    alt={pet.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{pet.name}</h5>
                    <p className="card-text">Species: {pet.species}</p>
                    <p className="card-text">Breed: {pet.breed}</p>
                    <p className="card-text">Genre: {pet.genre}</p>
                    <p className="card-text">Location: {pet.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN DERECHA (FORMULARIO DE SELECCIÓN) */}
        <div className="col-md-6">
          {selectedPet ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* MENSAJE DE STATUS */}
              {statusMessage && (
                <div
                  className={`alert ${statusMessage.includes("exitosamente") ? "alert-success" : "alert-danger"}`}
                  role="alert"
                >
                  {statusMessage}
                </div>
              )}

              {/* NOMBRE */}
              <div className="form-group mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: true })}
                />
              </div>

              {/* ESPECIE */}
              <div className="form-group mb-3">
                <label>Species</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("species", { required: true })}
                />
              </div>

              {/* RAZA */}
              <div className="form-group mb-3">
                <label>Breed</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("breed", { required: true })}
                />
              </div>

              {/* GENERO */}
              <div className="form-group mb-3">
                <label>Genre</label>
                <select
                  className="form-control"
                  {...register("genre", { required: true })}
                >
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>

              {/* UBICACION */}
              <div className="form-group mb-3">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("location", { required: true })}
                />
              </div>

              {/* FOTO */}
              <div className="form-group mb-3">
                <label>Picture (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("picture", {
                    required: true,
                    pattern: {
                      value: /^(ftp|http|https):\/\/[^ "]+$/,
                      message: "La URL debe ser válida",
                    },
                  })}
                />
              </div>

              {/* BUTTON SUBMIT */}
              <button type="submit" className="btn btn-primary">
                Actualizar Mascota
              </button>
            </form>
          ) : (
            <p>Selecciona una mascota para editar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPet;
