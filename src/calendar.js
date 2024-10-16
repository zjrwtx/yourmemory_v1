import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash, X } from 'lucide-react';

const TheCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', startTime: '', endTime: '' });
  const [editingEventIndex, setEditingEventIndex] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEventSubmit = () => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    if (editingEventIndex !== null) {
      // Edit existing event
      const updatedEvents = [...(events[dateKey] || [])];
      updatedEvents[editingEventIndex] = currentEvent;
      setEvents({
        ...events,
        [dateKey]: updatedEvents
      });
      setEditingEventIndex(null);
    } else {
      // Add new event
      setEvents({
        ...events,
        [dateKey]: [...(events[dateKey] || []), currentEvent]
      });
    }
    setCurrentEvent({ title: '', startTime: '', endTime: '' });
    setShowEventForm(false);
  };

  const editEvent = (index) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    setCurrentEvent(events[dateKey][index]);
    setEditingEventIndex(index);
    setShowEventForm(true);
  };

  const deleteEvent = (index) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const updatedEvents = [...(events[dateKey] || [])];
    updatedEvents.splice(index, 1);
    setEvents({
      ...events,
      [dateKey]: updatedEvents
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="text-amber-600 hover:text-amber-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-amber-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="text-amber-600 hover:text-amber-800">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center font-bold text-amber-600">{day}</div>
          ))}
          {[...Array(firstDayOfMonth).keys()].map(i => (
            <div key={`empty-${i}`} className="text-center p-2"></div>
          ))}
          {[...Array(daysInMonth).keys()].map(i => {
            const day = i + 1;
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
            const hasEvents = events[dateKey] && events[dateKey].length > 0;
            return (
              <div
                key={day}
                className={`text-center p-2 rounded-full ${
                  hasEvents ? 'bg-amber-200' : 'hover:bg-amber-100'
                } cursor-pointer`}
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                  setShowEventForm(true);
                  setEditingEventIndex(null);
                  setCurrentEvent({ title: '', startTime: '', endTime: '' });
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-amber-800 mb-2">日程</h3>
          {events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`]?.map((event, index) => (
            <div key={index} className="bg-amber-100 rounded p-2 mb-2 flex justify-between items-center">
              <div>
                <p className="font-bold">{event.title}</p>
                <p className="text-sm text-amber-700">{event.startTime} - {event.endTime}</p>
              </div>
              <div>
                <button onClick={() => editEvent(index)} className="text-blue-500 mr-2">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteEvent(index)} className="text-red-500">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
          {showEventForm && (
            <div className="mt-4 bg-amber-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold text-amber-800">
                  {editingEventIndex !== null ? '编辑事件' : '添加事件'}
                </h4>
                <button onClick={() => setShowEventForm(false)} className="text-amber-600">
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="事件标题"
                value={currentEvent.title}
                onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                className="w-full p-2 mb-2 border border-amber-300 rounded"
              />
              <div className="flex space-x-2 mb-2">
                <input
                  type="time"
                  value={currentEvent.startTime}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, startTime: e.target.value })}
                  className="w-1/2 p-2 border border-amber-300 rounded"
                />
                <input
                  type="time"
                  value={currentEvent.endTime}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, endTime: e.target.value })}
                  className="w-1/2 p-2 border border-amber-300 rounded"
                />
              </div>
              <button
                onClick={handleEventSubmit}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2 transition-colors duration-300 w-full flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" />
                {editingEventIndex !== null ? '更新事件' : '添加事件'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheCalendar;