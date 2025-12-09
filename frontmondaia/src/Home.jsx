import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./userContext.jsx";

const Home = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);

  // ---- estados del modal ----
  const [openModal, setOpenModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // para animación de entrada
  const [newTask, setNewTask] = useState({
    task_name: "",
    descripcion: "",
    estado: "pendiente",
  });

  // Abrir modal con animación
  const openCreateModal = () => {
    setOpenModal(true);
    setTimeout(() => setModalVisible(true), 20);
  };

  // Cerrar modal con animación suave
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setOpenModal(false), 200);
  };

  // ---- obtener tareas ----
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/tasks/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) return console.error("Error:", response.status);

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const updateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) return console.error("Error updating task");

      const data = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ---- crear tarea ----
  const handleCreateTask = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok)
        return console.error("Error creating task:", response.status);

      const createdTask = await response.json();
      setTasks((prev) => [...prev, createdTask]);

      closeModal();
      setNewTask({ task_name: "", descripcion: "", estado: "pendiente" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const isDone = (estado) => {
    if (!estado) return false;
    const s = String(estado).toLowerCase();
    return (
      s === "done" ||
      s === "completada" ||
      s === "completado" ||
      s === "terminada"
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tareas pendientes</h1>

      {/* BOTON PARA ABRIR MODAL */}
      <button
        className="bg-[#366E18] text-white rounded-lg w-12 h-12 flex items-center justify-center mb-6 hover:bg-green-600 transition"
        onClick={openCreateModal}
      >
        +
      </button>

      {tasks.length > 0 ? (
        <ul className="space-y-6">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="w-[410px] h-[220px] bg-[#D9D9D9] rounded-xl p-4 flex flex-col shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">
                {task.task_name || "Sin título"}
              </h2>

              <div className="w-full h-[2px] bg-gray-400 mb-3"></div>

              <div className="flex flex-col gap-3 flex-1">
                <p className="text-gray-700">
                  {task.descripcion || "Sin descripción"}
                </p>

                <p className="text-sm text-gray-600">
                  Estado:{" "}
                  <span
                    className={
                      isDone(task.estado) ? "text-green-600" : "text-red-600"
                    }
                  >
                    {task.estado ?? "Sin estado"}
                  </span>
                </p>

                {!isDone(task.estado) && (
                  <div className="mt-auto flex justify-end">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-fit"
                      onClick={() =>
                        updateTask(task.id, {
                          ...task,
                          estado: "done",
                        })
                      }
                    >
                      Marcar como hecho
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tareas asignadas por ahora.</p>
      )}

      {/* ---- MODAL ---- */}
      {openModal && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white p-8 rounded-xl w-[550px] space-y-6 relative shadow-2xl transition-all duration-300 transform ${
              modalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* X cerrar */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black text-2xl transition"
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 className="text-3xl font-semibold mb-2">Nueva tarea</h2>

            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-lg">Nombre:</label>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                value={newTask.task_name}
                className="w-full border p-3 rounded"
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    task_name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-lg">Descripción:</label>
              <textarea
                placeholder="Descripción de la tarea"
                value={newTask.descripcion}
                className="w-full border p-3 rounded h-36 resize-none"
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
              />
            </div>

            {/* Botón crear */}
            <div className="flex justify-end">
              <button
                className="px-5 py-3 bg-[#366E18] text-white rounded-lg hover:bg-green-700 transition"
                onClick={handleCreateTask}
              >
                Crear tarea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
