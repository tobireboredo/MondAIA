import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./userContext.jsx";

const Home = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);

  const [openCreateModalState, setOpenCreateModalState] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [openFinishModal, setOpenFinishModal] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [taskToFinish, setTaskToFinish] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [newTask, setNewTask] = useState({
    task_name: "",
    descripcion: "",
    estado: "pendiente",
  });

  const openCreateModal = () => {
    setOpenCreateModalState(true);
    setTimeout(() => setCreateModalVisible(true), 20);
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    setTimeout(() => setOpenCreateModalState(false), 200);
  };

  const openFinishModalFn = () => {
    setOpenFinishModal(true);
    setTimeout(() => setFinishModalVisible(true), 20);
  };

  const closeFinishModal = () => {
    setFinishModalVisible(false);
    setTimeout(() => setOpenFinishModal(false), 200);
  };

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

        if (!response.ok) return;

        const data = await response.json();
        setTasks(data.filter((t) => t.estado !== "finalizado"));
      } catch (error) {}
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

      if (!response.ok) return;

      const updatedTask = await response.json();

      if (updatedTask.estado === "finalizado") {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (error) {}
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) return;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {}
  };

  const handleMarkAsDone = (task) => {
    if (task.estado === "pendiente") {
      setTaskToFinish(task);
      openFinishModalFn();
    }
  };

  const confirmFinishTask = () => {
    if (!taskToFinish) return;
    updateTask(taskToFinish.id, { ...taskToFinish, estado: "finalizado" });
    closeFinishModal();
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

      if (!response.ok) return;

      const createdTask = await response.json();
      setTasks((prev) => [...prev, createdTask]);

      closeCreateModal();
      setNewTask({ task_name: "", descripcion: "", estado: "pendiente" });
    } catch (error) {}
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tareas pendientes</h1>

      <button
        className="bg-[#366E18] text-white rounded-lg w-12 h-12 flex items-center justify-center mb-6 hover:bg-green-600 transition"
        onClick={openCreateModal}
      >
        +
      </button>

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
                <span className="text-red-600">
                  {task.estado ?? "Sin estado"}
                </span>
              </p>

              <div className="mt-auto flex justify-end gap-3">
                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleMarkAsDone(task)}
                >
                  Marcar como hecho
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  onClick={() => handleDeleteClick(task)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay tareas pendientes.</p>
      )}

      {openCreateModalState && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
            createModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white p-8 rounded-xl w-[550px] space-y-6 relative shadow-2xl transition-all duration-300 transform ${
              createModalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black text-2xl transition"
              onClick={closeCreateModal}
            >
              ✕
            </button>

            <h2 className="text-3xl font-semibold mb-2">Nueva tarea</h2>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-lg">Nombre:</label>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                value={newTask.task_name}
                className="w-full border p-3 rounded"
                onChange={(e) =>
                  setNewTask({ ...newTask, task_name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-lg">Descripción:</label>
              <textarea
                placeholder="Descripción de la tarea"
                value={newTask.descripcion}
                className="w-full border p-3 rounded h-36 resize-none"
                onChange={(e) =>
                  setNewTask({ ...newTask, descripcion: e.target.value })
                }
              />
            </div>

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

      {openFinishModal && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
            finishModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white p-6 rounded-xl w-[420px] space-y-6 relative shadow-2xl transition-all duration-300 transform ${
              finishModalVisible
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-semibold">¿Finalizar tarea?</h2>

            <p className="text-gray-700">{taskToFinish?.task_name}</p>

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={closeFinishModal}
              >
                Cancelar
              </button>

              <button
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={confirmFinishTask}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {openDeleteModal && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
            deleteModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white p-6 rounded-xl w-[420px] space-y-6 relative shadow-2xl transition-all duration-300 transform ${
              deleteModalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-semibold">¿Eliminar tarea?</h2>

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

export default Home;
