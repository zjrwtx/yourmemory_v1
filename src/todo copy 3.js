import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Check, X, Trash2, Edit2, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos).map(todo => ({
      ...todo,
      tags: todo.tags || []
    })) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [newTag, setNewTag] = useState('');
  const [filter, setFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [todos, tags]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, tags: [] }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const deleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    setTodos(todos.map(todo => ({
      ...todo,
      tags: todo.tags.filter(tag => tag !== tagToDelete)
    })));
    if (tagFilter === tagToDelete) {
      setTagFilter('all');
    }
  };

  const toggleTag = (todoId, tag) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        const newTags = todo.tags && todo.tags.includes(tag)
          ? todo.tags.filter(t => t !== tag)
          : [...(todo.tags || []), tag];
        return { ...todo, tags: newTags };
      }
      return todo;
    }));
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    const tagMatch = 
      tagFilter === 'all' || 
      (todo.tags && todo.tags.includes(tagFilter));
    return statusMatch && tagMatch;
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'light' ? 'bg-amber-50' : 'bg-gray-900'} transition-colors duration-500`}>
      <header className={`p-4 ${theme === 'light' ? 'bg-amber-600' : 'bg-amber-800'} text-white shadow-lg transition-colors duration-500`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">友好待办 🌟</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white text-amber-600"
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </motion.button>
        </div>
        <p className="text-sm mt-2">记录美好，成就每一天</p>
      </header>

      <main className="flex-grow p-4 overflow-auto">
        <div className="mb-4 flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新任务..."
            className={`flex-grow p-2 rounded-l-lg border-2 ${theme === 'light' ? 'border-amber-300 bg-white' : 'border-amber-700 bg-gray-800 text-white'} focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-300`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className={`p-2 rounded-r-lg ${theme === 'light' ? 'bg-amber-500' : 'bg-amber-700'} text-white transition-colors duration-300`}
          >
            <Plus size={24} />
          </motion.button>
        </div>

        <div className="mb-4 flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="添加新标签..."
            className={`flex-grow p-2 rounded-l-lg border-2 ${theme === 'light' ? 'border-amber-300 bg-white' : 'border-amber-700 bg-gray-800 text-white'} focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-300`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTag}
            className={`p-2 rounded-r-lg ${theme === 'light' ? 'bg-amber-500' : 'bg-amber-700'} text-white transition-colors duration-300`}
          >
            <Tag size={24} />
          </motion.button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.div
              key={tag}
              className="flex items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTagFilter(tag === tagFilter ? 'all' : tag)}
                className={`px-3 py-1 rounded-l-full ${
                  tagFilter === tag
                    ? theme === 'light'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-700 text-white'
                    : theme === 'light'
                    ? 'bg-white text-amber-800'
                    : 'bg-gray-700 text-white'
                } transition-colors duration-300`}
              >
                {tag}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTag(tag)}
                className={`p-1 rounded-r-full ${
                  theme === 'light' ? 'bg-red-500' : 'bg-red-700'
                } text-white transition-colors duration-300`}
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`flex flex-col mb-2 p-3 rounded-lg shadow-md ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              } transition-colors duration-300`}
            >
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTodo(todo.id)}
                  className={`mr-2 p-1 rounded-full ${
                    todo.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </motion.button>
                <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const newText = prompt('编辑任务:', todo.text);
                    if (newText) editTodo(todo.id, newText);
                  }}
                  className="mr-2 text-blue-500"
                >
                  <Edit2 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(todo.id, tag)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      todo.tags && todo.tags.includes(tag)
                        ? theme === 'light'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-700 text-white'
                        : theme === 'light'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-gray-700 text-gray-200'
                    } transition-colors duration-300`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      <footer className={`p-4 ${theme === 'light' ? 'bg-amber-100' : 'bg-gray-800'} shadow-lg transition-colors duration-500`}>
        <div className="flex justify-center space-x-4">
          {['all', 'active', 'completed'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full ${
                filter === f
                  ? theme === 'light'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-700 text-white'
                  : theme === 'light'
                  ? 'bg-white text-amber-800'
                  : 'bg-gray-700 text-white'
              } transition-colors duration-300`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>
      </footer>
    </div>
  );
}