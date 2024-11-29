import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoadPet = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");

  // FUNCIÓN MANEJAR EL ENVÍO DEL FORMULARIO
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://rep-kod-abril-24-default-rtdb.firebaseio.com/pets.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setStatusMessage("Mascota cargada exitosamente.");
        reset(); // RESET AL FORMULARIO DESPUÉS DE ENVIARLO
        setTimeout(() => {
          navigate("/"); // REDIRIGIR AL CATÁLOGO (2 SEGUNDOS)
        }, 2000);
      } else {
        setStatusMessage("Hubo un error al cargar la mascota.");
      }
    } catch (error) {
      console.error("Error al conectar con Firebase: ", error);
      setStatusMessage("Error al conectar con Firebase.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Cargar Mascota Nueva</h1>

      {/* MENSAJE STATUS */}
      {statusMessage && (
        <div className={`alert ${statusMessage.includes("exitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ESPECIES */}
        <div className="form-group mb-3">
          <label>Species</label>
          <input
            type="text"
            className="form-control"
            {...register("species", { required: true })}
          />
          {errors.species && (
            <small className="text-danger">Este campo es obligatorio</small>
          )}
        </div>

        {/* UBICACION */}
        <div className="form-group mb-3">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <small className="text-danger">Este campo es obligatorio</small>
          )}
        </div>

        {/* NOMBRE */}
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <small className="text-danger">Este campo es obligatorio</small>
          )}
        </div>

        {/* RAZA */}
        <div className="form-group mb-3">
          <label>Breed</label>
          <input
            type="text"
            className="form-control"
            {...register("breed", { required: true })}
          />
          {errors.breed && (
            <small className="text-danger">Este campo es obligatorio</small>
          )}
        </div>

        {/* GENERO */}
        <div className="form-group mb-3">
          <label>Genre</label>
          <select
            className="form-control"
            {...register("genre", { required: true })}
          >
            <option value="">Selecciona un género</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          {errors.genre && (
            <small className="text-danger">Este campo es obligatorio</small>
          )}
        </div>

        {/* FOTO (URL) */}
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
          {errors.picture && (
            <small className="text-danger">
              {errors.picture.message || "Este campo es obligatorio"}
            </small>
          )}
        </div>

        {/* BUTTON SUBMIT */}
        <button type="submit" className="btn btn-primary">
          Cargar Mascota
        </button>
      </form>
    </div>
  );
};

export default LoadPet;
