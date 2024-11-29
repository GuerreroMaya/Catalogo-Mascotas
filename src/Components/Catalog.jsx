import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Catalog = () => {
  const { register, handleSubmit } = useForm();
  const [species, setSpecies] = useState([]);
  const [pets, setPets] = useState([]);
  const [filterType, setFilterType] = useState("species");
  const [filteredPets, setFilteredPets] = useState([]);

  // FETCH PARA LOS DATOS DE FIREBASE
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(
          "https://rep-kod-abril-24-default-rtdb.firebaseio.com/pets.json"
        );
        const data = await response.json();
        const petsData = data ? Object.values(data) : [];
        setPets(petsData);
        setFilteredPets(petsData); // PARA MOSTRAR TODAS LAS MASCOTAS INICIALMENTE
        const speciesList = [...new Set(petsData.map((pet) => pet.species))];
        setSpecies(speciesList); // OBTENER LAS ESPECIES
      } catch (error) {
        console.error("Error fetching pets: ", error);
      }
    };
    fetchPets();
  }, []);

  // PARA MANEJAR CAMBIO AL FILTRAR
  const handleFilterChange = (data) => {
    if (filterType === "species") {
      const filtered = pets.filter((pet) => pet.species === data.species);
      setFilteredPets(filtered.length > 0 ? filtered : []);
    } else if (filterType === "breed") {
      const filtered = pets.filter((pet) =>
        pet.breed.toLowerCase().includes(data.breed.toLowerCase())
      );
      setFilteredPets(filtered.length > 0 ? filtered : []);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Catálogo de Mascotas</h1>

      {/* SECCION DE FILTRAR */}
      <form onSubmit={handleSubmit(handleFilterChange)} className="mb-4">
        <div className="d-flex justify-content-center mb-3">
          {/* RADIO BUTTONS EN UNA LINEA */}
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="filterType"
              value="species"
              checked={filterType === "species"}
              onChange={() => setFilterType("species")}
              className="form-check-input"
            />
            <label className="form-check-label">Filtrar por especie</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="filterType"
              value="breed"
              checked={filterType === "breed"}
              onChange={() => setFilterType("breed")}
              className="form-check-input"
            />
            <label className="form-check-label">Filtrar por raza</label>
          </div>
        </div>

        {/* DROPDOWN DEBAJO DE LOS RADIO BUTTONS */}
        {filterType === "species" && (
          <div className="form-group">
            <select
              className="form-control"
              {...register("species")}
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona una especie
              </option>
              {species.map((specie, index) => (
                <option key={index} value={specie}>
                  {specie}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterType === "breed" && (
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa la raza"
              {...register("breed")}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-3">
          Filtrar
        </button>
      </form>

      {/* SECCIÓN MASCOTAS */}
      <div className="row">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img
                  src={pet.picture}
                  alt={pet.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{pet.name}</h5>
                  <p className="card-text">Género: {pet.genre}</p>
                  <button className="btn btn-success me-2">Adoptar</button>
                  <button className="btn btn-info">Ver detalle</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay disponibilidad por el momento.</p>
        )}
      </div>

        {/* BUTTONS PARA CARGAR Y EDITAR MASCOTAS */}
        <div className="text-end">
        {/* BUTTON PARA EDITAR MASCOTA */}
        <Link to="/edit-pet" className="btn btn-secondary me-2 mb-5">
            Editar Mascota
        </Link>

        {/* BUTTON PARA CARGAR MASCOTA */}
        <Link to="/load-new-pet" className="btn btn-primary mb-5">
            Cargar Mascota
        </Link>
        </div>
    </div>
  );
};

export default Catalog;
