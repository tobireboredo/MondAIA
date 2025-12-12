import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./userContext.jsx";

const TareasFinalizadas = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const openDeleteModalFn = () => {
    setOpenDeleteModal(true);
    setTimeout(() => setDeleteModalVisible(true), 20);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setTimeout(() => setOpenDeleteModal(false), 200);
  };

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

        setTasks(data.filter((t) => t.estado === "finalizado"));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/task/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.log("Error eliminando tarea");
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    openDeleteModalFn();
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id);
    closeDeleteModal();
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tareas finalizadas</h1>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#D9D9D9] rounded-xl p-4 shadow-md h-[220px] flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-2">
                {task.task_name || "Sin título"}
              </h2>

              <div className="w-full h-[2px] bg-gray-400 mb-3"></div>

              <p className="text-gray-700 flex-1">
                {task.descripcion || "Sin descripción"}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                Estado:{" "}
                <span className="text-green-600 font-semibold">
                  Finalizado
                </span>
              </p>

              <div className="mt-auto flex justify-end">
                <button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                  onClick={() => handleDeleteClick(task)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay tareas finalizadas.</p>
      )}

      {openDeleteModal && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
            deleteModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white p-6 rounded-xl w-[420px] space-y-6 relative shadow-2xl transition-all duration-300 transform ${
              deleteModalVisible
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-semibold">
              ¿Eliminar tarea definitivamente?
            </h2>

            <p className="text-gray-700">{taskToDelete?.task_name}</p>

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>

              <button
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmDeleteTask}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasFinalizadas;
