"use client";
import { CREATE_TASK } from '@/app/graphql/mutation/createTask';
import { DELETE_TASK } from '@/app/graphql/mutation/deleteTask';
import { UPDATE_TASK } from '@/app/graphql/mutation/updateTask';
import { GET_TASKS } from '@/app/graphql/queries/getTodos';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { UPDATE_STATUS } from '@/app/graphql/mutation/updateStatus';
import { useAuth } from '@/app/context/AuthContext';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TodoList = () => {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [updateStatus] = useMutation(UPDATE_STATUS, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const { logout, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    if (data && data.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  const openModal = (task?: Task) => {
    setIsModalOpen(true);
    if (task) {
      setIsEditing(true);
      setCurrentTask(task);
      setNewTaskTitle(task.title);
      setNewTaskDescription(task.description);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleNewTaskChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== '' && newTaskDescription.trim() !== '') {
      try {
        await createTask({
          variables: {
            title: newTaskTitle,
            description: newTaskDescription,
            completed: false,
          },
        });
        closeModal();
      } catch (err) {
        console.error('Error creating task:', err);
      }
    }
  };

  const handleUpdateTask = async () => {
    if (currentTask && newTaskTitle.trim() !== '' && newTaskDescription.trim() !== '') {
      try {
        await updateTask({
          variables: {
            id: currentTask._id,
            title: newTaskTitle,
            description: newTaskDescription,
            completed: currentTask.completed,
          },
        });
        closeModal();
      } catch (err) {
        console.error('Error updating task:', err);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({ variables: { id: taskId } });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateStatus = useCallback(
    debounce(async (taskId: string, currentStatus: boolean) => {
      try {
        await updateStatus({
          variables: {
            id: taskId,
            completed: !currentStatus,
          },
        });
      } catch (err) {
        console.error('Error updating task status:', err);
      }
    }, 400),
    []
  );

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (error) logout();
  }, [error]);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="container mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center">
        Welcome, {user?.name}
      </h1>

      <div className="flex mb-5 justify-center gap-4 flex-wrap">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          onClick={() => openModal()}
        >
          Add Task
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex flex-wrap items-center mb-2 p-2 border-b border-gray-200"
          >
            <span
              className={`text-lg flex-1 ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}
            >
              {task.title} - <span className="italic text-sm">{task.description}</span>
            </span>
            <input
              type="checkbox"              
              className="transform scale-150 m-2.5 cursor-pointer"
              checked={task.completed}
              onChange={() => handleUpdateStatus(task._id, task.completed)}
            />
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg ml-2 transition duration-200"
              onClick={() => openModal(task)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg ml-2 transition duration-200"
              onClick={() => handleDeleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg mx-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTaskTitle}
              onChange={handleNewTaskChange(setNewTaskTitle)}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTaskDescription}
              onChange={handleNewTaskChange(setNewTaskDescription)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={isEditing ? handleUpdateTask : handleAddTask}
              >
                {isEditing ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
