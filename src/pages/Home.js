import React, { useState, useEffect } from 'react';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { listTodos } from '../graphql/queries';
import { createTodo, updateTodo, deleteTodo } from '../graphql/mutations';
import './css/home.css'; 

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [editMode, setEditMode] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        setIsAuthenticated(true);
        fetchTodos();
      }
    } catch (error) {
      console.error("L'utilisateur n'est pas authentifié", error);
      setIsAuthenticated(false);
    }
  };

  const fetchTodos = async () => {
    if (!isAuthenticated) return;

    try {
      const todoData = await API.graphql({
        query: listTodos,
        authMode: 'AMAZON_COGNITO_USER_POOLS' 
      });
      setTodos(todoData.data.listTodos.items);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
    }
  };

  const addTodo = async () => {
    if (title.trim() === '') {
      alert('Le titre est requis');
      return;
    }

    try {
      const user = await Auth.currentAuthenticatedUser();
      if (!user) {
        alert("Vous devez être connecté pour créer une tâche.");
        return;
      }

      const newTodo = {
        title,
        description,
        status: 'PENDING',
        owner: user.username
      };

      await API.graphql({
        query: createTodo,
        variables: { input: newTodo },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });

      setTitle('');
      setDescription('');
      setStatus('PENDING');
      fetchTodos();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche :', error);
      alert(error.message || 'Erreur inconnue lors de la création de la tâche');
    }
  };

  const startEditing = (todo) => {
    setEditMode(true);
    setCurrentTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setStatus(todo.status);
  };

  const updateExistingTodo = async () => {
    if (!isAuthenticated || !currentTodo) return;

    try {
      const updatedTodo = {
        id: currentTodo.id,
        title,
        description,
        status,
      };
      await API.graphql({
        query: updateTodo,
        variables: { input: updatedTodo },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });
      setEditMode(false);
      setTitle('');
      setDescription('');
      setStatus('PENDING');
      setCurrentTodo(null);
      fetchTodos();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche :', error);
    }
  };

  const removeTodo = async (id) => {
    if (!isAuthenticated) return;

    try {
      await API.graphql({
        query: deleteTodo,
        variables: { input: { id } },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });
      fetchTodos();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche :', error);
    }
  };

  useEffect(() => {
     const deleteTodoCompleted = async () =>{
      for(const todo of todos) {
        if(todo.status === 'COMPLETED'){
          await removeTodo(todo.id);
        }
      }
     }
     deleteTodoCompleted();
  },[todos])

  return (
    <div className="home-container">
      <h2 className="home-title">Liste des tâches</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Titre de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="home-input"
        />
        <textarea
          placeholder="Description de la tâche"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="home-input"
        ></textarea>
        {editMode && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-status"
          >
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminée</option>
          </select>
        )}
        {editMode ? (
          <button onClick={updateExistingTodo} className="button update-button">
            Mettre à jour
          </button>
        ) : (
          <button onClick={addTodo} className="button add-button">
            Ajouter
          </button>
        )}
      </div>
      <div className='todo-body'>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.status.toLowerCase()}`}>
            <div className="todo-details">
              <strong className="todo-title">{todo.title}</strong> - <span className="todo-description">{todo.description}</span> [{todo.status}]
              <button onClick={() => startEditing(todo)} className="button edit-button">
                Modifier
              </button>
              <button onClick={() => removeTodo(todo.id)} className="button delete-button">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Home;
