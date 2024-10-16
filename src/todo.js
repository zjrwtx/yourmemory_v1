import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Check, X, Trash2, Edit2, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function EnhancedTodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : {};
  });
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
      setTodos(prevTodos => ({
        ...prevTodos,
        [currentDate]: [
          ...(prevTodos[currentDate] || []),
          { id: Date.now(), text: newTodo, completed: false, tags: [] }
        ]
      }));
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [currentDate]: prevTodos[currentDate].map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [currentDate]: prevTodos[currentDate].filter(todo => todo.id !== id)
    }));
  };

  const editTodo = (id, newText) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [currentDate]: prevTodos[currentDate].map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
      )
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const deleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    setTodos(prevTodos => {
      const updatedTodos = { ...prevTodos };
      Object.keys(updatedTodos).forEach(date => {
        updatedTodos[date] = updatedTodos[date].map(todo => ({
          ...todo,
          tags: todo.tags.filter(tag => tag !== tagToDelete)
        }));
      });
      return updatedTodos;
    });
    if (tagFilter === tagToDelete) {
      setTagFilter('all');
    }
  };

  const toggleTag = (todoId, tag) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [currentDate]: prevTodos[currentDate].map(todo => {
        if (todo.id === todoId) {
          const newTags = todo.tags.includes(tag)
            ? todo.tags.filter(t => t !== tag)
            : [...todo.tags, tag];
          return { ...todo, tags: newTags };
        }
        return todo;
      })
    }));
  };

  const filteredTodos = (todos[currentDate] || []).filter(todo => {
    const statusMatch = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    const tagMatch = 
      tagFilter === 'all' || 
      todo.tags.includes(tagFilter);
    return statusMatch && tagMatch;
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const changeDate = (direction) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + direction);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos[currentDate] || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(prevTodos => ({
      ...prevTodos,
      [currentDate]: items
    }));
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'light' ? 'bg-amber-50' : 'bg-gray-900'} transition-colors duration-500`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2 text-amber-600"
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </motion.button>

      <main className="flex-grow p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeDate(-1)}
            className={`p-2 rounded-full ${theme === 'light' ? 'bg-amber-500' : 'bg-amber-700'} text-white`}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-amber-800' : 'text-amber-200'}`}>
            {new Date(currentDate).toLocaleDateString()}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeDate(1)}
            className={`p-2 rounded-full ${theme === 'light' ? 'bg-amber-500' : 'bg-amber-700'} text-white`}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

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
                } border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
              >
                {tag}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteTag(tag)}
                className={`px-2 py-1 rounded-r-full ${
                  theme === 'light'
                    ? 'bg-amber-300 text-white'
                    : 'bg-gray-700 text-white'
                } border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="mb-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-l-full ${filter === 'all' ? theme === 'light' ? 'bg-amber-500 text-white' : 'bg-amber-700 text-white' : theme === 'light' ? 'bg-white text-amber-800' : 'bg-gray-700 text-white'} border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
          >
            全部
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('active')}
            className={`px-4 py-2 ${filter === 'active' ? theme === 'light' ? 'bg-amber-500 text-white' : 'bg-amber-700 text-white' : theme === 'light' ? 'bg-white text-amber-800' : 'bg-gray-700 text-white'} border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
          >
            进行中
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-r-full ${filter === 'completed' ? theme === 'light' ? 'bg-amber-500 text-white' : 'bg-amber-700 text-white' : theme === 'light' ? 'bg-white text-amber-800' : 'bg-gray-700 text-white'} border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
          >
            已完成
          </motion.button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <AnimatePresence>
                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`flex flex-col mb-2 p-3 rounded-lg shadow-md ${
                            theme === 'light' ? 'bg-white' : 'bg-gray-800'
                          } transition-colors duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleTodo(todo.id)}
                                className={`p-2 rounded-full ${todo.completed ? 'bg-amber-500' : theme === 'light' ? 'bg-white' : 'bg-gray-800'} border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
                              >
                                {todo.completed && <Check size={24} className="text-white" />}
                              </motion.button>
                              <motion.input
                                whileFocus={{ scale: 1.02 }}
                                type="text"
                                value={todo.text}
                                onChange={(e) => editTodo(todo.id, e.target.value)}
                                className={`ml-4 bg-transparent focus:outline-none ${
                                  theme === 'light' ? 'text-amber-800' : 'text-white'
                                }`}
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteTodo(todo.id)}
                              className={`p-2 rounded-full ${theme === 'light' ? 'bg-amber-300' : 'bg-gray-700'} text-white`}
                            >
                              <Trash2 size={24} />
                            </motion.button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {tags.map(tag => (
                              <motion.button
                                key={tag}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleTag(todo.id, tag)}
                                className={`px-3 py-1 rounded-full ${
                                  todo.tags.includes(tag)
                                    ? theme === 'light'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-amber-700 text-white'
                                    : theme === 'light'
                                    ? 'bg-white text-amber-800'
                                    : 'bg-gray-700 text-white'
                                } border-2 ${theme === 'light' ? 'border-amber-300' : 'border-amber-700'} transition-colors duration-300`}
                              >
                                {tag}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </div>
  );
}
