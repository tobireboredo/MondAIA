import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./userContext.jsx";

const Home = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);

  // Traer tareas del backend
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/tasks?userId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user]);

  // Función para actualizar una tarea
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
      const data = await response.json();

      // Actualizar estado local
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4">Tareas pendientes</h1>

      {/* Botón verde + */}
      <button
        className="bg-[#366E18] text-white rounded-lg w-12 h-12 flex items-center justify-center mb-6 hover:bg-green-600 transition"
        onClick={() => alert("Agregar nueva tarea")}
      >
        +
      </button>

      {/* Lista de tareas */}
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-2 border rounded flex justify-between items-center"
            >
              <span className={task.completed ? "line-through text-gray-400" : ""}>
                {task.name}
              </span>
              {!task.completed && (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => updateTask(task.id, { completed: true })}
                >
                  Marcar como hecho
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tareas asignadas por ahora.</p>
      )}
    </div>
  );
};

export default Home;
