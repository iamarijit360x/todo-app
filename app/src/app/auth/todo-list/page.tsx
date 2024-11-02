import { CREATE_TASK } from '@/app/graphql/mutation/createTask';
import { DELETE_TASK } from '@/app/graphql/mutation/deleteTask';
import { UPDATE_TASK } from '@/app/graphql/mutation/updateTask';
import { GET_TASKS } from '@/app/graphql/queries/getTodos';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
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
  // const history = useHistory(); // Initialize useHistory
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
  const {logout,user}=useAuth()
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

  const handleUpdateStatus = async (taskId: any, newStatus: boolean) => {
    try {
      const { data } = await updateStatus({
        variables: {
          id: taskId,
          completed: !newStatus,
        },
      });
      console.log('Task updated:', data.updateStatus);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleLogout = () => {


    logout()
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  return (
    <div className="container mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-5 text-center">Welcome {user?.name}</h1>
      <div className="flex mb-5 justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          onClick={() => openModal()}
        >
          Add Task
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg ml-4 transition duration-200"
          onClick={handleLogout} // Trigger logout on click
        >
          Logout
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="flex items-center mb-2 p-2 border-b border-gray-200">
            <span
              className={`text-lg flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
            >
              {task.title} - <span className="italic text-sm">{task.description}</span>
            </span>
            <input
              type="checkbox"
              className="ml-2"
              checked={task.completed}
              onChange={(e) => handleUpdateStatus(task._id, task.completed)}
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

      {/* Modal for adding/updating a task */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
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
            <div className="flex justify-end">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
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
